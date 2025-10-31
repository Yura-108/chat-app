import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {NextResponse} from "next/server";
import prisma from "@/utils/prisma";
import {pusherServer} from "@/utils/pusher";

export default async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {text, receivedId} = body;

    if (!text || !receivedId) {
      return NextResponse.json(
        { error: "Text and receiverId are required" },
        { status: 400 }
      );
    }

    const newMessage = await prisma.message.create({
      data: {
        text,
        receivedId,
        senderId: session.user.id,
      }
    });

    const fullMessage = await prisma.message.findUnique({
      where: {id: newMessage.id},
      include: {
        sender:{select:{avatar:true,id:true}},
        receiver:{select:{avatar:true,id:true}},
      }
    });

    if(!fullMessage){
      return;
    }

    const ids = [session.user.id, receivedId].sort();
    const channelName = `chat-${ids[0]}-${ids[1]}`;

    await pusherServer.trigger(channelName, "new-message", fullMessage);

    return NextResponse.json(newMessage, {status: 201});
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
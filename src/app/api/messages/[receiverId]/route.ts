import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/utils/prisma";

export async function GET(
    _req: Request,
    {params} : {params: Promise<{receiverId: string}>}
    ) {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const receiverId = (await params).receiverId;
    const currentUserId = session?.user.id;

    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: currentUserId,
                        receiverId,
                    },
                    {
                        senderId: receiverId,
                        receiverId: currentUserId
                    }
                ]
            },
            include: {
                sender: {select: {id: true, avatar: true, name: true}},
                receiver: {select: {id: true, avatar: true, name: true}}
            },
            orderBy: {createdAt: "asc"}
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error Fetching Messages:", error);
        return NextResponse.json(
            { error: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}
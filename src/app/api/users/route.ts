import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {NextResponse} from "next/server";
import prisma from "@/utils/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            where: {id: {not: session.user.id}},
            select: {id: true, avatar: true, name: true},
            orderBy: {name: "asc"}
        });

        return NextResponse.json(users, {status: 200});
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "failed to fetch user" },
            { status: 500 }
        );
    }
}
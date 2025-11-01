import prisma from "@/utils/prisma";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {redirect} from "next/navigation";
import SetupProfile from "@/components/SetupProfile";

export default async function Home() {
    const session = await getServerSession(authOptions);

    if(!session?.user.id){
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: {id: session.user.id},
        select: {hasProfile: true}
    });

    if(user?.hasProfile) {
        redirect("/chat");
    }

    return (
        <SetupProfile />
    )
}
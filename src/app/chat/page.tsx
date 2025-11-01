import {useChatStore} from "@/store/store";
import {useGetMessage} from "@/custom-hooks/useMessage";
import {SpinnerCircularFixed} from "spinners-react";
import {FaUser} from "react-icons/fa6";
import Image from "next/image";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";

export default function Page() {
    const {activeChatUser, onlineIds} = useChatStore();
    const receiverId = activeChatUser?.id;
    const {messages, isLoading, isError} = useGetMessage(receiverId);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-30">
                <SpinnerCircularFixed size={30} color="#4f39f6"/>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex-1 flex items-center justify-center p-4">
                <p className="text-gray-400">Error Fetching Messages</p>
            </div>
        )
    }

    if (!activeChatUser) {
        return (
            <div className="flex flex-col h-screen flex-1 p-4 justify-center">
                <div className="text-center space-y-2">
                    <div className="text-indigo-600 flex justify-center">
                        <FaUser size={50} />
                    </div>
                    <h2 className="text-3xl font-semibold text-gray-300">
                        Select a user to start chatting
                    </h2>
                    <p className="text-gray-500">Your conversations will appear here.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen flex-1 p-4">
            <div className="flex items-center gap-2">
                {activeChatUser.avatar && (
                    <Image
                        src={activeChatUser.avatar}
                        alt={"profile-pic"}
                        width={1000}
                        height={1000}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                )}

                <div>
                    <p className="font-semibold text-white">{activeChatUser.name}</p>
                    {onlineIds.includes(activeChatUser.id) ? (
                        <span className="text-sm text-green-400">online</span>
                    ): (
                        <span className="text-sm text-gray-400">offline</span>
                    )}
                </div>
            </div>
            <ChatWindow messages={messages} />
            <ChatInput />
        </div>
    )
}
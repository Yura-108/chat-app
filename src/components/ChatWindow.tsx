import {IMessage} from "@/types/message.type";
import {useChatStore} from "@/store/store";
import {useSession} from "next-auth/react";
import {useEffect, useRef, useState} from "react";
import {pusherClient} from "@/utils/pusher-client";
import {AiFillMessage} from "react-icons/ai";
import Image from "next/image";

interface IChatWindow {
  messages: IMessage[];
}

export default function ChatWindow({messages}: IChatWindow) {
  const {activeChatUser} = useChatStore();
  const receivedId = activeChatUser?.id;
  const {data: session} = useSession();
  const currentUserId = session?.user.id;
  const [chatMessages, setChatMessages] = useState<IMessage[]>(messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: "smooth"})
  }, [chatMessages]);

  useEffect(() => {
    if (!receivedId || !currentUserId) return;

    const ids = [currentUserId, receivedId].sort()
    const channelName = `chat-${ids[0]}-${ids[1]}`;

    const channel = pusherClient.subscribe(channelName);

    const handleNewMessage = (message: IMessage) => {
      setChatMessages(prev => {
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message]
      })
    };

    channel.bind("new-message", handleNewMessage);

    return () => {
      channel.unbind("new-message", handleNewMessage);
      pusherClient.unsubscribe(channelName);
    }
  }, [currentUserId, receivedId]);


  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-4 mt-6">
      {chatMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-indigo-600">
            <AiFillMessage size={50}/>
          </div>
          <p className="text-3xl font-semibold text-gray-300">
            No messages yet. Start chatting!
          </p>
        </div>
      ) : (
        chatMessages.map(message => {
          const isOwnMessage = message.senderId === currentUserId;
          return (
            <div
              className={`flex ${
                isOwnMessage ? "justify-end" : "justify-start"
              }  gap-2`}
              key={message.id}
            >
              {!isOwnMessage && message.sender.avatar && (
                <Image
                  src={message.sender.avatar}
                  alt={"profile-pic"}
                  width={1000}
                  height={1000}
                  className={"w-10 h-10 rounded-full object-cover"}
                />
              )}
              <div className="max-w-xs text-right">
                <div
                  className={`px-4 py-2 text-white rounded-lg ${isOwnMessage ? "bg-gradient-to-r from-blue-500 to-purple-600 rounded-br-2xl" : "bg-slate-800 rounded-bl-2xl"}`}>
                  {message.text}
                </div>
                <span className="text-xs text-gray-400 mr-2">
                  {new Date(message.createAt).toLocaleString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
              {isOwnMessage && message.sender.avatar && (
                <Image
                  src={message.sender.avatar}
                  alt="profile-pic"
                  width={1000}
                  height={1000}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
            </div>
          )
        })
      )}
      <div ref={bottomRef} />
    </div>
  );
}
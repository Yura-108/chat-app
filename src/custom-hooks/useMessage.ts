import axios from "axios";
import {useEffect, useOptimistic, useState, useTransition} from "react";
import {IMessage} from "@/types/message.type";

export async function SendMessage(text: string, receivedId: string): Promise<IMessage> {
  try {
    const res = await axios.post("/api/send-message", {
      text,
      receivedId
    });

    return res.data;
  } catch (error) {
    console.log("failed to send message:", error);
    throw error;
  }
}

async function fetchMessages(receiverId: string): Promise<IMessage[]> {
  const response  = await axios.get<IMessage[]>(`/api/messages/${receiverId}`);

  return response.data;
}

export function useGetMessage(receiverId: string | undefined) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<null | Error>(null);

  useEffect(() => {
    if (!receiverId) return;

    let isMounted = true;
    setIsLoading(true);
    setIsError(null);

    fetchMessages(receiverId)
      .then(data => {
        if (isMounted) setMessages(data);
      })
      .catch(error => {
        if (isMounted) setMessages(error)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };

  }, [receiverId]);

  return {messages, isLoading, isError};
}
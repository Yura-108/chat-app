"use client";

import {useGetUsers} from "@/custom-hooks/useUser";
import {useChatStore} from "@/store/store";
import {SpinnerCircularFixed} from "spinners-react";
import Image from "next/image";

interface IUser {
  id: string;
  name: string;
  email: string
  avatar: string;
  bio: string | null;
  password: string;
  hasProfile: boolean;
  createAt: Date;
}

interface IFriendsList {
  onlineIds: string[],
  setSidebarOpen: (value: boolean) => void;
}

export default function FriendsList({onlineIds, setSidebarOpen} : IFriendsList) {
  const {users, isLoading, isError} = useGetUsers();
  const {setActiveChatUser} = useChatStore();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-30">
        <SpinnerCircularFixed size={30}color="#4f39f6"/>
      </div>
    )
  }

  if (isError) return <p className="text-xl text-gray-400 mt-15">Error</p>;

  return (
    <div className={"mt-15"}>
      {users.map((user: IUser) => {
        const isOnline = onlineIds.includes(user.id);
        return (
          <div
            key={user.id}
            className="flex items-center  gap-2 p-3 rounded-lg cursor-pointer hover:bg-input-bg"
            onClick={() => {
              setActiveChatUser({
                id: user.id,
                name: user.name,
                avatar: user.avatar
              });
              setSidebarOpen(false);
            }}
          >
            {user.avatar && (
              <Image
                src={user.avatar}
                width={1000}
                height={100}
                alt="profile-pic"
                className="w-12 h-12 rounded-full object-cover"
              />
            )}

            <div>
              <p className="font-semibold text-white">{user.name}</p>
              {isOnline ? (
                <span className="text-sm text-green-400">online</span>
              ) : (
                <span className="text-sm text-gray-400">offline</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  )
}
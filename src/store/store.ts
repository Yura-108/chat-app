import {IUser} from "@/types/user.type";
import {create} from "zustand/react";

interface IChatState {
  onlineIds: string[];
  activeChatUser: IUser | null;
  setActiveChatUser: (user: IUser) => void;
}

export const useChatStore = create<IChatState>((set) => ({
  onlineIds: [],
  activeChatUser: null,
  setActiveChatUser: (user) => set({activeChatUser: user})
}))
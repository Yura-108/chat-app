import {IUser} from "@/types/user.type";

export interface IMessage {
  id: string;
  text: string;
  createAt: string;
  senderId: string;
  receiverId: string;
  sender: IUser;
  receiver: IUser;
}
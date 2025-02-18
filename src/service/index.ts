import axios from "axios";
import { IMessage, IUserData } from "./types";

export const setUserRequest = (userData: IUserData) => {
  const res = axios.post<IUserData, { data: IUserData }>("/user", userData);

  return res;
};

export const getRoomRequest = (roomId: string) => {
  const res = axios.get<IMessage[]>(`/chat/${roomId}`);

  return res;
};

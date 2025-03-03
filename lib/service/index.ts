import axios from "axios";
import { IMessage, IUserData, IAnswerData } from "./types";
import { IPollsData } from "../types";

export const setUserRequest = (userData: IUserData) => {
  const res = axios.post<IUserData, { data: IUserData }>("/user", userData);

  return res;
};

export const getRoomRequest = (roomId: string) => {
  const res = axios.get<IMessage[]>(`/chat/${roomId}`);

  return res;
};

export const setUserAnswer = (answerData: IAnswerData) => {
  const res = axios.put("/user", answerData);

  return res;
};

export const getPollsRequest = (episodeId: string) => {
  const res = axios.get<IPollsData>(`/polls/${episodeId}`);

  return res;
};

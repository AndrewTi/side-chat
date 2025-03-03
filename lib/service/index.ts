import axios from "axios";
import { IMessage, IUserData, IAnswerData } from "./types";
import { IPollsData } from "../types";

const localInstance = axios.create();

const detaultUrl = 'https://chat.r-words.com'

export const setUserRequest = (userData: IUserData) => {
  const res = localInstance.post<IUserData, { data: IUserData }>(detaultUrl+"/user", userData);

  return res;
};

export const getRoomRequest = (roomId: string) => {
  const res = localInstance.get<IMessage[]>(detaultUrl+`/chat/${roomId}`);

  return res;
};

export const setUserAnswer = (answerData: IAnswerData) => {
  const res = localInstance.put(detaultUrl+"/user", answerData);

  return res;
};

export const getPollsRequest = (episodeId: string) => {
  const res = localInstance.get<IPollsData>(detaultUrl+`/polls/${episodeId}`);

  return res;
};

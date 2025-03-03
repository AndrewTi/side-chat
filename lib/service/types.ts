export interface IUserData {
  userName: string;
  avatar: string;
  _id: string;
}

export interface IMessage {
  _id: string;
  user: IUserData;
  message: string;
  createdAt: string;
}

export interface IAnswerData {
  userId: string;
  answerTime: number;
  pollId: string;
  answerId: string | null;
  isCorrectAnswer: boolean;
}

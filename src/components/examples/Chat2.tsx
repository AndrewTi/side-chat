import { useSetUserData } from "../../hooks/useSetUserData";
import { Chat } from "../Chat";

export const Chat2 = () => {
  useSetUserData({
    _id: "123456",
    userName: "Pipka",
    avatar: "",
  });
  return (
    <Chat
      // url="http://localhost:3030"
      roomId="2"
      beforeSentMessage={() => new Promise((res) => res(true))}
    />
  );
};

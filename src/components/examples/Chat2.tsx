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
      roomId="2"
      beforeSentMessage={() => new Promise((res) => res(true))}
    />
  );
};

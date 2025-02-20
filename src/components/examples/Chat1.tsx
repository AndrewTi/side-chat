import { useSetUserData } from "../../hooks/useSetUserData";
import { Chat } from "../Chat";

export const Chat1 = () => {
  useSetUserData({
    _id: "123456296743",
    userName: "Another User",
    avatar: "",
  });
  return (
    <Chat
      // url="http://localhost:3030"
      roomId="1"
      beforeSentMessage={() => new Promise((res) => res(true))}
    />
  );
};

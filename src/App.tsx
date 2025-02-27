import { useState } from "react";
import { Poll } from "./components/poll";
import { Stream } from "./components/stream";
import data from "./polls.json";
import "./App.css";
import { useSetUserData } from "./hooks/useSetUserData";
import { Chat } from "./components/chat";

function App() {
  const [currentStreamTime, setCurrentStreamTime] = useState<number>(0);
  useSetUserData({ userName: "Pipka", _id: "123456789", avatar: "" });
  return (
    <div className="test">
      <Chat
        url="http://localhost:3030"
        roomId="123123"
        beforeSentMessage={() => new Promise((res) => res(true))}
      />
      <Stream
        setCurrentStreamTime={setCurrentStreamTime}
        streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8"
      />

      <Poll
        afterUserAnswer={() => new Promise((res) => res(true))}
        config={{ showInTime: 5, answerTime: 5, viewResultTime: 5 }}
        polls={data?.polls}
        url="http://localhost:3030"
        currentStreamTime={currentStreamTime}
      />
    </div>
  );
}

export default App;

import { Poll } from "./components/poll";
import { Stream } from "./components/stream";
import { useSetUserData } from "./hooks/useSetUserData";
import { Chat } from "./components/chat";
import "./App.css";

function App() {
  useSetUserData({ userName: "Pipka", _id: "123456789", avatar: "" });

  return (
    <div className="test">
      <Chat
        roomId="123123"
        beforeSentMessage={() => new Promise((res) => res(true))}
        onInputChange={(text) =>
          new Promise((res) => {
            if (text.includes("*")) return res(false);

            res(true);
          })
        }
      />
      <Stream streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8" />

      <Poll
        afterUserAnswer={() => new Promise((res) => res(true))}
        artistId="555a22e1-d6f8-4b87-8ae8-a675bc23bea0"
        episodeId="839b401f-178b-4439-aeea-fbb0ba9a0bc0"
      />
    </div>
  );
}

export default App;

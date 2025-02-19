import { Stream } from "./components/stream/Stream";
import "./App.css";
import { Chat } from "./components/chat/Chat";

function App() {
  return (
    <div className="test">
      <Chat
        roomId="1"
        beforeSentMessage={() => new Promise((res) => { res(true)})}
      />
      <Stream streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8" />
      <Stream
        streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8"
        styles={{
          mainBlock: { width: "70vw", height: 565 },
          controlsBlock: {
            background: "#ffffff45",
            borderRadius: 10,
            margin: 10,
            padding: 10,
            gap: 20,
          },
          progress: {
            margin: 0,
          },
          progressRange: {
            backgroundColor: "#006aff",
          },
          progressThumb: {
            backgroundColor: "#006aff",
          },
          controls: {
            margin: 0,
          },
          controlButton: {
            backgroundColor: "#33333380",
            padding: 10,
            borderRadius: "100%",
            color: "#ffa42f",
          },
          controlLive: {
            backgroundColor: "#fff",
            color: "#000",
            padding: "3px 7px",
            borderRadius: 5,
          },
        }}
      />
      <Stream
        streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8"
        styles={{
          mainBlock: {
            width: 500,
            height: 300,
            borderRadius: 0,
          },
          controlsBlock: {
            position: "static",
            flexDirection: "row-reverse",
            alignItems: "center",
            background: "#8c67ff",
            borderRadius: 0,
            marginTop: -5,
            padding: "15px 10px",
          },
          videoBlock: {
            borderRadius: 0,
          },
          progress: {
            margin: 0,
            flexGrow: 1,
          },
          controls: {
            margin: 0,
            gap: 10,
          },
        }}
      />
    </div>
  );
}

export default App;

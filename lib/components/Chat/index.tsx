import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { formatDate } from "../../../src/helpers/index";
import { getRoomRequest } from "../../../src/service";
import { v4 as uuidv4 } from "uuid";
import mainStyles from "./styles.module.css";
import { IMessage } from "../../../src/service/types";
import { io } from "socket.io-client";
import axios from "axios";

type TStyles = React.CSSProperties;
interface IChat {
  styles?: {
    mainBlock?: TStyles;
    scrollBlock?: TStyles;
    scrollBlock_messageBlock?: TStyles;
    scrollBlock_messageBlock_avatar?: TStyles;
    scrollBlock_messageBlock_title?: TStyles;
    scrollBlock_messageBlock_message?: TStyles;
    inputBlock?: TStyles;
    inputBlock_input?: TStyles;
    inputBlock_submit?: TStyles;
  };
  roomId: string;
  beforeSentMessage: (msg: string) => Promise<boolean>;
  url: string;
}

export function Chat({ styles, roomId, beforeSentMessage, url }: IChat) {
  const socket = useMemo(() => io(url), [url]);

  useEffect(() => {
    axios.defaults.baseURL = url;
  }, [url]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState<IMessage[]>([]);

  const getChats = useCallback(async () => {
    try {
      setError("");
      setIsLoading(true);

      const { data } = await getRoomRequest(roomId);

      if (data) {
        setChat(data);
      }
    } catch (error) {
      console.error("get chat error: ", error);
      setError("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    getChats();
  }, [getChats]);

  useEffect(() => {
    const newMsg = (msg: string) => {
      try {
        const userLocal = localStorage.getItem("user");
        const userData = userLocal ? JSON.parse(userLocal) : null;
        if (userData) {
          setChat((prev) => [
            ...prev,
            {
              user: userData,
              message: msg,
              _id: uuidv4(),
              createdAt: new Date().toISOString(),
            },
          ]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    socket.on(`chat message ${roomId}`, newMsg);

    return () => {
      socket.off(`chat message ${roomId}`, newMsg);
    };
  }, [roomId, socket]);

  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.emit("join room", roomId);

    return () => {
      socket.emit("join room", roomId);
    };
  }, [roomId, socket]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (msg.trim()) {
      try {
        const res = await beforeSentMessage(msg);

        if (res) {
          const userLocal = localStorage.getItem("user");
          const userData = userLocal ? JSON.parse(userLocal) : null;

          socket.emit("chat message", { roomId, message: msg, userData });
          setMsg("");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({
        block: "nearest",
        inline: "start",
      });
    }
  }, [chat]);

  return (
    <div
      className={mainStyles.vTrx6SideChat_container}
      style={styles?.mainBlock}
    >
      <div
        className={mainStyles.vTrx6SideChat_scrollView}
        style={styles?.scrollBlock}
      >
        {chat.map((item) => {
          return (
            <div
              key={item._id}
              className={mainStyles.vTrx6SideChat_messageItem}
              style={styles?.scrollBlock_messageBlock}
            >
              <div
                className={mainStyles.vTrx6SideChat_avatarContainer}
                style={styles?.scrollBlock_messageBlock_avatar}
              >
                <img
                  src={
                    item?.user?.avatar ||
                    "https://i.pinimg.com/736x/ef/1e/35/ef1e355122ed168516114137b555a21f.jpg"
                  }
                  alt="avatar"
                  title="avatar"
                  className={mainStyles.vTrx6SideChat_avatar}
                />
              </div>

              <div className={mainStyles.vTrx6SideChat_messageBlock}>
                <p
                  className={mainStyles.vTrx6SideChat_title}
                  style={styles?.scrollBlock_messageBlock_title}
                >
                  {item?.user?.userName}
                </p>
                <p
                  className={mainStyles.vTrx6SideChat_textContent}
                  style={styles?.scrollBlock_messageBlock_message}
                >
                  {item?.message}

                  <span className={mainStyles.vTrx6SideChat_messageDate}>
                    {formatDate(item?.createdAt)}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className={mainStyles.vTrx6SideChat_loaderContainer}>
            <div className={mainStyles.vTrx6SideChat_loader} />
          </div>
        )}

        {!isLoading && !error && chat?.length === 0 && (
          <p className={mainStyles.vTrx6SideChat_dummy}>
            Chat history is empty...
          </p>
        )}

        {error && <p className={mainStyles.vTrx6SideChat_err}>{error}</p>}

        <div ref={chatRef} />
      </div>
      <form
        onSubmit={submit}
        action="submit"
        className={mainStyles.vTrx6SideChat_form}
        style={styles?.inputBlock}
      >
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          type="text"
          className={mainStyles.vTrx6SideChat_input}
          placeholder="Message..."
          style={styles?.inputBlock_input}
        />
        <button
          type="submit"
          className={mainStyles.vTrx6SideChat_submit}
          style={styles?.inputBlock_submit}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.6281 13.1601L15.4742 8.31397M20.4316 5.35645L16.341 18.651C15.9744 19.8425 15.7909 20.4385 15.4748 20.636C15.2005 20.8074 14.8609 20.836 14.5623 20.7121C14.2178 20.5692 13.9383 20.0111 13.3807 18.8958L10.7897 13.7139C10.7012 13.5369 10.6569 13.4488 10.5978 13.3721C10.5453 13.304 10.4848 13.2427 10.4168 13.1903C10.3418 13.1325 10.2552 13.0892 10.0861 13.0046L4.89224 10.4077C3.77693 9.85006 3.21923 9.57098 3.07632 9.22656C2.95238 8.92787 2.98064 8.588 3.152 8.31375C3.34959 7.99751 3.94555 7.8138 5.13735 7.44709L18.4319 3.35645C19.3689 3.06815 19.8376 2.92412 20.154 3.0403C20.4297 3.1415 20.647 3.35861 20.7482 3.63428C20.8644 3.9506 20.7202 4.41904 20.4322 5.35506L20.4316 5.35645Z"
              stroke={
                styles?.inputBlock_submit?.color
                  ? styles?.inputBlock_submit?.color
                  : "#00b4e4"
              }
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}

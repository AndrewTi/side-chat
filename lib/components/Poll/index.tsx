import { useEffect, useState } from "react";
import mainStyles from "./styles.module.css";
import axios from "axios";
import { TimerProgress } from "./TimerProgress";
import { IQuizProps } from "../../../src/types";
import { countShowPolls } from "../../../src/helpers";
import { setUserAnswer } from "../../../src/service";
import { Loader } from "../../../src/components/loader/Loader";

export function Poll({
  afterUserAnswer,
  url = "https://chat.r-words.com",
  config = { showInTime: 60, answerTime: 10, viewResultTime: 10 },
  polls,
  styles,
  currentStreamTime,
}: IQuizProps) {
  const showPolls = countShowPolls(currentStreamTime, config, polls?.length);

  useEffect(() => {
    if (!showPolls) return;
    axios.defaults.baseURL = url;
  }, [url, showPolls]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [curAnswerTimer, setCurAnswerTimer] = useState(config?.answerTime);
  const [curVewResultTimer, setCurViewResultTimer] = useState(0);

  const [currentPoll, setCurrentPoll] = useState<number>(0);
  const [selected, setSelected] = useState<{
    choiceId: string;
    position: string;
    label: string;
    correct?: boolean;
  } | null>(null);

  const saveUserAnswer = async () => {
    setIsLoading(true);
    try {
      const userLocal = localStorage.getItem("user");
      const userData = userLocal ? JSON.parse(userLocal) : null;

      if (userData) {
        await afterUserAnswer({
          answerTime: config?.answerTime - curAnswerTimer,
          pollId: polls[currentPoll]?.pollId,
          answerId: selected?.choiceId || null,
          isCorrectAnswer: !!selected?.correct,
          userId: userData?._id,
        });

        await setUserAnswer({
          answerTime: config?.answerTime - curAnswerTimer,
          pollId: polls[currentPoll]?.pollId,
          answerId: selected?.choiceId || null,
          isCorrectAnswer: !!selected?.correct,
          userId: userData?._id,
        });
      } else {
        console.error("To save answer user data must be provided");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selected) return;
    setCurAnswerTimer(0);
  };

  const next = () => {
    setSelected(null);
    setCurAnswerTimer(config?.answerTime);
    setCurrentPoll(currentPoll + 1);
  };

  const handleNext = () => {
    next();
    setCurViewResultTimer(0);
  };

  useEffect(() => {
    if (!showPolls) return;
    if (polls.length === currentPoll) return;
    if (curAnswerTimer === 0) {
      saveUserAnswer();
      setCurViewResultTimer(config?.viewResultTime);
    }

    const interval = setInterval(() => {
      setCurAnswerTimer((prev) => {
        if (prev === 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [curAnswerTimer, currentPoll, showPolls]);

  useEffect(() => {
    if (!showPolls) return;
    if (polls.length === currentPoll) return;
    if (curAnswerTimer !== 0) return;

    const interval = setInterval(() => {
      setCurViewResultTimer((prev) => {
        if (prev === 0) {
          next();

          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [curAnswerTimer, currentPoll, showPolls]);

  const isEnd = polls?.length === currentPoll;
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!showPolls) return;
    if (isEnd) {
      setTimeout(() => {
        setIsActive(false);
      }, 3000);
    }
  }, [isEnd]);

  if (!polls?.length) {
    console.error("Polls Array is required");
    return null;
  }

  if (!isActive) return null;
  if (!showPolls) return null;

  return (
    <div
      className={mainStyles.vTrx6SideChat_container}
      style={styles?.mainBlock}
    >
      {isEnd ? (
        <p className={mainStyles.vTrx6SideChat_quizEnd}>
          That's all. Thank you for answering
        </p>
      ) : (
        <>
          <div
            className={mainStyles.vTrx6SideChat_timer}
            style={styles?.timerBlock}
          >
            {!!curAnswerTimer && (
              <TimerProgress
                progressColor="#9ed157"
                timer={config?.answerTime}
                styles={styles?.timerBlock_progress}
              />
            )}
            {!!curVewResultTimer && (
              <TimerProgress
                progressColor="#9257d1"
                timer={config?.viewResultTime}
                styles={styles?.timerBlock_progress}
              />
            )}
          </div>
          <div
            className={mainStyles.vTrx6SideChat_quiz}
            style={styles?.pollBlock}
          >
            <div
              className={mainStyles.vTrx6SideChat_quizHeader}
              style={styles?.pollBlock_header}
            >
              <p
                className={mainStyles.vTrx6SideChat_quizAmount}
                style={styles?.pollBlock_headerTitle}
              >
                Question {currentPoll + 1}/{polls?.length}
              </p>
              <p
                className={mainStyles.vTrx6SideChat_quizQuestion}
                style={styles?.pollBlock_headerQuestion}
              >
                {polls[currentPoll]?.question}
              </p>
            </div>
            <div
              className={mainStyles.vTrx6SideChat_quizBody}
              style={styles?.pollBlock_body}
            >
              <ul
                className={mainStyles.vTrx6SideChat_quizList}
                style={styles?.pollBlock_list}
              >
                {polls[currentPoll]?.choices?.map((item, i) => {
                  const isCorrectAnswer = item?.correct;
                  const currentItem = item?.choiceId;
                  return (
                    <li
                      key={i}
                      className={mainStyles.vTrx6SideChat_quizListItem}
                      style={styles?.pollBlock_listItem}
                    >
                      <button
                        onClick={() =>
                          setSelected((prev) =>
                            prev?.choiceId === currentItem ? null : item
                          )
                        }
                        className={`${
                          mainStyles.vTrx6SideChat_quizListButton
                        } ${
                          selected === item
                            ? mainStyles.vTrx6SideChat_quizListButtonActive
                            : ""
                        }
                      ${
                        curAnswerTimer === 0 &&
                        (isCorrectAnswer
                          ? mainStyles.vTrx6SideChat_quizListButtonCorrent
                          : currentItem === selected?.choiceId
                          ? mainStyles.vTrx6SideChat_quizListButtonIncorrent
                          : "")
                      }
        
                      `}
                        disabled={curAnswerTimer === 0 || isLoading}
                        style={styles?.pollBlock_listItemButton}
                      >
                        <div
                          className={mainStyles.vTrx6SideChat_quizListItemIndx}
                          style={styles?.pollBlock_listItemButton_indx}
                        >
                          {i + 1}
                        </div>
                        <div
                          className={
                            mainStyles.vTrx6SideChat_quizListItemAnswer
                          }
                          style={styles?.pollBlock_listItemButton_choise}
                        >
                          {item?.label}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div
                className={mainStyles.vTrx6SideChat_quizCta}
                style={styles?.pollBlock_cta}
              >
                <button
                  className={mainStyles.vTrx6SideChat_quizCtaBtn}
                  onClick={handleSubmit}
                  disabled={!selected || curAnswerTimer === 0 || isLoading}
                  style={styles?.pollBlock_ctaSubmit}
                >
                  submit
                  {isLoading && <Loader />}
                </button>
                {curAnswerTimer === 0 && (
                  <button
                    className={mainStyles.vTrx6SideChat_quizCtaBtn}
                    onClick={handleNext}
                    disabled={isLoading}
                    style={styles?.pollBlock_ctaNext}
                  >
                    next
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

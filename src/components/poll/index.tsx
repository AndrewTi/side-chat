import mainStyles from "./styles.module.css";
import { TimerProgress } from "./TimerProgress";
import { IChoise, IPoll, IPollsData, IQuizProps } from "../../types";
import { useCallback, useEffect, useState } from "react";
import { getPollsRequest, setUserAnswer } from "../../service";
import { DateTime } from "luxon";

export function Poll({ afterUserAnswer, episodeId, styles }: IQuizProps) {
  const [pollsData, setPollsData] = useState<null | IPollsData>(null);

  const getPolls = useCallback(async () => {
    if (!episodeId) return;

    try {
      const { data } = await getPollsRequest(episodeId);

      if (data && typeof data === "object") {
        setPollsData(data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [episodeId]);

  useEffect(() => {
    getPolls();
  }, [getPolls]);

  const pollsList = pollsData?.polls;
  const streamStart = pollsData?.streamStartsAt;

  const [currentUserTime, setCurrentUserTime] = useState<string>(
    DateTime.now().toSeconds().toFixed(0)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentUserTime(DateTime.now().toSeconds().toFixed(0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [isShown, setIsShown] = useState<boolean>(false);
  const [currentQuestion, setCurrentQustion] = useState<IPoll | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<null | IChoise>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [curAnswerTime, setCurAnswerTime] = useState<number | null>(null);
  const [curViewResultsTime, setCurViewResultsTime] = useState<number | null>(
    null
  );

  const saveUserAnswer = async () => {
    if (!currentQuestion) return;

    setIsLoading(true);

    try {
      const userLocal = localStorage.getItem("user");
      const userData = userLocal ? JSON.parse(userLocal) : null;

      const answerData = {
        answerTime: currentQuestion?.answerTime - (curAnswerTime || 0),
        pollId: currentQuestion?.pollId,
        answerId: selectedAnswer?.choiceId || null,
        isCorrectAnswer: !!selectedAnswer?.correct,
        userId: userData?._id,
      };

      if (userData) {
        await afterUserAnswer(answerData);
        await setUserAnswer(answerData);
      } else {
        console.error("To save answer user data must be provided");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!pollsList?.length) return;
    if (!streamStart) return;

    if (!isShown) {
      const currentQuestion = pollsList?.find((poll) => {
        const dateTime = DateTime.fromISO(streamStart);

        // Add question showIn time
        const updatedTime = dateTime.plus({ seconds: poll?.showIn });

        return updatedTime.toSeconds().toFixed(0) === currentUserTime
          ? poll
          : null;
      });

      if (currentQuestion) {
        setIsShown(true);
        setCurrentQustion(currentQuestion);
        setCurAnswerTime(currentQuestion?.answerTime);
      }
    }
  }, [pollsList, isShown, currentUserTime, streamStart]);

  useEffect(() => {
    if (!isShown || !currentQuestion) return;
    if (curAnswerTime === null || curViewResultsTime) return;

    if (curAnswerTime === 0) {
      if (!isSubmitted) {
        saveUserAnswer();
        setIsSubmitted(true);
      }
      setCurViewResultsTime(currentQuestion?.showResultTime);
    }

    const interval = setInterval(() => {
      setCurAnswerTime((prev) => {
        if (prev === null) return prev;

        if (prev === 0) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isShown, currentQuestion, curViewResultsTime, curAnswerTime]);

  useEffect(() => {
    if (!isShown || !currentQuestion) return;
    if (curViewResultsTime === null || curAnswerTime) return;

    if (curViewResultsTime === 0) {
      setIsShown(false);
      setCurAnswerTime(null);
      setCurViewResultsTime(null);
      setCurrentQustion(null);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    }

    const interval = setInterval(() => {
      setCurViewResultsTime((prev) => {
        if (prev === null) return prev;

        if (prev === 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [curAnswerTime, isShown, currentQuestion, curViewResultsTime]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!currentQuestion) return;
    setIsSubmitted(true);
    // setCurAnswerTime(0);
    saveUserAnswer();
  };

  if (!isShown) return <></>;

  return (
    <div
      className={mainStyles.vTrx6SideChat_container}
      style={styles?.mainBlock}
    >
      <div
        className={mainStyles.vTrx6SideChat_timer}
        style={styles?.timerBlock}
      >
        {currentQuestion && (
          <>
            {!!curAnswerTime && (
              <TimerProgress
                progressColor="#9ed157"
                timer={currentQuestion?.answerTime}
                styles={styles?.timerBlock_progress}
              />
            )}
            {!!curViewResultsTime && (
              <TimerProgress
                progressColor="#9257d1"
                timer={currentQuestion?.showResultTime}
                styles={styles?.timerBlock_progress}
              />
            )}
          </>
        )}
      </div>
      <div className={mainStyles.vTrx6SideChat_quiz} style={styles?.pollBlock}>
        <div
          className={mainStyles.vTrx6SideChat_quizHeader}
          style={styles?.pollBlock_header}
        >
          <p
            className={mainStyles.vTrx6SideChat_quizAmount}
            style={styles?.pollBlock_headerTitle}
          >
            Question
          </p>
          <p
            className={mainStyles.vTrx6SideChat_quizQuestion}
            style={styles?.pollBlock_headerQuestion}
          >
            {currentQuestion?.question}
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
            {currentQuestion?.choices?.map((item, i) => {
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
                      setSelectedAnswer((prev) =>
                        prev?.choiceId === currentItem ? null : item
                      )
                    }
                    className={`${mainStyles.vTrx6SideChat_quizListButton} ${
                      selectedAnswer?.choiceId === item?.choiceId
                        ? mainStyles.vTrx6SideChat_quizListButtonActive
                        : ""
                    }
                      ${
                        curAnswerTime === 0 &&
                        (isCorrectAnswer
                          ? mainStyles.vTrx6SideChat_quizListButtonCorrent
                          : currentItem === selectedAnswer?.choiceId
                          ? mainStyles.vTrx6SideChat_quizListButtonIncorrent
                          : "")
                      }

                      `}
                    disabled={curAnswerTime === 0 || isLoading || isSubmitted}
                    style={styles?.pollBlock_listItemButton}
                  >
                    <div
                      className={mainStyles.vTrx6SideChat_quizListItemIndx}
                      style={styles?.pollBlock_listItemButton_indx}
                    >
                      {i + 1}
                    </div>
                    <div
                      className={mainStyles.vTrx6SideChat_quizListItemAnswer}
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
              disabled={isLoading || !curAnswerTime || isSubmitted}
              style={styles?.pollBlock_ctaSubmit}
            >
              submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";

import {
  getLesson,
  getCourse,
  submitAnswer,
} from "@/lib/api";
import {
  getActiveUser,
  updateActiveUser,
  saveCurrentLesson,
  type DuolearnUser,
} from "@/lib/userState";

type Option = {
  id: number;
  text: string;
};

type Exercise = {
  id: number;
  type: string;
  question: string;
  explanation?: string;
  order_index: number;
  options?: Option[];
};

type Lesson = {
  id: number;
  title: string;
  xp_reward: number;
  exercises: Exercise[];
};

type MatchPair = {
  spanish: string;
  english: string;
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();

  const rawLessonId = Array.isArray(params.lessonId)
    ? params.lessonId[0]
    : params.lessonId;

  const lessonId = Number(rawLessonId);

  // Every lesson uses the currently logged-in account.
  // No account is hard-coded to user 1.
  const [user, setUser] = useState<DuolearnUser | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedOption, setSelectedOption] =
    useState<number | null>(null);

  const [answer, setAnswer] = useState("");

  const [selectedSpanish, setSelectedSpanish] =
    useState<string | null>(null);

  const [selectedEnglish, setSelectedEnglish] =
    useState<string | null>(null);

  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);

  const [lessonXP, setLessonXP] = useState(0);

  const [totalXP, setTotalXP] = useState(0);

  const [hearts, setHearts] = useState(5);

  const [checking, setChecking] = useState(false);

  const [lessonCompleted, setLessonCompleted] =
    useState(false);

  /*
   * Match-pair data.
   *
   * The current lesson GET API does not return
   * match-pair options, so these are kept locally.
   */
  const matchPairs: MatchPair[] = [
    {
      spanish: "Hola",
      english: "Hello",
    },
    {
      spanish: "Gracias",
      english: "Thank you",
    },
    {
      spanish: "Adiós",
      english: "Goodbye",
    },
    {
      spanish: "Por favor",
      english: "Please",
    },
  ];

  // ============================================================
  // GLOBAL STATS SYNC
  // ============================================================

  function updateGlobalStats(
    _data: any,
    fallbackHearts: number
  ) {
    const currentUser = getActiveUser();

    if (!currentUser) {
      return;
    }

    /*
     * The current answer API does not receive our local account UUID.
     * Therefore backend user-1 stats must never overwrite this account.
     * LocalStorage is the source of truth for each logged-in account.
     */
    const nextHearts = Math.max(
      0,
      Math.min(5, Number(fallbackHearts))
    );

    const nextXP = Number(
      _data?.total_xp ?? currentUser.xp ?? totalXP
    );
    const nextGems = Number(
      _data?.gems ?? currentUser.gems ?? 100
    );
    // Streak changes ONLY when the whole lesson is completed.
    const nextStreak = Math.max(
      0,
      Number(currentUser.streak ?? 0)
    );

    setHearts(nextHearts);
    setTotalXP(nextXP);

    updateActiveUser({
      hearts: nextHearts,
      xp: nextXP,
      gems: nextGems,
      streak: nextStreak,
    });

    setUser(getActiveUser());

    window.dispatchEvent(
      new CustomEvent("duolearn:stats-updated", {
        detail: {
          hearts: nextHearts,
          gems: nextGems,
          streak: nextStreak,
          total_xp: nextXP,
        },
      })
    );
  }

  // ============================================================
  // VOICE / PRONUNCIATION
  // ============================================================

  function speakText(textToSpeak: string, language = "es-ES") {
    if (typeof window === "undefined" || !textToSpeak.trim()) {
      return;
    }

    if (!("speechSynthesis" in window)) {
      setError("Voice is not supported by this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language;
    utterance.rate = 0.82;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }

  // ============================================================
  // LOAD LESSON + USER STATS
  // ============================================================

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const activeUser = getActiveUser();

        // A lesson is only available to a logged-in account.
        if (!activeUser) {
          window.location.replace("/login");
          return;
        }

        if (!Number.isFinite(lessonId) || lessonId < 1) {
          setError("Invalid lesson.");
          return;
        }

        setUser(activeUser);

        // Lesson content comes from the API.
        const lessonData = await getLesson(lessonId);
        setLesson(lessonData);

        // Stats/progress come from THIS local account.
        const initialXP = Number(activeUser.xp ?? 0);
        const initialHearts = Number(activeUser.hearts ?? 5);

        setTotalXP(initialXP);
        setHearts(initialHearts);

        window.dispatchEvent(
          new CustomEvent("duolearn:stats-updated", {
            detail: {
              hearts: initialHearts,
              gems: Number(activeUser.gems ?? 100),
              streak: Number(activeUser.streak ?? 0),
              total_xp: initialXP,
            },
          })
        );

        /*
         * Do not move an existing user's saved progress backwards.
         * Login already sends an existing user to currentLesson.
         * For a new user, currentLesson is 1.
         */
        const savedLesson = Number(activeUser.currentLesson ?? 1);

        if (
          !Number.isFinite(savedLesson) ||
          savedLesson < 1 ||
          lessonId === savedLesson
        ) {
          saveCurrentLesson(lessonId);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    }

    if (lessonId) {
      loadData();
    }
  }, [lessonId]);
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ============================================================
  // CLIENT-ONLY PORTAL GUARD
  // ============================================================
  // IMPORTANT: this check is AFTER every React hook above.
  // Putting it before a hook causes the "change in the order of Hooks"
  // error shown by Next.js.
  if (!mounted) {
    return null;
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return createPortal(
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-5 animate-bounce">
            🦉
          </div>

          <h2 className="text-2xl font-black text-slate-900">
            Loading lesson...
          </h2>

          <p className="text-slate-500 mt-2">
            Get ready to practice Spanish!
          </p>
        </div>
      </main>
    , document.body);
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error || !lesson) {
    return createPortal(
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="text-center bg-white p-10 rounded-3xl shadow-xl border border-slate-200">
          <div className="text-6xl mb-5">
            😕
          </div>

          <p className="text-xl font-black text-red-600 mb-6">
            {error || "Lesson not found"}
          </p>

          <button
            onClick={() => router.push("/")}
            className="px-7 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-black transition"
          >
            Back to Course
          </button>
        </div>
      </main>
    , document.body);
  }

  const exercises = lesson.exercises || [];
  const totalExercises = exercises.length;
  const currentExercise = exercises[currentIndex];

  // ============================================================
  // LESSON COMPLETE
  // ============================================================

  if (lessonCompleted) {
    return createPortal(
      <main className="fixed inset-0 z-[99999] min-h-screen overflow-y-auto bg-[#131F23] px-5 py-10 text-white md:px-8">
        <div className="mx-auto mt-8 w-full max-w-xl rounded-3xl border-2 border-[#33464D] bg-[#17272C] p-8 text-center shadow-2xl md:p-10">
          <div className="text-7xl mb-5">
            🎉
          </div>

          <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">
            Lesson Complete!
          </h1>

          <p className="mb-9 text-lg text-[#AFC0C6]">
            Great job! You completed{" "}
            <span className="font-black text-white">
              "{lesson.title}"
            </span>
            .
          </p>

          <div className="grid grid-cols-2 gap-5 mb-8">
            <div className="rounded-2xl border-2 border-[#315E14] bg-[#19351F] p-6">
              <div className="text-4xl mb-2">
                ⭐
              </div>

              <p className="text-3xl font-black text-[#7BE33D]">
                {lessonXP}
              </p>

              <p className="mt-1 font-semibold text-[#B9DDB0]">
                XP Earned
              </p>
            </div>

            <div className="rounded-2xl border-2 border-[#8A353A] bg-[#351F23] p-6">
              <div className="text-4xl mb-2">
                ❤️
              </div>

              <p className="text-3xl font-black text-[#FF7777]">
                {hearts}
              </p>

              <p className="mt-1 font-semibold text-[#B9DDB0]">
                Hearts Left
              </p>
            </div>
          </div>

          <p className="mb-6 text-sm text-[#8FA5AD]">
            Total XP:{" "}
            <span className="font-black text-white">
              {totalXP}
            </span>
          </p>

          <button
            onClick={() => router.push("/")}
            className="w-full py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white text-lg font-black transition shadow-md"
          >
            Continue Learning →
          </button>
        </div>
      </main>
    , document.body);
  }

  // ============================================================
  // SAFETY
  // ============================================================

  if (!currentExercise) {
    return createPortal(
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-black text-slate-800">
            No exercises found.
          </p>

          <button
            onClick={() => router.push("/")}
            className="mt-5 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-black"
          >
            Back to Course
          </button>
        </div>
      </main>
    , document.body);
  }

  const progress =
    totalExercises > 0
      ? ((currentIndex + 1) / totalExercises) * 100
      : 0;

  // ============================================================
  // RESET QUESTION
  // ============================================================

  function resetQuestion() {
    setSelectedOption(null);
    setAnswer("");

    setSelectedSpanish(null);
    setSelectedEnglish(null);
    setMatchedPairs([]);

    setChecked(false);
    setCorrect(null);
    setError("");
  }

  // ============================================================
  // MULTIPLE CHOICE
  // ============================================================

  function handleMultipleChoice(optionId: number) {
    if (checked || checking) {
      return;
    }

    setSelectedOption(optionId);

    const option = currentExercise.options?.find(
      (item) => item.id === optionId
    );

    if (option) {
      setAnswer(option.text);
    }
  }

  // ============================================================
  // MATCH PAIRS
  // ============================================================

  function handleSpanishSelect(word: string) {
    if (checked || checking) {
      return;
    }

    if (matchedPairs.includes(word)) {
      return;
    }

    setSelectedSpanish(word);

    if (selectedEnglish) {
      checkMatch(word, selectedEnglish);
    }
  }

  function handleEnglishSelect(word: string) {
    if (checked || checking) {
      return;
    }

    if (
      matchedPairs.some((spanish) => {
        const pair = matchPairs.find(
          (item) => item.spanish === spanish
        );

        return pair?.english === word;
      })
    ) {
      return;
    }

    setSelectedEnglish(word);

    if (selectedSpanish) {
      checkMatch(selectedSpanish, word);
    }
  }

  // ============================================================
  // CHECK MATCH
  // ============================================================

  async function checkMatch(
    spanish: string,
    english: string
  ) {
    if (checked || checking) {
      return;
    }

    const pair = matchPairs.find(
      (item) =>
        item.spanish === spanish &&
        item.english === english
    );

    // ----------------------------------------------------------
    // WRONG MATCH
    // ----------------------------------------------------------

    if (!pair) {
      try {
        setChecking(true);
        setCorrect(false);
        setError("");

        const data = await submitAnswer(
          lessonId,
          currentExercise.id,
          "wrong-match"
        );

        /*
         * IMPORTANT:
         * Wrong match must also update both the local heart
         * and the global header.
         */
        const currentUser = getActiveUser();

        if (!currentUser) {
          window.location.replace("/login");
          return;
        }

        const nextHearts = Math.max(
          0,
          Number(currentUser.hearts ?? hearts) - 1
        );

        setHearts(nextHearts);

        updateActiveUser({
          hearts: nextHearts,
          streak: Number(
            data?.streak ?? currentUser.streak ?? 0
          ),
        });

        setUser(getActiveUser());

        window.dispatchEvent(
          new CustomEvent("duolearn:stats-updated", {
            detail: {
              hearts: nextHearts,
              gems: Number(
                data?.gems ?? currentUser.gems ?? 100
              ),
              streak: Number(
                data?.streak ?? currentUser.streak ?? 0
              ),
              total_xp: Number(
                data?.total_xp ?? currentUser.xp ?? totalXP
              ),
            },
          })
        );

        setSelectedSpanish(null);
        setSelectedEnglish(null);

        setTimeout(() => {
          setCorrect(null);
        }, 700);
      } catch (err) {
        console.error(err);
        setError("Failed to check match");
      } finally {
        setChecking(false);
      }

      return;
    }

    // ----------------------------------------------------------
    // CORRECT MATCH
    // ----------------------------------------------------------

    const updatedMatchedPairs = [
      ...matchedPairs,
      spanish,
    ];

    setMatchedPairs(updatedMatchedPairs);

    setSelectedSpanish(null);
    setSelectedEnglish(null);

    setCorrect(true);

    // ----------------------------------------------------------
    // ALL MATCHES COMPLETED
    // ----------------------------------------------------------

    if (
      updatedMatchedPairs.length ===
      matchPairs.length
    ) {
      try {
        setChecking(true);
        setError("");

        /*
         * Send the complete match result to the backend.
         *
         * The match-pairs exercise is worth exactly 10 XP
         * for the entire exercise.
         */
        const matchAnswer =
          "hola=hello|gracias=thank you|adiós=goodbye|por favor=please";

        const data = await submitAnswer(
          lessonId,
          currentExercise.id,
          matchAnswer
        );

        const isCorrect = Boolean(data.correct);

        setCorrect(isCorrect);
        setChecked(true);

        if (isCorrect) {
          const earned = Number(data?.xp_earned ?? 0);
          const currentUser = getActiveUser();

          if (!currentUser) {
            window.location.replace("/login");
            return;
          }

          const nextXP =
            Number(currentUser.xp ?? totalXP) + earned;

          const currentHearts = Math.max(
            0,
            Math.min(5, Number(currentUser.hearts ?? hearts))
          );

          setLessonXP((previous) => previous + earned);
          setTotalXP(nextXP);
          setHearts(currentHearts);

          // Do not increase streak for a single exercise.
          // The streak is updated only after the final lesson step.
          const currentStreak = Math.max(
            0,
            Number(currentUser.streak ?? 0)
          );

          updateActiveUser({
            xp: nextXP,
            hearts: currentHearts,
            gems: Number(
              data?.gems ?? currentUser.gems ?? 100
            ),
            streak: currentStreak,
          });

          setUser(getActiveUser());

          updateGlobalStats(
            {
              ...data,
              streak: currentStreak,
              total_xp: data?.total_xp ?? nextXP,
            },
            currentHearts
          );
        } else {
          updateGlobalStats({}, hearts);
        }
      } catch (err) {
        console.error(err);
        setError(
          "Failed to submit match pairs"
        );
      } finally {
        setChecking(false);
      }
    }
  }

  // ============================================================
  // CHECK NORMAL ANSWER THROUGH BACKEND
  // ============================================================

  async function handleCheckAnswer() {
    if (
        checked ||
        checking ||
        !currentExercise
    ) {
        return;
    }

    // Match pairs are handled separately
    if (currentExercise.type === "match_pairs") {
        if (
        matchedPairs.length === matchPairs.length
        ) {
        setChecked(true);
        setCorrect(true);
        }

        return;
    }

    let finalAnswer = answer.trim();

    // ----------------------------------------------------------
    // MULTIPLE CHOICE
    // ----------------------------------------------------------

    if (currentExercise.type === "multiple_choice") {
        if (selectedOption === null) {
        return;
        }

        const selected =
        currentExercise.options?.find(
            (option) =>
            option.id === selectedOption
        );

        if (!selected) {
        return;
        }

        finalAnswer = selected.text;
    }

    if (!finalAnswer) {
        return;
    }

    // ----------------------------------------------------------
    // SUBMIT ANSWER
    // ----------------------------------------------------------

    try {
        setChecking(true);
        setError("");

        const data = await submitAnswer(
        lessonId,
        currentExercise.id,
        finalAnswer
        );

        console.log("ANSWER RESPONSE:", data);

        const isCorrect = Boolean(data?.correct);

        setCorrect(isCorrect);
        setChecked(true);

        // --------------------------------------------------------
        // APPLY RESULT TO THE CURRENT LOCAL ACCOUNT
        // --------------------------------------------------------

        const currentUser = getActiveUser();

        if (!currentUser) {
          window.location.replace("/login");
          return;
        }

        if (isCorrect) {
          const earned = Number(data?.xp_earned ?? 0);

          // Add XP to the account that is actually logged in.
          const nextXP =
            Number(currentUser.xp ?? totalXP) + earned;

          const currentHearts = Math.max(
            0,
            Math.min(5, Number(currentUser.hearts ?? hearts))
          );

          setLessonXP((previous) => previous + earned);
          setTotalXP(nextXP);
          setHearts(currentHearts);

          // Do not increase streak for a single exercise.
          // The streak is updated only after the final lesson step.
          const currentStreak = Math.max(
            0,
            Number(currentUser.streak ?? 0)
          );

          updateActiveUser({
            xp: nextXP,
            hearts: currentHearts,
            gems: Number(
              data?.gems ?? currentUser.gems ?? 100
            ),
            streak: currentStreak,
          });

          setUser(getActiveUser());

          window.dispatchEvent(
            new CustomEvent("duolearn:stats-updated", {
              detail: {
                hearts: currentHearts,
                gems: Number(
                  data?.gems ?? currentUser.gems ?? 100
                ),
                streak: currentStreak,
                total_xp: Number(
                  data?.total_xp ?? nextXP
                ),
              },
            })
          );

          return;
        }

        // Wrong answer: always remove exactly one heart locally.
        const nextHearts = Math.max(
          0,
          Number(currentUser.hearts ?? hearts) - 1
        );

        setHearts(nextHearts);

        updateActiveUser({
          hearts: nextHearts,
          streak: Number(
            data?.streak ?? currentUser.streak ?? 0
          ),
        });

        setUser(getActiveUser());

        window.dispatchEvent(
          new CustomEvent("duolearn:stats-updated", {
            detail: {
              hearts: nextHearts,
              gems: Number(
                data?.gems ?? currentUser.gems ?? 100
              ),
              streak: Number(
                data?.streak ?? currentUser.streak ?? 0
              ),
              total_xp: Number(
                data?.total_xp ?? currentUser.xp ?? totalXP
              ),
            },
          })
        );

    } catch (err) {
        console.error(
        "ANSWER SUBMISSION ERROR:",
        err
        );

        setError(
        "Failed to check answer"
        );
    } finally {
        setChecking(false);
    }
    }

  // ============================================================
  // NEXT QUESTION / COMPLETE LESSON
  // ============================================================

  async function handleNext() {
    if (!checked) {
      return;
    }

    // ----------------------------------------------------------
    // MORE QUESTIONS
    // ----------------------------------------------------------

    if (
      currentIndex <
      totalExercises - 1
    ) {
      setCurrentIndex(
        (previous) => previous + 1
      );

      resetQuestion();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    // ----------------------------------------------------------
    // LAST QUESTION → COMPLETE LESSON
    // ----------------------------------------------------------

    try {
      setChecking(true);
      setError("");

      /*
       * XP has already been awarded by the
       * /answer endpoint.
       *
       * Therefore we DO NOT send XP again here.
       *
       * This endpoint only records that the lesson
       * was completed and updates skill progress.
       */
      const activeUser = getActiveUser();

      if (!activeUser) {
        window.location.replace("/login");
        return;
      }

      /*
       * The local account is the source of truth for progress.
       * This avoids the old hard-coded backend userId = 1.
       *
       * The account's currentLesson is advanced only after the
       * final exercise has been completed.
       *
       * We use the actual course lesson order instead of assuming
       * lesson IDs are always consecutive.
       */
      let nextLessonId: number | null = null;

      try {
        const courseData = await getCourse(1);
        const orderedLessons: number[] = [];

        for (const unit of courseData?.units ?? []) {
          for (const skill of unit?.skills ?? []) {
            for (const item of skill?.lessons ?? []) {
              const id = Number(item?.id);

              if (Number.isFinite(id) && id > 0) {
                orderedLessons.push(id);
              }
            }
          }
        }

        const currentPosition = orderedLessons.findIndex(
          (id) => id === lessonId
        );

        if (
          currentPosition >= 0 &&
          currentPosition < orderedLessons.length - 1
        ) {
          nextLessonId = orderedLessons[currentPosition + 1];
        }
      } catch (courseError) {
        console.error(
          "Failed to determine next lesson:",
          courseError
        );
      }

      // Safe fallback for the current API if lesson ordering is unavailable.
      if (nextLessonId === null) {
        nextLessonId = lessonId + 1;
      }

      const latestUser = getActiveUser();

      if (latestUser) {
        /*
         * STREAK RULE:
         * - A brand-new account starts at 0.
         * - Completing the first lesson changes 0 -> 1.
         * - Completing more lessons on the same account does NOT
         *   reset the streak or give a fake extra streak.
         *
         * currentLesson is the lesson the account was working on.
         * A new account starts at lesson 1, so this detects the
         * first completed lesson without using a hard-coded user ID.
         */
        const wasFirstLesson =
          Number(latestUser.currentLesson ?? 1) === lessonId;

        const currentStreak = Math.max(
          0,
          Number(latestUser.streak ?? 0)
        );

        const completedLessonStreak = wasFirstLesson
          ? Math.max(1, currentStreak)
          : currentStreak;

        updateActiveUser({
          currentLesson: nextLessonId,
          hearts: Math.max(0, Math.min(5, Number(hearts))),
          xp: Number(latestUser.xp ?? totalXP),
          gems: Number(latestUser.gems ?? 100),
          streak: completedLessonStreak,
        });

        const updatedUser = getActiveUser();

        setUser(updatedUser);
        setHearts(Number(updatedUser?.hearts ?? hearts));
        setTotalXP(Number(updatedUser?.xp ?? totalXP));

        window.dispatchEvent(
          new CustomEvent("duolearn:stats-updated", {
            detail: {
              hearts: Number(updatedUser?.hearts ?? hearts),
              gems: Number(updatedUser?.gems ?? 100),
              streak: Number(updatedUser?.streak ?? 0),
              total_xp: Number(updatedUser?.xp ?? totalXP),
            },
          })
        );
      }

      setLessonCompleted(true);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to complete lesson"
      );
    } finally {
      setChecking(false);
    }
  }

  // ============================================================
  // CAN CHECK
  // ============================================================

  const canCheck =
    currentExercise.type ===
    "multiple_choice"
      ? selectedOption !== null
      : currentExercise.type ===
        "match_pairs"
      ? matchedPairs.length ===
        matchPairs.length
      : answer.trim().length > 0;

  // ============================================================
  // UI
  // ============================================================

  const optionLetters = ["A", "B", "C", "D"];

  return createPortal(
    <main className="fixed inset-0 z-[99999] h-screen w-screen overflow-y-auto bg-[#131F23] text-white">
      {/* =========================================================
          DUOLINGO-STYLE LESSON HEADER
      ========================================================== */}

      <header className="sticky left-0 right-0 top-0 z-50 border-b border-[#33464D] bg-[#131F23]">
        <div className="mx-auto flex h-[78px] w-full max-w-[1120px] items-center gap-5 px-5 md:px-8">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-3xl font-bold text-[#AFC0C6] transition hover:bg-[#223238] hover:text-white"
            aria-label="Exit lesson"
          >
            ×
          </button>

          <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#33464D]">
            <div
              className="h-full rounded-full bg-[#58CC02] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex shrink-0 items-center gap-2 text-lg font-black text-[#FF4B4B]">
            <span className="text-2xl">❤️</span>
            <span>{hearts}</span>
          </div>
        </div>
      </header>

      {/* =========================================================
          LESSON CONTENT
      ========================================================== */}

      <section className="mx-auto w-full max-w-[1120px] px-5 pb-40 pt-10 md:px-8 md:pt-14">
        {/* Lesson title / progress information */}
        <div className="mb-10 flex items-start justify-between gap-5">
          <div>
            <p className="mb-2 text-sm font-black uppercase tracking-[0.14em] text-[#8FA5AD]">
              {lesson.title}
            </p>

            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">
                Question {currentIndex + 1} of {totalExercises}
              </h1>

              <span className="rounded-full bg-[#263A41] px-3 py-1 text-sm font-black text-[#FFD900]">
                ⭐ {lesson.xp_reward} XP
              </span>
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-black text-[#8FA5AD]">
              {Math.round(progress)}%
            </p>
            <p className="mt-1 text-xs font-bold text-[#60777F]">
              Keep going!
            </p>
          </div>
        </div>

        {/* =======================================================
            QUESTION
        ======================================================== */}

        <div className="mx-auto max-w-[900px]">
          <div className="mb-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#B968F0] px-4 py-2 text-sm font-black text-white shadow-[0_3px_0_rgba(0,0,0,.25)]">
              {currentExercise.type === "multiple_choice"
                ? "NEW WORD"
                : currentExercise.type === "match_pairs"
                ? "MATCH PAIRS"
                : "PRACTICE"}
            </span>
          </div>

          <h2 className="max-w-[850px] text-[30px] font-black leading-tight tracking-tight text-white md:text-[42px]">
            {currentExercise.question}
          </h2>

          <p className="mt-4 text-base font-semibold text-[#AFC0C6] md:text-lg">
            {currentExercise.type === "match_pairs"
              ? "Select the matching translation."
              : "Choose or type the correct answer."}
          </p>

          {/* VOICE BUTTON */}
          <div className="mt-5">
            <button
              type="button"
              onClick={() =>
                speakText(
                  currentExercise.question,
                  "en-US"
                )
              }
              className="inline-flex items-center gap-3 rounded-2xl border-2 border-[#3A5058] bg-[#17272C] px-5 py-3 text-base font-black text-[#F2F7F8] shadow-[0_3px_0_#263A41] transition hover:border-[#1CB0F6] hover:bg-[#1C3036] active:translate-y-[2px] active:shadow-none"
              aria-label="Listen to the question"
              title="Listen to the question"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#203A45] text-xl">
                🔊
              </span>
              <span>Listen</span>
            </button>
          </div>

          {/* =====================================================
              MULTIPLE CHOICE
          ====================================================== */}

          {currentExercise.type === "multiple_choice" && (
            <div className="mt-9 grid gap-4">
              {currentExercise.options?.map((option, index) => {
                const selected = selectedOption === option.id;
                const letter = optionLetters[index] ?? String(index + 1);

                let stateClass =
                  "border-[#3A5058] bg-[#17272C] hover:border-[#61777F] hover:bg-[#1C3036]";

                if (selected && !checked) {
                  stateClass =
                    "border-[#58CC02] bg-[#1D3820] shadow-[0_3px_0_#315E14]";
                }

                if (checked && selected && correct === true) {
                  stateClass =
                    "border-[#58CC02] bg-[#17351D] shadow-[0_3px_0_#315E14]";
                }

                if (checked && selected && correct === false) {
                  stateClass =
                    "border-[#FF4B4B] bg-[#3A2023] shadow-[0_3px_0_#702D31]";
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleMultipleChoice(option.id)}
                    disabled={checked || checking}
                    className={`group flex min-h-[76px] w-full items-center gap-5 rounded-2xl border-2 px-5 text-left text-lg font-black transition-all md:min-h-[86px] md:px-7 md:text-xl ${stateClass}`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 text-base font-black transition ${
                        selected
                          ? "border-[#58CC02] bg-[#58CC02] text-white"
                          : "border-[#40565E] bg-[#21343A] text-[#D8E3E6] group-hover:border-[#6D8289]"
                      }`}
                    >
                      {letter}
                    </span>

                    <span className="text-[#F2F7F8]">
                      {option.text}
                    </span>

                    <span
                      role="button"
                      tabIndex={checked || checking ? -1 : 0}
                      aria-label={`Listen to ${option.text}`}
                      title={`Listen to ${option.text}`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        if (!checked && !checking) {
                          speakText(option.text, "es-ES");
                        }
                      }}
                      onKeyDown={(event) => {
                        if (
                          (event.key === "Enter" || event.key === " ") &&
                          !checked &&
                          !checking
                        ) {
                          event.preventDefault();
                          event.stopPropagation();
                          speakText(option.text, "es-ES");
                        }
                      }}
                      className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#3A5058] bg-[#20343C] text-xl transition hover:border-[#1CB0F6] hover:bg-[#24414B]"
                    >
                      🔊
                    </span>

                    {checked && selected && (
                      <span className="ml-auto text-2xl">
                        {correct ? "✓" : "✕"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* =====================================================
              TEXT INPUT
          ====================================================== */}

          {[
            "translation",
            "fill_blank",
            "type_answer",
          ].includes(currentExercise.type) && (
            <div className="mt-9">
              <div
                className={`rounded-2xl border-2 bg-[#17272C] p-2 transition ${
                  checked
                    ? correct
                      ? "border-[#58CC02]"
                      : "border-[#FF4B4B]"
                    : "border-[#3A5058] focus-within:border-[#58CC02]"
                }`}
              >
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      canCheck &&
                      !checking
                    ) {
                      if (checked) {
                        handleNext();
                      } else {
                        handleCheckAnswer();
                      }
                    }
                  }}
                  disabled={checked || checking}
                  placeholder={
                    currentExercise.type === "fill_blank"
                      ? "Type your answer..."
                      : "Type your answer..."
                  }
                  className="w-full bg-transparent px-5 py-5 text-xl font-bold text-white outline-none placeholder:text-[#60777F] md:text-2xl"
                  autoComplete="off"
                />
              </div>

              <p className="mt-3 text-sm font-semibold text-[#70868E]">
                Press Enter to check your answer.
              </p>
            </div>
          )}

          {/* =====================================================
              MATCH PAIRS
          ====================================================== */}

          {currentExercise.type === "match_pairs" && (
            <div className="mt-9">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-3 text-xs font-black uppercase tracking-wider text-[#789099]">
                    Spanish
                  </p>

                  <div className="space-y-3">
                    {matchPairs.map((pair) => {
                      const matched = matchedPairs.includes(pair.spanish);
                      const selected =
                        selectedSpanish === pair.spanish;

                      return (
                        <button
                          key={pair.spanish}
                          type="button"
                          disabled={matched || checked || checking}
                          onClick={() =>
                            handleSpanishSelect(pair.spanish)
                          }
                          className={`flex min-h-[72px] w-full items-center justify-between rounded-2xl border-2 px-5 text-left font-black transition ${
                            matched
                              ? "border-[#58CC02] bg-[#19341F] text-[#7BE33D]"
                              : selected
                              ? "border-[#1CB0F6] bg-[#173746] text-white"
                              : "border-[#3A5058] bg-[#17272C] text-white hover:border-[#60777F]"
                          }`}
                        >
                          <span>{pair.spanish}</span>

                          <span
                            role="button"
                            tabIndex={matched || checked || checking ? -1 : 0}
                            aria-label={`Listen to ${pair.spanish}`}
                            title={`Listen to ${pair.spanish}`}
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();

                              if (!matched && !checked && !checking) {
                                speakText(pair.spanish, "es-ES");
                              }
                            }}
                            onKeyDown={(event) => {
                              if (
                                (event.key === "Enter" || event.key === " ") &&
                                !matched &&
                                !checked &&
                                !checking
                              ) {
                                event.preventDefault();
                                event.stopPropagation();
                                speakText(pair.spanish, "es-ES");
                              }
                            }}
                            className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#3A5058] bg-[#20343C] text-lg transition hover:border-[#1CB0F6] hover:bg-[#24414B]"
                          >
                            🔊
                          </span>

                          {matched && (
                            <span className="text-xl">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs font-black uppercase tracking-wider text-[#789099]">
                    English
                  </p>

                  <div className="space-y-3">
                    {matchPairs.map((pair) => {
                      const matched = matchedPairs.some((spanish) => {
                        const matchedPair = matchPairs.find(
                          (item) => item.spanish === spanish
                        );

                        return (
                          matchedPair?.english === pair.english
                        );
                      });

                      const selected =
                        selectedEnglish === pair.english;

                      return (
                        <button
                          key={pair.english}
                          type="button"
                          disabled={matched || checked || checking}
                          onClick={() =>
                            handleEnglishSelect(pair.english)
                          }
                          className={`flex min-h-[72px] w-full items-center justify-between rounded-2xl border-2 px-5 text-left font-black transition ${
                            matched
                              ? "border-[#58CC02] bg-[#19341F] text-[#7BE33D]"
                              : selected
                              ? "border-[#1CB0F6] bg-[#173746] text-white"
                              : "border-[#3A5058] bg-[#17272C] text-white hover:border-[#60777F]"
                          }`}
                        >
                          <span>{pair.english}</span>
                          {matched && (
                            <span className="text-xl">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================
              RESULT
          ====================================================== */}

          {error && (
            <div className="mt-7 rounded-2xl border-2 border-[#8A353A] bg-[#351F23] p-5">
              <p className="font-bold text-[#FF8A8A]">{error}</p>
            </div>
          )}

          {checked && correct === true && (
            <div className="mt-7 flex items-center gap-4 rounded-2xl border-2 border-[#4B9D21] bg-[#19351F] p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#58CC02] text-2xl font-black text-white">
                ✓
              </span>

              <div>
                <p className="text-xl font-black text-[#7BE33D]">
                  Correct!
                </p>
                <p className="mt-1 font-semibold text-[#B9DDB0]">
                  Great job!
                  {currentExercise.type !== "match_pairs" &&
                    " XP has been added to your account."}
                </p>

                {currentExercise.explanation && (
                  <p className="mt-1 text-sm font-medium text-[#9EC698]">
                    {currentExercise.explanation}
                  </p>
                )}
              </div>
            </div>
          )}

          {checked && correct === false && (
            <div className="mt-7 flex items-center gap-4 rounded-2xl border-2 border-[#8A353A] bg-[#351F23] p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FF4B4B] text-2xl font-black text-white">
                ✕
              </span>

              <div>
                <p className="text-xl font-black text-[#FF7777]">
                  Not quite!
                </p>

                <p className="mt-1 font-semibold text-[#FFB0B0]">
                  You lost one heart. Try the next question.
                </p>

                {currentExercise.explanation && (
                  <p className="mt-1 text-sm font-medium text-[#E59B9B]">
                    {currentExercise.explanation}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          FIXED DUOLINGO-STYLE BOTTOM ACTION BAR
      ========================================================== */}

      <div className="fixed bottom-0 left-0 right-0 z-[100] border-t-2 border-[#33464D] bg-[#131F23]/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-5 px-5 py-4 md:px-8">
          <div className="hidden text-sm font-black text-[#789099] sm:block">
            {checked
              ? correct
                ? "Nice work!"
                : "Learn from the mistake and continue."
              : "Take your time."}
          </div>

          <button
            type="button"
            onClick={
              checked
                ? handleNext
                : handleCheckAnswer
            }
            disabled={
              checking ||
              (!checked && !canCheck)
            }
            className={`ml-auto min-w-[190px] rounded-2xl border-b-4 px-8 py-4 text-base font-black uppercase tracking-wide transition-all md:min-w-[230px] ${
              checking
                ? "cursor-wait border-[#4B5D63] bg-[#34464D] text-[#7D8E94]"
                : checked || canCheck
                ? "border-[#3C9300] bg-[#58CC02] text-white hover:bg-[#61D507] active:translate-y-1 active:border-b-0"
                : "cursor-not-allowed border-[#2D3E44] bg-[#25363C] text-[#53666D]"
            }`}
          >
            {checking
              ? "Checking..."
              : checked
              ? currentIndex === totalExercises - 1
                ? "Finish Lesson"
                : "Continue"
              : "Check"}
          </button>
        </div>
      </div>
    </main>
  , document.body);
}

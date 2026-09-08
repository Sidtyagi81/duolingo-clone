"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getActiveUser, type DuolearnUser } from "@/lib/userState";

function RewardChest() {
  return (
    <div className="relative h-[48px] w-[48px]" aria-hidden="true">
      <div className="absolute left-[4px] top-[8px] h-[31px] w-[40px] rounded-b-[7px] border-[3px] border-[#E7A06D] bg-[#D77E43]" />
      <div className="absolute left-[4px] top-[4px] h-[14px] w-[40px] rounded-t-[7px] border-[3px] border-[#F0B27F] bg-[#D9874B]" />
      <div className="absolute left-[20px] top-[18px] h-[9px] w-[8px] rounded-sm bg-[#A85E31]" />
    </div>
  );
}

function FlameIcon({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 29c6.5 0 11-4.5 11-10.5 0-5-3.5-9-7.5-12C19.5 10 17.5 12 15.5 13.5 15 9 12 5 8 3c1 6-3 9-3 15.5C5 24.5 9.5 29 16 29Z"
        fill="#3D5059"
      />
      <path
        d="M16 25c3 0 5-2 5-4.5 0-2-1.5-3.5-3.5-5-.1 2.5-1.5 3.5-2.5 4-.5-2-2-3.5-3.5-4.5 0 2-.5 3.5-.5 5 0 2.5 2 4.5 5 4.5Z"
        fill="#52636B"
      />
    </svg>
  );
}

function GemIcon({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m18 3 11 7-4.5 18L18 32l-6.5-4L7 10l11-7Z"
        fill="#1CB0F6"
        stroke="#8BD8FF"
        strokeWidth="2"
      />
      <path
        d="m12.5 11 5.5-5 5.5 5-3.5 14-2 3-2-3-3.5-14Z"
        fill="#7DD7FF"
      />
    </svg>
  );
}

function HeartIcon({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18 31C15.5 28.5 6 22 6 14c0-4.5 3.5-8 8-8 2 0 3.5 1 4 2.5C18.5 7 20 6 22 6c4.5 0 8 3.5 8 8 0 8-9.5 14.5-12 17Z"
        fill="#FF4B4B"
        stroke="#FFB7B7"
        strokeWidth="2"
      />
      <path
        d="M12 12c-1.5 0-3 1.5-3 3"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".75"
      />
    </svg>
  );
}

export default function QuestsPage() {
  const [user, setUser] = useState<DuolearnUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [lessonStarted, setLessonStarted] = useState(false);

  const loadUser = () => {
    const activeUser = getActiveUser();

    if (!activeUser) {
      window.location.replace("/login");
      return;
    }

    setUser(activeUser);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    const initialUser = getActiveUser();

    if (!initialUser) {
      window.location.replace("/login");
      return;
    }

    if (mounted) {
      setUser(initialUser);
      setLoading(false);
    }

    const syncUser = () => {
      if (!mounted) return;

      const activeUser = getActiveUser();

      if (!activeUser) {
        window.location.replace("/login");
        return;
      }

      setUser(activeUser);
    };

    window.addEventListener("storage", syncUser);
    window.addEventListener("duolearn:stats-updated", syncUser as EventListener);
    window.addEventListener("duolearn:logout", syncUser);

    return () => {
      mounted = false;
      window.removeEventListener("storage", syncUser);
      window.removeEventListener(
        "duolearn:stats-updated",
        syncUser as EventListener,
      );
      window.removeEventListener("duolearn:logout", syncUser);
    };
  }, []);

  const streak = Number(user?.streak ?? 0);
  const gems = Number(user?.gems ?? 100);
  const hearts = Number(user?.hearts ?? 5);
  const totalXP = Number(user?.xp ?? 0);

  // The current lesson is the first lesson the account has not completed.
  // New accounts are initialized with currentLesson = 1.
  // After completing a lesson, lesson completion should save the next
  // lesson number into the same account.
  const currentLesson = Math.max(Number(user?.currentLesson ?? 1), 1);
  const completedLessons = Math.max(currentLesson - 1, 0);

  // This local account model stores total XP, not a separate daily XP value.
  // Use total XP for the daily quest so the page never falls back to another
  // user's backend data.
  const questXP = Math.min(totalXP, 10);
  const questProgress = Math.min((questXP / 10) * 100, 100);

  const userStatus = useMemo(() => {
    if (!user) return "Loading your account...";
    if (completedLessons === 0) return "Start your first lesson";
    return `Continue from Lesson ${currentLesson}`;
  }, [user, completedLessons, currentLesson]);

  const lessonHref = "/learn";

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0E1E23] text-white">
        <div className="text-center">
          <div className="mb-5 animate-bounce text-7xl">🦉</div>
          <h1 className="text-2xl font-black">Loading quests...</h1>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E1E23] text-white">
      {/* GlobalSidebar / GlobalHeader are supplied by app/layout.tsx. */}

      <main className="xl:ml-[348px]">
        <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-8 sm:px-8 xl:px-8 xl:pt-8">
          <div className="grid grid-cols-1 gap-8 2xl:grid-cols-[minmax(600px,742px)_minmax(380px,500px)]">
            <section>
              <div className="relative h-[315px] overflow-hidden rounded-[22px] bg-[#9367D0]">
                <div className="absolute left-8 top-8 max-w-[570px] text-[#101A46] sm:left-9 sm:top-9">
                  <h1 className="text-[30px] font-black sm:text-[32px]">
                    Welcome, {user.name}!
                  </h1>

                  <p className="mt-5 max-w-[510px] text-[20px] font-semibold leading-relaxed">
                    Complete quests to earn rewards! Quests refresh every day.
                  </p>

                  <p className="mt-4 text-[16px] font-black uppercase tracking-wide text-[#24164A]/70">
                    {userStatus}
                  </p>
                </div>

                <div className="absolute bottom-[54px] right-[65px] text-[102px] leading-none">
                  🦉
                </div>

                <div className="absolute right-[143px] top-[72px] text-[50px] leading-none">
                  🎁
                </div>

                <div className="absolute right-[109px] top-[51px] text-xl text-white">
                  ✦
                </div>

                <div className="absolute right-[202px] top-[122px] text-2xl text-white">
                  ✦
                </div>

                <div className="absolute bottom-[48px] right-[60px] h-[20px] w-[118px] rounded-[50%] bg-[#7554A6]" />
              </div>

              <div className="mt-10 flex items-center justify-between gap-4">
                <h2 className="text-[31px] font-black">Daily Quests</h2>

                <div className="flex items-center gap-2 text-[20px] font-black text-[#FFAA00]">
                  <span className="text-[24px]">◷</span>
                  4 HOURS
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-[22px] border-2 border-[#344850] bg-[#112329]">
                <div className="flex min-h-[150px] items-center gap-7 px-8 py-7">
                  <div className="shrink-0 text-[66px] leading-none">⚡</div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-[23px] font-black">Earn 10 XP</h3>

                    <div className="mt-7 flex items-center gap-3">
                      <div className="h-[13px] flex-1 overflow-hidden rounded-full bg-[#3D5059]">
                        <div
                          className="h-full rounded-full bg-[#58CC02] transition-all duration-500"
                          style={{ width: `${questProgress}%` }}
                        />
                      </div>

                      <span className="min-w-[55px] text-center text-[17px] font-black text-[#AAB9BE]">
                        {questXP} / 10
                      </span>
                    </div>
                  </div>

                  <RewardChest />
                </div>
              </div>

              <div className="mt-6 flex min-h-[135px] items-center gap-7 rounded-[22px] border-2 border-[#344850] bg-[#112329] px-8">
                <div className="text-[58px] leading-none">🔒</div>

                <div className="text-[22px] font-black text-[#61777F]">
                  More quests unlock soon
                </div>
              </div>
            </section>

            <aside>
              <div className="rounded-[22px] border-2 border-[#344850] bg-[#112329] p-7">
                <div className="relative min-h-[265px] overflow-hidden">
                  <h2 className="max-w-[300px] text-[23px] font-black leading-relaxed">
                    Monthly challenges unlock soon!
                  </h2>

                  <p className="mt-5 max-w-[315px] text-[19px] font-medium leading-relaxed text-[#E1ECEF]">
                    Complete each month&apos;s challenge to earn exclusive
                    badges.
                  </p>

                  <div className="pointer-events-none absolute right-[-20px] top-0">
                    <div className="absolute right-[35px] top-[12px] flex h-[112px] w-[112px] items-center justify-center rounded-full border-[12px] border-[#FFD21A] bg-[#FFC900] shadow-inner">
                      <span className="text-5xl">★</span>
                    </div>

                    <div className="absolute right-[-18px] top-[70px] h-[102px] w-[102px] rounded-full bg-[#84D900]" />
                    <div className="absolute right-[-42px] top-[82px] h-[94px] w-[94px] rounded-full bg-[#B4E832]" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0">
                    <button
                      type="button"
                      onClick={() => setLessonStarted(true)}
                      className="w-full rounded-[20px] border-2 border-[#344850] bg-transparent px-5 py-4 text-[18px] font-black text-[#35BDF5] shadow-[0_5px_0_rgba(52,72,80,.45)] transition hover:bg-[#20343C] active:translate-y-1 active:shadow-none"
                    >
                      {completedLessons === 0
                        ? "START LESSON 1"
                        : `CONTINUE LESSON ${currentLesson}`}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border-2 border-[#344850] bg-[#112329] p-4 text-center">
                  <div className="flex justify-center">
                    <FlameIcon size={30} />
                  </div>
                  <div className="mt-1 text-xl font-black">{streak}</div>
                  <div className="text-xs font-bold text-[#8FA4AA]">STREAK</div>
                </div>

                <div className="rounded-2xl border-2 border-[#344850] bg-[#112329] p-4 text-center">
                  <div className="flex justify-center">
                    <GemIcon size={30} />
                  </div>
                  <div className="mt-1 text-xl font-black">{gems}</div>
                  <div className="text-xs font-bold text-[#8FA4AA]">GEMS</div>
                </div>

                <div className="rounded-2xl border-2 border-[#344850] bg-[#112329] p-4 text-center">
                  <div className="flex justify-center">
                    <HeartIcon size={30} />
                  </div>
                  <div className="mt-1 text-xl font-black">{hearts}</div>
                  <div className="text-xs font-bold text-[#8FA4AA]">HEARTS</div>
                </div>
              </div>

              <div className="mt-5 rounded-[22px] border-2 border-[#344850] bg-[#112329] p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black uppercase tracking-wide text-[#8FA4AA]">
                    Course progress
                  </span>
                  <span className="text-xl font-black text-[#35BDF5]">
                    Lesson {currentLesson}
                  </span>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#3D5059]">
                  <div
                    className="h-full rounded-full bg-[#58CC02] transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (completedLessons / Math.max(currentLesson, 1)) * 100,
                        100,
                      )}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-sm font-bold text-[#8FA4AA]">
                  <span>{completedLessons} completed</span>
                  <span>{totalXP} XP</span>
                </div>
              </div>

              <footer className="flex flex-wrap justify-center gap-x-7 gap-y-5 px-5 pt-12 text-[14px] font-black text-[#526970]">
                
              </footer>
            </aside>
          </div>
        </div>
      </main>

      {lessonStarted && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-5 backdrop-blur-sm"
          onClick={() => setLessonStarted(false)}
        >
          <div
            className="w-full max-w-[500px] rounded-[28px] border-2 border-[#344850] bg-[#12262C] p-8 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="text-7xl">⚡</div>

            <h2 className="mt-4 text-3xl font-black">Start a Lesson</h2>

            <p className="mt-3 text-lg leading-relaxed text-[#DCE8EE]">
              {completedLessons === 0
                ? "Start Lesson 1 and build your course progress from scratch."
                : `Continue from Lesson ${currentLesson}, exactly where this account last progressed.`}
            </p>

            <Link
              href={lessonHref}
              className="mt-7 block rounded-2xl bg-[#58CC02] px-5 py-4 text-lg font-black text-white shadow-[0_5px_0_#3A9200] transition active:translate-y-1 active:shadow-none"
            >
              {completedLessons === 0
                ? "START LESSON 1"
                : `CONTINUE LESSON ${currentLesson}`}
            </Link>

            <button
              type="button"
              onClick={() => setLessonStarted(false)}
              className="mt-4 w-full rounded-2xl border-2 border-[#344850] px-5 py-4 font-black text-white hover:bg-[#20343C]"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

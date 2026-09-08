"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getActiveUser, type DuolearnUser } from "@/lib/userState";

/* =========================================================
   MEDAL GRAPHIC
   ========================================================= */

function MedalGraphic() {
  return (
    <div className="relative h-[245px] w-[410px] max-w-full">
      <div className="absolute left-[42px] top-[60px] h-[125px] w-[105px] rotate-[-28deg] rounded-[28px] border-[8px] border-[#E5B37B] bg-[#DFA46F] shadow-[inset_0_-10px_0_rgba(0,0,0,.08)]" />
      <div className="absolute right-[35px] top-[60px] h-[125px] w-[105px] rotate-[28deg] rounded-[28px] border-[8px] border-[#C8D7E3] bg-[#DDEAF4] shadow-[inset_0_-10px_0_rgba(0,0,0,.08)]" />

      <div className="absolute left-1/2 top-[42px] h-[155px] w-[145px] -translate-x-1/2 rounded-[28px] border-[9px] border-[#FFD92A] bg-[#FFC800] shadow-[0_8px_0_#DCA900]">
        <div className="absolute inset-[15px] rounded-[20px] bg-[#FFCC1A]" />
        <div className="absolute left-1/2 top-1/2 h-[75px] w-[16px] -translate-x-1/2 -translate-y-1/2 rotate-[42deg] rounded-full bg-[#F39A00]" />
        <div className="absolute left-[47px] top-[73px] h-[30px] w-[55px] -translate-y-1/2 rotate-[42deg] rounded-full bg-[#F39A00]" />
      </div>

      <div className="absolute left-[93px] top-[18px] h-[25px] w-[25px] rotate-45 rounded-md bg-[#FFEFB0]" />
      <div className="absolute left-[71px] top-[52px] h-[18px] w-[18px] rotate-45 rounded-md bg-[#FFEFB0]" />
      <div className="absolute right-[91px] top-[24px] h-[22px] w-[22px] rotate-45 rounded-md bg-[#FFEFB0]" />
      <div className="absolute bottom-[4px] left-1/2 h-[18px] w-[24px] -translate-x-1/2 rotate-45 rounded-md bg-[#FFF2B8]" />
    </div>
  );
}

/* =========================================================
   OWL
   ========================================================= */

function OwlCompetitor() {
  return (
    <div className="relative h-[150px] w-[150px]">
      <div className="absolute right-0 top-[15px] h-[112px] w-[112px] rotate-[-8deg] rounded-[44%] bg-[#78D500] shadow-[inset_-8px_-7px_0_rgba(0,0,0,.08)]" />

      <div className="absolute right-[38px] top-[47px] h-[38px] w-[38px] rounded-full bg-white">
        <div className="absolute left-[14px] top-[10px] h-[14px] w-[14px] rounded-full bg-[#3D3D3D]" />
      </div>

      <div className="absolute right-[4px] top-[55px] h-[38px] w-[38px] rounded-full bg-white">
        <div className="absolute left-[7px] top-[10px] h-[14px] w-[14px] rounded-full bg-[#3D3D3D]" />
      </div>

      <div className="absolute right-[48px] top-[83px] h-[20px] w-[25px] rotate-[8deg] rounded-[45%] bg-[#FF9600]" />
      <div className="absolute right-[10px] top-[5px] h-[22px] w-[130px] rotate-[-34deg] rounded-full bg-[#FF4B4B]" />
      <div className="absolute right-[14px] top-[9px] h-[7px] w-[128px] rotate-[-34deg] bg-white" />
      <div className="absolute right-[18px] top-[16px] h-[6px] w-[125px] rotate-[-34deg] bg-[#58CC02]" />
      <div className="absolute right-[112px] top-[83px] h-[45px] w-[45px] rotate-[-15deg] rounded-full bg-[#5E6870]" />
      <div className="absolute bottom-[5px] left-[28px] h-[45px] w-[75px] rounded-[50%] bg-[#5E6870]" />
    </div>
  );
}

/* =========================================================
   FOOTER
   ========================================================= */

function Footer() {
  return (
    <footer className="flex flex-wrap justify-center gap-x-7 gap-y-5 px-5 py-12 text-[14px] font-black text-[#526970]">
      
    </footer>
  );
}

/* =========================================================
   LEADERBOARD PAGE
   ========================================================= */

export default function LeaderboardPage() {
  const [user, setUser] = useState<DuolearnUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [lessonOpen, setLessonOpen] = useState(false);

  /* ---------------------------------------------------------
     LOAD CURRENT LOGGED-IN ACCOUNT
     --------------------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    const loadUser = () => {
      const activeUser = getActiveUser();

      if (!activeUser) {
        window.location.replace("/login");
        return;
      }

      if (mounted) {
        setUser(activeUser);
        setLoading(false);
      }
    };

    loadUser();

    const refreshUser = () => {
      const activeUser = getActiveUser();

      if (!activeUser) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      if (mounted) {
        setUser(activeUser);
      }
    };

    window.addEventListener("duolearn:stats-updated", refreshUser);
    window.addEventListener("duolearn:logout", refreshUser);
    window.addEventListener("storage", refreshUser);

    return () => {
      mounted = false;
      window.removeEventListener("duolearn:stats-updated", refreshUser);
      window.removeEventListener("duolearn:logout", refreshUser);
      window.removeEventListener("storage", refreshUser);
    };
  }, []);

  /* ---------------------------------------------------------
     CURRENT USER VALUES
     --------------------------------------------------------- */

  const userName = user?.name?.trim() || "You";
  const totalXP = Number(user?.xp ?? 0);
  const streak = Number(user?.streak ?? 0);
  const gems = Number(user?.gems ?? 100);
  const hearts = Number(user?.hearts ?? 5);

  /*
   * currentLesson is the FIRST lesson the user has not completed.
   *
   * New user:
   * currentLesson = 1 -> 0 completed
   *
   * After lesson 1:
   * currentLesson = 2 -> 1 completed
   *
   * After lesson 2:
   * currentLesson = 3 -> 2 completed
   *
   * After lesson 3:
   * currentLesson = 4 -> 3 completed
   */
  const completedLessons = Math.max(
    Number(user?.currentLesson ?? 1) - 1,
    0
  );

  const lessonsNeeded = Math.max(3 - completedLessons, 0);
  const unlocked = lessonsNeeded === 0;

  const recentXP = useMemo(() => {
    return totalXP;
  }, [totalXP]);

  /* ---------------------------------------------------------
     LEADERBOARD DATA
     --------------------------------------------------------- */

  const leaders = useMemo(() => {
    const rawLeaders = [
      {
        name: "Luna",
        xp: Math.max(totalXP + 420, 420),
        icon: "🦉",
        you: false,
      },
      {
        name: "Alex",
        xp: Math.max(totalXP + 190, 190),
        icon: "🦊",
        you: false,
      },
      {
        name: userName,
        xp: totalXP,
        icon: "🧑",
        you: true,
      },
      {
        name: "Maya",
        xp: Math.max(totalXP - 70, 0),
        icon: "🐼",
        you: false,
      },
      {
        name: "Noah",
        xp: Math.max(totalXP - 130, 0),
        icon: "🐼",
        you: false,
      },
    ];

    const sorted = [...rawLeaders].sort((a, b) => b.xp - a.xp);

    return sorted.map((leader, index) => ({
      ...leader,
      rank: index + 1,
    }));
  }, [totalXP, userName]);

  /* ---------------------------------------------------------
     LOADING
     --------------------------------------------------------- */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0E1E23] pt-[82px] text-white">
        <div className="text-center">
          <div className="mb-6 animate-bounce text-7xl">🏆</div>
          <h1 className="text-2xl font-black">
            Loading leaderboard...
          </h1>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  /* ---------------------------------------------------------
     MAIN
     --------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-[#0E1E23] text-white">
      <main className="pt-[82px] xl:ml-[348px]">
        <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-8 sm:px-8">
          <div className="grid grid-cols-1 gap-8 2xl:grid-cols-[minmax(620px,820px)_minmax(390px,500px)]">

            {/* LEFT */}
            <section className="min-w-0">
              {!unlocked ? (
                <>
                  <div className="flex min-h-[480px] flex-col items-center justify-start px-4 pt-3 text-center">
                    <MedalGraphic />

                    <h1 className="mt-[-2px] text-[30px] font-black tracking-[-.5px] sm:text-[32px]">
                      Unlock Leaderboards!
                    </h1>

                    <p className="mt-5 text-[21px] font-semibold text-[#E4EFF2]">
                      Complete {lessonsNeeded} more{" "}
                      {lessonsNeeded === 1 ? "lesson" : "lessons"} to
                      start competing
                    </p>

                    <button
                      type="button"
                      onClick={() => setLessonOpen(true)}
                      className="mt-9 w-[350px] max-w-full rounded-[20px] border-2 border-[#344850] bg-transparent px-6 py-4 text-[18px] font-black text-[#35BDF5] shadow-[0_5px_0_#344850] transition hover:bg-[#172B32] active:translate-y-1 active:shadow-none"
                    >
                      CONTINUE LEARNING
                    </button>
                  </div>

                  <div className="relative mt-6 overflow-hidden pb-5">
                    {[0, 1, 2].map((row) => (
                      <div
                        key={row}
                        className="mx-auto flex max-w-[700px] items-center gap-8 border-b border-[#15272D] px-7 py-7 opacity-45"
                      >
                        <div className="h-5 w-5 rounded-full bg-[#8A979C]" />
                        <div className="h-[66px] w-[66px] rounded-full bg-[#7D888D]" />
                        <div className="h-4 w-[105px] rounded-full bg-[#7D888D]" />
                        <div className="ml-auto h-4 w-[65px] rounded-full bg-[#7D888D]" />
                      </div>
                    ))}

                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#0E1E23]" />
                  </div>
                </>
              ) : (
                <div className="pt-4">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-[32px] font-black">
                        Weekly Leaderboard
                      </h1>
                      <p className="mt-2 text-[#9EB0B7]">
                        Compete with learners and earn XP.
                      </p>
                    </div>

                    <div className="rounded-2xl border-2 border-[#344850] bg-[#112329] px-5 py-3 text-center">
                      <div className="text-sm font-black text-[#627780]">
                        YOUR XP
                      </div>
                      <div className="text-2xl font-black text-[#35BDF5]">
                        {totalXP}
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 overflow-hidden rounded-[22px] border-2 border-[#344850] bg-[#112329]">
                    {leaders.map((leader, index) => (
                      <div
                        key={`${leader.rank}-${leader.name}`}
                        className={`flex items-center gap-5 px-6 py-5 ${
                          index !== leaders.length - 1
                            ? "border-b-2 border-[#263940]"
                            : ""
                        } ${
                          leader.you ? "bg-[#18313A]" : ""
                        }`}
                      >
                        <div className="w-9 text-center text-xl font-black text-[#AABBC1]">
                          {leader.rank}
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#78D500] text-xl">
                          {leader.icon}
                        </div>

                        <div className="flex-1">
                          <div className="font-black">
                            {leader.name}
                          </div>
                          <div className="text-sm text-[#657A82]">
                            {leader.you ? "You" : "Learner"}
                          </div>
                        </div>

                        <div className="font-black text-[#35BDF5]">
                          {leader.xp} XP
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border-2 border-[#344850] bg-[#112329] p-5">
                      <div className="text-3xl">⚡</div>
                      <div className="mt-3 text-2xl font-black">
                        {recentXP}
                      </div>
                      <div className="text-sm font-bold text-[#63777E]">
                        Total XP
                      </div>
                    </div>

                    <div className="rounded-2xl border-2 border-[#344850] bg-[#112329] p-5">
                      <div className="text-3xl">📚</div>
                      <div className="mt-3 text-2xl font-black">
                        {completedLessons}
                      </div>
                      <div className="text-sm font-bold text-[#63777E]">
                        Lessons completed
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* RIGHT */}
            <aside>
              <div className="rounded-[22px] border-2 border-[#344850] bg-[#112329] p-7">
                <div className="relative min-h-[250px] overflow-hidden">
                  <p className="text-[18px] font-black uppercase tracking-wide text-[#627780]">
                    YOUR PROGRESS
                  </p>

                  <h2 className="mt-5 max-w-[310px] text-[23px] font-black leading-relaxed">
                    Keep learning.
                    <br />
                    Keep earning XP.
                  </h2>

                  <p className="mt-5 max-w-[325px] text-[19px] font-medium leading-relaxed text-[#E2EDF0]">
                    {unlocked
                      ? "Your leaderboard is unlocked. Finish lessons and keep climbing."
                      : `You need ${lessonsNeeded} more ${
                          lessonsNeeded === 1
                            ? "lesson"
                            : "lessons"
                        } to unlock the leaderboard.`}
                  </p>

                  <div className="pointer-events-none absolute bottom-[-7px] right-[-15px]">
                    <OwlCompetitor />
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border-2 border-[#344850] bg-[#112329] p-4 text-center">
                  <div className="text-2xl">🔥</div>
                  <div className="mt-1 font-black">{streak}</div>
                  <div className="text-xs font-bold text-[#63777E]">
                    Streak
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-[#344850] bg-[#112329] p-4 text-center">
                  <div className="text-2xl">💎</div>
                  <div className="mt-1 font-black">{gems}</div>
                  <div className="text-xs font-bold text-[#63777E]">
                    Gems
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-[#344850] bg-[#112329] p-4 text-center">
                  <div className="text-2xl">❤️</div>
                  <div className="mt-1 font-black">{hearts}</div>
                  <div className="text-xs font-bold text-[#63777E]">
                    Hearts
                  </div>
                </div>
              </div>

              <Footer />
            </aside>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {lessonOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/75 p-5 backdrop-blur-sm"
          onClick={() => setLessonOpen(false)}
        >
          <div
            className="w-full max-w-[500px] rounded-[28px] border-2 border-[#344850] bg-[#12262C] p-8 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="text-7xl">📚</div>

            <h2 className="mt-4 text-3xl font-black">
              Continue Learning
            </h2>

            <p className="mt-3 text-lg leading-relaxed text-[#DCE8EE]">
              {completedLessons === 0
                ? "Start your first lesson and begin your learning journey."
                : `You have completed ${completedLessons} ${
                    completedLessons === 1
                      ? "lesson"
                      : "lessons"
                  }. Continue from where you left off.`}
            </p>

            <Link
              href="/"
              onClick={() => setLessonOpen(false)}
              className="mt-7 block rounded-2xl bg-[#58CC02] px-5 py-4 text-lg font-black text-white shadow-[0_5px_0_#3A9200] transition active:translate-y-1 active:shadow-none"
            >
              CONTINUE LEARNING
            </Link>

            <button
              type="button"
              onClick={() => setLessonOpen(false)}
              className="mt-4 w-full rounded-2xl border-2 border-[#344850] px-5 py-4 font-black text-white transition hover:bg-[#20343C]"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

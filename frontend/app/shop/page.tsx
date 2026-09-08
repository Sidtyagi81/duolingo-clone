"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getActiveUser,
  updateActiveUser,
} from "@/lib/userState";

type UserStats = {
  total_xp?: number;
  daily_xp?: number;
  streak?: number;
  hearts?: number;
  gems?: number;
};

function HomeIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M5 14.5 16 5l11 9.5V27h-7v-8h-8v8H5V14.5Z"
        fill="#FFC800"
        stroke="#FF4B4B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M12 19h8v8h-8v-8Z" fill="#FF9600" />
    </svg>
  );
}

function TrophyIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M9 5h14v8c0 5-3 8-7 8s-7-3-7-8V5Z"
        fill="#FFD900"
      />
      <path
        d="M9 8H5v3c0 4 2.5 6 6 6M23 8h4v3c0 4-2.5 6-6 6"
        stroke="#FF9600"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M16 21v5M11 27h10"
        stroke="#FFD900"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function QuestIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect
        x="5"
        y="8"
        width="22"
        height="19"
        rx="3"
        fill="#FFC800"
      />
      <rect
        x="10"
        y="4"
        width="12"
        height="6"
        rx="2"
        fill="#FF9600"
      />
      <path
        d="M11 15h10M11 20h7"
        stroke="#DFA800"
        strokeWidth="2"
      />
    </svg>
  );
}

function ShopIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M4 12h24v15H4V12Z" fill="#FF4B4B" />
      <path d="M3 12 7 5h18l4 7H3Z" fill="#FF9600" />
      <path
        d="M4 12h24M10 18v9M22 18v9"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
}

function ProfileIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle
        cx="16"
        cy="16"
        r="13"
        stroke="#65767D"
        strokeWidth="2.5"
        strokeDasharray="4 3"
      />
      <circle cx="16" cy="12" r="4" fill="#65767D" />
      <path
        d="M9 24c1.5-4.5 11.5-4.5 13 0"
        stroke="#65767D"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoreIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13" fill="#C77DFF" />
      <circle cx="10" cy="16" r="2" fill="white" />
      <circle cx="16" cy="16" r="2" fill="white" />
      <circle cx="22" cy="16" r="2" fill="white" />
    </svg>
  );
}

function GemIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
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

function PrimaryButton({
  children,
  onClick,
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl border-2 border-black/20 px-6 py-4 font-black tracking-wide shadow-[0_5px_0_rgba(0,0,0,.22)] transition-all active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export default function ShopPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [superOpen, setSuperOpen] = useState(false);
  const [freezeOpen, setFreezeOpen] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [gems, setGems] = useState(100);
  const [freezeCount, setFreezeCount] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);

  useEffect(() => {
    let mounted = true;

    function loadShopData() {
      try {
        const activeUser = getActiveUser();

        if (!activeUser) {
          window.location.replace("/login");
          return;
        }

        if (!mounted) return;

        const userHearts = Number(activeUser.hearts ?? 5);
        const userGems = Number(activeUser.gems ?? 100);
        const userXP = Number(activeUser.xp ?? 0);
        const userStreak = Number(activeUser.streak ?? 0);
        const currentLesson = Number(activeUser.currentLesson ?? 1);

        setStats({
          total_xp: userXP,
          daily_xp: userXP,
          streak: userStreak,
          hearts: userHearts,
          gems: userGems,
        });

        setHearts(userHearts);
        setGems(userGems);

        // currentLesson is the first lesson the user still needs to do.
        // Therefore lesson 1 means 0 completed lessons, lesson 2 means 1, etc.
        setCompletedLessons(Math.max(currentLesson - 1, 0));

        // Keep power-ups separate for every account.
        const savedFreeze = Number(
          localStorage.getItem(`streakFreezeCount_${activeUser.id}`) ?? 0
        );

        setFreezeCount(
          Number.isFinite(savedFreeze) ? Math.max(savedFreeze, 0) : 0
        );
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load shop data.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadShopData();

    const handleStatsUpdate = () => loadShopData();
    const handleLogout = () => window.location.replace("/homepage");

    window.addEventListener("duolearn:stats-updated", handleStatsUpdate);
    window.addEventListener("duolearn:logout", handleLogout);

    return () => {
      mounted = false;
      window.removeEventListener("duolearn:stats-updated", handleStatsUpdate);
      window.removeEventListener("duolearn:logout", handleLogout);
    };
  }, []);

  const totalXP = Number(stats?.total_xp ?? 0);
  const streak = Number(stats?.streak ?? 0);

  const questXP = Math.min(Number(stats?.daily_xp ?? 0), 10);

  const questProgress = Math.min((questXP / 10) * 100, 100);

  const leaderboardUnlocked = completedLessons >= 3;

  function showMessage(text: string) {
    setMessage(text);

    window.setTimeout(() => {
      setMessage("");
    }, 2200);
  }

  function refillHearts() {
    if (hearts >= 5) {
      showMessage("Your hearts are already full.");
      return;
    }

    try {
      setError("");

      const updated = updateActiveUser({ hearts: 5 });

      if (!updated) {
        window.location.replace("/login");
        return;
      }

      setHearts(5);
      setGems(Number(updated.gems ?? gems));

      setStats((previous) => ({
        ...(previous ?? {}),
        hearts: 5,
        gems: Number(updated.gems ?? gems),
        streak: Number(updated.streak ?? streak),
      }));

      window.dispatchEvent(
        new CustomEvent("duolearn:stats-updated", {
          detail: {
            hearts: 5,
            gems: Number(updated.gems ?? gems),
            streak: Number(updated.streak ?? streak),
            total_xp: Number(updated.xp ?? totalXP),
          },
        })
      );

      showMessage("Hearts refilled! ❤️");
    } catch (err) {
      console.error("Refill hearts error:", err);
      setError("Failed to refill hearts.");
      showMessage("Could not refill hearts.");
    }
  }

  function buyFreeze() {
    if (gems < 200) {
      showMessage("You need 200 gems to buy Streak Freeze.");
      return;
    }

    if (freezeCount >= 2) {
      showMessage("You already have the maximum 2 Streak Freezes.");
      return;
    }

    const activeUser = getActiveUser();

    if (!activeUser) {
      window.location.replace("/login");
      return;
    }

    const nextGems = gems - 200;
    const nextFreeze = freezeCount + 1;

    const updated = updateActiveUser({ gems: nextGems });

    if (!updated) {
      showMessage("Could not update your account.");
      return;
    }

    setGems(nextGems);
    setStats((previous) => ({
      ...(previous ?? {}),
      gems: nextGems,
    }));

    setFreezeCount(nextFreeze);

    localStorage.setItem(
      `streakFreezeCount_${activeUser.id}`,
      String(nextFreeze)
    );

    setFreezeOpen(false);

    window.dispatchEvent(
      new CustomEvent("duolearn:stats-updated", {
        detail: {
          hearts,
          gems: nextGems,
          streak,
          total_xp: totalXP,
        },
      })
    );

    showMessage("Streak Freeze added! ❄️");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0E1E23] text-white">
        <div className="text-center">
          <div className="mb-5 animate-bounce text-7xl">
            🦉
          </div>

          <h1 className="text-2xl font-black">
            Loading shop...
          </h1>
        </div>
      </main>
    );
  }

  if (error || !stats) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0E1E23] px-6 text-white">
        <div className="max-w-md rounded-3xl border-2 border-[#344850] bg-[#112329] p-10 text-center">

          <div className="mb-4 text-6xl">
            😕
          </div>

          <h1 className="text-2xl font-black">
            Something went wrong
          </h1>

          <p className="mt-3 text-[#AFC1C7]">
            {error || "Could not load shop."}
          </p>

          <PrimaryButton
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 bg-[#58CC02] text-white"
          >
            TRY AGAIN
          </PrimaryButton>

        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E1E23] text-white">

      {/* =====================================================
          IMPORTANT:
          GlobalSidebar is already rendered by app/layout.tsx.

          There is NO PAGE-LEVEL SIDEBAR here.
          Therefore this page cannot create another
          duolingo logo/sidebar.
      ===================================================== */}

      <main className="xl:ml-[368px]">

        <div className="mx-auto max-w-[1450px] px-8 pb-24 pt-8 xl:px-10">

          <div className="grid grid-cols-1 gap-8 2xl:grid-cols-[minmax(600px,800px)_minmax(380px,525px)]">

            <section>

              {/* SUPER CARD */}
              <div className="overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0C655F] via-[#173F7F] to-[#482080] p-7 shadow-lg">

                <div className="flex min-h-[275px] flex-col justify-between">

                  <div className="flex items-center gap-7">

                    <div className="relative shrink-0 text-[118px] leading-none drop-shadow-lg">
                      🐦

                      <span className="absolute -bottom-1 left-8 text-5xl">
                        💗
                      </span>
                    </div>

                    <div>

                      <div className="mb-3 inline-flex rounded-xl bg-gradient-to-r from-[#2BD69D] to-[#EC42E8] px-4 py-1 text-xl font-black italic text-white shadow">
                        SUPER
                      </div>

                      <h1 className="max-w-[590px] text-[30px] font-black leading-tight text-white md:text-[34px]">
                        Start a 1 week free trial to enjoy exclusive Super benefits
                      </h1>

                    </div>
                  </div>

                  <PrimaryButton
                    onClick={() =>
                      setSuperOpen(true)
                    }
                    className="w-full bg-white text-[19px] text-[#121B4D] shadow-[0_6px_0_rgba(255,255,255,.45)] hover:bg-[#F4F7FA]"
                  >
                    START MY FREE 7 DAYS
                  </PrimaryButton>

                </div>

              </div>

              {/* HEARTS */}
              <section className="mt-12">

                <h2 className="text-[32px] font-black">
                  Hearts
                </h2>

                <div className="mt-8 border-t-2 border-[#344850]">

                  <div className="flex min-h-[165px] items-center gap-7 border-b-2 border-[#344850] py-7">

                    <div className="flex w-[125px] shrink-0 justify-center text-[90px] leading-none">
                      ❤️
                    </div>

                    <div className="min-w-0 flex-1">

                      <h3 className="text-[24px] font-black">
                        Refill Hearts
                      </h3>

                      <p className="mt-3 max-w-[480px] text-[19px] font-medium leading-relaxed text-[#E5EFF1]">
                        Get full hearts so you can worry less about making mistakes in a lesson
                      </p>

                    </div>

                    <PrimaryButton
                      onClick={refillHearts}
                      disabled={hearts >= 5}
                      className={`min-w-[215px] border-[#344850] ${
                        hearts >= 5
                          ? "bg-transparent text-[#526B76]"
                          : "bg-[#58CC02] text-white hover:bg-[#61D507]"
                      }`}
                    >
                      {hearts >= 5 ? "FULL" : "REFILL"}
                    </PrimaryButton>

                  </div>

                  <div className="flex min-h-[165px] items-center gap-7 py-7">

                    <div className="flex w-[125px] shrink-0 justify-center text-[82px] leading-none">
                      💚
                    </div>

                    <div className="min-w-0 flex-1">

                      <h3 className="text-[24px] font-black">
                        Unlimited Hearts
                      </h3>

                      <p className="mt-3 text-[19px] font-medium text-[#E5EFF1]">
                        Never run out of hearts with Super!
                      </p>

                    </div>

                    <PrimaryButton
                      onClick={() =>
                        setSuperOpen(true)
                      }
                      className="min-w-[215px] border-[#344850] bg-transparent text-[#F32AD7]"
                    >
                      FREE TRIAL
                    </PrimaryButton>

                  </div>

                </div>

              </section>

              {/* POWER UPS */}
              <section className="mt-12">

                <h2 className="text-[32px] font-black">
                  Power-Ups
                </h2>

                <div className="mt-8 border-t-2 border-[#344850]">

                  <div className="flex min-h-[180px] items-center gap-7 border-b-2 border-[#344850] py-7">

                    <div className="flex w-[125px] shrink-0 justify-center text-[86px] leading-none">
                      🧊
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="text-[24px] font-black">
                          Streak Freeze
                        </h3>

                        <span className="rounded-full bg-[#344850] px-4 py-1 text-sm font-black text-[#70858D]">
                          {freezeCount}/2 EQUIPPED
                        </span>

                      </div>

                      <p className="mt-3 max-w-[510px] text-[18px] font-medium leading-relaxed text-[#E5EFF1]">
                        Streak Freeze allows your streak to remain in place for one full day of inactivity.
                      </p>

                    </div>

                    <PrimaryButton
                      onClick={() =>
                        setFreezeOpen(true)
                      }
                      className="min-w-[215px] border-[#344850] bg-transparent text-[#35BDF5]"
                    >
                      GET FOR{" "}
                      <GemIcon size={26} />{" "}
                      200
                    </PrimaryButton>

                  </div>

                </div>

              </section>

            </section>

            {/* RIGHT SIDE */}
            <aside className="space-y-7">

              {/* LEADERBOARD */}
              <div className="rounded-[22px] border-2 border-[#344850] bg-[#112329] p-7">

                <h2 className="text-[25px] font-black">
                  Unlock Leaderboards!
                </h2>

                <div className="mt-8 flex items-center gap-7">

                  <div className="flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-2xl border-4 border-[#DCE8EE] bg-[#B9CAD5] text-4xl shadow-inner">
                    🔒
                  </div>

                  <p className="text-[20px] font-bold leading-relaxed text-[#DCE8EE]">
                    {leaderboardUnlocked
                      ? "Leaderboards are unlocked! Start competing."
                      : `Complete ${Math.max(
                          3 - completedLessons,
                          0
                        )} more lessons to start competing`}
                  </p>

                </div>

              </div>

              {/* DAILY QUESTS */}
              <div className="rounded-[22px] border-2 border-[#344850] bg-[#112329] p-7">

                <div className="flex items-center justify-between">

                  <h2 className="text-[25px] font-black">
                    Daily Quests
                  </h2>

                  <Link
                    href="/quests"
                    className="text-[18px] font-black text-[#35BDF5] hover:text-white"
                  >
                    VIEW ALL
                  </Link>

                </div>

                <div className="mt-9 flex items-center gap-7">

                  <div className="text-[62px] leading-none">
                    ⚡
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="text-[21px] font-black">
                      Earn 10 XP
                    </div>

                    <div className="mt-5 flex items-center gap-2">

                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#3D5059]">

                        <div
                          className="h-full rounded-full bg-[#58CC02] transition-all duration-500"
                          style={{
                            width: `${questProgress}%`,
                          }}
                        />

                      </div>

                      <span className="text-sm font-black text-[#AAB9BE]">
                        {questXP} / 10
                      </span>

                    </div>

                  </div>

                  <div className="text-5xl">
                    🎁
                  </div>

                </div>

              </div>

              <footer className="flex flex-wrap justify-center gap-x-7 gap-y-4 px-4 pt-8 text-[14px] font-black text-[#526970]">

        

              </footer>

            </aside>

          </div>

        </div>

      </main>

      {/* MOBILE NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-[76px] items-center justify-around border-t-2 border-[#31434A] bg-[#101F24] xl:hidden">

        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-white"
        >
          <HomeIcon size={27} />
          <span className="text-[10px] font-black">
            LEARN
          </span>
        </Link>

        <Link
          href="/leaderboard"
          className="flex flex-col items-center gap-1 text-white"
        >
          <TrophyIcon size={27} />
          <span className="text-[10px] font-black">
            LEAGUE
          </span>
        </Link>

        <Link
          href="/quests"
          className="flex flex-col items-center gap-1 text-white"
        >
          <QuestIcon size={27} />
          <span className="text-[10px] font-black">
            QUESTS
          </span>
        </Link>

        <Link
          href="/shop"
          className="flex flex-col items-center gap-1 text-[#35BDF5]"
        >
          <ShopIcon size={27} />
          <span className="text-[10px] font-black">
            SHOP
          </span>
        </Link>

        <Link
          href="/profile"
          className="flex flex-col items-center gap-1 text-white"
        >
          <ProfileIcon size={30} />
          <span className="text-[10px] font-black">
            PROFILE
          </span>
        </Link>

      </div>

      {/* MESSAGE */}
      {message && (
        <div className="fixed bottom-8 left-1/2 z-[120] -translate-x-1/2 rounded-2xl border-2 border-[#344850] bg-[#162E36] px-6 py-4 text-center font-black text-white shadow-2xl">
          {message}
        </div>
      )}

      {/* SUPER MODAL */}
      {superOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-5 backdrop-blur-sm"
          onClick={() =>
            setSuperOpen(false)
          }
        >

          <div
            className="w-full max-w-[570px] overflow-hidden rounded-[28px] border-2 border-[#344850] bg-[#12262C] shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="bg-gradient-to-br from-[#0C655F] via-[#173F7F] to-[#482080] p-8">

              <div className="text-center">

                <div className="mx-auto text-7xl">
                  🐦
                </div>

                <div className="mt-3 inline-block rounded-xl bg-gradient-to-r from-[#2BD69D] to-[#EC42E8] px-4 py-1 text-xl font-black italic">
                  SUPER
                </div>

                <h2 className="mt-4 text-3xl font-black">
                  Try Super free for 7 days
                </h2>

                <p className="mt-3 text-lg font-medium text-[#EAF5F7]">
                  Unlimited hearts and extra Super benefits.
                </p>

              </div>

            </div>

            <div className="p-7">

              <PrimaryButton
                onClick={() => {
                  setSuperOpen(false);
                  showMessage(
                    "Your 7-day Super trial is ready! 🎉"
                  );
                }}
                className="w-full bg-white text-[#121B4D]"
              >
                START MY FREE 7 DAYS
              </PrimaryButton>

              <button
                type="button"
                onClick={() =>
                  setSuperOpen(false)
                }
                className="mt-3 w-full rounded-2xl border-2 border-[#344850] px-5 py-4 font-black text-white hover:bg-[#20343C]"
              >
                NOT NOW
              </button>

            </div>

          </div>

        </div>
      )}

      {/* FREEZE MODAL */}
      {freezeOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-5 backdrop-blur-sm"
          onClick={() =>
            setFreezeOpen(false)
          }
        >

          <div
            className="w-full max-w-[500px] rounded-[28px] border-2 border-[#344850] bg-[#12262C] p-8 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="text-center">

              <div className="text-7xl">
                🧊
              </div>

              <h2 className="mt-4 text-3xl font-black">
                Streak Freeze
              </h2>

              <p className="mt-3 text-lg leading-relaxed text-[#DCE8EE]">
                Protect your streak for one full day of inactivity.
              </p>

              <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl bg-[#0E1E23] p-4">

                <GemIcon size={34} />

                <span className="text-2xl font-black text-[#35BDF5]">
                  200 gems
                </span>

              </div>

              <PrimaryButton
                onClick={buyFreeze}
                disabled={gems < 200}
                className="mt-6 w-full bg-[#35BDF5] text-[#09202A]"
              >
                {gems >= 200
                  ? "BUY STREAK FREEZE"
                  : "NOT ENOUGH GEMS"}
              </PrimaryButton>

              <button
                type="button"
                onClick={() =>
                  setFreezeOpen(false)
                }
                className="mt-3 w-full rounded-2xl border-2 border-[#344850] px-5 py-4 font-black text-white hover:bg-[#20343C]"
              >
                CANCEL
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
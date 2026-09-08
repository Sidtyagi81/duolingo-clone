"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getActiveUser } from "@/lib/userState";

type UserStats = {
  total_xp?: number;
  daily_xp?: number;
  streak?: number;
  hearts?: number;
  gems?: number;
  currentLesson?: number;
};

type SoundItem = {
  symbol: string;
  word: string;
  phonetic?: string;
};

const vowels: SoundItem[] = [
  { symbol: "ɑ", word: "hot" },
  { symbol: "æ", word: "cat" },
  { symbol: "ʌ", word: "but" },
  { symbol: "ɛ", word: "bed" },
  { symbol: "eɪ", word: "say" },
  { symbol: "ɝ", word: "bird" },
  { symbol: "ɪ", word: "ship" },
  { symbol: "i", word: "sheep" },
  { symbol: "ə", word: "about" },
  { symbol: "oʊ", word: "boat" },
  { symbol: "ʊ", word: "foot" },
  { symbol: "u", word: "food" },
  { symbol: "aʊ", word: "cow" },
  { symbol: "aɪ", word: "time" },
  { symbol: "ɔɪ", word: "boy" },
];

const consonants: SoundItem[] = [
  { symbol: "b", word: "book" },
  { symbol: "tʃ", word: "chair" },
  { symbol: "d", word: "day" },
  { symbol: "f", word: "fish" },
  { symbol: "g", word: "go" },
  { symbol: "h", word: "home" },
  { symbol: "dʒ", word: "job" },
  { symbol: "k", word: "key" },
  { symbol: "l", word: "lion" },
  { symbol: "m", word: "moon" },
  { symbol: "n", word: "nose" },
  { symbol: "ŋ", word: "sing" },
  { symbol: "p", word: "pig" },
  { symbol: "ɹ", word: "red" },
  { symbol: "s", word: "see" },
  { symbol: "ʒ", word: "measure" },
  { symbol: "ʃ", word: "shoe" },
  { symbol: "t", word: "time" },
  { symbol: "θ", word: "think" },
  { symbol: "v", word: "very" },
  { symbol: "w", word: "water" },
  { symbol: "j", word: "you" },
  { symbol: "z", word: "zoo" },
  { symbol: "ð", word: "then" },
];

function HomeIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M5 14.5 16 5l11 9.5V27h-7v-8h-8v8H5V14.5Z" fill="#FFC800" stroke="#FF4B4B" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M12 19h8v8h-8v-8Z" fill="#FF9600"/>
    </svg>
  );
}

function SoundIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M5 13h5l6-5v16l-6-5H5v-6Z" fill="#FF8A65" stroke="#FFB199" strokeWidth="2"/>
      <path d="M20 11c2.5 2.5 2.5 7.5 0 10M23.5 8c4.5 4.5 4.5 11.5 0 16" stroke="#FF8A65" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function TrophyIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M9 5h14v8c0 5-3 8-7 8s-7-3-7-8V5Z" fill="#FFD900"/>
      <path d="M9 8H5v3c0 4 2.5 6 6 6M23 8h4v3c0 4-2.5 6-6 6" stroke="#FF9600" strokeWidth="3" strokeLinecap="round"/>
      <path d="M16 21v5M11 27h10" stroke="#FFD900" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function QuestIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="5" y="8" width="22" height="19" rx="3" fill="#FFC800"/>
      <rect x="10" y="4" width="12" height="6" rx="2" fill="#FF9600"/>
      <path d="M11 15h10M11 20h7" stroke="#DFA800" strokeWidth="2"/>
    </svg>
  );
}

function ShopIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M4 12h24v15H4V12Z" fill="#FF4B4B"/>
      <path d="M3 12 7 5h18l4 7H3Z" fill="#FF9600"/>
      <path d="M4 12h24M10 18v9M22 18v9" stroke="white" strokeWidth="2"/>
    </svg>
  );
}

function ProfileIcon({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="13" fill="#78B82A"/>
      <circle cx="16" cy="12" r="4" fill="#4A3130"/>
      <path d="M9 25c1.5-5 12.5-5 14 0" fill="#B77BD4"/>
      <circle cx="16" cy="12" r="2" fill="#F3C5A6"/>
    </svg>
  );
}

function MoreIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="13" fill="#C77DFF"/>
      <circle cx="10" cy="16" r="2" fill="white"/>
      <circle cx="16" cy="16" r="2" fill="white"/>
      <circle cx="22" cy="16" r="2" fill="white"/>
    </svg>
  );
}

function FlameIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 29c6.5 0 11-4.5 11-10.5 0-5-3.5-9-7.5-12C19.5 10 17.5 12 15.5 13.5 15 9 12 5 8 3c1 6-3 9-3 15.5C5 24.5 9.5 29 16 29Z" fill="#3D5059"/>
      <path d="M16 25c3 0 5-2 5-4.5 0-2-1.5-3.5-3.5-5-.1 2.5-1.5 3.5-2.5 4-.5-2-2-3.5-3.5-4.5 0 2-.5 3.5-.5 5 0 2.5 2 4.5 5 4.5Z" fill="#52636B"/>
    </svg>
  );
}

function GemIcon({ size = 37 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path d="m18 3 11 7-4.5 18L18 32l-6.5-4L7 10l11-7Z" fill="#1CB0F6" stroke="#8BD8FF" strokeWidth="2"/>
      <path d="m12.5 11 5.5-5 5.5 5-3.5 14-2 3-2-3-3.5-14Z" fill="#7DD7FF"/>
    </svg>
  );
}

function HeartIcon({ size = 37 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path d="M18 31C15.5 28.5 6 22 6 14c0-4.5 3.5-8 8-8 2 0 3.5 1 4 2.5C18.5 7 20 6 22 6c4.5 0 8 3.5 8 8 0 8-9.5 14.5-12 17Z" fill="#FF4B4B" stroke="#FFB7B7" strokeWidth="2"/>
      <path d="M12 12c-1.5 0-3 1.5-3 3" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".75"/>
    </svg>
  );
}

function SidebarItem({
  href,
  label,
  icon,
  active = false,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-5 rounded-2xl border-2 px-5 py-4 transition-all ${
        active
          ? "border-[#3E9CCC] bg-[#20343C] text-[#35BDF5]"
          : "border-transparent text-[#E9F3F5] hover:bg-[#192C33]"
      }`}
    >
      <div className="flex w-9 shrink-0 justify-center">{icon}</div>
      <span className="text-[17px] font-extrabold tracking-wide">{label}</span>
    </Link>
  );
}

function PlayIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 5.5v13L18.5 12 8 5.5Z" fill="currentColor"/>
    </svg>
  );
}

function Footer() {
  return (
    <footer className="flex flex-wrap justify-center gap-x-7 gap-y-5 px-5 py-12 text-[14px] font-black text-[#526970]">
      
    </footer>
  );
}

function SuperBird() {
  return (
    <div className="relative h-[125px] w-[145px]">
      <div className="absolute right-1 top-3 h-[80px] w-[100px] rotate-[-12deg] rounded-[45%] bg-gradient-to-br from-[#50E3FF] via-[#386CFF] to-[#A733FF]" />
      <div className="absolute right-[47px] top-[47px] h-[55px] w-[65px] rotate-[15deg] rounded-[45%] bg-gradient-to-br from-[#30DFFF] to-[#5B2DFF]" />
      <div className="absolute right-0 top-[85px] h-[22px] w-[22px] rounded-full bg-[#F02BE7]" />
      <div className="absolute right-[38px] top-[82px] h-[22px] w-[22px] rounded-full bg-[#F02BE7]" />
      <div className="absolute right-[73px] top-[49px] h-[8px] w-[8px] rounded-full bg-white" />
    </div>
  );
}

function LockBadge() {
  return (
    <div className="relative h-[66px] w-[62px] shrink-0 rounded-[18px] border-4 border-[#D9E6EF] bg-[#B9CBD8] shadow-[inset_0_-8px_0_rgba(0,0,0,.08)]">
      <div className="absolute left-1/2 top-3 h-8 w-8 -translate-x-1/2 rounded-full border-[5px] border-[#8EA5B5]" />
      <div className="absolute bottom-1 left-1/2 h-8 w-11 -translate-x-1/2 rounded-[12px] bg-[#DCE8EF]" />
      <div className="absolute bottom-[7px] left-1/2 h-3 w-2 -translate-x-1/2 rounded-full bg-[#8EA5B5]" />
    </div>
  );
}

export default function SoundsPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState<string | null>(null);
  const [superOpen, setSuperOpen] = useState(false);
  const [lessonOpen, setLessonOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    function loadActiveUser() {
      try {
        const user = getActiveUser();

        // No logged-in user -> do not show another user's data.
        if (!user) {
          window.location.replace("/login");
          return;
        }

        if (!mounted) return;

        // Every new account is created with:
        // hearts: 5, gems: 100, streak: 0, xp: 0, currentLesson: 1.
        // Existing accounts keep their own saved values.
        setStats({
          total_xp: Number(user.xp ?? 0),
          daily_xp: Number(user.xp ?? 0),
          streak: Number(user.streak ?? 0),
          hearts: Number(user.hearts ?? 5),
          gems: Number(user.gems ?? 100),
          currentLesson: Number(user.currentLesson ?? 1),
        });
        setError("");
        setLoading(false);
      } catch (err) {
        console.error("Failed to load active user:", err);
        if (mounted) {
          setError("Failed to load your account.");
          setLoading(false);
        }
      }
    }

    loadActiveUser();

    function refreshUser() {
      loadActiveUser();
    }

    window.addEventListener("duolearn:stats-updated", refreshUser);
    window.addEventListener("duolearn:logout", refreshUser);
    window.addEventListener("focus", refreshUser);

    return () => {
      mounted = false;
      window.removeEventListener("duolearn:stats-updated", refreshUser);
      window.removeEventListener("duolearn:logout", refreshUser);
      window.removeEventListener("focus", refreshUser);
    };
  }, []);

  const streak = Number(stats?.streak ?? 0);
  const gems = Number(stats?.gems ?? 100);
  const hearts = Number(stats?.hearts ?? 5);

  // Leaderboard progress must come from the currently logged-in account.
  // A new account starts at lesson 1, so completed lessons = 0.
  // After completing lesson 1, currentLesson becomes 2, so completed lessons = 1.
  const currentLesson = Math.max(Number(stats?.currentLesson ?? 1), 1);
  const completedLessons = Math.max(currentLesson - 1, 0);

  // Leaderboards unlock after 3 completed lessons.
  const lessonsNeeded = Math.max(3 - completedLessons, 0);

  function speak(text: string, key: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.72;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setPlaying(key);
    utterance.onend = () => setPlaying(null);
    utterance.onerror = () => setPlaying(null);

    setPlaying(key);
    window.speechSynthesis.speak(utterance);
  }

  function playSound(item: SoundItem, index: number, group: string) {
    // The example word is spoken rather than the IPA symbol because browser
    // speech engines pronounce IPA characters inconsistently.
    speak(item.word, `${group}-${index}`);
  }

  function startPractice() {
    setLessonOpen(true);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0E1E23] text-white">
        <div className="text-center">
          <div className="mb-6 text-7xl animate-bounce">🔊</div>
          <h1 className="text-2xl font-black">Loading sounds...</h1>
        </div>
      </main>
    );
  }

  if (error || !stats) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0E1E23] px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border-2 border-[#344850] bg-[#112329] p-10 text-center">
          <div className="mb-4 text-6xl">😕</div>
          <h1 className="text-2xl font-black">Something went wrong</h1>
          <p className="mt-3 text-[#AFC1C7]">{error || "Could not load sounds."}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-[#58CC02] px-6 py-3 font-black text-white shadow-[0_4px_0_#3A9200]"
          >
            TRY AGAIN
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E1E23] text-white">
      <main className="xl:ml-[348px]">

        <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-8 sm:px-8 xl:px-8">
          <div className="grid grid-cols-1 gap-8 2xl:grid-cols-[minmax(600px,800px)_minmax(390px,500px)]">
            <section className="min-w-0">
              <div className="px-2 text-center">
                <h1 className="text-[31px] font-black tracking-[-0.8px] sm:text-[34px]">
                  Let&apos;s learn English sounds!
                </h1>

                <p className="mt-5 text-[21px] font-medium text-[#E2EDF0]">
                  Train your ear and learn to pronounce English sounds
                </p>

                <button
                  type="button"
                  onClick={startPractice}
                  className="mt-8 w-[410px] max-w-full rounded-[20px] bg-[#4BB9EE] px-8 py-4 text-[18px] font-black text-[#10252D] shadow-[0_6px_0_#258FC1] transition hover:brightness-105 active:translate-y-1 active:shadow-none"
                >
                  START +10 XP
                </button>
              </div>

              <div className="mt-16">
                <div className="mb-7 flex items-center gap-3 px-8">
                  <div className="h-[3px] flex-1 bg-[#344850]" />
                  <h2 className="px-1 text-[24px] font-black">Vowels</h2>
                  <div className="h-[3px] flex-1 bg-[#344850]" />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {vowels.map((item, index) => {
                    const key = `vowels-${index}`;
                    const isPlaying = playing === key;

                    return (
                      <button
                        key={`${item.symbol}-${item.word}`}
                        type="button"
                        onClick={() => playSound(item, index, "vowels")}
                        aria-label={`Play ${item.symbol}, as in ${item.word}`}
                        className={`group relative flex h-[92px] flex-col items-center justify-center rounded-[20px] border-[3px] border-[#344850] bg-[#102127] transition-all hover:-translate-y-0.5 hover:border-[#4A6974] hover:bg-[#152B32] active:translate-y-0 ${
                          isPlaying ? "border-[#35BDF5] bg-[#17333C]" : ""
                        }`}
                      >
                        <span className="text-[23px] font-black leading-none text-[#EDF5F7]">
                          {item.symbol}
                        </span>
                        <span className="mt-1 text-[18px] font-bold leading-none text-[#526970]">
                          {item.word}
                        </span>
                        <span
                          className={`mt-3 flex h-2 w-14 items-center justify-center overflow-hidden rounded-full ${
                            isPlaying ? "bg-[#35BDF5]" : "bg-[#3D5059]"
                          }`}
                        >
                          {isPlaying && <span className="h-2 w-2 animate-pulse rounded-full bg-white" />}
                        </span>

                        <span className="absolute right-3 top-3 text-[#35BDF5] opacity-0 transition group-hover:opacity-100">
                          <PlayIcon size={17} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-12">
                <div className="mb-7 flex items-center gap-3 px-8">
                  <div className="h-[3px] flex-1 bg-[#344850]" />
                  <h2 className="px-1 text-[24px] font-black">Consonants</h2>
                  <div className="h-[3px] flex-1 bg-[#344850]" />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {consonants.map((item, index) => {
                    const key = `consonants-${index}`;
                    const isPlaying = playing === key;

                    return (
                      <button
                        key={`${item.symbol}-${item.word}`}
                        type="button"
                        onClick={() => playSound(item, index, "consonants")}
                        aria-label={`Play ${item.symbol}, as in ${item.word}`}
                        className={`group relative flex h-[92px] flex-col items-center justify-center rounded-[20px] border-[3px] border-[#344850] bg-[#102127] transition-all hover:-translate-y-0.5 hover:border-[#4A6974] hover:bg-[#152B32] active:translate-y-0 ${
                          isPlaying ? "border-[#35BDF5] bg-[#17333C]" : ""
                        }`}
                      >
                        <span className="text-[23px] font-black leading-none text-[#EDF5F7]">
                          {item.symbol}
                        </span>
                        <span className="mt-1 text-[18px] font-bold leading-none text-[#526970]">
                          {item.word}
                        </span>
                        <span
                          className={`mt-3 flex h-2 w-14 items-center justify-center overflow-hidden rounded-full ${
                            isPlaying ? "bg-[#35BDF5]" : "bg-[#3D5059]"
                          }`}
                        >
                          {isPlaying && <span className="h-2 w-2 animate-pulse rounded-full bg-white" />}
                        </span>

                        <span className="absolute right-3 top-3 text-[#35BDF5] opacity-0 transition group-hover:opacity-100">
                          <PlayIcon size={17} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-10 rounded-[22px] border-2 border-[#344850] bg-[#112329] p-6 text-center">
                <p className="text-[17px] font-bold text-[#A8BBC2]">
                  Tap any sound card to hear its example word.
                </p>
                <p className="mt-2 text-sm font-medium text-[#617780]">
                  {vowels.length + consonants.length} English sounds are available to practice.
                </p>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="overflow-hidden rounded-[22px] border-2 border-[#344850] bg-[#112329]">
                <div className="p-7">
                  <div className="relative min-h-[240px]">
                    <div className="inline-block rounded-xl bg-gradient-to-r from-[#27D69C] to-[#EC42E8] px-4 py-1 text-[19px] font-black italic">
                      SUPER
                    </div>

                    <h2 className="mt-6 max-w-[300px] text-[25px] font-black">
                      Try Super for free
                    </h2>

                    <p className="mt-5 max-w-[325px] text-[19px] font-medium leading-relaxed text-[#DCE8EE]">
                      No ads, personalized practice, and unlimited Legendary!
                    </p>

                    <div className="pointer-events-none absolute right-[-18px] top-[-8px]">
                      <SuperBird />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSuperOpen(true)}
                    className="w-full rounded-[20px] bg-[#4351FF] px-6 py-4 text-[18px] font-black text-white shadow-[0_6px_0_#3436D9] transition hover:brightness-110 active:translate-y-1 active:shadow-none"
                  >
                    TRY 1 WEEK FREE
                  </button>
                </div>
              </div>

              <div className="rounded-[22px] border-2 border-[#344850] bg-[#112329] p-7">
                <h2 className="text-[24px] font-black">Unlock Leaderboards!</h2>

                <div className="mt-9 flex items-center gap-7">
                  <LockBadge />
                  <p className="text-[20px] font-bold leading-relaxed text-[#DCE8EE]">
                    Complete {lessonsNeeded} more{" "}
                    {lessonsNeeded === 1 ? "lesson" : "lessons"} to start competing
                  </p>
                </div>

                <Link
                  href="/leaderboard"
                  className="mt-7 block text-center text-[15px] font-black text-[#35BDF5] hover:text-white"
                >
                  VIEW LEADERBOARD
                </Link>
              </div>

              <div className="rounded-[22px] border-2 border-[#344850] bg-[#112329] p-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-[24px] font-black">Daily Quests</h2>
                  <Link href="/quests" className="text-[17px] font-black text-[#35BDF5] hover:text-white">
                    VIEW ALL
                  </Link>
                </div>

                <div className="mt-9 flex items-center gap-6">
                  <div className="text-[61px] leading-none">⚡</div>

                  <div className="min-w-0 flex-1">
                    <div className="text-[20px] font-black">Earn 10 XP</div>

                    <div className="mt-5 flex items-center gap-2">
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#3D5059]">
                        <div
                          className="h-full rounded-full bg-[#FFC800] transition-all"
                          style={{
                            width: `${Math.min(
                              Number(stats?.daily_xp ?? 0),
                              10,
                            ) * 10}%`,
                          }}
                        />
                      </div>
                      <span className="whitespace-nowrap text-[17px] font-black text-[#A8B6BB]">
                        {Math.min(Number(stats?.daily_xp ?? 0), 10)} / 10
                      </span>
                    </div>

                    <div className="mt-3 text-right text-sm font-bold text-[#617780]">
                      {Number(stats?.daily_xp ?? 0) >= 10
                        ? "Daily XP goal complete!"
                        : "Complete a lesson to earn XP"}
                    </div>
                  </div>
                </div>
              </div>

              <Footer />
            </aside>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-[76px] items-center justify-around border-t-2 border-[#31434A] bg-[#101F24] xl:hidden">
        <Link href="/" className="flex flex-col items-center gap-1 text-white">
          <HomeIcon size={27} />
          <span className="text-[10px] font-black">LEARN</span>
        </Link>

        <Link href="/sounds" className="flex flex-col items-center gap-1 text-[#35BDF5]">
          <SoundIcon size={27} />
          <span className="text-[10px] font-black">SOUNDS</span>
        </Link>

        <Link href="/leaderboard" className="flex flex-col items-center gap-1 text-white">
          <TrophyIcon size={27} />
          <span className="text-[10px] font-black">LEAGUE</span>
        </Link>

        <Link href="/quests" className="flex flex-col items-center gap-1 text-white">
          <QuestIcon size={27} />
          <span className="text-[10px] font-black">QUESTS</span>
        </Link>

        <Link href="/profile" className="flex flex-col items-center gap-1 text-white">
          <ProfileIcon size={30} />
          <span className="text-[10px] font-black">PROFILE</span>
        </Link>
      </div>

      {superOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-5 backdrop-blur-sm"
          onClick={() => setSuperOpen(false)}
        >
          <div
            className="w-full max-w-[560px] overflow-hidden rounded-[28px] border-2 border-[#344850] bg-[#12262C] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-[#0C655F] via-[#173F7F] to-[#482080] p-8 text-center">
              <div className="text-7xl">🐦</div>
              <div className="mt-3 inline-block rounded-xl bg-gradient-to-r from-[#2BD69D] to-[#EC42E8] px-4 py-1 text-xl font-black italic">
                SUPER
              </div>
              <h2 className="mt-4 text-3xl font-black">Try Super free for 7 days</h2>
              <p className="mt-3 text-lg font-medium text-[#EAF5F7]">
                Unlimited hearts and extra Super benefits.
              </p>
            </div>

            <div className="p-7">
              <button
                type="button"
                onClick={() => setSuperOpen(false)}
                className="w-full rounded-2xl bg-white px-5 py-4 text-lg font-black text-[#121B4D] shadow-[0_5px_0_#B8C4D1]"
              >
                START MY FREE 7 DAYS
              </button>

              <button
                type="button"
                onClick={() => setSuperOpen(false)}
                className="mt-3 w-full rounded-2xl border-2 border-[#344850] px-5 py-4 font-black text-white hover:bg-[#20343C]"
              >
                NOT NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {lessonOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-5 backdrop-blur-sm"
          onClick={() => setLessonOpen(false)}
        >
          <div
            className="w-full max-w-[520px] rounded-[28px] border-2 border-[#344850] bg-[#12262C] p-8 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="text-7xl">🔊</div>

            <h2 className="mt-4 text-3xl font-black">Sound Practice</h2>

            <p className="mt-3 text-lg leading-relaxed text-[#DCE8EE]">
              Tap any vowel or consonant card to hear the example pronunciation.
              Then repeat it aloud and practice your English sounds.
            </p>

            <button
              type="button"
              onClick={() => {
                setLessonOpen(false);
                window.setTimeout(() => {
                  playSound(vowels[0], 0, "vowels");
                }, 150);
              }}
              className="mt-7 w-full rounded-2xl bg-[#58CC02] px-5 py-4 text-lg font-black text-white shadow-[0_5px_0_#3A9200] transition active:translate-y-1 active:shadow-none"
            >
              PLAY FIRST SOUND
            </button>

            <button
              type="button"
              onClick={() => setLessonOpen(false)}
              className="mt-4 w-full rounded-2xl border-2 border-[#344850] px-5 py-4 font-black text-white hover:bg-[#20343C]"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

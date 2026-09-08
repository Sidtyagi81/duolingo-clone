"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Goal = 10 | 20 | 30 | 50;
type Theme = "dark" | "light";

function HomeIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M5 14.5 16 5l11 9.5V27h-7v-8h-8v8H5V14.5Z" fill="#FFC800" stroke="#FF4B4B" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M12 19h8v8h-8v-8Z" fill="#FF9600"/>
    </svg>
  );
}

function SoundIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M5 13h5l6-5v16l-6-5H5v-6Z" fill="#FF8A65" stroke="#FFB199" strokeWidth="2"/>
      <path d="M20 11c2.5 2.5 2.5 7.5 0 10M23.5 8c4.5 4.5 4.5 11.5 0 16" stroke="#FF8A65" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function TrophyIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M9 5h14v8c0 5-3 8-7 8s-7-3-7-8V5Z" fill="#FFD900"/>
      <path d="M9 8H5v3c0 4 2.5 6 6 6M23 8h4v3c0 4-2.5 6-6 6" stroke="#FF9600" strokeWidth="3" strokeLinecap="round"/>
      <path d="M16 21v5M11 27h10" stroke="#FFD900" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function QuestIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="5" y="8" width="22" height="19" rx="3" fill="#FFC800"/>
      <rect x="10" y="4" width="12" height="6" rx="2" fill="#FF9600"/>
      <path d="M11 15h10M11 20h7" stroke="#DFA800" strokeWidth="2"/>
    </svg>
  );
}

function ShopIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M4 12h24v15H4V12Z" fill="#FF4B4B"/>
      <path d="M3 12 7 5h18l4 7H3Z" fill="#FF9600"/>
      <path d="M4 12h24M10 18v9M22 18v9" stroke="white" strokeWidth="2"/>
    </svg>
  );
}

function ProfileIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="13" fill="#78B82A"/>
      <circle cx="16" cy="12" r="4" fill="#4A3130"/>
      <path d="M9 25c1.5-5 12.5-5 14 0" fill="#B77BD4"/>
      <circle cx="16" cy="12" r="2" fill="#F3C5A6"/>
    </svg>
  );
}

function MoreIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="13" fill="#C77DFF"/>
      <circle cx="10" cy="16" r="2" fill="white"/>
      <circle cx="16" cy="16" r="2" fill="white"/>
      <circle cx="22" cy="16" r="2" fill="white"/>
    </svg>
  );
}

function FlameIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 29c6.5 0 11-4.5 11-10.5 0-5-3.5-9-7.5-12C19.5 10 17.5 12 15.5 13.5 15 9 12 5 8 3c1 6-3 9-3 15.5C5 24.5 9.5 29 16 29Z" fill="#3D5059"/>
      <path d="M16 25c3 0 5-2 5-4.5 0-2-1.5-3.5-3.5-5-.1 2.5-1.5 3.5-2.5 4-.5-2-2-3.5-3.5-4.5 0 2-.5 3.5-.5 5 0 2.5 2 4.5 5 4.5Z" fill="#52636B"/>
    </svg>
  );
}

function GemIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path d="m18 3 11 7-4.5 18L18 32l-6.5-4L7 10l11-7Z" fill="#1CB0F6" stroke="#8BD8FF" strokeWidth="2"/>
      <path d="m12.5 11 5.5-5 5.5 5-3.5 14-2 3-2-3-3.5-14Z" fill="#7DD7FF"/>
    </svg>
  );
}

function HeartIcon({ size = 36 }: { size?: number }) {
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
      className={`group flex min-h-[72px] items-center gap-5 rounded-2xl border-2 px-5 py-4 transition-all ${
        active
          ? "border-[#3E9CCC] bg-[#20343C] text-[#35BDF5]"
          : "border-transparent text-[#E9F3F5] hover:border-[#334A53] hover:bg-[#192C33]"
      }`}
    >
      <div className="flex w-9 shrink-0 justify-center">{icon}</div>
      <span className="text-[17px] font-extrabold tracking-wide">
        {label}
      </span>
    </Link>
  );
}

function applyTheme(nextTheme: Theme) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.dataset.theme = nextTheme;

  const styleId = "duolearn-global-theme";
  let style = document.getElementById(styleId) as HTMLStyleElement | null;

  if (!style) {
    style = document.createElement("style");
    style.id = styleId;
    document.head.appendChild(style);
  }

  if (nextTheme === "light") {
    style.textContent = `
      html[data-theme="light"], html[data-theme="light"] body {
        background: #f7f9fa !important;
        color: #17212b !important;
      }

      html[data-theme="light"] body {
        color-scheme: light;
      }

      html[data-theme="light"] [class*="bg-[#0E1E23]"],
      html[data-theme="light"] [class*="bg-[#0F1B20]"],
      html[data-theme="light"] [class*="bg-[#101F25]"],
      html[data-theme="light"] [class*="bg-[#101D22]"],
      html[data-theme="light"] [class*="bg-[#112329]"],
      html[data-theme="light"] [class*="bg-[#12262C]"],
      html[data-theme="light"] [class*="bg-[#142329]"],
      html[data-theme="light"] [class*="bg-[#162E36]"],
      html[data-theme="light"] [class*="bg-[#18262C]"],
      html[data-theme="light"] [class*="bg-[#192C33]"],
      html[data-theme="light"] [class*="bg-[#20343C]"] {
        background-color: #ffffff !important;
      }

      html[data-theme="light"] [class*="text-white"],
      html[data-theme="light"] [class*="text-[#E9F3F5]"],
      html[data-theme="light"] [class*="text-[#E5EFF1]"],
      html[data-theme="light"] [class*="text-[#DCE8EE]"],
      html[data-theme="light"] [class*="text-[#EAF5F7]"] {
        color: #17212b !important;
      }

      html[data-theme="light"] [class*="text-[#81959C]"],
      html[data-theme="light"] [class*="text-[#AFC1C7]"],
      html[data-theme="light"] [class*="text-[#526970]"],
      html[data-theme="light"] [class*="text-[#526B76]"],
      html[data-theme="light"] [class*="text-[#70858D]"] {
        color: #5b6b75 !important;
      }

      html[data-theme="light"] [class*="border-[#344A53]"],
      html[data-theme="light"] [class*="border-[#344850]"],
      html[data-theme="light"] [class*="border-[#30434B"],
      html[data-theme="light"] [class*="border-[#31434A"] {
        border-color: #d6e0e5 !important;
      }

      html[data-theme="light"] header {
        background-color: #ffffff !important;
        border-color: #d6e0e5 !important;
      }

      html[data-theme="light"] input,
      html[data-theme="light"] textarea,
      html[data-theme="light"] select {
        background-color: #ffffff !important;
        color: #17212b !important;
      }
    `;
  } else {
    style.textContent = "";
  }
}

export default function SettingsPage() {
  const [dailyGoal, setDailyGoal] = useState<Goal>(20);
  const [sound, setSound] = useState(true);
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedGoal = localStorage.getItem("dailyGoal");
    const savedSound = localStorage.getItem("soundEnabled");
    const savedTheme = localStorage.getItem("theme") as Theme | null;

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("dark");
    }

    if (savedGoal) {
      const value = Number(savedGoal);
      if ([10, 20, 30, 50].includes(value)) {
        setDailyGoal(value as Goal);
      }
    }

    if (savedSound !== null) {
      setSound(savedSound === "true");
    }

  }, []);

  function saveSettings() {
    localStorage.setItem("dailyGoal", String(dailyGoal));
    localStorage.setItem("soundEnabled", String(sound));
    localStorage.setItem("theme", theme);
    applyTheme(theme);
    window.dispatchEvent(new CustomEvent("duolearn:theme-changed", { detail: { theme } }));

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2200);
  }

  return (
    <main className="min-h-screen bg-[#0F1B20] text-white">
      {/* =====================================================
          MAIN
      ====================================================== */}
      <div className="xl:ml-[365px]">
        

        <div className="mx-auto max-w-[1000px] px-5 pb-12 pt-10 md:px-10">
          <div className="mb-8 border-b-2 border-[#30434B] pb-8">
            <p className="mb-2 text-[15px] font-black uppercase tracking-[2px] text-[#35BDF5]">
              MORE
            </p>
            <h1 className="text-[40px] font-black tracking-tight text-white md:text-[48px]">
              Settings
            </h1>
            <p className="mt-2 text-[18px] font-semibold text-[#81959C]">
              Manage your account and learning settings
            </p>
          </div>

          {/* DAILY GOAL */}
          <section className="mb-6 rounded-[25px] border-[3px] border-[#344A53] bg-[#101F25] p-6 md:p-8">
            <div className="mb-7">
              <h2 className="text-[25px] font-black text-white">🎯 Daily Goal</h2>
              <p className="mt-2 text-[16px] font-semibold text-[#81959C]">
                Choose how much XP you want to earn each day.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[10, 20, 30, 50].map((goal) => {
                const selected = dailyGoal === goal;
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setDailyGoal(goal as Goal)}
                    className={`rounded-[18px] border-[3px] p-5 text-left transition ${
                      selected
                        ? "border-[#58CC02] bg-[#1E351F]"
                        : "border-[#344A53] bg-[#142329] hover:border-[#4B626B]"
                    }`}
                  >
                    <div className={`mb-2 text-2xl ${selected ? "text-[#58CC02]" : "text-[#71868E]"}`}>
                      ⭐
                    </div>
                    <div className={`text-[19px] font-black ${selected ? "text-[#58CC02]" : "text-white"}`}>
                      {goal} XP
                    </div>
                    {selected && (
                      <div className="mt-2 text-[11px] font-black uppercase tracking-wide text-[#58CC02]">
                        SELECTED
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* SOUND */}
          <section className="mb-6 rounded-[25px] border-[3px] border-[#344A53] bg-[#101F25] p-6 md:p-8">
            <div className="flex items-center justify-between gap-5">
              <div className="flex items-center gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#20343C] text-2xl">
                  🔊
                </div>
                <div>
                  <h2 className="text-[22px] font-black text-white">Sound Effects</h2>
                  <p className="mt-1 text-[15px] font-semibold text-[#81959C]">
                    Play sounds for correct and incorrect answers.
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Toggle sound effects"
                aria-pressed={sound}
                onClick={() => setSound((value) => !value)}
                className={`relative h-9 w-[62px] shrink-0 rounded-full transition ${
                  sound ? "bg-[#58CC02]" : "bg-[#3B4D54]"
                }`}
              >
                <span
                  className={`absolute top-[5px] h-7 w-7 rounded-full bg-white shadow-md transition-all ${
                    sound ? "left-[30px]" : "left-[5px]"
                  }`}
                />
              </button>
            </div>
          </section>

          {/* APPEARANCE / MODE */}
          <section className="mb-6 rounded-[25px] border-[3px] border-[#344A53] bg-[#101F25] p-6 md:p-8">
            <div className="mb-7">
              <h2 className="text-[25px] font-black text-white">🎨 Mode</h2>
              <p className="mt-2 text-[16px] font-semibold text-[#81959C]">
                Choose how Duolearn looks across the whole app.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setTheme("light");
                  localStorage.setItem("theme", "light");
                  applyTheme("light");
                  window.dispatchEvent(new CustomEvent("duolearn:theme-changed", { detail: { theme: "light" } }));
                }}
                className={`rounded-[20px] border-[3px] p-5 text-left transition ${
                  theme === "light"
                    ? "border-[#58CC02] bg-[#EAF8E5] text-[#17212B]"
                    : "border-[#344A53] bg-[#142329] text-white hover:border-[#4B626B]"
                }`}
              >
                <div className="mb-4 flex h-24 items-center justify-center rounded-xl border border-[#D9E2E7] bg-white text-5xl shadow-sm">
                  ☀️
                </div>
                <div className="text-[19px] font-black">Light Mode</div>
                <div className={`mt-1 text-sm font-semibold ${theme === "light" ? "text-[#5B6B75]" : "text-[#81959C]"}`}>
                  Bright white interface
                </div>
                {theme === "light" && (
                  <div className="mt-3 text-[11px] font-black uppercase tracking-wide text-[#58CC02]">
                    SELECTED
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme("dark");
                  localStorage.setItem("theme", "dark");
                  applyTheme("dark");
                  window.dispatchEvent(new CustomEvent("duolearn:theme-changed", { detail: { theme: "dark" } }));
                }}
                className={`rounded-[20px] border-[3px] p-5 text-left transition ${
                  theme === "dark"
                    ? "border-[#58CC02] bg-[#1E351F] text-white"
                    : "border-[#344A53] bg-[#142329] text-white hover:border-[#4B626B]"
                }`}
              >
                <div className="mb-4 flex h-24 items-center justify-center rounded-xl border border-[#344A53] bg-[#0F1B20] text-5xl">
                  🌙
                </div>
                <div className="text-[19px] font-black">Dark Mode</div>
                <div className="mt-1 text-sm font-semibold text-[#81959C]">
                  Dark Duolearn interface
                </div>
                {theme === "dark" && (
                  <div className="mt-3 text-[11px] font-black uppercase tracking-wide text-[#58CC02]">
                    SELECTED
                  </div>
                )}
              </button>
            </div>
          </section>

          {/* COURSE */}
          <section className="mb-6 rounded-[25px] border-[3px] border-[#344A53] bg-[#101F25] p-6 md:p-8">
            <h2 className="mb-5 text-[25px] font-black text-white">🌎 Course</h2>

            <div className="flex items-center justify-between gap-5 rounded-[20px] border-2 border-[#344A53] bg-[#20343C] p-5">
              <div className="flex items-center gap-5">
                <div
                  className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm"
                  aria-label="Spanish flag"
                  title="Spanish"
                >
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    role="img"
                    aria-hidden="true"
                  >
                    <rect width="56" height="56" rx="10" fill="#AA151B" />
                    <rect y="13" width="56" height="30" fill="#F1BF00" />
                    <g transform="translate(13 18) scale(.42)">
                      <path
                        d="M0 0h12v25H0z"
                        fill="#AA151B"
                        opacity=".9"
                      />
                      <path
                        d="M12 2h20v21H12z"
                        fill="#F1BF00"
                        stroke="#AA151B"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M16 5h12v4H16zM16 11h12v4H16zM16 17h8v3h-8z"
                        fill="#AA151B"
                      />
                    </g>
                  </svg>
                </div>
                <div>
                  <p className="text-[19px] font-black text-white">Spanish</p>
                  <p className="mt-1 text-[14px] font-semibold text-[#81959C]">
                    Learning from English
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-[#244A2B] px-4 py-2 text-[11px] font-black tracking-wide text-[#58CC02]">
                ACTIVE
              </span>
            </div>
          </section>

          {/* ACCOUNT */}
          <section className="mb-6 rounded-[25px] border-[3px] border-[#344A53] bg-[#101F25] p-6 md:p-8">
            <h2 className="mb-5 text-[25px] font-black text-white">Account</h2>

            <div className="space-y-3">
              <Link
                href="/profile"
                className="flex items-center justify-between rounded-[18px] border-2 border-[#344A53] bg-[#142329] px-5 py-4 transition hover:bg-[#20343C]"
              >
                <span className="font-black text-white">View Profile</span>
                <span className="text-[#35BDF5]">→</span>
              </Link>

              <Link
                href="/"
                className="flex items-center justify-between rounded-[18px] border-2 border-[#344A53] bg-[#142329] px-5 py-4 transition hover:bg-[#20343C]"
              >
                <span className="font-black text-white">Back to Learning</span>
                <span className="text-[#35BDF5]">→</span>
              </Link>
            </div>
          </section>

          {/* SAVE */}
          <section className="mb-6 rounded-[25px] border-[3px] border-[#344A53] bg-[#101F25] p-6 md:p-8">
            <button
              type="button"
              onClick={saveSettings}
              className="w-full rounded-[18px] bg-[#58CC02] py-4 text-[18px] font-black text-white shadow-[0_4px_0_#3E9800] transition hover:bg-[#61D509] active:translate-y-[2px] active:shadow-[0_2px_0_#3E9800]"
            >
              SAVE SETTINGS
            </button>

            {saved && (
              <div className="mt-5 rounded-[18px] border-2 border-[#3D7633] bg-[#1C3521] p-4 text-center">
                <p className="font-black text-[#58CC02]">
                  ✓ Settings saved successfully!
                </p>
              </div>
            )}
          </section>

          {/* LOG OUT */}
          <section className="mb-6 rounded-[25px] border-[3px] border-[#344A53] bg-[#101F25] p-6 md:p-8">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("dailyGoal");
                localStorage.removeItem("soundEnabled");
                localStorage.removeItem("theme");
                applyTheme("dark");
                window.dispatchEvent(new Event("duolearn:logout"));
                window.location.href = "/homepage";
              }}
              className="w-full rounded-[18px] border-[3px] border-[#5A4146] bg-[#18262C] py-4 text-[18px] font-black text-[#FF6B78] transition hover:border-[#FF6B78] hover:bg-[#2A2024]"
            >
              LOG OUT
            </button>
          </section>

          <div className="pb-12 pt-2 text-center">
            <Link
              href="/"
              className="font-bold text-[#81959C] transition hover:text-[#35BDF5]"
            >
              ← Back to Learning
            </Link>
          </div>
        </div>
      </div>

    </main>
  );
}

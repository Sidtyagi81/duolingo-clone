"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getUserStats } from "@/lib/api";

type DuolingoLayoutProps = {
  children: ReactNode;
  active?: string;
  rightContent?: ReactNode;
  showRightSidebar?: boolean;
};

type Stats = {
  streak: number;
  gems: number;
  hearts: number;
};

type Popup = "course" | "streak" | "gems" | "hearts" | null;

/* =========================================================
   HEADER ICONS
========================================================= */

function FlagIcon() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-white text-[29px] leading-none">
      🇺🇸
    </div>
  );
}

function FlameIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none">
      <path
        d="M21 4c2 8-2 11-5.5 14.5C12.5 21.5 10 25 10 29c0 5.5 4.3 9.5 9.7 9.5 6.1 0 10.8-4.7 10.8-11 0-7-5.1-13.1-9.5-23.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GemIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none">
      <path
        d="M20 3 32 12l-4.5 23H12.5L8 12 20 3Z"
        fill="#20B8F0"
        stroke="#DDF9FF"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M8 12h24M20 3v32M12.5 35 8 12M27.5 35 32 12"
        stroke="#8DE9FF"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none">
      <path
        d="M20 34S5.5 25.8 5.5 15.1C5.5 10.1 9.1 6.5 13.7 6.5c2.9 0 5.3 1.6 6.3 4 1.1-2.4 3.5-4 6.4-4 4.6 0 8.1 3.6 8.1 8.6C34.5 25.8 20 34 20 34Z"
        fill="#FF4B55"
        stroke="#FF858B"
        strokeWidth="2"
      />
    </svg>
  );
}

function HomeIcon() {
  return <span className="text-[31px]">🏠</span>;
}
function SoundIcon() {
  return <span className="text-[31px]">👄</span>;
}
function TrophyIcon() {
  return <span className="text-[31px]">🏆</span>;
}
function QuestIcon() {
  return <span className="text-[31px]">🎯</span>;
}
function ShopIcon() {
  return <span className="text-[31px]">🛍️</span>;
}
function ProfileIcon() {
  return <span className="text-[31px]">👤</span>;
}
function MoreIcon() {
  return <span className="text-[31px]">•••</span>;
}

/* =========================================================
   POPUP WRAPPER
   Rendered in document.body so NO parent overflow/z-index
   can hide the popup.
========================================================= */

function Popup({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <div
        aria-hidden="true"
        onMouseDown={onClose}
        onTouchStart={onClose}
        className="fixed inset-0 z-[900] bg-transparent"
      />
      <div className="pointer-events-auto relative z-[1001]">
        {children}
      </div>
    </>,
    document.body
  );
}

/* =========================================================
   COURSE POPUP
========================================================= */

function CoursePopup({ close }: { close: () => void }) {
  return (
    <Popup onClose={close}>
      <div className="fixed right-[250px] top-[94px] z-[100000] w-[365px] overflow-hidden rounded-[25px] border-[3px] border-[#344A53] bg-[#101F25] shadow-[0_15px_40px_rgba(0,0,0,.55)]">
        <div className="absolute -top-[11px] right-[165px] h-5 w-5 rotate-45 border-l-[3px] border-t-[3px] border-[#344A53] bg-[#101F25]" />

        <div className="border-b-2 border-[#344A53] px-8 py-6">
          <div className="text-[20px] font-black text-[#637981]">
            MY COURSES
          </div>
        </div>

        <Link
          href="/"
          onClick={close}
          className="flex h-[88px] items-center gap-7 border-b-2 border-[#344A53] bg-[#20343C] px-7"
        >
          <FlagIcon />
          <span className="text-[23px] font-black text-[#35BDF5]">
            Spanish
          </span>
        </Link>

        <Link
          href="/courses"
          onClick={close}
          className="flex h-[84px] items-center gap-7 bg-[#101F25] px-7 hover:bg-[#172A31]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-lg border-[3px] border-[#536B74] text-[31px] text-[#71868E]">
            +
          </span>
          <span className="text-[21px] font-black text-white">
            Add a new course
          </span>
        </Link>
      </div>
    </Popup>
  );
}

/* =========================================================
   STREAK POPUP
========================================================= */

function StreakPopup({
  streak,
  close,
}: {
  streak: number;
  close: () => void;
}) {
  return (
    <Popup onClose={close}>
      <div className="fixed right-[400px] top-[94px] z-[100000] w-[470px] overflow-hidden rounded-[25px] border-[3px] border-[#344A53] bg-[#20343C] shadow-[0_15px_40px_rgba(0,0,0,.55)]">
        <div className="absolute -top-[11px] right-[220px] h-5 w-5 rotate-45 border-l-[3px] border-t-[3px] border-[#344A53] bg-[#20343C]" />

        <div className="p-8">
          <h2 className="text-[32px] font-black text-[#657C85]">
            {streak} day streak
          </h2>

          <p className="mt-5 text-[22px] font-bold leading-relaxed text-[#E1EAED]">
            {streak === 0
              ? "Do a lesson today to start a new streak!"
              : "Keep learning today to keep your streak alive!"}
          </p>

          <div className="mt-8 rounded-[18px] bg-[#101F25] p-6">
            <div className="grid grid-cols-7 text-center font-black text-[#61777F]">
              <span className="text-[#FFB12C]">M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
            <div className="mt-6 h-3 rounded-full bg-[#3C5059]" />
          </div>
        </div>
      </div>
    </Popup>
  );
}

/* =========================================================
   GEMS POPUP
========================================================= */

function GemsPopup({
  gems,
  close,
}: {
  gems: number;
  close: () => void;
}) {
  return (
    <Popup onClose={close}>
      <div className="fixed right-[115px] top-[94px] z-[100000] w-[575px] overflow-hidden rounded-[25px] border-[3px] border-[#344A53] bg-[#101F25] shadow-[0_15px_40px_rgba(0,0,0,.55)]">
        <div className="absolute -top-[11px] right-[210px] h-5 w-5 rotate-45 border-l-[3px] border-t-[3px] border-[#344A53] bg-[#101F25]" />

        <div className="flex items-center gap-8 p-8">
          <div className="flex h-[125px] w-[125px] items-center justify-center rounded-2xl bg-[#182C33] text-[72px]">
            💎
          </div>

          <div>
            <h2 className="text-[31px] font-black text-white">Gems</h2>
            <p className="mt-2 text-[22px] font-semibold text-[#DCE6EA]">
              You have {gems} gems
            </p>
            <Link
              href="/shop"
              onClick={close}
              className="mt-5 inline-block text-[19px] font-black text-[#35BDF5]"
            >
              GO TO SHOP
            </Link>
          </div>
        </div>
      </div>
    </Popup>
  );
}

/* =========================================================
   HEARTS POPUP
========================================================= */

function HeartsPopup({
  hearts,
  close,
}: {
  hearts: number;
  close: () => void;
}) {
  return (
    <Popup onClose={close}>
      <div className="fixed right-[20px] top-[94px] z-[100000] w-[575px] overflow-hidden rounded-[25px] border-[3px] border-[#344A53] bg-[#101F25] shadow-[0_15px_40px_rgba(0,0,0,.55)]">
        <div className="absolute -top-[11px] right-[68px] h-5 w-5 rotate-45 border-l-[3px] border-t-[3px] border-[#344A53] bg-[#101F25]" />

        <div className="p-8 text-center">
          <h2 className="text-[32px] font-black text-white">Hearts</h2>

          <div className="mt-7 flex justify-center gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={i < hearts ? "" : "opacity-25"}>
                <HeartIcon />
              </div>
            ))}
          </div>

          <h3 className="mt-7 text-[25px] font-black text-white">
            {hearts >= 5 ? "You have full hearts" : `${hearts} hearts remaining`}
          </h3>

          <p className="mt-2 text-[21px] font-semibold text-[#C8D5DA]">
            Keep on learning
          </p>

          <Link
            href="/shop"
            onClick={close}
            className="mt-7 flex h-[76px] items-center justify-between rounded-[20px] border-[3px] border-[#344A53] px-7 hover:bg-[#172A31]"
          >
            <span className="text-[19px] font-black text-white">
              ♾️ &nbsp; UNLIMITED HEARTS
            </span>
            <span className="text-[19px] font-black text-[#E73DD7]">
              FREE TRIAL
            </span>
          </Link>

          <Link
            href="/shop"
            onClick={close}
            className="mt-4 flex h-[76px] items-center justify-between rounded-[20px] border-[3px] border-[#344A53] px-7 hover:bg-[#172A31]"
          >
            <span className="text-[19px] font-black text-white">
              ♡ &nbsp; REFILL HEARTS
            </span>
            <span className="text-[18px] font-black text-[#9AABB1]">
              💎 350
            </span>
          </Link>
        </div>
      </div>
    </Popup>
  );
}

/* =========================================================
   MAIN LAYOUT
========================================================= */

export default function DuolingoLayout({
  children,
  active = "learn",
  rightContent,
  showRightSidebar = true,
}: DuolingoLayoutProps) {
  const [stats, setStats] = useState<Stats>({
    streak: 0,
    gems: 500,
    hearts: 5,
  });

  const [popup, setPopup] = useState<Popup>(null);

  useEffect(() => {
    let mounted = true;

    async function loadStats() {
      try {
        const data = await getUserStats(1);

        if (!mounted || !data) return;

        setStats({
          streak: Number(data.streak ?? 0),
          gems: Number(data.gems ?? 500),
          hearts: Number(data.hearts ?? 5),
        });
      } catch (error) {
        console.error("Failed to load header stats:", error);
      }
    }

    loadStats();

    return () => {
      mounted = false;
    };
  }, []);

  const toggle = (name: Exclude<Popup, null>) => {
    setPopup((current) => (current === name ? null : name));
  };

  const closePopup = () => setPopup(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPopup(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const navItems = [
    { key: "learn", label: "LEARN", icon: <HomeIcon />, href: "/" },
    { key: "sounds", label: "SOUNDS", icon: <SoundIcon />, href: "/sounds" },
    {
      key: "leaderboard",
      label: "LEADERBOARDS",
      icon: <TrophyIcon />,
      href: "/leaderboard",
    },
    { key: "quests", label: "QUESTS", icon: <QuestIcon />, href: "/quests" },
    { key: "shop", label: "SHOP", icon: <ShopIcon />, href: "/shop" },
    {
      key: "profile",
      label: "PROFILE",
      icon: <ProfileIcon />,
      href: "/profile",
    },
    { key: "more", label: "MORE", icon: <MoreIcon />, href: "/settings" },
  ];

  return (
    <main className="min-h-screen bg-[#0F1B20] text-white">
      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside className="fixed bottom-0 left-0 top-0 z-50 hidden w-[355px] flex-col border-r-2 border-[#30434B] bg-[#101D22] lg:flex">
        <div className="px-10 pb-8 pt-10">
          <Link href="/" className="block">
            <div className="text-[44px] font-black leading-none tracking-[-2px] text-[#58CC02]">
              duolearn
            </div>
            <div className="mt-2 text-sm font-bold text-[#72878F]">
              Learn every day
            </div>
          </Link>
        </div>

        <nav className="space-y-2 px-6">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-5 rounded-2xl border-2 px-5 py-4 transition ${
                active === item.key
                  ? "border-[#49A8D8] bg-[#203238] text-[#49C6FF]"
                  : "border-transparent text-[#E2ECEF] hover:border-[#334A53] hover:bg-[#18292F]"
              }`}
            >
              <span className="flex w-9 justify-center">{item.icon}</span>
              <span className="text-[16px] font-black tracking-wide">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-7 pb-8">
          <div className="border-t-2 border-[#273A42] pt-5">
            <Link
              href="/settings"
              className="flex items-center gap-4 rounded-xl px-5 py-3 text-[#8EA1A8] hover:bg-[#18292F]"
            >
              ⚙️
              <span className="font-bold">Settings</span>
            </Link>
          </div>
        </div>
      </aside>

      <div className="lg:ml-[355px]">
        {/*
          DESKTOP HEADER REMOVED
          -----------------------------------------------
          The reference video has NO top statistics header on
          desktop. The sidebar remains fixed and the page content
          starts immediately beside it.
        */}

        {/* MOBILE HEADER ONLY */}
        <header className="flex h-[72px] items-center justify-end border-b-2 border-[#2D4149] bg-[#101D22] px-4 lg:hidden">
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Courses"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => toggle("course")}
              className={`flex h-[58px] min-w-[62px] items-center justify-center rounded-[14px] px-2 transition ${
                popup === "course" ? "bg-[#20333B]" : "hover:bg-[#172A31]"
              }`}
            >
              <FlagIcon />
            </button>

            <button
              type="button"
              aria-label="Streak"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => toggle("streak")}
              className={`flex h-[58px] min-w-[62px] items-center justify-center gap-1 rounded-[14px] px-2 transition ${
                popup === "streak" ? "bg-[#20333B]" : "hover:bg-[#172A31]"
              }`}
            >
              <span className="text-[#50646C]"><FlameIcon /></span>
              <span className="text-[17px] font-black text-[#657A82]">{stats.streak}</span>
            </button>

            <button
              type="button"
              aria-label="Gems"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => toggle("gems")}
              className={`flex h-[58px] min-w-[78px] items-center justify-center gap-1 rounded-[14px] px-2 transition ${
                popup === "gems" ? "bg-[#20333B]" : "hover:bg-[#172A31]"
              }`}
            >
              <GemIcon />
              <span className="text-[17px] font-black text-[#35BDF5]">{stats.gems}</span>
            </button>

            <button
              type="button"
              aria-label="Hearts"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => toggle("hearts")}
              className={`flex h-[58px] min-w-[70px] items-center justify-center gap-1 rounded-[14px] px-2 transition ${
                popup === "hearts" ? "bg-[#20333B]" : "hover:bg-[#172A31]"
              }`}
            >
              <HeartIcon />
              <span className="text-[17px] font-black text-[#FF5B62]">{stats.hearts}</span>
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-10">
          {showRightSidebar ? (
            <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_500px]">
              <section className="min-w-0">{children}</section>
              {rightContent && (
                <aside className="space-y-6">{rightContent}</aside>
              )}
            </div>
          ) : (
            <section>{children}</section>
          )}
        </div>
      </div>

      {/* MOBILE NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-[#30434B] bg-[#101D22] lg:hidden">
        <div className="grid grid-cols-5 py-3">
          {[
            ["🏠", "LEARN", "/"],
            ["🏆", "LEAGUE", "/leaderboard"],
            ["🎯", "QUESTS", "/quests"],
            ["🛍️", "SHOP", "/shop"],
            ["👤", "PROFILE", "/profile"],
          ].map(([icon, label, href]) => (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center gap-1 ${
                active === label.toLowerCase()
                  ? "text-[#58CC02]"
                  : "text-[#81959C]"
              }`}
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-[9px] font-black">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* POPUPS */}
      {popup === "course" && <CoursePopup close={closePopup} />}
      {popup === "streak" && (
        <StreakPopup streak={stats.streak} close={closePopup} />
      )}
      {popup === "gems" && (
        <GemsPopup gems={stats.gems} close={closePopup} />
      )}
      {popup === "hearts" && (
        <HeartsPopup hearts={stats.hearts} close={closePopup} />
      )}
    </main>
  );
}

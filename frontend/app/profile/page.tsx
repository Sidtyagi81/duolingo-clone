"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import AvatarDisplay, {
  defaultAvatar,
  loadAvatar,
  type AvatarData,
} from "@/components/AvatarDisplay";

import {
  getActiveUser,
  type DuolearnUser,
} from "@/lib/userState";

/* =========================================================
   TYPES
========================================================= */

type UserStats = {
  total_xp?: number;
  daily_xp?: number;
  streak?: number;
  hearts?: number;
  gems?: number;
};

type Activity = {
  activity_date: string;
  xp_earned: number;
};

type SkillProgress = {
  skill_id: number;
  completed_lessons: number;
  total_lessons: number;
  total_xp: number;
  crowns: number;
  is_unlocked: boolean;
  completed: boolean;
  status: string;
  progress_percent: number;
};

/* =========================================================
   INLINE ICONS
========================================================= */

function HomeIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M5 14.5L16 5L27 14.5V27H20V19H12V27H5V14.5Z"
        fill="#FFC800"
        stroke="#FF4B4B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 19H20V27H12V19Z"
        fill="#FF9600"
      />
    </svg>
  );
}

function SoundIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M5 13H10L16 8V24L10 19H5V13Z"
        fill="#FF8A65"
        stroke="#FFB199"
        strokeWidth="2"
      />
      <path
        d="M20 11C22.5 13.5 22.5 18.5 20 21"
        stroke="#FF8A65"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M23.5 8C28 12.5 28 19.5 23.5 24"
        stroke="#FF8A65"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrophyIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M9 5H23V13C23 18 20 21 16 21C12 21 9 18 9 13V5Z"
        fill="#FFC800"
      />
      <path
        d="M9 8H5V11C5 15 7.5 17 11 17"
        stroke="#FF9600"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M23 8H27V11C27 15 24.5 17 21 17"
        stroke="#FF9600"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M16 21V26"
        stroke="#FFC800"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M11 27H21"
        stroke="#FFC800"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function QuestIcon({ size = 30 }: { size?: number }) {
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
        d="M11 15H21"
        stroke="#DFA800"
        strokeWidth="2"
      />
      <path
        d="M11 20H18"
        stroke="#DFA800"
        strokeWidth="2"
      />
    </svg>
  );
}

function ShopIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M4 12H28V27H4V12Z"
        fill="#FF4B4B"
      />
      <path
        d="M3 12L7 5H25L29 12H3Z"
        fill="#FF9600"
      />
      <path
        d="M4 12H28"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M10 18V27"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M22 18V27"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
}

function ProfileIcon({ size = 30 }: { size?: number }) {
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
      <circle
        cx="16"
        cy="12"
        r="4"
        fill="#65767D"
      />
      <path
        d="M9 24C10.5 19.5 21.5 19.5 23 24"
        stroke="#65767D"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoreIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle
        cx="16"
        cy="16"
        r="13"
        fill="#C77DFF"
      />
      <circle
        cx="10"
        cy="16"
        r="2"
        fill="white"
      />
      <circle
        cx="16"
        cy="16"
        r="2"
        fill="white"
      />
      <circle
        cx="22"
        cy="16"
        r="2"
        fill="white"
      />
    </svg>
  );
}

function FlameIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 29C22.5 29 27 24.5 27 18.5C27 13.5 23.5 9.5 19.5 6C19.5 10 17.5 12 15.5 13.5C15 9 12 5 8 3C9 9 5 12 5 18.5C5 24.5 9.5 29 16 29Z"
        fill="#FF4B4B"
      />
      <path
        d="M16 25C19 25 21 23 21 20.5C21 18.5 19.5 17 17.5 15.5C17.5 18 16 19 15 19.5C14.5 17.5 13 16 11.5 15C11.5 17 10.5 18.5 10.5 20.5C10.5 23 13 25 16 25Z"
        fill="#FFC800"
      />
    </svg>
  );
}

function LightningIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M18 3L7 18H14L12 29L25 13H18L18 3Z"
        fill="#FFC800"
        stroke="#FFB800"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 27C14 25 5 19 5 12C5 8 8 5 12 5C14 5 15.5 6 16 7.5C16.5 6 18 5 20 5C24 5 27 8 27 12C27 19 18 25 16 27Z"
        fill="#FF4B4B"
        stroke="#FF6B6B"
        strokeWidth="2"
      />
      <path
        d="M11 9C9.5 9 8 10.5 8 12"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

function GemIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 3L26 9L22 25L16 29L10 25L6 9L16 3Z"
        fill="#1CB0F6"
        stroke="#8BD8FF"
        strokeWidth="2"
      />
      <path
        d="M11 10L16 6L21 10L18 22L16 25L14 22L11 10Z"
        fill="#7DD7FF"
      />
    </svg>
  );
}

function EditIcon({ size = 25 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M7 23L8 18L21 5C22 4 24 4 25 5L27 7C28 8 28 10 27 11L14 24L9 25L7 23Z"
        fill="#EAF7FA"
      />
      <path
        d="M19 7L25 13"
        stroke="#14252B"
        strokeWidth="2"
      />
    </svg>
  );
}

function SearchIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle
        cx="16"
        cy="16"
        r="10"
        fill="#E6F7FF"
        stroke="#B8DCEB"
        strokeWidth="2"
      />
      <path
        d="M24 24L32 32"
        stroke="#FF9600"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect
        x="5"
        y="8"
        width="30"
        height="24"
        rx="5"
        fill="#FFC800"
      />
      <path
        d="M7 11L20 21L33 11"
        stroke="#FF9600"
        strokeWidth="3"
      />
    </svg>
  );
}

function ChevronRight({ size = 25 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M9 5L16 12L9 19"
        stroke="#D7E4E8"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M20 4L33 9V18C33 27 27 33 20 36C13 33 7 27 7 18V9L20 4Z"
        fill="#6D7D83"
      />
      <circle
        cx="20"
        cy="17"
        r="5"
        fill="#35464D"
      />
      <path
        d="M13 28C14 23 26 23 27 28"
        stroke="#35464D"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MedalIcon({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle
        cx="20"
        cy="22"
        r="11"
        fill="#65767D"
      />
      <circle
        cx="20"
        cy="22"
        r="6"
        fill="#34454C"
      />
      <path
        d="M14 11L10 4H17L20 10"
        fill="#8C9CA1"
      />
      <path
        d="M26 11L30 4H23L20 10"
        fill="#8C9CA1"
      />
    </svg>
  );
}

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-5 rounded-2xl px-5 py-4 transition-all ${
        active
          ? "border-2 border-[#3E9CCC] bg-[#20343C]"
          : "border-2 border-transparent hover:bg-[#192C33]"
      }`}
    >
      <div className="w-9 shrink-0">
        {icon}
      </div>

      <span
        className={`text-[17px] font-extrabold tracking-wide ${
          active
            ? "text-[#35BDF5]"
            : "text-[#E9F3F5]"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}

/* =========================================================
   ACHIEVEMENT CARD
========================================================= */

function AchievementCard({
  title,
  description,
  current,
  target,
  icon,
  bg,
}: {
  title: string;
  description: string;
  current: number;
  target: number;
  icon: React.ReactNode;
  bg: string;
}) {
  const percentage =
    target > 0
      ? Math.min(
          (current / target) * 100,
          100
        )
      : 0;

  return (
    <div className="flex min-h-[145px] items-center gap-6 border-b-2 border-[#304149] px-7 py-6 last:border-b-0">

      <div
        className="flex h-[108px] w-[108px] shrink-0 flex-col items-center justify-center rounded-2xl border-b-[5px] border-black/20"
        style={{
          background: bg,
        }}
      >
        <div>{icon}</div>

        <span className="mt-1 text-[11px] font-black text-[#102027]">
          LEVEL 1
        </span>
      </div>

      <div className="min-w-0 flex-1">

        <div className="mb-3 flex items-center justify-between gap-4">

          <h3 className="text-[21px] font-extrabold text-white">
            {title}
          </h3>

          <span className="shrink-0 text-[16px] font-bold text-[#637980]">
            {current}/{target}
          </span>

        </div>

        <div className="h-5 overflow-hidden rounded-full bg-[#3A4B52]">

          <div
            className="h-full rounded-full bg-[#58CC02] transition-all"
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

        <p className="mt-3 text-[17px] font-medium text-[#E6F2F4]">
          {description}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   PROFILE PAGE
========================================================= */


function formatJoinedDate(value: unknown): string {
  if (!value) return "Recently";

  const raw = String(value).trim();
  if (!raw) return "Recently";

  // Supports ISO dates, timestamps, and normal date strings.
  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}


export default function ProfilePage() {
  const [user, setUser] = useState<DuolearnUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [dailyGoal, setDailyGoal] = useState(20);
  const [avatar, setAvatar] = useState<AvatarData>(defaultAvatar);

  const [socialTab, setSocialTab] =
    useState<"following" | "followers">("following");

  const [showFindFriends, setShowFindFriends] = useState(false);
  const [showInviteFriends, setShowInviteFriends] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const [friendSearch, setFriendSearch] = useState("");
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("/profile");

  function refreshAvatar() {
    try {
      const savedAvatar = loadAvatar();

      if (savedAvatar) {
        setAvatar({
          ...defaultAvatar,
          ...savedAvatar,
        });
      } else {
        setAvatar(defaultAvatar);
      }
    } catch (err) {
      console.error("Failed to load avatar:", err);
      setAvatar(defaultAvatar);
    }
  }

  function refreshUser() {
    const activeUser = getActiveUser();

    if (!activeUser) {
      window.location.replace("/login");
      return;
    }

    setUser(activeUser);
    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;

    const activeUser = getActiveUser();

    if (!activeUser) {
      window.location.replace("/login");
      return;
    }

    if (mounted) {
      setUser(activeUser);
      setLoading(false);
    }

    refreshAvatar();

    const savedGoal = localStorage.getItem("dailyGoal");

    if (savedGoal) {
      const parsedGoal = Number(savedGoal);

      if (Number.isFinite(parsedGoal) && parsedGoal > 0) {
        setDailyGoal(parsedGoal);
      }
    }

    setInviteUrl(`${window.location.origin}/profile`);

    const syncUser = () => {
      if (!mounted) return;

      const currentUser = getActiveUser();

      if (!currentUser) {
        window.location.replace("/login");
        return;
      }

      setUser(currentUser);
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === "duolingoAvatar" ||
        event.key === "avatar" ||
        event.key === "duolearn_users" ||
        event.key === "duolearn_active_user" ||
        event.key === "dailyGoal"
      ) {
        refreshAvatar();
        syncUser();

        if (event.key === "dailyGoal" && event.newValue) {
          const nextGoal = Number(event.newValue);
          if (Number.isFinite(nextGoal) && nextGoal > 0) {
            setDailyGoal(nextGoal);
          }
        }
      }
    };

    const handleStatsUpdated = () => syncUser();
    const handleFocus = () => {
      refreshAvatar();
      syncUser();
    };

    const handlePageShow = () => {
      refreshAvatar();
      syncUser();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("duolearn:stats-updated", handleStatsUpdated);
    window.addEventListener("duolearn:logout", handleStatsUpdated);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      mounted = false;

      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(
        "duolearn:stats-updated",
        handleStatsUpdated,
      );
      window.removeEventListener("duolearn:logout", handleStatsUpdated);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0E1E23] text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#344850] border-t-[#58CC02]" />
          <p className="text-lg font-bold text-[#AFC1C7]">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  /*
   * IMPORTANT:
   * This page now reads ONLY the currently logged-in account.
   *
   * New account:
   *   XP = 0
   *   streak = 0
   *   hearts = 5
   *   gems = 100
   *   currentLesson = 1
   *
   * Existing account:
   *   Its own saved XP, streak, hearts, gems and currentLesson are shown.
   */
  const totalXP = Number(user.xp ?? 0);
  const streak = Number(user.streak ?? 0);
  const hearts = Number(user.hearts ?? 5);
  const gems = Number(user.gems ?? 100);
  const currentLesson = Math.max(Number(user.currentLesson ?? 1), 1);

  // currentLesson means the first unfinished lesson.
  const completedLessons = Math.max(currentLesson - 1, 0);

  // The local account model stores total XP. There is no fake backend
  // daily_xp value, so daily progress is based on this account's XP.
  const dailyXP = totalXP;

  // Keep the profile useful even before course metadata is loaded.
  // A 20-lesson course is used only as a visual progress scale.
  const totalLessons = 20;

  const courseProgress =
    totalLessons > 0
      ? Math.min(
          Math.round((completedLessons / totalLessons) * 100),
          100,
        )
      : 0;

  const dailyProgress =
    dailyGoal > 0
      ? Math.min((dailyXP / dailyGoal) * 100, 100)
      : 0;

  let league = "Bronze";

  if (totalXP >= 2000) {
    league = "Gold";
  } else if (totalXP >= 1000) {
    league = "Silver";
  }

  const wildfireProgress = Math.min(streak, 3);
  const sageProgress = Math.min(totalXP, 100);
  const championProgress = Math.min(completedLessons, 10);

  return (
    <div className="min-h-screen bg-[#0E1E23] text-white">
      <main className="xl:ml-[365px]">
        <div className="mx-auto max-w-[1450px] px-5 pb-24 pt-8 sm:px-8 xl:px-10">
          <div className="grid grid-cols-1 gap-8 2xl:grid-cols-[minmax(600px,800px)_minmax(380px,525px)]">
            <section>
              <div className="overflow-hidden rounded-[20px] border-2 border-[#263A42] bg-[#12262C]">
                <div className="relative flex h-[350px] items-center justify-center overflow-hidden bg-[#20343B]">
                  <Link
                    href="/profile/avatar"
                    aria-label="Edit avatar"
                    className="relative flex h-[290px] w-[290px] items-center justify-center rounded-[44%] border-[6px] border-[#48BFF2] bg-[#4B92B4] shadow-[0_14px_35px_rgba(0,0,0,0.28)] transition-transform duration-200 hover:scale-[1.02]"
                  >
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="scale-[0.62] transform">
                        <AvatarDisplay
                          key={JSON.stringify(avatar)}
                          avatar={avatar}
                          size="medium"
                          showBackground={false}
                        />
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/profile/avatar"
                    aria-label="Edit avatar"
                    className="absolute right-6 top-6 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#172C33] bg-[#172C33] shadow-lg transition hover:bg-[#20343C]"
                  >
                    <EditIcon size={32} />
                  </Link>
                </div>

                <div className="px-7 pb-7 pt-8">
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <h1 className="text-[30px] font-black tracking-tight text-white sm:text-[36px]">
                        {user.name}
                      </h1>

                      <p className="mt-1 text-[20px] font-medium text-[#60777F]">
                        @{user.email.split("@")[0]}
                      </p>

                      <p className="mt-2 text-[17px] font-medium text-[#E3EFF2]">
                        Joined{" "}
                        {formatJoinedDate(user.joinedDate)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-8 text-[18px] font-extrabold text-[#35BDF5]">
                    <span>0 Following</span>
                    <span>0 Followers</span>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="mb-5 text-[28px] font-black">Statistics</h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-[20px] border-2 border-[#344850] bg-[#112329] p-6">
                    <div className="flex items-center gap-5">
                      <FlameIcon size={42} />

                      <div>
                        <div className="text-[27px] font-black text-[#687C83]">
                          {streak}
                        </div>
                        <div className="text-[18px] font-medium text-[#61757C]">
                          Day streak
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[20px] border-2 border-[#344850] bg-[#112329] p-6">
                    <div className="flex items-center gap-5">
                      <LightningIcon size={42} />

                      <div>
                        <div className="text-[27px] font-black text-[#F0F7F8]">
                          {totalXP}
                        </div>
                        <div className="text-[18px] font-medium text-[#61757C]">
                          Total XP
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[20px] border-2 border-[#344850] bg-[#112329] p-6">
                    <div className="flex items-center gap-5">
                      <ShieldIcon size={42} />

                      <div>
                        <div className="text-[24px] font-black text-[#687C83]">
                          {league}
                        </div>
                        <div className="text-[18px] font-medium text-[#61757C]">
                          Current league
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[20px] border-2 border-[#344850] bg-[#112329] p-6">
                    <div className="flex items-center gap-5">
                      <MedalIcon size={42} />

                      <div>
                        <div className="text-[27px] font-black text-[#687C83]">
                          {totalXP >= 500 ? 1 : 0}
                        </div>
                        <div className="text-[18px] font-medium text-[#61757C]">
                          Top 3 finishes
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-[28px] font-black">Achievements</h2>

                  <button
                    type="button"
                    onClick={() => setShowAchievements(true)}
                    className="text-[17px] font-black text-[#35BDF5] transition hover:text-white"
                  >
                    VIEW ALL
                  </button>
                </div>

                <div className="overflow-hidden rounded-[20px] border-2 border-[#344850] bg-[#112329]">
                  <AchievementCard
                    title="Wildfire"
                    description="Reach a 3 day streak"
                    current={wildfireProgress}
                    target={3}
                    bg="#FF4B4B"
                    icon={<FlameIcon size={42} />}
                  />

                  <AchievementCard
                    title="Sage"
                    description="Earn 100 XP"
                    current={sageProgress}
                    target={100}
                    bg="#78D500"
                    icon={<span className="text-4xl">🧙</span>}
                  />

                  <AchievementCard
                    title="Champion"
                    description="Complete 10 lessons"
                    current={championProgress}
                    target={10}
                    bg="#C77DFF"
                    icon={<TrophyIcon size={42} />}
                  />
                </div>
              </div>
            </section>

            <aside className="space-y-7">
              <div className="overflow-hidden rounded-[22px] border-2 border-[#344850] bg-[#112329]">
                <div className="grid grid-cols-2 border-b-2 border-[#344850]">
                  <button
                    type="button"
                    onClick={() => setSocialTab("following")}
                    className={`border-b-2 px-4 py-6 text-[19px] font-black transition ${
                      socialTab === "following"
                        ? "border-[#35BDF5] text-[#35BDF5]"
                        : "border-transparent text-white hover:bg-[#182D34]"
                    }`}
                  >
                    FOLLOWING
                  </button>

                  <button
                    type="button"
                    onClick={() => setSocialTab("followers")}
                    className={`border-b-2 px-4 py-6 text-[19px] font-black transition ${
                      socialTab === "followers"
                        ? "border-[#35BDF5] text-[#35BDF5]"
                        : "border-transparent text-white hover:bg-[#182D34]"
                    }`}
                  >
                    FOLLOWERS
                  </button>
                </div>

                <div className="flex min-h-[410px] flex-col items-center justify-center px-8 text-center">
                  <div className="mb-7 text-[105px] leading-none">🧑‍🤝‍🧑</div>

                  <p className="max-w-[380px] text-[22px] font-medium leading-relaxed text-[#E8F3F5]">
                    {socialTab === "following"
                      ? "You are not following anyone yet. Find friends and start learning together!"
                      : "You do not have any followers yet. Invite your friends to join you!"}
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-[22px] border-2 border-[#344850] bg-[#112329]">
                <h2 className="px-7 pt-7 text-[25px] font-black">
                  Add friends
                </h2>

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setShowFindFriends(true)}
                    className="flex w-full items-center gap-5 px-7 py-6 text-left transition hover:bg-[#182D34]"
                  >
                    <SearchIcon size={45} />
                    <span className="flex-1 text-[20px] font-extrabold">
                      Find friends
                    </span>
                    <ChevronRight size={28} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowInviteFriends(true)}
                    className="flex w-full items-center gap-5 px-7 py-6 text-left transition hover:bg-[#182D34]"
                  >
                    <MailIcon size={45} />
                    <span className="flex-1 text-[20px] font-extrabold">
                      Invite friends
                    </span>
                    <ChevronRight size={28} />
                  </button>
                </div>
              </div>

              <div className="rounded-[22px] border-2 border-[#344850] bg-[#112329] p-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-[25px] font-black">Daily goal</h2>
                  <span className="text-[18px] font-extrabold text-[#35BDF5]">
                    {dailyXP}/{dailyGoal} XP
                  </span>
                </div>

                <div className="mt-5 h-5 overflow-hidden rounded-full bg-[#394B52]">
                  <div
                    className="h-full rounded-full bg-[#58CC02] transition-all"
                    style={{ width: `${dailyProgress}%` }}
                  />
                </div>

                <p className="mt-4 text-[16px] font-medium text-[#8DA0A6]">
                  {dailyProgress >= 100
                    ? "Daily goal complete! 🎉"
                    : "Keep learning to reach your daily goal."}
                </p>
              </div>

              <div className="rounded-[22px] border-2 border-[#344850] bg-[#112329] p-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-[25px] font-black">Course progress</h2>
                  <span className="text-[18px] font-black text-[#35BDF5]">
                    {courseProgress}%
                  </span>
                </div>

                <div className="mt-5 h-5 overflow-hidden rounded-full bg-[#394B52]">
                  <div
                    className="h-full rounded-full bg-[#58CC02]"
                    style={{ width: `${courseProgress}%` }}
                  />
                </div>

                <div className="mt-4 flex justify-between text-[16px] font-bold text-[#83969C]">
                  <span>{completedLessons} lessons</span>
                  <span>{totalLessons} total</span>
                </div>

                <Link
                  href="/learn"
                  className="mt-6 block rounded-2xl bg-[#58CC02] px-5 py-4 text-center text-[17px] font-black text-white shadow-[0_4px_0_#46A302] transition hover:bg-[#61D407] active:translate-y-1 active:shadow-none"
                >
                  {completedLessons === 0
                    ? "START LESSON 1"
                    : `CONTINUE LESSON ${currentLesson}`}
                </Link>
              </div>

              <div className="rounded-[22px] border-2 border-[#344850] bg-[#112329] p-6">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-[#182D34] p-3 text-center">
                    <FlameIcon size={30} />
                    <div className="mt-1 font-black">{streak}</div>
                    <div className="text-[10px] font-black text-[#7E969E]">
                      STREAK
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#182D34] p-3 text-center">
                    <GemIcon size={30} />
                    <div className="mt-1 font-black">{gems}</div>
                    <div className="text-[10px] font-black text-[#7E969E]">
                      GEMS
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#182D34] p-3 text-center">
                    <HeartIcon size={30} />
                    <div className="mt-1 font-black">{hearts}</div>
                    <div className="text-[10px] font-black text-[#7E969E]">
                      HEARTS
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <footer className="mt-16 hidden justify-center gap-7 pb-8 text-[14px] font-black text-[#526970] xl:flex">
            
          </footer>
        </div>
      </main>

      {showFindFriends && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-5"
          onClick={() => setShowFindFriends(false)}
        >
          <div
            className="w-full max-w-[520px] rounded-3xl border-2 border-[#344850] bg-[#12262C] p-7 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">Find friends</h2>
              <button
                type="button"
                onClick={() => setShowFindFriends(false)}
                className="rounded-xl px-3 py-2 text-xl font-black text-[#8DA0A6] hover:bg-[#20343C] hover:text-white"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl border-2 border-[#344850] bg-[#0E1E23] px-4 py-3">
              <SearchIcon size={32} />
              <input
                autoFocus
                value={friendSearch}
                onChange={(event) => setFriendSearch(event.target.value)}
                placeholder="Search by username"
                className="w-full bg-transparent text-lg font-bold text-white outline-none placeholder:text-[#60777F]"
              />
            </div>

            <div className="mt-6 rounded-2xl bg-[#182D34] p-5 text-center">
              <div className="text-5xl">🧑‍🤝‍🧑</div>
              <p className="mt-3 font-bold text-[#E8F3F5]">
                {friendSearch.trim()
                  ? `No users found for "${friendSearch.trim()}".`
                  : "Type a username to find friends."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowFindFriends(false)}
              className="mt-6 w-full rounded-2xl bg-[#58CC02] px-5 py-4 text-lg font-black text-white shadow-[0_4px_0_#46A302] active:translate-y-1 active:shadow-none"
            >
              DONE
            </button>
          </div>
        </div>
      )}

      {showInviteFriends && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#061216]/80 p-4 backdrop-blur-sm sm:p-6"
          onClick={() => setShowInviteFriends(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-friends-title"
            className="w-full max-w-[560px] overflow-hidden rounded-[28px] border-2 border-[#38515A] bg-[#12262C] shadow-[0_25px_80px_rgba(0,0,0,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative border-b-2 border-[#2B4148] bg-gradient-to-br from-[#17323A] to-[#12262C] px-6 pb-6 pt-6 sm:px-8 sm:pt-7">
              <div className="flex items-start justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-[#DFA800] bg-[#FFC800] shadow-[0_4px_0_#B88900]">
                    <MailIcon size={34} />
                  </div>

                  <div>
                    <div className="mb-1 inline-flex rounded-full bg-[#1E3A43] px-3 py-1 text-[11px] font-black tracking-[1.5px] text-[#48BFF2]">
                      INVITE &amp; LEARN TOGETHER
                    </div>

                    <h2
                      id="invite-friends-title"
                      className="text-[28px] font-black tracking-tight text-white sm:text-[30px]"
                    >
                      Invite friends
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowInviteFriends(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-2xl font-black text-[#8DA0A6] transition hover:bg-[#20343C] hover:text-white active:scale-95"
                  aria-label="Close invite friends"
                >
                  ×
                </button>
              </div>

              <p className="mt-5 max-w-[470px] text-[17px] font-medium leading-7 text-[#D7E7EA]">
                Share your profile with friends and invite them to learn,
                practice, and reach their goals with you.
              </p>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-7">
              <div className="mb-3 flex items-center justify-between">
                <label
                  htmlFor="invite-profile-link"
                  className="text-[14px] font-black uppercase tracking-wider text-[#AFC1C7]"
                >
                  Your profile link
                </label>

                <span className="rounded-full bg-[#17343C] px-3 py-1 text-[11px] font-black text-[#58CC02]">
                  READY TO SHARE
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border-2 border-[#3B555E] bg-[#0B1B20] p-2 shadow-inner transition focus-within:border-[#48BFF2]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#17343C]">
                  <span className="text-xl">🔗</span>
                </div>

                <div
                  id="invite-profile-link"
                  className="min-w-0 flex-1 overflow-hidden px-1"
                >
                  <p className="truncate text-[15px] font-extrabold text-[#E8F3F5] sm:text-[16px]">
                    {inviteUrl}
                  </p>
                  <p className="mt-0.5 text-[12px] font-bold text-[#60777F]">
                    Friends can open this link to visit your profile.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(inviteUrl);
                    setCopiedInvite(true);

                    window.setTimeout(
                      () => setCopiedInvite(false),
                      2200,
                    );
                  } catch {
                    setCopiedInvite(false);
                  }
                }}
                className={`mt-5 flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-[17px] font-black shadow-[0_4px_0_#B88900] transition-all active:translate-y-1 active:shadow-none ${
                  copiedInvite
                    ? "bg-[#58CC02] text-white shadow-[0_4px_0_#46A302]"
                    : "bg-[#FFC800] text-[#102027] hover:bg-[#FFD633]"
                }`}
              >
                <span className="text-xl">{copiedInvite ? "✓" : "📋"}</span>
                <span>
                  {copiedInvite ? "LINK COPIED!" : "COPY INVITE LINK"}
                </span>
              </button>

              {copiedInvite && (
                <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#173A24] px-4 py-3 text-sm font-extrabold text-[#8FEA62]">
                  <span>✓</span>
                  Invite link copied to your clipboard
                </div>
              )}

              <div className="mt-6 rounded-2xl border border-[#2E454D] bg-[#162D34] px-4 py-3 text-center">
                <p className="text-[13px] font-bold leading-5 text-[#8DA0A6]">
                  Learning with friends makes progress more fun. Send this
                  link to someone you want to learn with.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCopiedInvite(false);
                  setShowInviteFriends(false);
                }}
                className="mt-4 w-full rounded-2xl border-2 border-[#38515A] bg-transparent px-5 py-3.5 text-[16px] font-black text-white transition hover:border-[#4B6872] hover:bg-[#1A3037] active:scale-[0.99]"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {showAchievements && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-5"
          onClick={() => setShowAchievements(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-[700px] overflow-y-auto rounded-3xl border-2 border-[#344850] bg-[#12262C] p-7 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">
                All achievements
              </h2>

              <button
                type="button"
                onClick={() => setShowAchievements(false)}
                className="rounded-xl px-3 py-2 text-xl font-black text-[#8DA0A6] hover:bg-[#20343C] hover:text-white"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border-2 border-[#344850]">
              <AchievementCard
                title="Wildfire"
                description="Reach a 3 day streak"
                current={wildfireProgress}
                target={3}
                bg="#FF4B4B"
                icon={<FlameIcon size={42} />}
              />

              <AchievementCard
                title="Sage"
                description="Earn 100 XP"
                current={sageProgress}
                target={100}
                bg="#78D500"
                icon={<span className="text-4xl">🧙</span>}
              />

              <AchievementCard
                title="Champion"
                description="Complete 10 lessons"
                current={championProgress}
                target={10}
                bg="#C77DFF"
                icon={<TrophyIcon size={42} />}
              />
            </div>

            <button
              type="button"
              onClick={() => setShowAchievements(false)}
              className="mt-6 w-full rounded-2xl bg-[#58CC02] px-5 py-4 text-lg font-black text-white"
            >
              DONE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

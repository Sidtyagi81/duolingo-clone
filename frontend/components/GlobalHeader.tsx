"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  getActiveUser,
  updateActiveUser,
} from "@/lib/userState";
import { getStreak } from "@/lib/api";

/* =========================================================
   TYPES
   ========================================================= */

type UserStats = {
  streak: number;
  gems: number;
  hearts: number;
};

type PopupType =
  | "course"
  | "streak"
  | "gems"
  | "hearts"
  | null;

/* =========================================================
   SPANISH FLAG
   ========================================================= */

function FlagIcon() {
  return (
    <div
      className="
        flex
        h-12
        w-12
        items-center
        justify-center
        overflow-hidden
        rounded-[12px]
        bg-white
        shadow-sm
      "
      aria-label="Spanish"
    >
      <svg
        viewBox="0 0 60 40"
        className="h-[34px] w-[44px]"
        aria-hidden="true"
      >
        <rect width="60" height="40" fill="#AA151B" />
        <rect y="10" width="60" height="20" fill="#F1BF00" />

        {/* simplified coat of arms */}
        <g transform="translate(25 12) scale(.28)">
          <path
            d="M0 0h35v34c0 12-8 19-17.5 23C6 53 0 46 0 34V0Z"
            fill="#C60B1E"
          />

          <path
            d="M4 4h27v29c0 8-5 13-13.5 17C9 46 4 41 4 33V4Z"
            fill="#F1BF00"
          />

          <path
            d="M17.5 4v38M4 18h27"
            stroke="#AA151B"
            strokeWidth="3"
          />

          <circle
            cx="17.5"
            cy="18"
            r="5"
            fill="#AA151B"
          />
        </g>
      </svg>
    </div>
  );
}

/* =========================================================
   FLAME ICON
   ========================================================= */

function FlameIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      className="h-9 w-9"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M21 4c2 8-2 11-5.5 14.5C12.5 21.5 10 25 10 29c0 5.5 4.3 9.5 9.7 9.5 6.1 0 10.8-4.7 10.8-11 0-7-5.1-13.1-9.5-23.5Z"
        fill="currentColor"
      />

      <path
        d="M19.5 20c2.5 2.5 4.4 5.2 4.4 8 0 2.4-1.5 4.3-3.8 4.3-2.5 0-4.2-1.9-4.2-4.4 0-2.5 1.5-5 3.6-7.9Z"
        fill="#101D22"
        opacity=".25"
      />
    </svg>
  );
}

/* =========================================================
   GEM ICON
   ========================================================= */

function GemIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      className="h-9 w-9"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 2.8 32.4 12 27.7 35H12.3L7.6 12 20 2.8Z"
        fill="#20B8F0"
        stroke="#D9F8FF"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />

      <path
        d="M7.6 12h24.8M20 3v32M12.3 35 7.6 12M27.7 35 32.4 12"
        stroke="#8DE9FF"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* =========================================================
   HEART ICON
   ========================================================= */

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      className="h-9 w-9"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 34S5.5 25.8 5.5 15.1C5.5 10.1 9.1 6.5 13.7 6.5c2.9 0 5.3 1.6 6.3 4 1.1-2.4 3.5-4 6.4-4 4.6 0 8.1 3.6 8.1 8.6C34.5 25.8 20 34 20 34Z"
        fill="#FF4B55"
        stroke="#FF8188"
        strokeWidth="2"
      />

      <path
        d="M11 12.5c1.2-2 3.2-3 5-2.8"
        stroke="#FF9B9F"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   PORTAL
   ========================================================= */

function HeaderPortal({
  children,
}: {
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(children, document.body);
}

/* =========================================================
   POPUP
   ========================================================= */

function Popup({
  children,
  close,
}: {
  children: ReactNode;
  close: () => void;
}) {
  return (
    <HeaderPortal>
      <>
        <button
          type="button"
          aria-label="Close popup"
          onClick={close}
          className="
            fixed
            inset-0
            z-[9990]
            cursor-default
            bg-transparent
          "
        />

        <div className="relative z-[10000] pointer-events-auto">
          {children}
        </div>
      </>
    </HeaderPortal>
  );
}

/* =========================================================
   COURSE POPUP
   ========================================================= */

function CoursePopup({
  close,
}: {
  close: () => void;
}) {
  return (
    <Popup close={close}>
      <div
        onClick={(event) => event.stopPropagation()}
        className="
          fixed
          right-4
          top-[94px]
          w-[min(365px,calc(100vw-32px))]
          overflow-hidden
          rounded-[25px]
          border-[3px]
          border-[#344A53]
          bg-[#101F25]
          shadow-[0_15px_40px_rgba(0,0,0,.55)]
        "
      >
        <div
          className="
            absolute
            -top-[11px]
            right-[165px]
            h-5
            w-5
            rotate-45
            border-l-[3px]
            border-t-[3px]
            border-[#344A53]
            bg-[#101F25]
          "
        />

        <div className="border-b-2 border-[#344A53] px-8 py-6">
          <div className="text-[20px] font-black text-[#637981]">
            MY COURSES
          </div>
        </div>

        <Link
          href="/"
          onClick={close}
          className="
            flex
            h-[88px]
            items-center
            gap-7
            border-b-2
            border-[#344A53]
            bg-[#20343C]
            px-7
            hover:bg-[#263D46]
          "
        >
          <FlagIcon />

          <span className="text-[23px] font-black text-[#35BDF5]">
            Spanish
          </span>
        </Link>

        <Link
          href="/courses"
          onClick={close}
          className="
            flex
            h-[84px]
            items-center
            gap-7
            bg-[#101F25]
            px-7
            hover:bg-[#172A31]
          "
        >
          <span
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-lg
              border-[3px]
              border-[#536B74]
              text-[31px]
              text-[#71868E]
            "
          >
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
   CURRENT WEEK
   ========================================================= */

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function getTodayWeekIndex() {
  // Monday = 0, Tuesday = 1, ... Sunday = 6.
  return (new Date().getDay() + 6) % 7;
}

function WeekStreakBar({ streak }: { streak: number }) {
  const todayIndex = getTodayWeekIndex();

  return (
    <div className="mt-8 rounded-[18px] bg-[#101F25] p-6">
      <div className="grid grid-cols-7 text-center font-black">
        {WEEKDAY_LABELS.map((label, index) => {
          const isToday = index === todayIndex;
          const isPast = index < todayIndex;

          return (
            <span
              key={`${label}-${index}`}
              title={isToday ? "Today" : isPast ? "Past day" : "Upcoming day"}
              className={
                isToday
                  ? "text-[#FFB12C]"
                  : isPast && streak > 0
                    ? "text-[#657C85]"
                    : "text-[#61777F]"
              }
            >
              {label}
            </span>
          );
        })}
      </div>

      <div className="relative mt-6 h-3 overflow-hidden rounded-full bg-[#3C5059]">
        <div
          className="h-full rounded-full bg-[#FFB12C] transition-all duration-500"
          style={{
            width: `${((todayIndex + 1) / 7) * 100}%`,
          }}
        />
      </div>

      <div className="mt-3 grid grid-cols-7 text-center text-[11px] font-bold text-[#61777F]">
        {WEEKDAY_LABELS.map((label, index) => (
          <span key={`today-${label}-${index}`}>
            {index === todayIndex ? "Today" : ""}
          </span>
        ))}
      </div>
    </div>
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
    <Popup close={close}>
      <div
        onClick={(event) => event.stopPropagation()}
        className="
          fixed
          right-4
          top-[94px]
          w-[min(470px,calc(100vw-32px))]
          overflow-hidden
          rounded-[25px]
          border-[3px]
          border-[#344A53]
          bg-[#20343C]
          shadow-[0_15px_40px_rgba(0,0,0,.55)]
        "
      >
        <div
          className="
            absolute
            -top-[11px]
            right-[220px]
            h-5
            w-5
            rotate-45
            border-l-[3px]
            border-t-[3px]
            border-[#344A53]
            bg-[#20343C]
          "
        />

        <div className="p-8">
          <h2 className="text-[32px] font-black text-[#657C85]">
            {streak} day streak
          </h2>

          <p className="mt-5 text-[22px] font-bold leading-relaxed text-[#E1EAED]">
            {streak === 0
              ? "Do a lesson today to start a new streak!"
              : "Keep learning today to keep your streak alive!"}
          </p>

          <WeekStreakBar streak={streak} />
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
    <Popup close={close}>
      <div
        onClick={(event) => event.stopPropagation()}
        className="
          fixed
          right-4
          top-[94px]
          w-[min(575px,calc(100vw-32px))]
          overflow-hidden
          rounded-[25px]
          border-[3px]
          border-[#344A53]
          bg-[#101F25]
          shadow-[0_15px_40px_rgba(0,0,0,.55)]
        "
      >
        <div
          className="
            absolute
            -top-[11px]
            right-[205px]
            h-5
            w-5
            rotate-45
            border-l-[3px]
            border-t-[3px]
            border-[#344A53]
            bg-[#101F25]
          "
        />

        <div className="flex items-center gap-8 p-8">
          <div
            className="
              flex
              h-[125px]
              w-[125px]
              items-center
              justify-center
              rounded-2xl
              bg-[#182C33]
              text-[72px]
            "
          >
            💎
          </div>

          <div>
            <h2 className="text-[31px] font-black text-white">
              Gems
            </h2>

            <p className="mt-2 text-[22px] font-semibold text-[#DCE6EA]">
              You have {gems} gems
            </p>

            <Link
              href="/shop"
              onClick={close}
              className="
                mt-5
                inline-block
                text-[19px]
                font-black
                text-[#35BDF5]
                hover:underline
              "
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
    <Popup close={close}>
      <div
        onClick={(event) => event.stopPropagation()}
        className="
          fixed
          right-4
          top-[94px]
          w-[min(575px,calc(100vw-32px))]
          overflow-hidden
          rounded-[25px]
          border-[3px]
          border-[#344A53]
          bg-[#101F25]
          shadow-[0_15px_40px_rgba(0,0,0,.55)]
        "
      >
        <div
          className="
            absolute
            -top-[11px]
            right-[68px]
            h-5
            w-5
            rotate-45
            border-l-[3px]
            border-t-[3px]
            border-[#344A53]
            bg-[#101F25]
          "
        />

        <div className="p-8 text-center">
          <h2 className="text-[32px] font-black text-white">
            Hearts
          </h2>

          <div className="mt-7 flex justify-center gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={
                  index < hearts
                    ? "opacity-100"
                    : "opacity-25"
                }
              >
                <HeartIcon />
              </div>
            ))}
          </div>

          <h3 className="mt-7 text-[25px] font-black text-white">
            {hearts >= 5
              ? "You have full hearts"
              : `${hearts} hearts remaining`}
          </h3>

          <p className="mt-2 text-[21px] font-semibold text-[#C8D5DA]">
            Keep on learning
          </p>

          <Link
            href="/shop"
            onClick={close}
            className="
              mt-7
              flex
              h-[76px]
              items-center
              justify-between
              rounded-[20px]
              border-[3px]
              border-[#344A53]
              px-7
              hover:bg-[#172A31]
            "
          >
            <span className="flex items-center gap-5 text-[19px] font-black text-white">
              <span className="text-3xl">♾️</span>
              UNLIMITED HEARTS
            </span>

            <span className="text-[19px] font-black text-[#E73DD7]">
              FREE TRIAL
            </span>
          </Link>

          <Link
            href="/shop"
            onClick={close}
            className="
              mt-4
              flex
              h-[76px]
              items-center
              justify-between
              rounded-[20px]
              border-[3px]
              border-[#344A53]
              px-7
              hover:bg-[#172A31]
            "
          >
            <span className="flex items-center gap-5 text-[19px] font-black text-white">
              <span className="text-3xl">♡</span>
              REFILL HEARTS
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
   GLOBAL HEADER
   ========================================================= */

export default function GlobalHeader() {
  const [stats, setStats] = useState<UserStats>({
    streak: 1,
    gems: 100,
    hearts: 5,
  });

  const [activeUserName, setActiveUserName] = useState("");
  const [activeUserEmail, setActiveUserEmail] = useState("");

  const [popup, setPopup] =
    useState<PopupType>(null);

  /* =======================================================
     LOAD STATS FROM CURRENT LOGGED-IN USER
     ======================================================= */

  async function loadStats() {
    const user = getActiveUser();

    /*
     * DEMO MODE
     * ---------------------------------------------------------
     * The backend demo account is user ID 1 and
     * /activity/1/streak returns streak = 1.
     *
     * Do NOT stop when localStorage has no active user.
     * The deployed demo must still show the backend demo streak.
     */
    const DEMO_BACKEND_USER_ID = 1;

    if (!user) {
      setActiveUserName("Learner");
      setActiveUserEmail("");

      // Show the verified demo streak immediately.
      setStats({
        streak: 1,
        gems: 100,
        hearts: 5,
      });

      try {
        const streakResponse = await getStreak(DEMO_BACKEND_USER_ID);

        const backendStreak =
          typeof streakResponse === "number"
            ? Number(streakResponse)
            : Number(
                (streakResponse as {
                  streak?: number;
                  current_streak?: number;
                  days?: number;
                } | null)?.streak ??
                  (streakResponse as {
                    current_streak?: number;
                  } | null)?.current_streak ??
                  (streakResponse as {
                    days?: number;
                  } | null)?.days ??
                  0
              );

        const finalStreak =
          Number.isFinite(backendStreak) && backendStreak > 0
            ? backendStreak
            : 1;

        setStats((previous) => ({
          ...previous,
          streak: finalStreak,
        }));
      } catch (error) {
        console.warn(
          "Demo streak request failed; keeping streak at 1:",
          error
        );
        setStats((previous) => ({
          ...previous,
          streak: Math.max(1, previous.streak),
        }));
      }

      return;
    }

    setActiveUserName(user.name?.trim() || "Learner");
    setActiveUserEmail(user.email?.trim() || "");

    /*
     * DEMO ACCOUNT
     * ---------------------------------------------------------
     * The lesson API and the working backend streak endpoint
     * are using backend user ID 1.
     *
     * /activity/1/streak currently returns:
     * { "user_id": 1, "streak": 1 }
     *
     * Therefore the header must use the same backend user.
     */
    // Show local values immediately, but never let an existing
    // logged-in demo account display a zero-day streak.
    const localStreak = Number(user.streak ?? 0);
    const initialStreak = Math.max(1, localStreak);

    setStats({
      streak: initialStreak,
      gems: Number(user.gems ?? 100),
      hearts: Number(user.hearts ?? 5),
    });

    // Persist the initial demo streak immediately.
    if (localStreak < 1) {
      updateActiveUser({
        streak: 1,
      });
    }

    /*
     * Refresh from the SAME backend user used by submitAnswer().
     *
     * Important:
     * - Backend user 1 is the working demo account.
     * - A stale/empty backend response must never make the
     *   already-visible streak fall back to 0.
     */
    try {
      const streakResponse = await getStreak(DEMO_BACKEND_USER_ID);

      let backendStreak = 0;

      if (typeof streakResponse === "number") {
        backendStreak = Number(streakResponse);
      } else if (
        streakResponse &&
        typeof streakResponse === "object"
      ) {
        const response = streakResponse as {
          streak?: number;
          current_streak?: number;
          days?: number;
        };

        backendStreak = Number(
          response.streak ??
            response.current_streak ??
            response.days ??
            0
        );
      }

      if (!Number.isFinite(backendStreak) || backendStreak < 0) {
        backendStreak = 0;
      }

      /*
       * For this demo, a logged-in user who has opened the app
       * has a minimum visible streak of 1.
       *
       * This also protects the UI if Vercel temporarily returns
       * a stale SQLite value of 0.
       */
      const finalStreak = Math.max(
        1,
        localStreak,
        backendStreak
      );

      setStats((previous) => ({
        ...previous,
        streak: finalStreak,
      }));

      updateActiveUser({
        streak: finalStreak,
      });
    } catch (error) {
      // Keep the local/demo streak visible if the backend request fails.
      console.warn(
        "Could not refresh streak from backend. Keeping local streak:",
        error
      );

      setStats((previous) => ({
        ...previous,
        streak: Math.max(1, previous.streak),
      }));

      updateActiveUser({
        streak: Math.max(1, localStreak),
      });
    }
  }

  /* =======================================================
     INITIAL LOAD + GLOBAL REFRESH
     ======================================================= */

  useEffect(() => {
    function handleRefreshStats() {
      loadStats();
    }

    function handleStatsUpdated(event: Event) {
      const customEvent =
        event as CustomEvent<{
          hearts?: number;
          gems?: number;
          streak?: number;
        }>;

      const detail = customEvent.detail;

      if (!detail) return;

      setStats((previous) => {
        const incomingStreak =
          detail.streak !== undefined
            ? Number(detail.streak)
            : previous.streak;

        const nextStreak = Number.isFinite(incomingStreak)
          ? Math.max(1, incomingStreak)
          : Math.max(1, previous.streak);

        const nextGems =
          detail.gems !== undefined
            ? Number(detail.gems)
            : previous.gems;

        const nextHearts =
          detail.hearts !== undefined
            ? Number(detail.hearts)
            : previous.hearts;

        /*
         * Save the new streak immediately.
         * Do NOT call loadStats() here because an old backend value
         * could overwrite the freshly earned streak.
         */
        if (
          Number.isFinite(nextStreak) &&
          nextStreak >= 0
        ) {
          const currentUser = getActiveUser();

          if (
            currentUser &&
            Number(currentUser.streak ?? 0) !== nextStreak
          ) {
            updateActiveUser({
              streak: nextStreak,
            });
          }
        }

        return {
          ...previous,
          hearts: nextHearts,
          gems: nextGems,
          streak: nextStreak,
        };
      });
    }

    function handleLogout() {
      setActiveUserName("");
      setActiveUserEmail("");

      setStats({
        streak: 0,
        gems: 100,
        hearts: 5,
      });

      setPopup(null);
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        loadStats();
      }
    }

    function handleFocus() {
      loadStats();
    }

    loadStats();

    window.addEventListener(
      "duolearn:refresh-stats",
      handleRefreshStats
    );

    window.addEventListener(
      "duolearn:stats-updated",
      handleStatsUpdated
    );

    window.addEventListener(
      "duolearn:logout",
      handleLogout
    );

    window.addEventListener(
      "focus",
      handleFocus
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener(
        "duolearn:refresh-stats",
        handleRefreshStats
      );

      window.removeEventListener(
        "duolearn:stats-updated",
        handleStatsUpdated
      );

      window.removeEventListener(
        "duolearn:logout",
        handleLogout
      );

      window.removeEventListener(
        "focus",
        handleFocus
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  /* =======================================================
     ESC CLOSE
     ======================================================= */

  useEffect(() => {
    function handleEscape(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setPopup(null);
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /* =======================================================
     CLOSE POPUP ON BROWSER BACK/FORWARD
     ======================================================= */

  useEffect(() => {
    function handleRouteChange() {
      setPopup(null);
    }

    window.addEventListener(
      "popstate",
      handleRouteChange
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handleRouteChange
      );
    };
  }, []);

  /* =======================================================
     POPUP TOGGLE
     ======================================================= */

  function togglePopup(
    type: Exclude<PopupType, null>
  ) {
    setPopup((current) =>
      current === type ? null : type
    );
  }

  function closePopup() {
    setPopup(null);
  }

  /* =======================================================
     HEADER
     ======================================================= */

  return (
    <>
      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-[9000]
          h-[82px]
          border-b-2
          border-[#2D4149]
          bg-[#101D22]
        "
      >
        <div
          className="
            mx-auto
            flex
            h-full
            w-full
            max-w-[1600px]
            items-center
            justify-end
            px-3
            sm:px-5
            md:px-7
          "
        >
          <div
            className="
              flex
              h-full
              items-center
              gap-1
              sm:gap-2
              md:gap-3
            "
          >
            {/* =================================================
                COURSE
            ================================================= */}

            <button
              type="button"
              aria-label="Open courses"
              aria-expanded={
                popup === "course"
              }
              onClick={() =>
                togglePopup("course")
              }
              className={`
                flex
                h-[62px]
                min-w-[58px]
                items-center
                justify-center
                rounded-[15px]
                px-2
                transition
                ${
                  popup === "course"
                    ? "bg-[#20333B]"
                    : "hover:bg-[#172A31]"
                }
              `}
            >
              <FlagIcon />
            </button>

            {/* =================================================
                STREAK
            ================================================= */}

            <button
              type="button"
              aria-label="Open streak"
              aria-expanded={
                popup === "streak"
              }
              onClick={() =>
                togglePopup("streak")
              }
              className={`
                flex
                h-[62px]
                min-w-[68px]
                items-center
                justify-center
                gap-1
                rounded-[15px]
                px-2
                transition
                ${
                  popup === "streak"
                    ? "bg-[#20333B]"
                    : "hover:bg-[#172A31]"
                }
              `}
            >
              <span className="text-[#50646C]">
                <FlameIcon />
              </span>

              <span
                className="
                  text-[17px]
                  font-black
                  text-[#657A82]
                  sm:text-[19px]
                "
              >
                {stats.streak}
              </span>
            </button>

            {/* =================================================
                GEMS
            ================================================= */}

            <button
              type="button"
              aria-label="Open gems"
              aria-expanded={
                popup === "gems"
              }
              onClick={() =>
                togglePopup("gems")
              }
              className={`
                flex
                h-[62px]
                min-w-[82px]
                items-center
                justify-center
                gap-1
                rounded-[15px]
                px-2
                transition
                ${
                  popup === "gems"
                    ? "bg-[#20333B]"
                    : "hover:bg-[#172A31]"
                }
              `}
            >
              <GemIcon />

              <span
                className="
                  text-[17px]
                  font-black
                  text-[#35BDF5]
                  sm:text-[19px]
                "
              >
                {stats.gems}
              </span>
            </button>

            {/* =================================================
                HEARTS
            ================================================= */}

            <button
              type="button"
              aria-label="Open hearts"
              aria-expanded={
                popup === "hearts"
              }
              onClick={() =>
                togglePopup("hearts")
              }
              className={`
                flex
                h-[62px]
                min-w-[76px]
                items-center
                justify-center
                gap-1
                rounded-[15px]
                px-2
                transition
                ${
                  popup === "hearts"
                    ? "bg-[#20333B]"
                    : "hover:bg-[#172A31]"
                }
              `}
            >
              <HeartIcon />

              <span
                className="
                  text-[17px]
                  font-black
                  text-[#FF5B62]
                  sm:text-[19px]
                "
              >
                {stats.hearts}
              </span>
            </button>

            {/* =================================================
                LOGGED-IN PROFILE
            ================================================= */}

            

                
              
            
          </div>
        </div>
      </header>

      {/* =====================================================
          POPUPS
      ===================================================== */}

      {popup === "course" && (
        <CoursePopup
          close={closePopup}
        />
      )}

      {popup === "streak" && (
        <StreakPopup
          streak={stats.streak}
          close={closePopup}
        />
      )}

      {popup === "gems" && (
        <GemsPopup
          gems={stats.gems}
          close={closePopup}
        />
      )}

      {popup === "hearts" && (
        <HeartsPopup
          hearts={stats.hearts}
          close={closePopup}
        />
      )}
    </>
  );
}

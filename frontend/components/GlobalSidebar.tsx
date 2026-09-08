"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/* =========================================================
   ICONS
========================================================= */

function HomeIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M4.5 14.5 16 5l11.5 9.5V27h-7v-8h-9v8h-7V14.5Z"
        fill="#FFD800"
        stroke="#FF4B4B"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 19h9v8h-9v-8Z"
        fill="#FF9600"
      />
      <path
        d="M8 12.5 16 6l8 6.5"
        stroke="#FF4B4B"
        strokeWidth="2"
      />
    </svg>
  );
}

function SoundIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M4.5 13h5.5l6-5v16l-6-5H4.5v-6Z"
        fill="#F48A78"
        stroke="#FFC0B5"
        strokeWidth="1.8"
      />

      <path
        d="M20 11c2.5 2.5 2.5 7.5 0 10M23.5 8c4.5 4.5 4.5 11.5 0 16"
        stroke="#F48A78"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrophyIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M9 5h14v8c0 5-3 8-7 8s-7-3-7-8V5Z"
        fill="#FFD900"
      />

      <path
        d="M9 8H5v3c0 4 2.5 6 6 6M23 8h4v3c0 4-2.5 6-6 6"
        stroke="#F2B500"
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

function QuestIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect
        x="5"
        y="8"
        width="22"
        height="19"
        rx="3"
        fill="#FFD329"
      />

      <rect
        x="10"
        y="4"
        width="12"
        height="6"
        rx="2"
        fill="#FFB300"
      />

      <path
        d="M11 15h10M11 20h7"
        stroke="#D79D00"
        strokeWidth="2"
      />
    </svg>
  );
}

function ShopIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M4 12h24v15H4V12Z"
        fill="#FF4B57"
      />

      <path
        d="M3 12 7 5h18l4 7H3Z"
        fill="#FF9C21"
      />

      <path
        d="M4 12h24M10 18v9M22 18v9"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
}

function ProfileIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle
        cx="20"
        cy="20"
        r="17"
        fill="#8ED044"
      />

      <circle
        cx="20"
        cy="17"
        r="7"
        fill="#5A3C35"
      />

      <path
        d="M10 34c2-8 18-8 20 0"
        fill="#B77CD4"
      />

      <circle
        cx="18"
        cy="16"
        r="2.2"
        fill="#F7C6A7"
      />

      <circle
        cx="22"
        cy="16"
        r="2.2"
        fill="#F7C6A7"
      />
    </svg>
  );
}

function MoreIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle
        cx="16"
        cy="16"
        r="13"
        fill="#C56EF1"
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

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        group
        flex
        min-h-[72px]
        items-center
        gap-5
        rounded-[18px]
        border-2
        px-5
        transition-all
        duration-150
        ${
          active
            ? "border-[#35BDF5] bg-[#20343C]"
            : "border-transparent hover:bg-[#192C33]"
        }
      `}
    >
      <div className="flex w-9 shrink-0 items-center justify-center">
        {icon}
      </div>

      <span
        className={`
          text-[17px]
          font-black
          tracking-wide
          ${
            active
              ? "text-[#35BDF5]"
              : "text-[#EAF2F4]"
          }
        `}
      >
        {label}
      </span>
    </Link>
  );
}

/* =========================================================
   GLOBAL SIDEBAR
========================================================= */

export default function GlobalSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  return (
    <>
      {/* =====================================================
          DESKTOP GLOBAL SIDEBAR
      ===================================================== */}

      <aside
        className="
          fixed
          left-0
          top-[100px]
          z-[9000]
          hidden
          h-[calc(100vh-100px)]
          w-[340px]
          overflow-y-auto
          border-r-2
          border-[#31434A]
          bg-[#101F24]
          xl:block
        "
      >
        <div className="flex min-h-full flex-col px-5">

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            href="/"
            className="
              mb-8
              block
              px-5
              pt-7
              text-[39px]
              font-black
              leading-none
              tracking-[-2px]
              text-[#58CC02]
              transition
              hover:brightness-110
            "
          >
            duolingo
          </Link>

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <nav className="space-y-2">

            <SidebarItem
              href="/"
              label="LEARN"
              active={isActive("/")}
              icon={<HomeIcon />}
            />

            <SidebarItem
              href="/sounds"
              label="SOUNDS"
              active={isActive("/sounds")}
              icon={<SoundIcon />}
            />

            <SidebarItem
              href="/leaderboard"
              label="LEADERBOARDS"
              active={isActive("/leaderboard")}
              icon={<TrophyIcon />}
            />

            <SidebarItem
              href="/quests"
              label="QUESTS"
              active={isActive("/quests")}
              icon={<QuestIcon />}
            />

            <SidebarItem
              href="/shop"
              label="SHOP"
              active={isActive("/shop")}
              icon={<ShopIcon />}
            />

            <SidebarItem
              href="/profile"
              label="PROFILE"
              active={isActive("/profile")}
              icon={<ProfileIcon />}
            />

            <SidebarItem
              href="/settings"
              label="MORE"
              active={isActive("/settings")}
              icon={<MoreIcon />}
            />

          </nav>

          {/* =================================================
              BOTTOM ASSISTANT BUTTON
          ================================================= */}

          

        </div>
      </aside>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ===================================================== */}

      <nav
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-[9500]
          flex
          h-[76px]
          items-center
          justify-around
          border-t-2
          border-[#31434A]
          bg-[#101F24]
          xl:hidden
        "
      >
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 ${
            isActive("/")
              ? "text-[#35BDF5]"
              : "text-white"
          }`}
        >
          <HomeIcon size={27} />

          <span className="text-[10px] font-black">
            LEARN
          </span>
        </Link>

        <Link
          href="/sounds"
          className={`flex flex-col items-center gap-1 ${
            isActive("/sounds")
              ? "text-[#35BDF5]"
              : "text-white"
          }`}
        >
          <SoundIcon size={27} />

          <span className="text-[10px] font-black">
            SOUNDS
          </span>
        </Link>

        <Link
          href="/leaderboard"
          className={`flex flex-col items-center gap-1 ${
            isActive("/leaderboard")
              ? "text-[#35BDF5]"
              : "text-white"
          }`}
        >
          <TrophyIcon size={27} />

          <span className="text-[10px] font-black">
            LEAGUE
          </span>
        </Link>

        <Link
          href="/quests"
          className={`flex flex-col items-center gap-1 ${
            isActive("/quests")
              ? "text-[#35BDF5]"
              : "text-white"
          }`}
        >
          <QuestIcon size={27} />

          <span className="text-[10px] font-black">
            QUESTS
          </span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center gap-1 ${
            isActive("/profile")
              ? "text-[#35BDF5]"
              : "text-white"
          }`}
        >
          <ProfileIcon size={29} />

          <span className="text-[10px] font-black">
            PROFILE
          </span>
        </Link>
      </nav>
    </>
  );
}
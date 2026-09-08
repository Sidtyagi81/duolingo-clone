"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCourse } from "@/lib/api";
import {
  getActiveUser,
  saveCurrentLesson,
} from "@/lib/userState";

type UserStats = {
  total_xp?: number;
  daily_xp?: number;
  streak?: number;
  hearts?: number;
  gems?: number;
};








function FlameIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 29c6.5 0 11-4.5 11-10.5 0-5-3.5-9-7.5-12C19.5 10 17.5 12 15.5 13.5 15 9 12 5 8 3c1 6-3 9-3 15.5C5 24.5 9.5 29 16 29Z"
        fill="#465A62"
      />
      <path
        d="M16 25c3 0 5-2 5-4.5 0-2-1.5-3.5-3.5-5-.1 2.5-1.5 3.5-2.5 4-.5-2-2-3.5-3.5-4.5 0 2-.5 3.5-.5 5 0 2.5 2 4.5 5 4.5Z"
        fill="#62757C"
      />
    </svg>
  );
}

function GemIcon({ size = 35 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <path
        d="m18 3 11 7-4.5 18L18 32l-6.5-4L7 10l11-7Z"
        fill="#1CB0F6"
        stroke="#91DDFF"
        strokeWidth="2"
      />
      <path d="m12.5 11 5.5-5 5.5 5-3.5 14-2 3-2-3-3.5-14Z" fill="#7DDBFF" />
    </svg>
  );
}

function HeartIcon({ size = 35 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <path
        d="M18 31C15.5 28.5 6 22 6 14c0-4.5 3.5-8 8-8 2 0 3.5 1 4 2.5C18.5 7 20 6 22 6c4.5 0 8 3.5 8 8 0 8-9.5 14.5-12 17Z"
        fill="#FF4B4B"
        stroke="#FF8A8A"
        strokeWidth="2"
      />
    </svg>
  );
}

function GuidebookIcon({ size = 33 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="9" y="5" width="23" height="30" rx="4" fill="white" />
      <path
        d="M16 12h11M16 18h11M16 24h7"
        stroke="#D65DEB"
        strokeWidth="2.7"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1.7" fill="#D65DEB" />
      <circle cx="12" cy="18" r="1.7" fill="#D65DEB" />
      <circle cx="12" cy="24" r="1.7" fill="#D65DEB" />
    </svg>
  );
}

function BookNode({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M6 8c6-2 11 .2 14 3v23c-3-2.7-8-4.2-14-2V8Z"
        fill="#81949D"
      />
      <path
        d="M34 8c-6-2-11 .2-14 3v23c3-2.7 8-4.2 14-2V8Z"
        fill="#9BADB4"
      />
      <path d="M20 11v23" stroke="#536870" strokeWidth="2" />
    </svg>
  );
}

function StarNode({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="m20 5 4.4 9 9.9 1.4-7.2 7 1.7 9.8-8.8-4.6-8.8 4.6 1.7-9.8-7.2-7 9.9-1.4L20 5Z"
        fill="#81949D"
      />
    </svg>
  );
}

function ChestNode({ size = 46 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <rect x="8" y="17" width="36" height="27" rx="4" fill="#667B84" />
      <path d="M6 20 10 10h32l4 10H6Z" fill="#80949D" />
      <path d="M10 10h32v7H10z" fill="#91A4AC" />
      <path d="M24 28h4v8h-4z" fill="#435860" />
      <circle cx="26" cy="30" r="4" fill="#445960" />
      <path d="M17 25h18" stroke="#435860" strokeWidth="2" />
    </svg>
  );
}

function HeadphonesNode({ size = 42 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <path d="M9 24a13 13 0 0 1 26 0" stroke="#81949D" strokeWidth="5" strokeLinecap="round" />
      <rect x="6" y="22" width="9" height="13" rx="4" fill="#81949D" />
      <rect x="29" y="22" width="9" height="13" rx="4" fill="#81949D" />
    </svg>
  );
}

function DumbbellNode({ size = 42 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <path d="M11 15v14M6 18v8M15 19h14M33 15v14M38 18v8" stroke="#81949D" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function CupNode({ size = 42 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <path d="M11 9h22v10c0 8-4.5 12-11 12S11 27 11 19V9Z" fill="#81949D" />
      <path d="M11 13H6v4c0 5 3 7 7 7M33 13h5v4c0 5-3 7-7 7" stroke="#81949D" strokeWidth="4" strokeLinecap="round" />
      <path d="M22 31v6M15 38h14" stroke="#81949D" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function ArrowUp({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M20 31V9m0 0-8 8m8-8 8 8"
        stroke="#31C7FF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockBadge({ size = 58 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 58 58" fill="none">
      <path
        d="M29 4 47 11v14c0 13-8.5 22-18 28-9.5-6-18-15-18-28V11L29 4Z"
        fill="#E4EEF4"
        stroke="#B9CBD5"
        strokeWidth="3"
      />
      <rect x="20" y="25" width="18" height="15" rx="4" fill="#9AAEB9" />
      <path d="M23 25v-4a6 6 0 0 1 12 0v4" stroke="#9AAEB9" strokeWidth="4" strokeLinecap="round" />
      <circle cx="29" cy="32" r="2" fill="#DDE8ED" />
    </svg>
  );
}

function LightningIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <path
        d="M30 4 12 28h11l-3 20 20-28H29l1-16Z"
        fill="#FFD900"
        stroke="#F6C900"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QuestChest({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <path d="M8 19h36v26H8V19Z" fill="#D99463" />
      <path d="m7 19 5-9h28l5 9H7Z" fill="#F0B47F" />
      <rect x="20" y="25" width="12" height="10" rx="3" fill="#9D6040" />
      <path d="M17 13h18" stroke="#F9D1AE" strokeWidth="3" />
    </svg>
  );
}


const UNIT_COLORS = [
  "from-[#B84BEA] to-[#D85CEB]",
  "from-[#59E500] to-[#52D900]",
  "from-[#FF9B00] to-[#F28700]",
  "from-[#4BC6FF] to-[#2C9EEA]",
  "from-[#A56BFF] to-[#7C48DA]",
];

const LESSON_ICONS = [
  <BookNode key="book" />,
  <StarNode key="star" />,
  <HeadphonesNode key="headphones" />,
  <DumbbellNode key="dumbbell" />,
  <CupNode key="cup" />,
];

export default function Home() {
  const [course, setCourse] = useState<any>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [savedCurrentLesson, setSavedCurrentLesson] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dailyGoal, setDailyGoal] = useState(20);
  const [superOpen, setSuperOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const activeUser = getActiveUser();

        if (!activeUser) {
          window.location.href = "/login";
          return;
        }

        if (!mounted) return;

        setSavedCurrentLesson(Number(activeUser.currentLesson || 1));

        // Course content is shared, but progress/stats are stored per
        // logged-in local user so every new account starts from lesson 1.
        const courseData = await getCourse(1);

        if (!mounted) return;

        setCourse(courseData);
        setStats({
          total_xp: Number(activeUser.xp || 0),
          daily_xp: Number(activeUser.xp || 0),
          streak: Number(activeUser.streak || 0),
          hearts: Number(activeUser.hearts ?? 5),
          gems: Number(activeUser.gems ?? 100),
        });

      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load your course data.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    const savedGoal = localStorage.getItem("dailyGoal");
    if (savedGoal) {
      const parsed = Number(savedGoal);
      if (Number.isFinite(parsed) && parsed > 0) {
        setDailyGoal(parsed);
      }
    }

    function refreshUser() {
      const activeUser = getActiveUser();
      if (!activeUser) {
        window.location.href = "/login";
        return;
      }

      setSavedCurrentLesson(Number(activeUser.currentLesson || 1));
      setStats({
        total_xp: Number(activeUser.xp || 0),
        daily_xp: Number(activeUser.xp || 0),
        streak: Number(activeUser.streak || 0),
        hearts: Number(activeUser.hearts ?? 5),
        gems: Number(activeUser.gems ?? 100),
      });
    }

    window.addEventListener("duolearn:stats-updated", refreshUser);
    window.addEventListener("focus", refreshUser);

    return () => {
      mounted = false;
      window.removeEventListener("duolearn:stats-updated", refreshUser);
      window.removeEventListener("focus", refreshUser);
    };
  }, []);
  const streak = Number(stats?.streak ?? 0);
  const hearts = Number(stats?.hearts ?? 5);
  const gems = Number(stats?.gems ?? 100);

  const dailyXP = Number(stats?.daily_xp ?? stats?.total_xp ?? 0);
  const dailyPercent =
    dailyGoal > 0 ? Math.min((dailyXP / dailyGoal) * 100, 100) : 0;

  const orderedLessons = useMemo(() => {
    const units = Array.isArray(course?.units) ? course.units.slice(0, 10) : [];

    return units.flatMap((unit: any) =>
      (unit.skills ?? []).flatMap((skill: any) =>
        (Array.isArray(skill.lessons) ? skill.lessons : []).map((lesson: any) => ({
          lesson,
          unitId: unit.id,
          skillId: skill.id,
        }))
      )
    );
  }, [course]);

  // The logged-in user's saved lesson is the source of truth.
  // Lesson 1 is current for a brand-new account. If the user has reached
  // lesson N, lessons before N are considered completed and N is resumable.
  const currentLessonPosition = useMemo(() => {
    if (!orderedLessons.length) return 0;

    const savedId = Number(savedCurrentLesson || 1);
    const exactIndex = orderedLessons.findIndex(
      ({ lesson }: any) => Number(lesson.id) === savedId
    );

    if (exactIndex >= 0) return exactIndex;

    return Math.max(0, Math.min(savedId - 1, orderedLessons.length - 1));
  }, [orderedLessons, savedCurrentLesson]);

  const completedLessonIds = useMemo(() => {
    const ids = new Set<number>();

    orderedLessons.forEach(({ lesson }: any, index: number) => {
      if (index < currentLessonPosition) {
        ids.add(Number(lesson.id));
      }
    });

    return ids;
  }, [orderedLessons, currentLessonPosition]);

  const completedLessons = completedLessonIds.size;
  // Only the first 10 units are shown and used on this Learn page.
  const visibleUnits = useMemo(() => {
    return Array.isArray(course?.units) ? course.units.slice(0, 10) : [];
  }, [course]);

  const totalLessons = useMemo(() => {
    return visibleUnits.reduce((unitSum: number, unit: any) => {
      return (
        unitSum +
        (unit.skills ?? []).reduce(
          (skillSum: number, skill: any) =>
            skillSum + (Array.isArray(skill.lessons) ? skill.lessons.length : 0),
          0
        )
      );
    }, 0);
  }, [visibleUnits]);

  const coursePercent =
    totalLessons > 0
      ? Math.min(Math.round((completedLessons / totalLessons) * 100), 100)
      : 0;


  // Lessons are unlocked strictly in order:
  // Lesson 1 is open first. After it is completed, only Lesson 2 opens,
  // then Lesson 3, and so on across the entire visible course path.

  const nextUnlockedLessonId = useMemo(() => {
    const next = orderedLessons.find(
      ({ lesson }: any) => !completedLessonIds.has(Number(lesson.id))
    );
    return next ? Number(next.lesson.id) : null;
  }, [orderedLessons, completedLessonIds]);

  const currentLesson = useMemo(() => {
    const next = orderedLessons.find(
      ({ lesson }: any) => !completedLessonIds.has(Number(lesson.id))
    );

    return next ?? null;
  }, [orderedLessons, completedLessonIds]);

  const visibleCompletedCount = useMemo(
    () => completedLessonIds.size,
    [completedLessonIds]
  );

  const currentUnitId = currentLesson?.unitId;

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function jumpToCurrentLesson(unit: any) {
    const next = orderedLessons[currentLessonPosition];

    if (next?.lesson?.id) {
      saveCurrentLesson(Number(next.lesson.id));
      window.location.href = `/lesson/${next.lesson.id}`;
    } else {
      showNotice("All available lessons are completed!");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0E1E23] text-white">
        <div className="text-center">
          <div className="mb-5 text-7xl animate-bounce">🦉</div>
          <h2 className="text-2xl font-black">Loading your course...</h2>
          <p className="mt-2 font-medium text-[#71878F]">
            Get ready to learn Spanish!
          </p>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0E1E23] px-5 text-white">
        <div className="w-full max-w-md rounded-3xl border-2 border-[#344850] bg-[#112329] p-10 text-center">
          <div className="mb-5 text-6xl">😕</div>
          <h2 className="text-2xl font-black">Something went wrong</h2>
          <p className="mt-3 font-semibold text-[#FF7777]">
            {error || "Course not found"}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-[#58CC02] px-7 py-3 font-black text-white shadow-[0_4px_0_#3D9200]"
          >
            TRY AGAIN
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E1E23] text-white">

      {/* =========================================================
          MAIN AREA
      ========================================================== */}
      <main className="xl:ml-[340px]">
        <div className="mx-auto max-w-[1360px] px-5 pb-28 pt-8 sm:px-8 xl:px-8">
          <div className="grid grid-cols-1 gap-8 2xl:grid-cols-[minmax(620px,1fr)_490px]">
            {/* =====================================================
                LEARNING PATH
            ====================================================== */}
            <section className="min-w-0">
              {visibleUnits.map((unit: any, unitIndex: number) => {
                const unitLessons = (unit.skills ?? []).flatMap(
                  (skill: any) => skill.lessons ?? []
                );

                const unitCompleted = unitLessons.filter((lesson: any) =>
                  completedLessonIds.has(Number(lesson.id))
                ).length;

                const unitPercent =
                  unitLessons.length > 0
                    ? Math.round((unitCompleted / unitLessons.length) * 100)
                    : 0;

                const isCurrentUnit =
                  Number(currentUnitId) === Number(unit.id);

                const gradient =
                  UNIT_COLORS[unitIndex % UNIT_COLORS.length];

                return (
                  <section
                    key={unit.id ?? unitIndex}
                    id={`unit-${unit.id ?? unitIndex}`}
                    className="mb-12"
                  >
                    {/* UNIT HEADER */}
                    <div
                      className={`relative overflow-hidden rounded-[21px] bg-gradient-to-r ${gradient} p-6 shadow-[0_5px_0_rgba(0,0,0,.18)] sm:p-7`}
                    >
                      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
                      <div className="absolute -bottom-28 right-32 h-64 w-64 rounded-full bg-white/10" />

                      <div className="relative flex items-center justify-between gap-5">
                        <div className="min-w-0">
                          <div className="mb-2 flex items-center gap-2 text-[17px] font-black text-white/85">
                            <span>
                              SECTION 1, UNIT {unitIndex + 1}
                            </span>
                          </div>

                          <h1 className="max-w-[620px] text-[25px] font-black leading-tight sm:text-[28px]">
                            {unit.title || `Unit ${unitIndex + 1}`}
                          </h1>

                          {unit.description && (
                            <p className="mt-2 max-w-[620px] text-[16px] font-semibold text-white/80">
                              {unit.description}
                            </p>
                          )}

                          <div className="mt-4 flex items-center gap-3">
                            <div className="h-2.5 w-44 overflow-hidden rounded-full bg-black/20">
                              <div
                                className="h-full rounded-full bg-white transition-all"
                                style={{ width: `${unitPercent}%` }}
                              />
                            </div>
                            <span className="text-sm font-black">
                              {unitPercent}%
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/guidebook/en/${unit.id}`}
                          className="hidden shrink-0 items-center gap-3 rounded-[20px] border-2 border-black/20 bg-white/10 px-5 py-4 font-black shadow-[0_4px_0_rgba(0,0,0,.13)] backdrop-blur-sm transition hover:bg-white/20 sm:flex"
                        >
                          <GuidebookIcon />
                          <span>GUIDEBOOK</span>
                        </Link>
                      </div>
                    </div>

                    {/* MOBILE GUIDEBOOK */}
                    <Link
                      href={`/guidebook/en/${unit.id}`}
                      className="mt-3 flex items-center justify-center gap-2 rounded-2xl border-2 border-[#344850] bg-[#112329] px-4 py-3 font-black text-[#DCE8EE] sm:hidden"
                    >
                      <GuidebookIcon size={27} />
                      GUIDEBOOK
                    </Link>

                    {/* =================================================
                        LESSON PATH
                    ================================================== */}
                    <div className="relative mt-6">
                      {/* center line */}
                      <div className="absolute bottom-2 left-1/2 top-0 w-[6px] -translate-x-1/2 rounded-full bg-[#263940]" />

                      <div className="relative flex flex-col items-center gap-8 py-5">
                        {(unit.skills ?? []).map(
                          (skill: any, skillIndex: number) => {
                            const lessons = Array.isArray(skill.lessons)
                              ? skill.lessons
                              : [];

                            return (
                              <div
                                key={skill.id ?? skillIndex}
                                className="w-full"
                              >
                                {/* skill separator */}
                                <div className="mb-5 flex items-center justify-center">
                                  <div className="relative z-20 rounded-full border-2 border-[#344850] bg-[#112329] px-5 py-2 text-center">
                                    <span className="text-sm font-black uppercase tracking-wide text-[#718890]">
                                      {skill.name || `Skill ${skillIndex + 1}`}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex flex-col items-center gap-8">
                                  {lessons.map(
                                    (lesson: any, lessonIndex: number) => {
                                      const completed =
                                        completedLessonIds.has(
                                          Number(lesson.id)
                                        );

                                      // Only the first unfinished lesson is unlocked.
                                      // Every later lesson stays locked until its predecessor
                                      // has been completed.
                                      const isCurrent =
                                        Number(lesson.id) ===
                                        Number(nextUnlockedLessonId);

                                      const isUnlocked =
                                        completed || isCurrent;

                                      const offsets = [
                                        "-translate-x-24",
                                        "translate-x-0",
                                        "translate-x-24",
                                        "translate-x-0",
                                      ];

                                      const offset =
                                        offsets[
                                          (lessonIndex + skillIndex) %
                                            offsets.length
                                        ];

                                      const lessonContent = (
                                        <div
                                          className={`group block ${
                                            isUnlocked
                                              ? "cursor-pointer"
                                              : "cursor-not-allowed"
                                          }`}
                                          aria-label={
                                            isUnlocked
                                              ? `Open ${
                                                  lesson.title ?? "lesson"
                                                }`
                                              : `Locked: ${
                                                  lesson.title ?? "lesson"
                                                }`
                                          }
                                        >
                                          {isCurrent && !completed && (
                                            <div className="absolute -top-[58px] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-[13px] border-2 border-[#344850] bg-[#112329] px-4 py-2 text-[17px] font-black text-[#58CC02] shadow-lg">
                                              JUMP HERE?
                                              <div className="absolute left-1/2 top-full -translate-x-1/2 border-x-[9px] border-t-[9px] border-x-transparent border-t-[#344850]" />
                                            </div>
                                          )}

                                          <div
                                            className={`relative flex h-[88px] w-[88px] items-center justify-center rounded-full border-[6px] transition-all duration-150 ${
                                              isUnlocked
                                                ? "border-[#58CC02] bg-[#58CC02] shadow-[0_7px_0_#398D00] group-hover:scale-105"
                                                : "border-[#344850] bg-[#243940] shadow-[0_7px_0_#18272C]"
                                            }`}
                                          >
                                            <div
                                              className={`flex h-[62px] w-[62px] items-center justify-center rounded-full ${
                                                isUnlocked
                                                  ? "bg-[#7BE526]"
                                                  : "bg-[#30474F]"
                                              }`}
                                            >
                                              {completed ? (
                                                <span className="text-[35px] font-black text-[#194300]">
                                                  ✓
                                                </span>
                                              ) : isCurrent ? (
                                                <span className="ml-1 text-[32px] font-black text-white">
                                                  ▶
                                                </span>
                                              ) : (
                                                <div className="relative flex h-full w-full items-center justify-center">
                                                  {LESSON_ICONS[
                                                    (skillIndex + lessonIndex) %
                                                      LESSON_ICONS.length
                                                  ]}
                                                  {!isUnlocked && (
                                                    <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#243940] bg-[#526872] text-[15px]">
                                                      🔒
                                                    </span>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </div>

                                          <div className="pointer-events-none absolute left-1/2 top-[100px] z-30 w-[210px] -translate-x-1/2 text-center opacity-0 transition group-hover:opacity-100">
                                            <span className="rounded-xl border border-[#344850] bg-[#112329] px-3 py-2 text-xs font-black text-white shadow-xl">
                                              {isUnlocked
                                                ? lesson.title || "Start lesson"
                                                : "Complete the previous lesson first"}
                                            </span>
                                          </div>
                                        </div>
                                      );

                                      return (
                                        <div
                                          key={lesson.id ?? lessonIndex}
                                          className={`relative ${offset}`}
                                        >
                                          {isUnlocked ? (
                                            <Link
                                              href={`/lesson/${lesson.id}`}
                                              onClick={() => {
                                                saveCurrentLesson(Number(lesson.id));
                                                setSavedCurrentLesson(Number(lesson.id));
                                              }}
                                            >
                                              {lessonContent}
                                            </Link>
                                          ) : (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                showNotice(
                                                  "Complete the previous lesson first."
                                                )
                                              }
                                              className="block"
                                              aria-label={`Locked: ${
                                                lesson.title ?? "lesson"
                                              }`}
                                            >
                                              {lessonContent}
                                            </button>
                                          )}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}

                      </div>
                    </div>

                    {/* UNIT END / NEXT */}
                    <div className="relative mt-8 flex items-center justify-center">
                      <div className="absolute left-0 right-0 h-[3px] bg-[#344850]" />
                      <div className="relative z-10 bg-[#0E1E23] px-5 text-center text-[18px] font-black text-[#647B83]">
                        {unit.description ||
                          `${unit.title || "Unit"} complete your practice`}
                      </div>
                    </div>
                  </section>
                );
              })}
            </section>

            {/* =====================================================
                RIGHT SIDEBAR
            ====================================================== */}
            <aside className="space-y-5">
              {/* SUPER */}
              <div className="overflow-hidden rounded-[22px] border-2 border-[#344850] bg-[#112329]">
                <div className="p-7">
                  <div className="mb-4 inline-block rounded-xl bg-gradient-to-r from-[#2AD79F] to-[#EB40E7] px-4 py-1 text-[18px] font-black italic">
                    SUPER
                  </div>

                  <h2 className="text-[25px] font-black">
                    Try Super for free
                  </h2>

                  <p className="mt-4 max-w-[390px] text-[18px] font-medium leading-relaxed text-[#DDE8EB]">
                    No ads, personalized practice, and unlimited Legendary!
                  </p>

                  <button
                    type="button"
                    onClick={() => setSuperOpen(true)}
                    className="mt-6 w-full rounded-[20px] bg-[#4146F5] px-6 py-4 text-[18px] font-black text-white shadow-[0_6px_0_#3034CF] transition hover:brightness-110 active:translate-y-1 active:shadow-none"
                  >
                    TRY 1 WEEK FREE
                  </button>
                </div>
              </div>

              {/* LEADERBOARDS */}
              <div className="rounded-[22px] border-2 border-[#344850] bg-[#112329] p-7">
                <h2 className="text-[24px] font-black">
                  Unlock Leaderboards!
                </h2>

                <div className="mt-8 flex items-center gap-6">
                  <LockBadge />
                  <p className="text-[19px] font-bold leading-relaxed text-[#DCE7EA]">
                    Complete{" "}
                    <span className="text-white">
                      {Math.max(3 - completedLessons, 0)}
                    </span>{" "}
                    more{" "}
                    {Math.max(3 - completedLessons, 0) === 1
                      ? "lesson"
                      : "lessons"}{" "}
                    to start competing
                  </p>
                </div>
              </div>

              {/* DAILY QUESTS */}
              <div className="rounded-[22px] border-2 border-[#344850] bg-[#112329] p-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-[24px] font-black">Daily Quests</h2>
                  <Link
                    href="/quests"
                    className="text-[17px] font-black text-[#35BDF5] hover:text-white"
                  >
                    VIEW ALL
                  </Link>
                </div>

                <div className="mt-9 flex items-center gap-6">
                  <LightningIcon />

                  <div className="min-w-0 flex-1">
                    <div className="text-[19px] font-black">Earn 10 XP</div>

                    <div className="mt-5 flex items-center gap-2">
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#3D5059]">
                        <div
                          className="h-full rounded-full bg-[#FFC800] transition-all"
                          style={{
                            width: `${Math.min(dailyXP / 10, 1) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="whitespace-nowrap text-[16px] font-black text-[#A5B4B9]">
                        {Math.min(dailyXP, 10)} / 10
                      </span>
                      <QuestChest />
                    </div>
                  </div>
                </div>
              </div>

              {/* DAILY GOAL */}
              <div className="rounded-[22px] border-2 border-[#344850] bg-[#112329] p-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-[23px] font-black">Daily Goal</h2>
                  <span className="text-[16px] font-black text-[#35BDF5]">
                    {dailyXP}/{dailyGoal} XP
                  </span>
                </div>

                <div className="mt-5 h-3.5 overflow-hidden rounded-full bg-[#3A4B52]">
                  <div
                    className="h-full rounded-full bg-[#58CC02] transition-all"
                    style={{ width: `${dailyPercent}%` }}
                  />
                </div>

                <p className="mt-4 text-[14px] font-medium text-[#82979F]">
                  {dailyPercent >= 100
                    ? "🎉 Daily goal complete!"
                    : `${Math.max(dailyGoal - dailyXP, 0)} XP left to reach today's goal.`}
                </p>
              </div>

              {/* COURSE PROGRESS */}
              <div className="rounded-[22px] border-2 border-[#344850] bg-[#112329] p-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-[23px] font-black">Course Progress</h2>
                  <span className="text-[17px] font-black text-[#35BDF5]">
                    {coursePercent}%
                  </span>
                </div>

                <div className="mt-5 h-4 overflow-hidden rounded-full bg-[#394B52]">
                  <div
                    className="h-full rounded-full bg-[#58CC02] transition-all"
                    style={{ width: `${coursePercent}%` }}
                  />
                </div>

                <div className="mt-4 flex justify-between text-[14px] font-bold text-[#83969C]">
                  <span>{completedLessons} lessons</span>
                  <span>{totalLessons} total</span>
                </div>
              </div>

              {/* FOOTER */}
              <footer className="flex flex-wrap justify-center gap-x-6 gap-y-4 px-4 py-8 text-[13px] font-black text-[#526970]">
                
              </footer>
            </aside>
          </div>
        </div>
      </main>


      {/* =========================================================
          SUPER MODAL
      ========================================================== */}
      {superOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-5 backdrop-blur-sm"
          onClick={() => setSuperOpen(false)}
        >
          <div
            className="w-full max-w-[560px] overflow-hidden rounded-[28px] border-2 border-[#344850] bg-[#112329] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-[#0A615A] via-[#173B78] to-[#482080] p-8 text-center">
              <div className="text-7xl">🦉</div>
              <div className="mt-3 inline-block rounded-xl bg-gradient-to-r from-[#2AD79F] to-[#EB40E7] px-4 py-1 text-xl font-black italic">
                SUPER
              </div>
              <h2 className="mt-4 text-3xl font-black">
                Try Super free for 7 days
              </h2>
              <p className="mt-3 text-lg font-medium text-white/85">
                Unlimited hearts and extra Super benefits.
              </p>
            </div>

            <div className="p-7">
              <button
                type="button"
                onClick={() => setSuperOpen(false)}
                className="w-full rounded-2xl bg-white px-5 py-4 text-lg font-black text-[#3036C9] shadow-[0_5px_0_#AEBAC7]"
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

      {/* NOTICE */}
      {notice && (
        <div className="fixed bottom-24 left-1/2 z-[120] -translate-x-1/2 rounded-2xl border-2 border-[#344850] bg-[#162E36] px-6 py-4 text-center font-black text-white shadow-2xl">
          {notice}
        </div>
      )}
    </div>
  );
}

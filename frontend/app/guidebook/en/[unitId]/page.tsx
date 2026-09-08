"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getCourse, getLesson, getUserStats } from "@/lib/api";

type Option = {
  id: number;
  text: string;
};

type Exercise = {
  id: number;
  type: string;
  question: string;
  explanation?: string;
  order_index: number;
  options?: Option[];
};

type Lesson = {
  id: number;
  title: string;
  xp_reward: number;
  exercises: Exercise[];
};

type LessonRef = {
  id: number;
  title?: string;
};

type Skill = {
  id: number;
  name?: string;
  lessons?: LessonRef[];
};

type Unit = {
  id: number;
  title?: string;
  description?: string;
  skills?: Skill[];
};

type Course = {
  units?: Unit[];
};

type Stats = {
  streak?: number;
  gems?: number;
  hearts?: number;
  total_xp?: number;
};

/* =========================================================
   SMALL INLINE ICONS
   No lucide-react dependency is required.
========================================================= */

function HomeIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M4.5 14.5 16 5l11.5 9.5V27h-7v-8h-9v8h-7V14.5Z"
        fill="#FFD800"
        stroke="#FF4B4B"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M11.5 19h9v8h-9v-8Z" fill="#FF9600" />
    </svg>
  );
}

function SoundIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
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
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M9 5h14v8c0 5-3 8-7 8s-7-3-7-8V5Z" fill="#FFD900" />
      <path
        d="M9 8H5v3c0 4 2.5 6 6 6M23 8h4v3c0 4-2.5 6-6 6"
        stroke="#F2B500"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M16 21v5M11 27h10" stroke="#FFD900" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function QuestIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M5 10h22v17H5z" fill="#FFD800" stroke="#FFB000" strokeWidth="2" />
      <path d="M8 10V6h5l3 4 3-4h5v4" stroke="#FFB000" strokeWidth="2.5" />
      <path d="M11 17h10v6H11z" fill="#FF9600" />
      <circle cx="16" cy="20" r="2" fill="#FFF4A8" />
    </svg>
  );
}

function ShopIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M5 12h22v15H5z" fill="#F7F7F7" stroke="#E04B4B" strokeWidth="2" />
      <path d="M4 12 7 6h18l3 6H4Z" fill="#FF4B4B" />
      <path d="M8 12v5h5v-5M19 12v5h5v-5" fill="#E7F5FA" />
      <path d="M12 20h8v7h-8z" fill="#5AC8FA" />
    </svg>
  );
}

function ProfileIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="12" fill="#8CCB57" />
      <circle cx="16" cy="14" r="6" fill="#3C2540" />
      <circle cx="13.5" cy="13" r="1.4" fill="white" />
      <circle cx="18.5" cy="13" r="1.4" fill="white" />
      <path d="M11 21c2.5-3 7.5-3 10 0" stroke="#D7A6DD" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function MoreIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="12" fill="#B66BE8" />
      <circle cx="11" cy="16" r="1.6" fill="white" />
      <circle cx="16" cy="16" r="1.6" fill="white" />
      <circle cx="21" cy="16" r="1.6" fill="white" />
    </svg>
  );
}

function FlameIcon({ size = 31 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M17 4c1 5-1 7-4 10-2 2-3 4-3 7 0 4 3 7 7 7s7-3 7-8c0-5-4-9-7-16Z"
        fill="#5B6B73"
      />
      <path d="M17 14c2 3 4 5 4 8 0 2-1.5 4-4 4s-4-2-4-4c0-3 2-5 4-8Z" fill="#40515A" />
    </svg>
  );
}

function GemIcon({ size = 31 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="m16 3 9 7-4 16H11L7 10l9-7Z" fill="#22B8F0" stroke="#D5F6FF" strokeWidth="2" />
      <path d="m16 3 2 23M7 10h18M11 26l-4-16M21 26l4-16" stroke="#A7ECFF" strokeWidth="1.5" />
    </svg>
  );
}

function HeartIcon({ size = 31 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 27S5 20.7 5 12.6C5 8.8 7.8 6 11.2 6c2.1 0 3.8 1.1 4.8 2.6C17 7.1 18.7 6 20.8 6 24.2 6 27 8.8 27 12.6 27 20.7 16 27 16 27Z"
        fill="#FF4B4B"
        stroke="#FFD4D4"
        strokeWidth="2"
      />
    </svg>
  );
}

function SpeakerIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M4 12h6l8-6v20l-8-6H4v-8Z" fill="#35BDF5" />
      <path d="M22 11c2.7 2.5 2.7 7.5 0 10M25 8c4.5 4.5 4.5 11.5 0 16" stroke="#35BDF5" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function BackIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M19 6 9 16l10 10" stroke="#6F8790" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M10 17h20v17H10z" fill="#DCE7EE" stroke="#AEBEC8" strokeWidth="2" />
      <path d="M15 17v-5a5 5 0 0 1 10 0v5" stroke="#AEBEC8" strokeWidth="3" strokeLinecap="round" />
      <circle cx="20" cy="25" r="3" fill="#8CA1AC" />
      <path d="M20 27v3" stroke="#8CA1AC" strokeWidth="2" />
    </svg>
  );
}

function GuidebookCharacter() {
  return (
    <div className="relative h-[220px] w-[180px] shrink-0">
      <div className="absolute left-[34px] top-[24px] h-[158px] w-[100px] rotate-[2deg] rounded-[48%] bg-[#A96B45] shadow-[0_9px_0_#6E5142]" />
      <div className="absolute left-[25px] top-[94px] h-[92px] w-[122px] rounded-[45%] bg-[#A96B45]" />
      <div className="absolute left-[78px] top-[40px] h-[16px] w-[16px] rounded-full bg-[#A96B45]" />
      <div className="absolute left-[34px] top-[62px] h-[9px] w-[9px] rounded-full bg-[#A96B45]" />
      <div className="absolute left-[45px] top-[78px] h-[12px] w-[12px] rounded-full bg-white" />
      <div className="absolute left-[49px] top-[81px] h-[5px] w-[5px] rounded-full bg-[#25323A]" />
      <div className="absolute left-[84px] top-[79px] h-[12px] w-[12px] rounded-full bg-white" />
      <div className="absolute left-[88px] top-[82px] h-[5px] w-[5px] rounded-full bg-[#25323A]" />
      <div className="absolute left-[65px] top-[88px] h-[31px] w-[29px] rounded-[45%] bg-[#D29A5C]" />
      <div className="absolute left-[20px] top-[88px] h-[18px] w-[112px] rotate-[9deg] rounded-full bg-[#1CD0EE]" />
      <div className="absolute left-[31px] top-[103px] h-[62px] w-[18px] rotate-[20deg] rounded-full bg-[#1CD0EE]" />
      <div className="absolute left-[88px] top-[102px] h-[61px] w-[18px] rotate-[-18deg] rounded-full bg-[#1CD0EE]" />
      <div className="absolute left-[83px] top-[106px] h-[17px] w-[17px] rounded-full bg-[#F8C92E]" />
      <div className="absolute left-[86px] top-[109px] h-[11px] w-[11px] rounded-full bg-[#FFF1A5]" />
      <div className="absolute left-[109px] top-[40px] h-[156px] w-[4px] rotate-[7deg] rounded-full bg-[#FFD23F]" />
      <div className="absolute left-[109px] top-[34px] h-[165px] w-[2px] rotate-[7deg] rounded-full bg-white" />
      <div className="absolute left-[96px] top-[188px] h-[16px] w-[58px] rotate-[4deg] rounded-full bg-[#1DB7E8]" />
      <div className="absolute left-[105px] top-[181px] h-[25px] w-[38px] rounded-full border-[5px] border-[#1DB7E8] bg-white" />
      <div className="absolute left-[114px] top-[188px] h-[12px] w-[19px] rounded-full bg-[#FF5C5C]" />
    </div>
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
      className={`flex h-[70px] items-center gap-6 rounded-[18px] px-6 font-black tracking-wide transition ${
        active
          ? "border-[3px] border-[#36A8D7] bg-[#20323A] text-[#35BDF5]"
          : "border-[3px] border-transparent text-[#DCE7EC] hover:bg-[#172A31]"
      }`}
    >
      <span className="w-[38px] shrink-0">{icon}</span>
      <span className="text-[19px]">{label}</span>
    </Link>
  );
}

function SuperBird() {
  return (
    <div className="relative h-[125px] w-[145px]">
      <div className="absolute left-[20px] top-[18px] h-[75px] w-[95px] rotate-[8deg] rounded-[45%] bg-gradient-to-br from-[#19E2A0] via-[#35A8FF] to-[#B83CFF]" />
      <div className="absolute left-[50px] top-[28px] h-[45px] w-[45px] rounded-full bg-[#35A8FF]/70" />
      <div className="absolute left-[33px] top-[42px] h-[8px] w-[20px] rounded-full bg-[#182F3A]" />
      <div className="absolute left-[75px] top-[45px] h-[8px] w-[20px] rounded-full bg-[#182F3A]" />
      <div className="absolute left-[44px] top-[71px] h-[10px] w-[43px] rounded-full bg-[#8B35FF]" />
      <div className="absolute left-[20px] top-[80px] h-[18px] w-[30px] rotate-[35deg] rounded-full bg-[#18D99B]" />
      <div className="absolute right-[9px] top-[79px] h-[18px] w-[30px] rotate-[-35deg] rounded-full bg-[#EC39D8]" />
    </div>
  );
}

export default function GuidebookPage() {
  const params = useParams();
  const unitId = Number(params?.unitId);
  const userId = 1;

  const [course, setCourse] = useState<Course | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [error, setError] = useState("");
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [courseMenuOpen, setCourseMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadGuidebook() {
      try {
        setLoading(true);
        setError("");

        const [courseData, statsData] = await Promise.all([
          getCourse(1),
          getUserStats(userId),
        ]);

        if (!mounted) return;

        setCourse(courseData ?? null);
        setStats(statsData ?? null);

        const foundUnit =
          (courseData?.units ?? []).find(
            (item: Unit) => Number(item.id) === unitId
          ) ??
          (courseData?.units ?? [])[0] ??
          null;

        setUnit(foundUnit);

        if (!foundUnit) {
          setError("Unit not found");
          return;
        }

        const unitLessonRefs: LessonRef[] = (foundUnit.skills ?? []).flatMap(
          (skill: Skill) => skill.lessons ?? []
        );

        setLoadingLessons(true);

        const loaded = await Promise.all(
          unitLessonRefs.map(async (lessonRef: LessonRef) => {
            try {
              const data = await getLesson(Number(lessonRef.id));
              return data as Lesson;
            } catch (lessonError) {
              console.error("Failed to load lesson", lessonRef.id, lessonError);
              return {
                id: Number(lessonRef.id),
                title: lessonRef.title ?? "Lesson",
                xp_reward: 0,
                exercises: [],
              } as Lesson;
            }
          })
        );

        if (mounted) {
          setLessons(
            loaded
              .filter(Boolean)
              .sort((a, b) => Number(a.id) - Number(b.id))
          );
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load guidebook");
      } finally {
        if (mounted) {
          setLoading(false);
          setLoadingLessons(false);
        }
      }
    }

    if (Number.isFinite(unitId)) {
      loadGuidebook();
    } else {
      setLoading(false);
      setError("Invalid unit");
    }

    return () => {
      mounted = false;
    };
  }, [unitId]);

  const allExercises = useMemo(
    () =>
      lessons.flatMap((lesson) =>
        (lesson.exercises ?? [])
          .slice()
          .sort((a, b) => Number(a.order_index) - Number(b.order_index))
          .map((exercise) => ({
            ...exercise,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
          }))
      ),
    [lessons]
  );

  const questionCount = allExercises.length;

  const keyPhrases = useMemo(() => {
    const unique: string[] = [];

    for (const exercise of allExercises) {
      const text = String(exercise.question ?? "").trim();
      if (!text) continue;

      const normalized = text.replace(/\s+/g, " ");
      if (!unique.some((item) => item.toLowerCase() === normalized.toLowerCase())) {
        unique.push(normalized);
      }

      if (unique.length >= 6) break;
    }

    return unique;
  }, [allExercises]);

  const unitTitle = unit?.title || `Unit ${unitId}`;
  const unitDescription =
    unit?.description ||
    "Explore grammar tips and key phrases for this unit";

  const streak = Number(stats?.streak ?? 0);
  const gems = Number(stats?.gems ?? 500);
  const hearts = Number(stats?.hearts ?? 5);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0E1E23] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-5 text-7xl animate-bounce">📚</div>
            <h1 className="text-2xl font-black">Loading guidebook...</h1>
            <p className="mt-2 text-[#7B929B]">Preparing your unit questions</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !unit) {
    return (
      <main className="min-h-screen bg-[#0E1E23] px-6 py-20 text-white">
        <div className="mx-auto max-w-xl rounded-[24px] border-2 border-[#344850] bg-[#112329] p-10 text-center">
          <div className="text-6xl">😕</div>
          <h1 className="mt-5 text-3xl font-black">Guidebook unavailable</h1>
          <p className="mt-3 text-[#91A5AD]">{error || "Unit not found"}</p>
          <Link
            href="/"
            className="mt-7 inline-flex rounded-2xl bg-[#58CC02] px-7 py-4 font-black text-white shadow-[0_5px_0_#3D9400]"
          >
            BACK TO LEARN
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0E1E23] text-[#F1F7F9]">
      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[340px] border-r-2 border-[#344850] bg-[#102126] xl:block">
        <div className="flex h-full flex-col px-5 py-8">
          <Link
            href="/"
            className="mb-10 px-5 text-[43px] font-black leading-none tracking-[-2px] text-[#58CC02]"
          >
            duolingo
          </Link>

          <nav className="space-y-3">
            <SidebarItem href="/" label="LEARN" active icon={<HomeIcon />} />
            <SidebarItem href="/sounds" label="SOUNDS" icon={<SoundIcon />} />
            <SidebarItem href="/leaderboards" label="LEADERBOARDS" icon={<TrophyIcon />} />
            <SidebarItem href="/quests" label="QUESTS" icon={<QuestIcon />} />
            <SidebarItem href="/shop" label="SHOP" icon={<ShopIcon />} />
            <SidebarItem href="/profile" label="PROFILE" icon={<ProfileIcon />} />
            <SidebarItem href="/more" label="MORE" icon={<MoreIcon />} />
          </nav>

          <div className="mt-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-lg">
            🦉
          </div>
        </div>
      </aside>

      {/* =====================================================
          TOP STATUS BAR
      ====================================================== */}
      <header className="sticky top-0 z-40 border-b-2 border-[#263940] bg-[#0E1E23]/95 backdrop-blur xl:ml-[340px]">
        <div className="mx-auto flex h-[90px] max-w-[1420px] items-center justify-end gap-10 px-7">
          <div className="relative">
            <button
              type="button"
              onClick={() => setCourseMenuOpen((value) => !value)}
              aria-expanded={courseMenuOpen}
              aria-label="Open my courses"
              className="flex h-[68px] min-w-[96px] items-center justify-center rounded-[20px] bg-[#1B3038] px-4 transition hover:bg-[#223B44]"
            >
              <span className="text-[38px] leading-none">🇺🇸</span>
            </button>

            {courseMenuOpen && (
              <div className="absolute right-0 top-[82px] z-[70] w-[365px] overflow-hidden rounded-[24px] border-[3px] border-[#344850] bg-[#102126] shadow-[0_14px_30px_rgba(0,0,0,.35)]">
                <div className="border-b-[3px] border-[#344850] px-7 py-5 text-[18px] font-black text-[#60757E]">
                  MY COURSES
                </div>

                <button
                  type="button"
                  onClick={() => setCourseMenuOpen(false)}
                  className="flex w-full items-center gap-6 border-b-2 border-[#344850] bg-[#20343C] px-7 py-5 text-left transition hover:bg-[#29414A]"
                >
                  <span className="text-[42px] leading-none">🇺🇸</span>
                  <span className="text-[24px] font-black text-[#35BDF5]">English</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCourseMenuOpen(false);
                    alert("Add a new course");
                  }}
                  className="flex w-full items-center gap-6 px-7 py-5 text-left transition hover:bg-[#172D35]"
                >
                  <span className="flex h-[50px] w-[50px] items-center justify-center rounded-[9px] border-[3px] border-[#526872] text-[30px] font-black text-[#71868E]">
                    +
                  </span>
                  <span className="text-[22px] font-black text-[#E7EEF1]">Add a new course</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 font-black">
            <FlameIcon />
            <span className="text-[18px] text-[#53666E]">{streak}</span>
          </div>

          <div className="flex items-center gap-2 font-black">
            <GemIcon />
            <span className="text-[18px] text-[#35BDF5]">{gems}</span>
          </div>

          <div className="flex items-center gap-2 font-black">
            <HeartIcon />
            <span className="text-[18px] text-[#FF5B62]">{hearts}</span>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <div className="xl:ml-[340px]">
        <div className="mx-auto grid max-w-[1420px] grid-cols-1 gap-8 px-6 pb-24 pt-7 2xl:grid-cols-[minmax(620px,1fr)_490px]">
          {/* LEFT / GUIDEBOOK */}
          <section className="min-w-0">
            <Link
              href="/"
              className="mb-5 flex items-center gap-2 text-[24px] font-black text-[#657E87] hover:text-[#9FB2B9]"
            >
              <BackIcon size={25} />
              Back
            </Link>

            <div className="h-[2px] w-full bg-[#344850]" />

            {/* UNIT INTRO */}
            <section className="flex min-h-[310px] items-center gap-8 border-b-2 border-[#344850] py-7">
              <GuidebookCharacter />

              <div className="min-w-0">
                <h1 className="text-[29px] font-black leading-tight text-white">
                  Unit {unit.id} Guidebook
                </h1>

                <p className="mt-5 max-w-[580px] text-[22px] font-semibold leading-relaxed text-[#E0E9ED]">
                  {unitDescription}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="rounded-xl border-2 border-[#344850] bg-[#112329] px-4 py-2 text-sm font-black text-[#35BDF5]">
                    {questionCount} TEST QUESTIONS
                  </span>
                  <span className="rounded-xl border-2 border-[#344850] bg-[#112329] px-4 py-2 text-sm font-black text-[#8FA4AC]">
                    {lessons.length} LESSONS
                  </span>
                </div>
              </div>
            </section>

            {/* KEY PHRASES */}
            <section className="pt-9">
              <div className="text-[20px] font-black text-[#35BDF5]">KEY PHRASES</div>
              <h2 className="mt-3 text-[30px] font-black text-white">
                {unitTitle}
              </h2>

              <div className="mt-7 space-y-5">
                {keyPhrases.length > 0 ? (
                  keyPhrases.map((phrase, index) => (
                    <div
                      key={`${phrase}-${index}`}
                      className="relative rounded-[20px] border-2 border-[#344850] bg-[#112329] px-6 py-5 shadow-[0_5px_0_rgba(0,0,0,.14)]"
                    >
                      <div className="absolute -left-[10px] top-7 h-5 w-5 rotate-45 border-b-2 border-l-2 border-[#344850] bg-[#112329]" />
                      <div className="relative flex items-start gap-4">
                        <button
                          type="button"
                          className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1D3440] hover:bg-[#234655]"
                          onClick={() => {
                            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                              window.speechSynthesis.cancel();
                              window.speechSynthesis.speak(
                                new SpeechSynthesisUtterance(phrase)
                              );
                            }
                          }}
                          aria-label={`Play phrase: ${phrase}`}
                        >
                          <SpeakerIcon size={28} />
                        </button>

                        <div className="min-w-0">
                          <p className="text-[19px] font-semibold leading-relaxed text-white">
                            {phrase}
                          </p>
                          <div className="mt-3 h-[2px] w-[90%] border-t-2 border-dotted border-[#5D747D]" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[20px] border-2 border-[#344850] bg-[#112329] p-6 text-[#81969E]">
                    No phrases were returned by the lesson API for this unit.
                  </div>
                )}
              </div>
            </section>

            {/* =================================================
                TEST QUESTIONS
                These are the ACTUAL exercises returned by
                getLesson() for every lesson in this unit.
            ================================================== */}
            <section className="mt-12 border-t-2 border-[#344850] pt-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-[20px] font-black text-[#35BDF5]">TEST QUESTIONS</div>
                  <h2 className="mt-3 text-[30px] font-black text-white">
                    Questions in this unit
                  </h2>
                  <p className="mt-2 max-w-[720px] text-[17px] font-medium leading-relaxed text-[#8EA3AB]">
                    Every question below comes from the lesson data used by your test/lesson page.
                    Open a lesson to practice it.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAnswers((value) => !value)}
                  className="rounded-2xl border-2 border-[#344850] bg-[#112329] px-5 py-3 text-sm font-black text-[#35BDF5] transition hover:border-[#35BDF5]"
                >
                  {showAnswers ? "HIDE OPTIONS" : "SHOW OPTIONS"}
                </button>
              </div>

              {loadingLessons ? (
                <div className="mt-7 rounded-[20px] border-2 border-[#344850] bg-[#112329] p-7 text-center text-[#91A5AD]">
                  Loading all test questions...
                </div>
              ) : lessons.length === 0 ? (
                <div className="mt-7 rounded-[20px] border-2 border-[#344850] bg-[#112329] p-7 text-center text-[#91A5AD]">
                  No lesson questions were returned for this unit.
                </div>
              ) : (
                <div className="mt-7 space-y-5">
                  {lessons.map((lesson, lessonIndex) => {
                    const exercises = (lesson.exercises ?? [])
                      .slice()
                      .sort((a, b) => Number(a.order_index) - Number(b.order_index));

                    const isOpen = expandedLesson === lesson.id;

                    return (
                      <div
                        key={lesson.id}
                        className="overflow-hidden rounded-[20px] border-2 border-[#344850] bg-[#112329]"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedLesson(isOpen ? null : lesson.id)
                          }
                          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-[#152C34]"
                        >
                          <div>
                            <div className="text-xs font-black uppercase tracking-[1.5px] text-[#6F8790]">
                              LESSON {lessonIndex + 1}
                            </div>
                            <div className="mt-1 text-[20px] font-black text-white">
                              {lesson.title || `Lesson ${lessonIndex + 1}`}
                            </div>
                            <div className="mt-1 text-sm font-semibold text-[#849AA2]">
                              {exercises.length} question{exercises.length === 1 ? "" : "s"} · {lesson.xp_reward ?? 0} XP
                            </div>
                          </div>

                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#344850] text-xl font-black text-[#35BDF5] transition ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            ↓
                          </span>
                        </button>

                        {isOpen && (
                          <div className="border-t-2 border-[#344850] px-6 py-5">
                            <div className="space-y-5">
                              {exercises.length === 0 ? (
                                <div className="rounded-xl bg-[#0E1E23] p-5 text-[#81969E]">
                                  This lesson has no exercises returned by the API.
                                </div>
                              ) : (
                                exercises.map((exercise, exerciseIndex) => (
                                  <div
                                    key={exercise.id}
                                    className="rounded-[17px] border-2 border-[#2F444D] bg-[#0E1E23] p-5"
                                  >
                                    <div className="flex items-start gap-4">
                                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#20353D] text-sm font-black text-[#35BDF5]">
                                        {exerciseIndex + 1}
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <div className="mb-2 text-xs font-black uppercase tracking-[1.4px] text-[#6E8790]">
                                          {String(exercise.type || "question").replaceAll("_", " ")}
                                        </div>

                                        <p className="text-[19px] font-bold leading-relaxed text-white">
                                          {exercise.question || "Question text unavailable"}
                                        </p>

                                        {showAnswers && (exercise.options ?? []).length > 0 && (
                                          <div className="mt-4 grid gap-3">
                                            {(exercise.options ?? []).map((option) => (
                                              <div
                                                key={option.id}
                                                className="rounded-xl border-2 border-[#344850] bg-[#112329] px-4 py-3 text-[16px] font-semibold text-[#DCE7EC]"
                                              >
                                                {option.text}
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                        {exercise.explanation && (
                                          <p className="mt-4 rounded-xl bg-[#152B33] px-4 py-3 text-sm font-medium leading-relaxed text-[#8FA5AD]">
                                            {exercise.explanation}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>

                            <Link
                              href={`/lesson/${lesson.id}`}
                              className="mt-6 flex w-full items-center justify-center rounded-2xl bg-[#58CC02] px-6 py-4 text-[17px] font-black text-white shadow-[0_5px_0_#3D9400] transition hover:brightness-110"
                            >
                              PRACTICE THIS LESSON
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </section>

          {/* =====================================================
              RIGHT SIDEBAR
          ====================================================== */}
          <aside className="space-y-6">
            <div className="overflow-hidden rounded-[22px] border-2 border-[#344850] bg-[#112329]">
              <div className="relative min-h-[310px] p-7">
                <div className="inline-block rounded-xl bg-gradient-to-r from-[#27D69C] to-[#EC42E8] px-4 py-1 text-[18px] font-black italic">
                  SUPER
                </div>

                <h2 className="mt-6 max-w-[310px] text-[25px] font-black">
                  Try Super for free
                </h2>

                <p className="mt-5 max-w-[335px] text-[19px] font-medium leading-relaxed text-[#DCE8EE]">
                  No ads, personalized practice, and unlimited Legendary!
                </p>

                <div className="pointer-events-none absolute right-[-10px] top-[12px]">
                  <SuperBird />
                </div>

                <button
                  type="button"
                  className="absolute bottom-6 left-7 right-7 h-[68px] rounded-[20px] bg-[#4A50FF] text-[18px] font-black text-white shadow-[0_6px_0_#3137D8] transition hover:brightness-110"
                  onClick={() =>
                    alert("Super trial is ready to connect to your subscription flow.")
                  }
                >
                  TRY 1 WEEK FREE
                </button>
              </div>
            </div>

            <div className="rounded-[22px] border-2 border-[#344850] bg-[#112329] p-7">
              <h2 className="text-[24px] font-black">Unlock Leaderboards!</h2>

              <div className="mt-7 flex items-center gap-7">
                <div className="flex h-[78px] w-[65px] items-center justify-center rounded-[18px] bg-[#DCE7EE]">
                  <LockIcon size={45} />
                </div>

                <p className="text-[19px] font-semibold leading-relaxed text-[#D4E0E5]">
                  Complete 3 more lessons to start competing
                </p>
              </div>
            </div>

            <div className="rounded-[22px] border-2 border-[#344850] bg-[#112329] p-7">
              <div className="flex items-center justify-between">
                <h2 className="text-[24px] font-black">Daily Quests</h2>
                <Link href="/quests" className="text-[18px] font-black text-[#35BDF5]">
                  VIEW ALL
                </Link>
              </div>

              <div className="mt-7 flex items-center gap-5">
                <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#FFD800] text-3xl">
                  ⚡
                </div>
                <div className="flex-1">
                  <div className="text-[17px] font-black">Earn 10 XP</div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#273C44]">
                    <div className="h-full w-0 rounded-full bg-[#58CC02]" />
                  </div>
                  <div className="mt-2 text-sm font-bold text-[#7F959D]">0 / 10</div>
                </div>
                <div className="text-3xl">🧰</div>
              </div>
            </div>

            <div className="rounded-[22px] border-2 border-[#344850] bg-[#112329] p-7">
              <div className="flex items-center justify-between">
                <h2 className="text-[23px] font-black">Unit overview</h2>
                <span className="text-sm font-black text-[#35BDF5]">
                  {lessons.length} lessons
                </span>
              </div>

              <div className="mt-5 rounded-2xl bg-[#0E1E23] p-5">
                <div className="text-xs font-black uppercase tracking-[1.5px] text-[#6D858E]">
                  CURRENT UNIT
                </div>
                <div className="mt-2 text-[19px] font-black text-white">{unitTitle}</div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#263B43]">
                  <div className="h-full w-0 rounded-full bg-[#58CC02]" />
                </div>
              </div>
            </div>

            <div className="mb-6 border-b-2 border-[#344850] pb-5">
              <button
                type="button"
                className="text-[29px] font-semibold text-white transition hover:text-[#35BDF5]"
                onClick={() => setCourseMenuOpen((value) => !value)}
              >
                US
              </button>
            </div>

            <div className="px-2 pb-8 text-[13px] font-bold leading-8 text-[#687F88]">
             
             
            </div>
          </aside>
        </div>
      </div>

      {/* =====================================================
          MOBILE BOTTOM NAV
      ====================================================== */}
      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t-2 border-[#344850] bg-[#102126] xl:hidden">
        <Link href="/" className="flex flex-col items-center gap-1 py-3 text-xs font-black text-[#35BDF5]">
          <HomeIcon size={25} />
          LEARN
        </Link>
        <Link href="/leaderboards" className="flex flex-col items-center gap-1 py-3 text-xs font-black text-[#DCE7EC]">
          <TrophyIcon size={25} />
          RANK
        </Link>
        <Link href="/quests" className="flex flex-col items-center gap-1 py-3 text-xs font-black text-[#DCE7EC]">
          <QuestIcon size={25} />
          QUESTS
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 py-3 text-xs font-black text-[#DCE7EC]">
          <ProfileIcon size={25} />
          PROFILE
        </Link>
      </nav>
    </main>
  );
}

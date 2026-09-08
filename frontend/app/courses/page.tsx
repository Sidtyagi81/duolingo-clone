"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function SpainFlag() {
  return (
    <div
      className="relative flex h-24 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-[#40565E] bg-white shadow-lg"
      aria-label="Spanish flag"
      title="Spanish"
    >
      <div className="absolute inset-x-0 top-0 h-1/4 bg-[#AA151B]" />
      <div className="absolute inset-x-0 top-1/4 h-1/2 bg-[#F1BF00]" />
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-[#AA151B]" />

      <div className="absolute left-[30%] top-[36%] h-8 w-6 rounded border border-[#8B6B00] bg-[#F1BF00]">
        <div className="absolute left-1/2 top-1/2 h-5 w-2 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-[#AA151B]" />
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  /*
   * IMPORTANT:
   * The courses page is rendered through a portal directly into <body>.
   * This completely removes it from the DuolingoLayout/sidebar DOM tree.
   *
   * All hooks are declared before the mounted check, so React's
   * Rules of Hooks are never violated.
   */
  if (!mounted) {
    return null;
  }

  return createPortal(
    <main
      className="
        fixed
        inset-x-0
        bottom-0
        top-[82px]
        z-[99999]
        w-screen
        overflow-y-auto
        overflow-x-hidden
        bg-[#0F1F24]
        text-white
      "
    >
      <div className="mx-auto w-full max-w-[1250px] px-6 pb-24 pt-12 md:px-10 md:pt-16 lg:px-12">
        {/* PAGE HEADER */}
        <div className="mb-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-[#1CB0F6]">
            COURSES
          </p>

          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            Choose a course
          </h1>

          <p className="mt-4 max-w-2xl text-lg font-semibold text-[#8FA5AD]">
            Select the language you want to learn.
          </p>
        </div>

        {/* SPANISH ONLY */}
        <section className="overflow-hidden rounded-[30px] border-2 border-[#334B54] bg-[#14272D] shadow-[0_15px_40px_rgba(0,0,0,0.25)]">
          <div className="border-b-2 border-[#334B54] px-6 py-6 md:px-9">
            <h2 className="text-2xl font-black text-white">
              My available course
            </h2>
          </div>

          <div className="p-5 md:p-8">
            <Link
              href="/"
              className="
                group
                flex
                flex-col
                gap-7
                rounded-[26px]
                border-2
                border-[#405A63]
                bg-[#1D343C]
                p-6
                transition-all
                duration-200
                hover:border-[#58CC02]
                hover:bg-[#213A42]
                hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)]
                md:flex-row
                md:items-center
                md:p-8
              "
            >
              <SpainFlag />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-3xl font-black text-white md:text-4xl">
                    Spanish
                  </h3>

                  <span className="rounded-full bg-[#245B27] px-4 py-1.5 text-xs font-black uppercase tracking-wide text-[#7BE33D]">
                    Active
                  </span>
                </div>

                <p className="mt-2 text-base font-semibold text-[#91A9B1]">
                  Learning from English
                </p>

                <p className="mt-4 text-sm font-bold text-[#718991] transition group-hover:text-[#AFC4CB]">
                  Continue learning Spanish →
                </p>
              </div>

              <span
                className="
                  flex
                  h-14
                  w-full
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border-b-4
                  border-[#3C9300]
                  bg-[#58CC02]
                  px-8
                  text-base
                  font-black
                  uppercase
                  tracking-wide
                  text-white
                  transition-all
                  duration-200
                  group-hover:bg-[#61D507]
                  group-active:translate-y-1
                  group-active:border-b-0
                  md:w-[170px]
                "
              >
                Continue
              </span>
            </Link>
          </div>
        </section>

        {/* NO OTHER LANGUAGES */}
        <div className="mt-8 rounded-[24px] border-2 border-dashed border-[#334B54] bg-[#122329] px-6 py-8 text-center">
          {/* <div className="text-4xl">🇪🇸</div> */}

          <h2 className="mt-3 text-xl font-black text-[#AFC0C6]">
            Spanish is your current course
          </h2>

          <p className="mt-2 text-sm font-semibold text-[#667E87]">
            No additional languages are available.
          </p>
        </div>

        {/* BACK */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="
              inline-flex
              rounded-xl
              px-5
              py-3
              font-black
              text-[#1CB0F6]
              transition-all
              hover:bg-[#16343F]
              hover:text-[#58CC02]
            "
          >
            ← Back to Learning
          </Link>
        </div>
      </div>
    </main>,
    document.body
  );
}

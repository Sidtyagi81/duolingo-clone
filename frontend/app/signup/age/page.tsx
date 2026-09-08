"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function AgePage() {
  const [age, setAge] = useState("");

  function handleNext(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = Number(age);

    if (
      !Number.isInteger(value) ||
      value < 4 ||
      value > 120
    ) {
      return;
    }

    localStorage.setItem(
      "duolearnAge",
      String(value)
    );

    window.location.href = "/signup/profile";
  }

  return (
    <main className="min-h-screen bg-[#0F1F24] text-white">
      <div className="relative flex min-h-screen items-center justify-center px-5 py-10">

        {/* Close */}
        <Link
          href="/signup"
          aria-label="Back"
          className="absolute left-8 top-8 text-4xl font-light leading-none text-[#60777F] transition hover:text-white"
        >
          ×
        </Link>

        {/* Login */}
        <Link
          href="/login"
          className="absolute right-8 top-7 rounded-2xl border-2 border-[#344850] bg-[#12262C] px-7 py-4 text-lg font-black uppercase tracking-wide text-[#1CB0F6] shadow-[0_4px_0_#263A42] transition hover:bg-[#193139]"
        >
          Log in
        </Link>

        <section className="w-full max-w-[570px]">

          <h1 className="mb-12 text-center text-4xl font-black tracking-tight md:text-5xl">
            How old are you?
          </h1>

          <form onSubmit={handleNext}>

            {/* Age */}
            <input
              type="number"
              min={4}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              className="h-[68px] w-full rounded-2xl border-[3px] border-[#344850] bg-[#20343C] px-5 text-[25px] font-semibold text-white outline-none transition placeholder:text-[#E6EFF1] focus:border-[#1CB0F6]"
            />

            <p className="mt-3 text-[20px] font-semibold leading-8 text-[#E6EFF1]">
              Providing your age ensures you get the right
              Duolearn experience. For more details, please
              visit our{" "}
              <span className="font-black text-[#1CB0F6]">
                Privacy Policy
              </span>.
            </p>

            {/* Next */}
            <button
              type="submit"
              disabled={!age}
              className="mt-9 h-[68px] w-full rounded-2xl border-b-[5px] border-[#31434B] bg-[#3A4D56] text-xl font-black uppercase tracking-wide text-[#657A82] transition enabled:border-[#1495CF] enabled:bg-[#49B9EA] enabled:text-[#102027] enabled:hover:bg-[#5CC5F2] enabled:active:translate-y-1 enabled:active:border-b-0 disabled:cursor-not-allowed"
            >
              Next
            </button>

          </form>

          {/* OR */}
          <div className="my-9 flex items-center gap-4 text-[#60777F]">

            <div className="h-[3px] flex-1 bg-[#344850]" />

            <span className="text-lg font-black">
              OR
            </span>

            <div className="h-[3px] flex-1 bg-[#344850]" />

          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-5">

            <button
              type="button"
              onClick={() =>
                alert("Google signup is not connected yet.")
              }
              className="h-[68px] rounded-2xl border-[3px] border-[#344850] bg-transparent text-lg font-black tracking-wide text-[#4285F4] transition hover:bg-[#162B32]"
            >
              <span className="mr-3 text-2xl">
                G
              </span>

              GOOGLE
            </button>

            <button
              type="button"
              onClick={() =>
                alert("Facebook signup is not connected yet.")
              }
              className="h-[68px] rounded-2xl border-[3px] border-[#344850] bg-transparent text-lg font-black tracking-wide text-[#4267B2] transition hover:bg-[#162B32]"
            >
              <span className="mr-3 text-2xl">
                f
              </span>

              FACEBOOK
            </button>

          </div>

          {/* Terms */}
          <p className="mt-14 text-center text-base font-semibold leading-7 text-[#60777F]">
            By signing up to Duolearn, you agree to our{" "}
            <span className="font-black text-[#789097]">
              Terms
            </span>{" "}
            and{" "}
            <span className="font-black text-[#789097]">
              Privacy Policy
            </span>.
          </p>

          <p className="mt-10 text-center text-base font-semibold leading-7 text-[#60777F]">
            This site is protected by reCAPTCHA Enterprise
            and the Google{" "}
            <span className="font-black text-[#789097]">
              Privacy Policy
            </span>{" "}
            and{" "}
            <span className="font-black text-[#789097]">
              Terms of Service
            </span>{" "}
            apply.
          </p>

        </section>
      </div>
    </main>
  );
}
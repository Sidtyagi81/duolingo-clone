"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

export default function CreateProfilePage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "duolearnSignup"
      );

      if (saved) {
        const data = JSON.parse(saved);

        setName(data?.name ?? "");
      }
    } catch {
      // Ignore invalid local data.
    }
  }, []);

  function handleFinish(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!username.trim()) {
      return;
    }

    localStorage.setItem(
      "duolearnProfile",
      JSON.stringify({
        name: name.trim(),
        username: username.trim(),
      })
    );

    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-[#0F1F24] text-white">
      <div className="relative flex min-h-screen items-center justify-center px-5 py-10">

        {/* Back */}
        <Link
          href="/signup/age"
          aria-label="Back"
          className="absolute left-8 top-8 text-4xl font-light leading-none text-[#60777F] transition hover:text-white"
        >
          ←
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
            Create your profile
          </h1>

          <form
            onSubmit={handleFinish}
            className="space-y-4"
          >

            {/* Name */}
            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Name (optional)"
              className="h-[68px] w-full rounded-2xl border-[3px] border-[#344850] bg-[#20343C] px-5 text-[25px] font-semibold text-white outline-none transition placeholder:text-[#E6EFF1] focus:border-[#1CB0F6]"
            />

            {/* Username */}
            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Username"
              required
              className="h-[68px] w-full rounded-2xl border-[3px] border-[#344850] bg-[#20343C] px-5 text-[25px] font-semibold text-white outline-none transition placeholder:text-[#E6EFF1] focus:border-[#1CB0F6]"
            />

            {/* Continue */}
            <button
              type="submit"
              className="h-[68px] w-full rounded-2xl border-b-[5px] border-[#46A302] bg-[#58CC02] text-xl font-black uppercase tracking-wide text-white transition hover:bg-[#61D507] active:translate-y-1 active:border-b-0"
            >
              Continue
            </button>

          </form>

          <p className="mt-12 text-center text-base font-semibold leading-7 text-[#60777F]">
            Your profile helps personalize your
            Duolearn learning experience.
          </p>

        </section>
      </div>
    </main>
  );
}
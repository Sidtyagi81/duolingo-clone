"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createUser } from "@/lib/userState";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSignup(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      createUser(
        name,
        email,
        password
      );

      /*
       * IMPORTANT:
       * Do NOT log the user in automatically.
       *
       * New account → Login → Lesson 1
       */
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    } catch (error) {
      setLoading(false);

      if (
        error instanceof Error &&
        error.message === "ACCOUNT_EXISTS"
      ) {
        setError(
          "This account already exists. Please log in."
        );
      } else {
        setError(
          "Could not create account. Please try again."
        );
      }
    }
  }

  return (
    <main className="fixed inset-0 z-[9999] min-h-screen overflow-y-auto bg-[#0F1F24] text-white">
      <div className="relative flex min-h-screen w-full items-center justify-center px-5 py-12">

        {/* CLOSE */}
        <Link
          href="/homepage"
          aria-label="Close signup"
          className="absolute left-8 top-8 z-20 flex h-12 w-12 items-center justify-center text-5xl font-light leading-none text-[#60777F] transition hover:scale-110 hover:text-white"
        >
          ×
        </Link>

        {/* LOGIN */}
        <Link
          href="/login"
          className="absolute right-8 top-8 z-20 rounded-2xl border-[3px] border-[#344850] bg-[#12262C] px-7 py-4 text-lg font-black uppercase tracking-wide text-[#1CB0F6] shadow-[0_4px_0_#263A42] transition hover:bg-[#193139]"
        >
          Log in
        </Link>

        <section className="w-full max-w-[560px]">

          <h1 className="mb-12 text-center text-5xl font-black tracking-tight">
            Create your profile
          </h1>

          <form
            onSubmit={handleSignup}
            className="space-y-4"
          >

            {/* NAME */}
            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Name (optional)"
              autoComplete="name"
              disabled={loading}
              className="h-[76px] w-full rounded-2xl border-[3px] border-[#344850] bg-[#20343C] px-6 text-[24px] font-semibold text-white outline-none placeholder:text-[#E6EFF1] focus:border-[#1CB0F6]"
            />

            {/* EMAIL */}
            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Email"
              autoComplete="email"
              required
              disabled={loading}
              className="h-[76px] w-full rounded-2xl border-[3px] border-[#344850] bg-[#20343C] px-6 text-[24px] font-semibold text-white outline-none placeholder:text-[#E6EFF1] focus:border-[#1CB0F6]"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Password"
                autoComplete="new-password"
                required
                minLength={6}
                disabled={loading}
                className="h-[76px] w-full rounded-2xl border-[3px] border-[#344850] bg-[#20343C] px-6 pr-20 text-[24px] font-semibold text-white outline-none placeholder:text-[#E6EFF1] focus:border-[#1CB0F6]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (value) => !value
                  )
                }
                className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl text-[#1CB0F6]"
              >
                {showPassword ? "◉" : "◌"}
              </button>
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-2xl border-2 border-[#8F3F49] bg-[#321F25] px-5 py-4 text-center font-black text-[#FF6B78]">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="h-[76px] w-full rounded-2xl border-b-[6px] border-[#1594CC] bg-[#49B9EA] text-xl font-black uppercase tracking-wide text-[#102027] transition hover:bg-[#5CC5F2] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "CREATING..."
                : "CREATE ACCOUNT"}
            </button>
          </form>

          <p className="mt-12 text-center text-base font-semibold leading-7 text-[#60777F]">
            By signing up to Duolearn, you agree to our{" "}
            <span className="font-black">
              Terms
            </span>{" "}
            and{" "}
            <span className="font-black">
              Privacy Policy
            </span>
            .
          </p>

        </section>
      </div>
    </main>
  );
}
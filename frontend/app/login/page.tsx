"use client";

import Link from "next/link";
import {
  FormEvent,
  useState,
} from "react";
import {
  loginUser,
  getCurrentLesson,
} from "@/lib/userState";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(
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

    setLoading(true);

    const usersString =
      localStorage.getItem(
        "duolearn_users"
      );

    let users: Array<{
      email: string;
      name: string;
      password: string;
    }> = [];

    try {
      users = usersString
        ? JSON.parse(usersString)
        : [];
    } catch {
      users = [];
    }

    const value = email.trim().toLowerCase();

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === value ||
        item.name.toLowerCase() === value
    );

    if (!user) {
      setLoading(false);
      setError(
        "You are not registered. Please sign up first."
      );
      return;
    }

    if (user.password !== password) {
      setLoading(false);
      setError(
        "Incorrect password. Please try again."
      );
      return;
    }

    const loggedIn = loginUser(
      email,
      password
    );

    if (!loggedIn) {
      setLoading(false);
      setError(
        "Unable to log in. Please try again."
      );
      return;
    }

    /*
     * Existing user:
     * continue from saved lesson.
     *
     * New user:
     * currentLesson = 1.
     */
    const lesson =
      getCurrentLesson();

    window.location.href =
      `/`;
  }

  return (
    <main className="fixed inset-0 z-[9999] min-h-screen overflow-y-auto bg-[#0F1F24] text-white">

      <div className="relative flex min-h-screen w-full items-center justify-center px-5 py-12">

        {/* CLOSE → HOMEPAGE */}
        <Link
          href="/homepage"
          aria-label="Close login"
          className="absolute left-8 top-8 z-20 flex h-12 w-12 items-center justify-center text-5xl font-light leading-none text-[#60777F] transition hover:scale-110 hover:text-white"
        >
          ×
        </Link>

        {/* SIGN UP */}
        <Link
          href="/signup"
          className="absolute right-8 top-8 z-20 rounded-2xl border-[3px] border-[#344850] bg-[#12262C] px-7 py-4 text-lg font-black uppercase tracking-wide text-[#1CB0F6] shadow-[0_4px_0_#263A42] transition hover:bg-[#193139]"
        >
          Sign up
        </Link>

        <section className="w-full max-w-[640px]">

          <h1 className="mb-12 text-center text-5xl font-black">
            Log in
          </h1>

          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >

            {/* EMAIL */}
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Email or username"
              autoComplete="username"
              className="h-[76px] w-full rounded-2xl border-[3px] border-[#344850] bg-[#20343C] px-6 text-[25px] font-semibold text-white outline-none placeholder:text-[#E6EFF1] focus:border-[#1CB0F6]"
            />

            {/* PASSWORD */}
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Password"
              autoComplete="current-password"
              className="h-[76px] w-full rounded-2xl border-[3px] border-[#344850] bg-[#20343C] px-6 text-[25px] font-semibold text-white outline-none placeholder:text-[#E6EFF1] focus:border-[#1CB0F6]"
            />

            {/* ERROR */}
            {error && (
              <div className="rounded-2xl border-2 border-[#8F3F49] bg-[#321F25] px-5 py-4 text-center font-black text-[#FF6B78]">
                {error}
              </div>
            )}

            {/* LOGIN */}
            <button
              type="submit"
              disabled={loading}
              className="h-[76px] w-full rounded-2xl border-b-[6px] border-[#1594CC] bg-[#49B9EA] text-xl font-black uppercase tracking-wide text-[#102027] transition hover:bg-[#5CC5F2] disabled:opacity-60"
            >
              {loading
                ? "LOGGING IN..."
                : "LOG IN"}
            </button>

          </form>

          <p className="mt-14 text-center text-base font-semibold leading-7 text-[#60777F]">
            By signing in to Duolearn, you agree to our{" "}
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
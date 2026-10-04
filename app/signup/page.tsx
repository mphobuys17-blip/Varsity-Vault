
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase/client";
import ResXchangeLogo from "../components/ResXchangeLogo";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSignup(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) return;

    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 6) {
      setErrorMessage(
        "Your password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        "Your passwords do not match."
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setSuccessMessage(
      "Account created successfully. Check your email to confirm your account."
    );

    setLoading(false);

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-[#FFF9EF] px-5 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">

        {/* LOGO */}

        <div className="mb-8 flex justify-center">
          <Link
            href="/"
            aria-label="ResXchange home"
          >
            <ResXchangeLogo
              compact
              className="h-14 w-auto"
            />
          </Link>
        </div>

        {/* SIGN UP CARD */}

        <div className="rounded-3xl border border-[#14213D]/10 bg-white p-6 shadow-xl sm:p-8">

          <div className="text-center">

            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#3A86FF]">
              Join ResXchange
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#14213D] sm:text-4xl">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#14213D]/60">
              Create an account to sell products, manage your profile, and
              connect with other students.
            </p>

          </div>

          <form
            onSubmit={handleSignup}
            className="mt-8 space-y-5"
          >

            {/* EMAIL */}

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-bold text-[#14213D]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={loading}
                className="w-full rounded-2xl border border-[#14213D]/15 bg-[#FFF9EF] px-4 py-3.5 text-[#14213D] outline-none transition placeholder:text-[#14213D]/35 focus:border-[#3A86FF] focus:ring-2 focus:ring-[#3A86FF]/20 disabled:cursor-not-allowed disabled:opacity-60"
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-bold text-[#14213D]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="At least 6 characters"
                autoComplete="new-password"
                required
                disabled={loading}
                className="w-full rounded-2xl border border-[#14213D]/15 bg-[#FFF9EF] px-4 py-3.5 text-[#14213D] outline-none transition placeholder:text-[#14213D]/35 focus:border-[#3A86FF] focus:ring-2 focus:ring-[#3A86FF]/20 disabled:cursor-not-allowed disabled:opacity-60"
              />

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-bold text-[#14213D]"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Enter your password again"
                autoComplete="new-password"
                required
                disabled={loading}
                className="w-full rounded-2xl border border-[#14213D]/15 bg-[#FFF9EF] px-4 py-3.5 text-[#14213D] outline-none transition placeholder:text-[#14213D]/35 focus:border-[#3A86FF] focus:ring-2 focus:ring-[#3A86FF]/20 disabled:cursor-not-allowed disabled:opacity-60"
              />

            </div>

            {/* ERROR */}

            {errorMessage && (
              <div
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700"
              >
                {errorMessage}
              </div>
            )}

            {/* SUCCESS */}

            {successMessage && (
              <div
                role="status"
                className="rounded-2xl border border-[#B8F500]/40 bg-[#B8F500]/15 px-4 py-3 text-sm font-bold leading-6 text-[#14213D]"
              >
                {successMessage}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#14213D] px-5 py-4 font-black text-white transition hover:bg-[#1d3153] focus:outline-none focus:ring-2 focus:ring-[#3A86FF] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>

          </form>

          {/* LOGIN LINK */}

          <div className="mt-6 text-center">

            <p className="text-sm text-[#14213D]/60">
              Already have an account?
            </p>

            <Link
              href="/login"
              className="mt-1 inline-block text-sm font-black text-[#3A86FF] transition hover:text-[#14213D]"
            >
              Log in
            </Link>

          </div>

        </div>

        {/* BACK */}

        <div className="mt-6 text-center">

          <Link
            href="/"
            className="text-sm font-bold text-[#14213D]/50 transition hover:text-[#14213D]"
          >
            ← Back to marketplace
          </Link>

        </div>

      </div>
    </main>
  );
}


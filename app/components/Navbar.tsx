
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";
import ResXchangeLogo from "./ResXchangeLogo";

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      setEmail(user?.email ?? null);
      setAuthLoading(false);
    }

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      setEmail(session?.user?.email ?? null);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#14213D]/10 bg-[#FFF9EF]/95 shadow-[0_8px_30px_rgba(20,33,61,0.08)] backdrop-blur-xl">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex h-[76px] items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            aria-label="ResXchange home"
            className="shrink-0 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ResXchangeLogo
              compact
              className="h-11 w-auto sm:h-12"
            />
          </Link>

          {/* Desktop search */}
          <Link
            href="/"
            className="group hidden min-w-0 max-w-xl flex-1 items-center md:flex"
            aria-label="Search the ResXchange marketplace"
          >
            <div className="mx-auto flex w-full items-center rounded-2xl border border-[#14213D]/10 bg-white px-4 py-3 shadow-sm transition-all duration-200 group-hover:border-[#3A86FF]/40 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-[#3A86FF]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="mr-3 h-5 w-5 shrink-0 text-[#14213D]/45"
                aria-hidden="true"
              >
                <path
                  d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <span className="truncate text-sm font-medium text-[#14213D]/45">
                Search products, services & more...
              </span>

              <span className="ml-auto hidden rounded-lg bg-[#14213D]/5 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-[#14213D]/40 lg:block">
                Browse
              </span>
            </div>
          </Link>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/recently-viewed"
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#14213D]/70 transition hover:bg-[#14213D]/5 hover:text-[#14213D]"
            >
              Recently Viewed
            </Link>

            <Link
              href="/sell"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#14213D] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#14213D]/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1d3153] hover:shadow-xl active:translate-y-0"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B8F500] text-sm font-black leading-none text-[#14213D]">
                +
              </span>
              Sell an Item
            </Link>

            {authLoading ? (
              <div
                className="ml-1 h-10 w-24 animate-pulse rounded-xl bg-[#14213D]/5"
                aria-hidden="true"
              />
            ) : email ? (
              <Link
                href="/profile"
                className="ml-1 inline-flex items-center gap-2 rounded-xl border border-[#14213D]/10 bg-white px-4 py-2.5 text-sm font-black text-[#14213D] transition hover:border-[#3A86FF]/40 hover:shadow-sm"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3A86FF]/10 text-[#3A86FF]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M20 21a8 8 0 0 0-16 0m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                Profile
              </Link>
            ) : (
              <Link
                href="/login"
                className="ml-1 rounded-xl px-4 py-2.5 text-sm font-black text-[#14213D] transition hover:bg-[#B8F500]"
              >
                Log In
              </Link>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            {email && !authLoading && (
              <Link
                href="/profile"
                aria-label="Open profile"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3A86FF]/10 text-[#3A86FF] transition hover:bg-[#3A86FF]/20"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M20 21a8 8 0 0 0-16 0m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14213D] text-white transition hover:bg-[#1d3153] focus-visible:ring-2 focus-visible:ring-[#3A86FF] focus-visible:ring-offset-2"
            >
              {menuOpen ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6l12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div
          id="mobile-navigation"
          className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${
            menuOpen
              ? "max-h-[520px] pb-5 opacity-100"
              : "max-h-0 opacity-0"
          }`}
          aria-hidden={!menuOpen}
        >
          <div className="border-t border-[#14213D]/10 pt-4">
            {/* Mobile search */}
            <Link
              href="/"
              onClick={closeMenu}
              className="mb-3 flex items-center rounded-2xl border border-[#14213D]/10 bg-white px-4 py-3.5 shadow-sm"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="mr-3 h-5 w-5 text-[#14213D]/45"
                aria-hidden="true"
              >
                <path
                  d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <span className="text-sm font-medium text-[#14213D]/45">
                Search the marketplace
              </span>
            </Link>

            <div className="grid gap-2">
              <Link
                href="/"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 font-bold text-[#14213D] transition hover:bg-white"
              >
                Marketplace
              </Link>

              <Link
                href="/recently-viewed"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 font-bold text-[#14213D] transition hover:bg-white"
              >
                Recently Viewed
              </Link>

              <Link
                href="/sell"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl bg-[#14213D] px-4 py-3.5 font-black text-white shadow-lg"
              >
                <span>Sell an Item</span>

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#B8F500] text-[#14213D]">
                  +
                </span>
              </Link>

              {!authLoading &&
                (email ? (
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="rounded-xl px-4 py-3 font-bold text-[#14213D] transition hover:bg-white"
                  >
                    My Profile
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="rounded-xl bg-[#3A86FF] px-4 py-3.5 text-center font-black text-white transition hover:bg-[#2f73dc]"
                  >
                    Log In
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

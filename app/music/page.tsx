"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";
import ResXchangeLogo from "../components/ResXchangeLogo";

type Music = {
  id: number;
  title: string;
  artist: string;
  price: number;
  audio_url: string;
  cover_url: string | null;
  user_id: string;
  created_at: string;
};

export default function MusicPage() {
  const [music, setMusic] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null);

  useEffect(() => {
    loadMusic();
  }, []);

  async function loadMusic() {
    setLoading(true);

    const { data, error } = await supabase
      .from("music")
      .select(
        "id, title, artist, price, audio_url, cover_url, user_id, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading music:", error);
      setMusic([]);
    } else {
      setMusic(data ?? []);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#111827] text-[#FFF9EF]">
      {/* BACKGROUND TEXTURE */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.045]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#111827]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center">
            <ResXchangeLogo compact className="h-12 w-auto" />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white sm:block"
            >
              Marketplace
            </Link>

            <Link
              href="/music"
              className="rounded-full bg-[#B8F500] px-4 py-2 text-sm font-black text-[#111827]"
            >
              Music
            </Link>

            <Link
              href="/music/sell"
              className="rounded-full bg-[#3A86FF] px-4 py-2 text-sm font-black text-white transition hover:scale-105"
            >
              Sell Music
            </Link>
          </div>
        </div>
      </nav>

      {/* ALLEY HERO */}
      <section className="relative z-10 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:pb-24 sm:pt-20">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="rotate-[-2deg] bg-[#B8F500] px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#111827]">
                  Underground
                </span>

                <span className="border border-[#3A86FF] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#3A86FF]">
                  Music For Sale
                </span>
              </div>

              <h1 className="max-w-5xl text-5xl font-black uppercase leading-[0.88] tracking-[-0.05em] sm:text-7xl lg:text-8xl">
                THE
                <br />
                <span className="text-[#B8F500]">BACK ALLEY</span>
                <br />
                OF MUSIC.
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-white/60 sm:text-lg">
                No labels. No gatekeepers. Just artists putting their music
                out and people finding something worth listening to.
              </p>
            </div>

            {/* STREET SIGN */}
            <div className="relative hidden rotate-3 lg:block">
              <div className="border-4 border-[#B8F500] bg-[#111827] px-7 py-5 shadow-[8px_8px_0px_#3A86FF]">
                <p className="text-xs font-black tracking-[0.35em] text-[#B8F500]">
                  RESXCHANGE
                </p>

                <p className="mt-2 text-3xl font-black uppercase">
                  Music Dept.
                </p>

                <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                  Open all night
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="relative z-10 overflow-hidden border-b border-white/10 bg-[#FFF9EF] text-[#111827]">
        <div className="flex min-w-max animate-[marquee_20s_linear_infinite] gap-10 py-3 text-xs font-black uppercase tracking-[0.3em]">
          <span>NEW MUSIC</span>
          <span className="text-[#3A86FF]">✦</span>
          <span>UNDERGROUND</span>
          <span className="text-[#B8F500]">✦</span>
          <span>BUY DIRECT</span>
          <span className="text-[#3A86FF]">✦</span>
          <span>SUPPORT ARTISTS</span>
          <span className="text-[#B8F500]">✦</span>
          <span>NEW MUSIC</span>
          <span className="text-[#3A86FF]">✦</span>
          <span>UNDERGROUND</span>
          <span className="text-[#B8F500]">✦</span>
        </div>
      </div>

      {/* MUSIC SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-[#3A86FF]">
              Fresh drops
            </p>

            <h2 className="text-3xl font-black uppercase tracking-tight sm:text-5xl">
              What&apos;s in the alley
            </h2>
          </div>

          <div className="hidden rotate-[-2deg] border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/50 sm:block">
            Listen. Find. Buy.
          </div>
        </div>

        {loading ? (
          <div className="border border-white/10 bg-white/[0.03] p-16 text-center">
            <p className="animate-pulse text-sm font-bold uppercase tracking-[0.2em] text-white/50">
              Searching the alley...
            </p>
          </div>
        ) : music.length === 0 ? (
          <div className="relative overflow-hidden border border-white/10 bg-[#FFF9EF] p-10 text-center text-[#111827] shadow-[8px_8px_0px_#B8F500] sm:p-16">
            <div className="absolute right-[-30px] top-[-30px] h-32 w-32 rotate-12 border-8 border-[#3A86FF]" />

            <div className="relative">
              <p className="mb-4 text-5xl">🎧</p>

              <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-[#3A86FF]">
                Nobody&apos;s dropped yet
              </p>

              <h3 className="text-3xl font-black uppercase">
                The alley is empty.
              </h3>

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-black/60">
                Be the first artist to put something on the wall.
              </p>

              <Link
                href="/music/sell"
                className="mt-7 inline-flex -rotate-1 bg-[#111827] px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:rotate-0 hover:bg-[#3A86FF]"
              >
                Drop Your Music
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {music.map((track, index) => (
              <article
                key={track.id}
                className="group relative overflow-hidden border border-white/10 bg-[#1A2234] transition duration-300 hover:-translate-y-2 hover:border-[#B8F500]/60"
              >
                {/* NUMBER */}
                <div className="absolute left-3 top-3 z-20 flex h-8 w-8 items-center justify-center border border-white/30 bg-[#111827]/90 text-xs font-black">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* STICKER */}
                <div className="absolute right-3 top-3 z-20 rotate-3 bg-[#B8F500] px-2 py-1 text-[9px] font-black uppercase tracking-widest text-[#111827]">
                  For Sale
                </div>

                {/* COVER */}
                <div className="relative aspect-square overflow-hidden bg-[#0B0F18]">
                  {track.cover_url ? (
                    <img
                      src={track.cover_url}
                      alt={`${track.title} cover`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#3A86FF]">
                      <span className="text-8xl">🎵</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-70" />
                </div>

                {/* TRACK INFO */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-xl font-black uppercase">
                        {track.title}
                      </h3>

                      <p className="mt-1 truncate text-sm font-medium text-white/50">
                        {track.artist}
                      </p>
                    </div>

                    <div className="shrink-0 rotate-2 bg-[#B8F500] px-3 py-1 text-sm font-black text-[#111827]">
                      R{Number(track.price).toFixed(0)}
                    </div>
                  </div>

                  {/* PLAYER */}
                  <div className="mt-5 border-y border-white/10 py-4">
                    <audio
                      controls
                      preload="none"
                      className="w-full"
                      src={track.audio_url}
                      onPlay={() => setPlayingId(track.id)}
                      onPause={() => {
                        if (playingId === track.id) {
                          setPlayingId(null);
                        }
                      }}
                      onEnded={() => {
                        if (playingId === track.id) {
                          setPlayingId(null);
                        }
                      }}
                    />
                  </div>

                  {playingId === track.id && (
                    <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#B8F500]">
                      ● Playing in the alley
                    </p>
                  )}

                  {/* BUTTONS */}
                  <div className="mt-5 flex gap-2">
                    <Link
                      href={`/music/${track.id}`}
                      className="flex-1 border border-white/20 px-4 py-3 text-center text-xs font-black uppercase tracking-wide transition hover:border-[#3A86FF] hover:bg-[#3A86FF]"
                    >
                      View Track
                    </Link>

                    <button
                      type="button"
                      className="bg-[#B8F500] px-5 py-3 text-xs font-black uppercase text-[#111827] transition hover:bg-white"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* BOTTOM CTA */}
      <section className="relative z-10 border-t border-white/10 bg-[#B8F500] px-5 py-16 text-[#111827]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-[#3A86FF]">
              Got something?
            </p>

            <h2 className="text-4xl font-black uppercase leading-none sm:text-6xl">
              Put your
              <br />
              music outside.
            </h2>
          </div>

          <Link
            href="/music/sell"
            className="bg-[#111827] px-8 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[6px_6px_0px_#3A86FF] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            Sell Your Music →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-[#111827] px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-sm sm:flex-row">
          <p className="text-white/40">
            © {new Date().getFullYear()} ResXchange
          </p>

          <div className="font-bold text-white/40">
            Top Gooner · Bluu Flvme · Zooch · KB
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-25%);
          }
        }

        audio {
          height: 38px;
          filter: invert(1);
          opacity: 0.85;
        }

        audio::-webkit-media-controls-panel {
          background: #fff9ef;
        }
      `}</style>
    </main>
  );
}
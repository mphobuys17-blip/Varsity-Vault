
import Link from "next/link";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-[#FFF9EF] text-[#111827]">

      {/* Main Hero */}
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 md:px-10 md:pb-20 md:pt-28">

        {/* Eyebrow */}
        <div className="mb-8 flex justify-center">
          <span className="rounded-full bg-[#B8F500] px-5 py-2 text-xs font-black tracking-[0.18em] text-[#111827]">
            SOUTH AFRICA&apos;S CAMPUS MARKET
          </span>
        </div>

        {/* Heading */}
        <div className="text-center">

          <h1 className="mx-auto max-w-6xl text-6xl font-black leading-[0.85] tracking-[-0.06em] md:text-8xl lg:text-[10rem]">
            YOUR CAMPUS.
            <br />

            <span className="relative inline-block text-[#3A86FF]">
              YOUR MARKET.

              <span className="absolute -right-8 -top-5 rotate-12 text-3xl text-[#FF5C5C] md:-right-12 md:-top-8 md:text-5xl">
                ✦
              </span>
            </span>
          </h1>

          <p className="mx-auto mt-10 max-w-2xl text-base leading-7 text-[#4B5563] md:text-lg">
            Buy, sell and discover products, services and student
            businesses happening around you.
          </p>

        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <Link
            href="/"
            className="rounded-full bg-[#3A86FF] px-8 py-4 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-1 hover:bg-[#2563EB]"
          >
            SHOP THE MARKET →
          </Link>

          <Link
            href="/sell"
            className="rounded-full bg-[#8B5CF6] px-8 py-4 text-sm font-black text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-1 hover:bg-[#7C3AED]"
          >
            + SELL SOMETHING
          </Link>

        </div>

        {/* Stats */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl sm:grid-cols-3">

          <div className="border-b border-black/10 p-7 text-center sm:border-b-0 sm:border-r">
            <p className="text-4xl font-black text-[#3A86FF]">
              10K+
            </p>

            <p className="mt-2 text-xs font-bold tracking-[0.18em] text-[#6B7280]">
              STUDENTS
            </p>
          </div>

          <div className="border-b border-black/10 p-7 text-center sm:border-b-0 sm:border-r">
            <p className="text-4xl font-black text-[#8B5CF6]">
              3K+
            </p>

            <p className="mt-2 text-xs font-bold tracking-[0.18em] text-[#6B7280]">
              LISTINGS
            </p>
          </div>

          <div className="p-7 text-center">
            <p className="text-4xl font-black text-[#FF5C5C]">
              120+
            </p>

            <p className="mt-2 text-xs font-bold tracking-[0.18em] text-[#6B7280]">
              CAMPUSES
            </p>
          </div>

        </div>

      </div>

      {/* Campus Marquee */}
      <div className="border-y-4 border-[#111827] bg-[#B8F500] py-5">
        <div className="flex w-max animate-marquee whitespace-nowrap">

          <span className="mx-8 font-black tracking-[0.12em]">
            UNIVERSITY OF PRETORIA
          </span>

          <span className="text-[#3A86FF]">✦</span>

          <span className="mx-8 font-black tracking-[0.12em]">
            WITS UNIVERSITY
          </span>

          <span className="text-[#8B5CF6]">✦</span>

          <span className="mx-8 font-black tracking-[0.12em]">
            UNIVERSITY OF JOHANNESBURG
          </span>

          <span className="text-[#FF5C5C]">✦</span>

          <span className="mx-8 font-black tracking-[0.12em]">
            TSHWANE UNIVERSITY OF TECHNOLOGY
          </span>

          <span className="text-[#3A86FF]">✦</span>

          <span className="mx-8 font-black tracking-[0.12em]">
            NORTH-WEST UNIVERSITY
          </span>

          <span className="text-[#8B5CF6]">✦</span>

          <span className="mx-8 font-black tracking-[0.12em]">
            UNISA
          </span>

          <span className="text-[#FF5C5C]">✦</span>

          {/* Duplicate for seamless loop */}
          <span className="mx-8 font-black tracking-[0.12em]">
            UNIVERSITY OF PRETORIA
          </span>

          <span className="text-[#3A86FF]">✦</span>

          <span className="mx-8 font-black tracking-[0.12em]">
            WITS UNIVERSITY
          </span>

          <span className="text-[#8B5CF6]">✦</span>

          <span className="mx-8 font-black tracking-[0.12em]">
            UNIVERSITY OF JOHANNESBURG
          </span>

        </div>
      </div>

    </section>
  );
}

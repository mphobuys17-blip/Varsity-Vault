
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ResXchangeLogo from "../components/ResXchangeLogo";
import { supabase } from "../utils/supabase/client";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  school: string | null;
  description: string | null;
  image: string | null;
};

export default function RecentlyViewedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecentlyViewed() {
      try {
        const saved = localStorage.getItem(
          "resxchange_recently_viewed"
        );

        if (!saved) {
          setProducts([]);
          return;
        }

        const ids: number[] = JSON.parse(saved);

        if (!Array.isArray(ids) || ids.length === 0) {
          setProducts([]);
          return;
        }

        const { data, error } = await supabase
          .from("products")
          .select(
            "id, name, price, category, school, description, image"
          )
          .in("id", ids);

        if (error) {
          console.error("RECENTLY VIEWED ERROR:", error);
          setProducts([]);
          return;
        }

        if (!data) {
          setProducts([]);
          return;
        }

        const orderedProducts = ids
          .map((id) =>
            data.find((product) => product.id === id)
          )
          .filter(Boolean) as Product[];

        setProducts(orderedProducts);
      } catch (error) {
        console.error("RECENTLY VIEWED ERROR:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadRecentlyViewed();
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF9EF] text-[#111827]">

      {/* HEADER */}
      <section className="border-b border-black/5 bg-[#14213D] text-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">

          <div className="flex items-center justify-between gap-6">

            <Link
              href="/"
              className="transition duration-300 hover:scale-[1.02]"
            >
              <ResXchangeLogo
                compact
                className="h-12 w-auto"
              />
            </Link>

            <Link
              href="/"
              className="rounded-2xl border border-[#90E0EF]/40 px-5 py-3 text-sm font-black text-[#90E0EF] transition hover:bg-[#90E0EF] hover:text-[#14213D]"
            >
              ← Back
            </Link>

          </div>

        </div>
      </section>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#14213D] px-5 pb-14 pt-6 text-white sm:px-8 sm:pb-16">

        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#5B8CFF] opacity-20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 left-[-80px] h-96 w-96 rounded-full bg-[#B8F500] opacity-10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">

          <div className="inline-flex items-center rounded-full border border-[#B8F500]/30 bg-[#B8F500]/10 px-4 py-2 text-sm font-black text-[#B8F500]">
            👀 RECENTLY VIEWED
          </div>

          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            Your recent
            <br />
            <span className="text-[#5B8CFF]">
              discoveries.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
            Products you&apos;ve checked out recently. Find them
            again without having to search all over.
          </p>

        </div>

      </section>

      {/* PRODUCTS */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">

        {/* LOADING */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_20px_60px_rgba(20,33,61,0.08)]"
              >
                <div className="h-64 animate-pulse bg-gray-200" />

                <div className="space-y-4 p-5">
                  <div className="h-5 animate-pulse rounded-xl bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded-xl bg-gray-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded-xl bg-gray-200" />
                </div>
              </div>
            ))}

          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && products.length === 0 && (
          <div className="rounded-3xl border border-black/5 bg-white p-10 text-center shadow-[0_20px_60px_rgba(20,33,61,0.08)] sm:p-16">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#14213D] text-4xl shadow-lg">
              👀
            </div>

            <h2 className="mt-6 text-2xl font-black text-[#14213D]">
              Nothing here yet.
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              Products you view will appear here so you can
              easily find them again later.
            </p>

            <Link
              href="/"
              className="mt-7 inline-block rounded-2xl bg-[#B8F500] px-7 py-4 text-sm font-black text-[#14213D] shadow-lg shadow-[#B8F500]/20 transition hover:-translate-y-1 hover:shadow-xl"
            >
              BROWSE MARKETPLACE →
            </Link>

          </div>
        )}

        {/* PRODUCT GRID */}
        {!loading && products.length > 0 && (
          <>
            <div className="mb-8 flex items-end justify-between gap-4">

              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-[#3A86FF]">
                  YOUR HISTORY
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#14213D]">
                  Recently viewed.
                </h2>
              </div>

              <div className="rounded-full bg-[#B8F500] px-4 py-2 text-xs font-black text-[#14213D]">
                {products.length}{" "}
                {products.length === 1
                  ? "PRODUCT"
                  : "PRODUCTS"}
              </div>

            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group block"
                >
                  <article className="h-full overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_20px_60px_rgba(20,33,61,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-2xl">

                    {/* IMAGE */}
                    <div className="relative h-64 overflow-hidden bg-[#14213D]">

                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-center text-white/50">
                          <div className="text-5xl">
                            📦
                          </div>

                          <p className="mt-3 text-xs font-bold uppercase tracking-wider">
                            No image
                          </p>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#14213D]/70 via-transparent to-transparent" />

                      {/* CATEGORY */}
                      <div className="absolute left-4 top-4 rounded-full bg-[#B8F500] px-3 py-2 text-[10px] font-black uppercase tracking-wider text-[#14213D] shadow-lg">
                        {product.category}
                      </div>

                      {/* CAMPUS */}
                      {product.school && (
                        <div className="absolute bottom-4 left-4 max-w-[75%] rounded-full border border-white/20 bg-[#14213D]/80 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md">
                          🎓 {product.school}
                        </div>
                      )}

                      {/* ARROW */}
                      <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-black text-[#14213D] opacity-0 shadow-xl transition duration-300 group-hover:opacity-100">
                        ↗
                      </div>

                    </div>

                    {/* INFO */}
                    <div className="flex min-h-[190px] flex-col p-5">

                      <div className="flex items-start justify-between gap-3">

                        <h2 className="line-clamp-2 text-lg font-black leading-tight text-[#14213D] transition group-hover:text-[#3A86FF]">
                          {product.name}
                        </h2>

                        <span className="shrink-0 rounded-xl bg-[#B8F500] px-3 py-2 text-sm font-black text-[#14213D]">
                          R{Number(product.price).toFixed(2)}
                        </span>

                      </div>

                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-500">
                        {product.description ||
                          "No description provided."}
                      </p>

                      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-5">

                        <span className="text-xs font-black uppercase tracking-wider text-gray-400 transition group-hover:text-[#3A86FF]">
                          VIEW PRODUCT
                        </span>

                        <span className="text-xl font-black text-[#3A86FF] transition duration-300 group-hover:translate-x-2">
                          →
                        </span>

                      </div>

                    </div>

                  </article>
                </Link>
              ))}

            </div>
          </>
        )}

      </section>

      {/* FOOTER CTA */}
      <section className="px-5 pb-12 sm:px-8">

        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#14213D] p-8 text-white shadow-2xl sm:p-10">

          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#B8F500]">
                KEEP EXPLORING
              </p>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                Find something new.
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-white/60">
                Head back to the marketplace and discover
                what students around you are selling.
              </p>
            </div>

            <Link
              href="/"
              className="shrink-0 rounded-2xl bg-[#B8F500] px-7 py-4 text-center text-sm font-black text-[#14213D] shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              BROWSE MARKETPLACE →
            </Link>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/5 bg-[#14213D] px-5 py-8 text-white sm:px-8">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>
            <ResXchangeLogo
              compact
              className="h-10 w-auto"
            />

            <p className="mt-2 text-xs text-[#90E0EF]">
              Your campus. Your market. Your move.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm font-bold text-[#90E0EF]">

            <Link
              href="/"
              className="transition hover:text-white"
            >
              Marketplace
            </Link>

            <Link
              href="/sell"
              className="transition hover:text-white"
            >
              Sell
            </Link>

            <Link
              href="/profile"
              className="transition hover:text-white"
            >
              Profile
            </Link>

          </div>

          <p className="text-xs font-bold text-[#90E0EF]">
            SOUTH AFRICA 🇿🇦
          </p>

        </div>

        <div className="mx-auto mt-6 max-w-7xl border-t border-white/10 pt-5 text-xs text-white/30">
          © {new Date().getFullYear()} ResXchange. Built for students.
        </div>

      </footer>

    </main>
  );
}

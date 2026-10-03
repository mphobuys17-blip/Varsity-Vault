"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "./utils/supabase/client";
import ResXchangeLogo from "./components/ResXchangeLogo";

type Product = {
  id: number;
  created_at: string;
  name: string;
  school: string;
  category: string;
  price: number;
  image: string | null;
  description: string;
  user_id: string | null;
};

type ProductRow = {
  id: number;
  created_at: string;
  name: string | null;
  school: string | null;
  category: string | null;
  price: number | string | null;
  image: string | null;
  description: string | null;
  user_id: string | null;
};

const categories = [
  "All",
  "Perfumes",
  "Printing",
  "Snacks",
  "Tech",
  "Fashion",
  "Hair",
  "Service",
  "Other",
];

const sortOptions = [
  {
    value: "newest",
    label: "🆕 Newest",
  },
  {
    value: "oldest",
    label: "🕐 Oldest",
  },
  {
    value: "price-low",
    label: "💰 Price: Low → High",
  },
  {
    value: "price-high",
    label: "💰 Price: High → Low",
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [campus, setCampus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          console.error("SUPABASE PRODUCTS ERROR:", error);
          setProducts([]);
          return;
        }

        const formattedProducts: Product[] = (
          (data ?? []) as ProductRow[]
        ).map((product) => ({
          id: product.id,
          created_at: product.created_at,
          name: product.name ?? "Untitled product",
          school: product.school ?? "Campus not specified",
          category: product.category ?? "Other",
          price: Number(product.price ?? 0),
          image: product.image ?? null,
          description: product.description ?? "",
          user_id: product.user_id ?? null,
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error("PRODUCT LOADING ERROR:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const campuses = useMemo(() => {
    const unique = Array.from(
      new Set(
        products
          .map((product) => product.school)
          .filter(
            (school) =>
              school &&
              school.trim() !== "" &&
              school !== "Campus not specified"
          )
      )
    ).sort((a, b) => a.localeCompare(b));

    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" ||
        product.category.toLowerCase() === activeCategory.toLowerCase();

      const matchesCampus =
        campus === "All" ||
        product.school.toLowerCase() === campus.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.school.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesCampus && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
        );
      }

      if (sortBy === "price-low") {
        return a.price - b.price;
      }

      if (sortBy === "price-high") {
        return b.price - a.price;
      }

      return 0;
    });
  }, [products, search, activeCategory, campus, sortBy]);

  function closeMenu() {
    setMobileMenuOpen(false);
  }

  function openMarketplace() {
    setMarketplaceOpen(true);
    setMobileMenuOpen(false);

    setTimeout(() => {
      document.getElementById("marketplace")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  function toggleMarketplace() {
    if (marketplaceOpen) {
      setMarketplaceOpen(false);
      setMobileMenuOpen(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      openMarketplace();
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#14213D]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b-4 border-[#DFFF00] bg-[#14213D] px-5 py-4 text-white shadow-xl md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={() => {
                closeMenu();
                setMarketplaceOpen(false);

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="flex items-center transition duration-300 hover:scale-[1.02]"
            >
              <ResXchangeLogo compact className="h-12 w-auto" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="group flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#DFFF00] bg-[#DFFF00] text-[#14213D] shadow-lg transition duration-300 hover:scale-110 hover:shadow-xl"
            >
              <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`h-7 w-7 transition-transform duration-500 ease-in-out ${
                  mobileMenuOpen ? "rotate-180" : "rotate-0"
                }`}
                aria-hidden="true"
              >
                <path
                  d="M7 13.5C7.7 9.4 11.2 6.5 15.5 6.5C18.4 6.5 20.9 7.9 22.5 10.1"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />

                <path
                  d="M22 6.5L22.8 11.5L17.8 10.7"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M25 18.5C24.3 22.6 20.8 25.5 16.5 25.5C13.6 25.5 11.1 24.1 9.5 21.9"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />

                <path
                  d="M10 25.5L9.2 20.5L14.2 21.3"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              mobileMenuOpen
                ? "max-h-[600px] opacity-100"
                : "pointer-events-none max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-white/10 pt-4">
              <div className="grid gap-2 pb-2">
                <button
                  type="button"
                  onClick={toggleMarketplace}
                  className={`group flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left font-black transition duration-200 ${
                    marketplaceOpen
                      ? "bg-[#DFFF00] text-[#14213D]"
                      : "text-[#90E0EF] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>🛍️ MARKETPLACE</span>

                  <span
                    className={`text-xl transition duration-300 ${
                      marketplaceOpen
                        ? "rotate-90"
                        : "group-hover:translate-x-2"
                    }`}
                  >
                    →
                  </span>
                </button>

                <Link
                  href="/recently-viewed"
                  onClick={closeMenu}
                  className="group flex items-center justify-between rounded-2xl px-5 py-4 font-black text-[#90E0EF] transition duration-200 hover:bg-white/10 hover:text-white"
                >
                  <span>👀 RECENTLY VIEWED</span>

                  <span className="text-xl transition duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </Link>

                <Link
                  href="/sell"
                  onClick={closeMenu}
                  className="group flex items-center justify-between rounded-2xl bg-[#5B8CFF] px-5 py-4 font-black text-white shadow-lg transition duration-200 hover:bg-[#3A86FF]"
                >
                  <span>＋ SELL AN ITEM</span>

                  <span className="text-xl transition duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </Link>

                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="group flex items-center justify-between rounded-2xl border border-[#90E0EF]/40 px-5 py-4 font-black text-[#90E0EF] transition duration-200 hover:bg-[#90E0EF] hover:text-[#14213D]"
                >
                  <span>👤 PROFILE</span>

                  <span className="text-xl transition duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#14213D] px-6 py-16 text-white md:px-10 md:py-24">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#5B8CFF] opacity-30 blur-2xl" />

        <div className="pointer-events-none absolute -bottom-32 left-[-80px] h-96 w-96 rounded-full bg-[#DFFF00] opacity-10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="inline-block rotate-[-2deg] rounded-full bg-[#DFFF00] px-5 py-2 text-xs font-black tracking-[0.15em] text-[#14213D] shadow-lg">
            SOUTH AFRICA&apos;S CAMPUS MARKET
          </div>

          <h1 className="mt-8 max-w-5xl text-6xl font-black leading-[0.82] tracking-[-0.07em] md:text-8xl">
            YOUR
            <br />
            CAMPUS.
            <br />
            <span className="text-[#5B8CFF]">YOUR</span> MARKET.
          </h1>

          <p className="mt-8 max-w-xl text-lg font-medium leading-7 text-[#90E0EF]">
            Buy, sell and discover products and services from students around
            your campus.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={openMarketplace}
              className="rounded-2xl bg-[#5B8CFF] px-7 py-4 text-center text-sm font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#3A86FF]"
            >
              🛍️ BROWSE MARKETPLACE
            </button>

            <Link
              href="/sell"
              className="rounded-2xl border-2 border-[#90E0EF] px-7 py-4 text-center text-sm font-black text-[#90E0EF] transition hover:bg-[#90E0EF] hover:text-[#14213D]"
            >
              + SELL AN ITEM
            </Link>
          </div>
        </div>
      </section>

      {/* MARKETPLACE */}
      {marketplaceOpen && (
        <section
          id="marketplace"
          className="scroll-mt-24 px-6 py-12 md:px-10 md:py-16"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black tracking-[0.2em] text-[#5B8CFF]">
                  RESXCHANGE MARKETPLACE
                </p>

                <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] md:text-5xl">
                  Find your next drop.
                </h2>
              </div>

              <button
                type="button"
                onClick={toggleMarketplace}
                className="self-start rounded-full bg-[#14213D] px-5 py-3 text-xs font-black text-[#DFFF00] shadow-md transition hover:-translate-y-0.5 sm:self-auto"
              >
                CLOSE MARKETPLACE ↑
              </button>
            </div>

            <div className="rounded-[2rem] border-2 border-[#DDE5F0] bg-white p-5 shadow-xl md:p-7">
              <div className="relative">
                <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl">
                  🔎
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products, services, campuses..."
                  className="w-full rounded-2xl border-2 border-[#E4EAF2] bg-[#F8FAFC] py-4 pl-14 pr-5 text-sm font-semibold outline-none transition focus:border-[#5B8CFF] focus:ring-4 focus:ring-[#90E0EF]/30"
                />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="relative">
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full appearance-none rounded-2xl border-2 border-[#E4EAF2] bg-[#F8FAFC] px-5 py-4 pr-12 text-sm font-black text-[#14213D] outline-none transition focus:border-[#5B8CFF] focus:ring-4 focus:ring-[#90E0EF]/30"
                  >
                    {campuses.map((item) => (
                      <option key={item} value={item}>
                        {item === "All" ? "🎓 All campuses" : `🎓 ${item}`}
                      </option>
                    ))}
                  </select>

                  <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-lg">
                    ▼
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none rounded-2xl border-2 border-[#E4EAF2] bg-[#F8FAFC] px-5 py-4 pr-12 text-sm font-black text-[#14213D] outline-none transition focus:border-[#5B8CFF] focus:ring-4 focus:ring-[#90E0EF]/30"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-lg">
                    ▼
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
                {categories.map((category) => {
                  const active = activeCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`whitespace-nowrap rounded-full px-5 py-3 text-xs font-black transition duration-200 ${
                        active
                          ? "bg-[#14213D] text-[#DFFF00] shadow-md"
                          : "bg-[#EEF3F8] text-[#14213D] hover:-translate-y-0.5 hover:bg-[#DFFF00]"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-8 mt-10 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black tracking-[0.2em] text-[#5B8CFF]">
                  MARKETPLACE
                </p>

                <h3 className="mt-2 text-3xl font-black tracking-[-0.04em]">
                  Latest drops.
                </h3>
              </div>

              <div className="rounded-full bg-[#DFFF00] px-4 py-2 text-xs font-black text-[#14213D] shadow-sm">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "PRODUCT" : "PRODUCTS"}
              </div>
            </div>

            {loading && (
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-[2rem] border-2 border-[#DDE5F0] bg-white shadow-lg"
                  >
                    <div className="h-64 animate-pulse bg-[#DDE5F0]" />

                    <div className="space-y-4 p-6">
                      <div className="h-6 animate-pulse rounded-xl bg-[#DDE5F0]" />

                      <div className="h-4 w-2/3 animate-pulse rounded-xl bg-[#DDE5F0]" />

                      <div className="h-4 w-1/2 animate-pulse rounded-xl bg-[#DDE5F0]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredProducts.length > 0 && (
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group block"
                  >
                    <article className="h-full overflow-hidden rounded-[2rem] border-2 border-[#DDE5F0] bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:border-[#90E0EF] hover:shadow-2xl">
                      <div className="relative h-64 overflow-hidden bg-[#14213D]">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-[#14213D] text-6xl transition duration-500 group-hover:scale-110">
                            📦
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#14213D]/60 via-transparent to-transparent opacity-70" />

                        <div className="absolute left-4 top-4 rounded-full bg-[#DFFF00] px-3 py-2 text-[10px] font-black tracking-[0.08em] text-[#14213D] shadow-lg">
                          {product.category}
                        </div>

                        <div className="absolute bottom-4 left-4 max-w-[75%] rounded-full border border-white/30 bg-[#14213D]/80 px-3 py-2 text-[10px] font-black uppercase tracking-[0.06em] text-white backdrop-blur-md">
                          🎓 {product.school}
                        </div>

                        <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-black text-[#14213D] opacity-0 shadow-xl transition duration-300 group-hover:opacity-100">
                          ↗
                        </div>
                      </div>

                      <div className="flex min-h-[245px] flex-col p-6">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="line-clamp-2 text-xl font-black leading-tight tracking-[-0.03em] text-[#14213D] transition group-hover:text-[#5B8CFF]">
                            {product.name}
                          </h3>

                          <p className="shrink-0 rounded-xl bg-[#90E0EF]/30 px-3 py-2 text-sm font-black text-[#14213D]">
                            R{product.price.toFixed(2)}
                          </p>
                        </div>

                        <p className="mt-4 line-clamp-2 text-sm font-medium leading-6 text-gray-500">
                          {product.description || "No description provided."}
                        </p>

                        <div className="mt-auto flex items-center justify-between border-t border-[#E4EAF2] pt-5">
                          <span className="text-xs font-black tracking-[0.1em] text-gray-400 transition group-hover:text-[#5B8CFF]">
                            VIEW PRODUCT
                          </span>

                          <span className="text-xl font-black text-[#5B8CFF] transition duration-300 group-hover:translate-x-2">
                            →
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="rounded-[2rem] bg-[#14213D] px-6 py-20 text-center text-white shadow-2xl">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[#DFFF00] text-5xl shadow-lg">
                  🔎
                </div>

                <h3 className="mt-7 text-3xl font-black">
                  NOTHING FOUND.
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-6 text-[#90E0EF]">
                  Try another search, category or campus.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("All");
                    setCampus("All");
                    setSortBy("newest");
                  }}
                  className="mt-7 rounded-2xl bg-[#5B8CFF] px-7 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#3A86FF]"
                >
                  CLEAR FILTERS →
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CAMPUS MARQUEE */}
      <section className="overflow-hidden bg-[#90E0EF] py-5">
        <div className="resx-campus-marquee flex w-max items-center whitespace-nowrap">
          {[
            "UNIVERSITY OF PRETORIA",
            "WITS UNIVERSITY",
            "UNIVERSITY OF JOHANNESBURG",
            "TSHWANE UNIVERSITY OF TECHNOLOGY",
            "UNISA",
            "NORTH-WEST UNIVERSITY",

            "UNIVERSITY OF PRETORIA",
            "WITS UNIVERSITY",
            "UNIVERSITY OF JOHANNESBURG",
            "TSHWANE UNIVERSITY OF TECHNOLOGY",
            "UNISA",
            "NORTH-WEST UNIVERSITY",
          ].map((school, index) => (
            <div
              key={`${school}-${index}`}
              className="flex items-center"
            >
              <span className="mx-8 text-sm font-black tracking-[0.2em]">
                {school}
              </span>

              <span className="text-2xl text-[#5B8CFF]">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* SELL CTA */}
      <section className="bg-[#F8FAFC] px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#14213D] p-8 text-white shadow-2xl md:p-12">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-black tracking-[0.2em] text-[#DFFF00]">
                GOT SOMETHING TO SELL?
              </p>

              <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.05em] md:text-6xl">
                PUT IT ON
                <br />
                THE CAMPUS.
              </h2>
            </div>

            <div className="md:text-right">
              <p className="mb-6 text-sm font-medium leading-6 text-[#90E0EF]">
                Turn unused stuff, products and services into your next sale.
              </p>

              <Link
                href="/sell"
                className="inline-block rounded-2xl bg-[#DFFF00] px-7 py-4 text-sm font-black text-[#14213D] shadow-xl transition hover:-translate-y-1"
              >
                + SELL AN ITEM →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="overflow-hidden bg-[#14213D] text-white">
        <div className="overflow-hidden border-y border-[#DFFF00]/20 bg-[#DFFF00] py-4">
          <div className="resx-marquee flex w-max">
            {[
              "Bluu Flvme",
              "Zooch",
              "KB",
              "Bluu Flvme",
              "Zooch",
              "KB",
            ].map((name, index) => (
              <div
                key={`${name}-${index}`}
                className="flex items-center"
              >
                <span className="mx-8 whitespace-nowrap text-sm font-black uppercase tracking-[0.18em] text-[#14213D] md:text-base">
                  {name}
                </span>

                <span className="text-xl font-black text-[#14213D]/40">
                  ✦
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-12 md:flex-row md:items-center md:px-10">
          <div>
            <ResXchangeLogo compact className="h-12 w-auto" />

            <p className="mt-3 text-sm text-[#90E0EF]">
              Your campus. Your market. Your move.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm font-bold text-[#90E0EF]">
            <button
              type="button"
              onClick={openMarketplace}
              className="transition hover:text-white"
            >
              Marketplace
            </button>

            <Link
              href="/recently-viewed"
              className="transition hover:text-white"
            >
              Recently Viewed
            </Link>

            <Link
              href="/profile"
              className="transition hover:text-white"
            >
              Profile
            </Link>

            <Link
              href="/sell"
              className="transition hover:text-white"
            >
              Sell
            </Link>
          </div>

          <div className="text-sm font-bold text-[#90E0EF]">
            SOUTH AFRICA 🇿🇦
          </div>
        </div>

        <div className="mx-auto max-w-7xl border-t border-white/10 px-6 py-5 text-xs text-white/40 md:px-10">
          © {new Date().getFullYear()} ResXchange. Built for students.
        </div>
      </footer>

      {/* ANIMATIONS */}
      <style jsx>{`
        .resx-campus-marquee {
          animation: resx-campus-marquee 25s linear infinite;
        }

        @keyframes resx-campus-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .resx-marquee {
          animation: resx-marquee 18s linear infinite;
        }

        @keyframes resx-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </main>
  );
}
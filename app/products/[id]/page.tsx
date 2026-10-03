
"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import ResXchangeLogo from "../../components/ResXchangeLogo";
import { supabase } from "../../utils/supabase/client";

const RECENTLY_VIEWED_KEY =
  "resxchange_recently_viewed";

const MAX_RECENTLY_VIEWED = 10;

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

type Profile = {
  id: string;
  email: string | null;
  whatsapp: string | null;
  campus: string | null;
};

type ProfileRow = {
  id: string;
  email: string | null;
  whatsapp: string | null;
  campus: string | null;
};

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
}

function saveRecentlyViewed(productId: number) {
  try {
    const saved =
      localStorage.getItem(
        RECENTLY_VIEWED_KEY
      );

    let recentlyViewed: number[] = [];

    if (saved) {
      const parsed: unknown =
        JSON.parse(saved);

      if (Array.isArray(parsed)) {
        recentlyViewed = parsed.filter(
          (value): value is number =>
            typeof value === "number" &&
            Number.isFinite(value)
        );
      }
    }

    const updatedRecentlyViewed = [
      productId,
      ...recentlyViewed.filter(
        (id) => id !== productId
      ),
    ].slice(0, MAX_RECENTLY_VIEWED);

    localStorage.setItem(
      RECENTLY_VIEWED_KEY,
      JSON.stringify(
        updatedRecentlyViewed
      )
    );
  } catch (error: unknown) {
    console.error(
      "RECENTLY VIEWED ERROR:",
      error
    );
  }
}

export default function ProductPage() {
  const params = useParams();

  const rawId = params.id;

  const id =
    typeof rawId === "string"
      ? rawId
      : Array.isArray(rawId)
        ? rawId[0]
        : "";

  const [product, setProduct] =
    useState<Product | null>(null);

  const [seller, setSeller] =
    useState<Profile | null>(null);

  const [loading, setLoading] =
    useState(() => Boolean(id));

  const [message, setMessage] =
    useState(
      () =>
        id
          ? ""
          : "This product could not be found."
    );

  useEffect(() => {
    let mounted = true;

    if (!id) {
      return;
    }

    async function loadProduct() {
      try {
        if (mounted) {
          setLoading(true);
          setMessage("");
          setSeller(null);
        }

        const {
          data: productData,
          error: productError,
        } = await supabase
          .from("products")
          .select(
            "id, created_at, name, school, category, price, image, description, user_id"
          )
          .eq("id", id)
          .maybeSingle();

        if (productError) {
          throw productError;
        }

        if (!productData) {
          if (mounted) {
            setMessage(
              "This product does not exist."
            );
          }

          return;
        }

        const row =
          productData as ProductRow;

        const mappedProduct: Product = {
          id: row.id,
          created_at: row.created_at,
          name:
            row.name ??
            "Untitled product",
          school:
            row.school ??
            "",
          category:
            row.category ??
            "Other",
          price: Number(
            row.price ?? 0
          ),
          image:
            row.image ??
            null,
          description:
            row.description ??
            "",
          user_id:
            row.user_id ??
            null,
        };

        if (!mounted) return;

        setProduct(mappedProduct);

        saveRecentlyViewed(
          mappedProduct.id
        );

        if (mappedProduct.user_id) {
          const {
            data: profileData,
            error: profileError,
          } = await supabase
            .from("profiles")
            .select(
              "id, email, whatsapp, campus"
            )
            .eq(
              "id",
              mappedProduct.user_id
            )
            .maybeSingle();

          if (profileError) {
            console.error(
              "SELLER PROFILE ERROR:",
              profileError
            );
          }

          if (
            profileData &&
            mounted
          ) {
            const profile =
              profileData as ProfileRow;

            setSeller({
              id: profile.id,
              email:
                profile.email ??
                null,
              whatsapp:
                profile.whatsapp ??
                null,
              campus:
                profile.campus ??
                null,
            });
          }
        }
      } catch (error: unknown) {
        console.error(
          "PRODUCT LOAD ERROR:",
          error
        );

        if (mounted) {
          setMessage(
            getErrorMessage(
              error,
              "Could not load this product."
            )
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  function openWhatsApp() {
    setMessage("");

    if (!seller?.whatsapp) {
      setMessage(
        "The seller has not added a WhatsApp number yet."
      );
      return;
    }

    if (!product) {
      return;
    }

    let whatsappNumber =
      seller.whatsapp.replace(
        /\D/g,
        ""
      );

    if (
      whatsappNumber.startsWith(
        "0"
      )
    ) {
      whatsappNumber =
        "27" +
        whatsappNumber.substring(
          1
        );
    }

    if (
      !whatsappNumber.startsWith(
        "27"
      ) ||
      whatsappNumber.length <
        11
    ) {
      setMessage(
        "The seller's WhatsApp number appears to be invalid."
      );
      return;
    }

    const text =
      encodeURIComponent(
        `Hi, I'm interested in your "${product.name}" product on ResXchange. Is it still available?`
      );

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${text}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF9EF]">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div
            className="text-center"
            role="status"
            aria-live="polite"
          >
            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#90E0EF] border-t-[#3A86FF]" />

            <p className="mt-5 text-sm font-black tracking-[0.18em] text-[#14213D]">
              LOADING RESXCHANGE
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen flex-col bg-[#FFF9EF]">
        <Navbar />

        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-xl rounded-[2rem] bg-[#14213D] p-10 text-center text-white shadow-2xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#B8F500] text-4xl">
              📦
            </div>

            <h1 className="mt-7 text-3xl font-black">
              PRODUCT NOT FOUND
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#90E0EF]">
              {message ||
                "This product may have been removed."}
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-2xl bg-[#B8F500] px-7 py-4 text-sm font-black text-[#14213D] transition hover:-translate-y-1 hover:bg-[#90E0EF]"
            >
              ← BACK TO MARKETPLACE
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF9EF] text-[#14213D]">

      {/* NAVBAR */}

      <Navbar />

      {/* MAIN */}

      <section className="px-5 py-10 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">

          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-black transition hover:text-[#3A86FF]"
          >
            ← BACK TO MARKETPLACE
          </Link>

          <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(20,33,61,0.12)] lg:grid-cols-2">

            {/* IMAGE */}

            <div className="relative min-h-[380px] overflow-hidden bg-[#14213D] lg:min-h-[680px]">

              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                />
              ) : (
                <div className="flex h-full min-h-[380px] items-center justify-center text-8xl lg:min-h-[680px]">
                  📦
                </div>
              )}

              <div className="absolute left-6 top-6 rounded-full bg-[#B8F500] px-5 py-2 text-xs font-black tracking-[0.08em] text-[#14213D] shadow-lg">
                {product.category}
              </div>

            </div>

            {/* DETAILS */}

            <div className="flex flex-col p-7 md:p-10 lg:p-12">

              <div>

                <p className="text-xs font-black tracking-[0.22em] text-[#3A86FF]">
                  RESXCHANGE PRODUCT
                </p>

                <h1 className="mt-4 break-words text-4xl font-black leading-[0.95] tracking-[-0.05em] text-[#14213D] md:text-6xl">
                  {product.name}
                </h1>

                <div className="mt-6 inline-block rounded-full bg-[#3A86FF] px-5 py-2 text-2xl font-black text-white">
                  R
                  {product.price.toFixed(
                    2
                  )}
                </div>

              </div>

              {/* CATEGORY + CAMPUS */}

              <div className="mt-9 grid grid-cols-2 gap-3">

                <div className="rounded-2xl bg-[#F8FAFC] p-5">

                  <p className="text-[10px] font-black tracking-[0.15em] text-gray-400">
                    CATEGORY
                  </p>

                  <p className="mt-2 text-sm font-black text-[#14213D]">
                    {product.category}
                  </p>

                </div>

                <div className="rounded-2xl bg-[#F8FAFC] p-5">

                  <p className="text-[10px] font-black tracking-[0.15em] text-gray-400">
                    CAMPUS
                  </p>

                  <p className="mt-2 break-words text-sm font-black text-[#14213D]">
                    {product.school ||
                      "Not specified"}
                  </p>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="mt-9">

                <p className="text-xs font-black tracking-[0.18em] text-[#3A86FF]">
                  ABOUT THIS PRODUCT
                </p>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-500">
                  {product.description ||
                    "The seller hasn&apos;t added a description."}
                </p>

              </div>

              {/* SELLER */}

              <div className="mt-9 rounded-[1.7rem] bg-[#14213D] p-6 text-white shadow-xl">

                <div className="flex items-center justify-between gap-4">

                  <div className="min-w-0">

                    <p className="text-[10px] font-black tracking-[0.2em] text-[#90E0EF]">
                      SELLER
                    </p>

                    <h2 className="mt-2 break-all text-xl font-black">
                      {seller?.email ||
                        "ResXchange seller"}
                    </h2>

                  </div>

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#B8F500] text-2xl text-[#14213D]">
                    👤
                  </div>

                </div>

                {/* SELLER CAMPUS */}

                <div className="mt-5 rounded-2xl bg-white/10 p-4">

                  <p className="text-[10px] font-black tracking-[0.15em] text-[#90E0EF]">
                    CAMPUS
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    🎓{" "}
                    {seller?.campus ||
                      product.school ||
                      "Not specified"}
                  </p>

                </div>

                {/* WHATSAPP */}

                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#B8F500] px-5 py-5 text-sm font-black text-[#14213D] shadow-lg transition hover:-translate-y-1 hover:bg-[#90E0EF] active:translate-y-0"
                >
                  <span
                    className="text-xl"
                    aria-hidden="true"
                  >
                    💬
                  </span>

                  CONTACT SELLER ON WHATSAPP
                </button>

                {message && (
                  <div
                    role="alert"
                    className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-center text-sm font-bold text-red-300"
                  >
                    {message}
                  </div>
                )}

              </div>

              <div className="mt-8 text-center">

                <p className="text-xs font-black tracking-[0.15em] text-gray-400">
                  SWAP. SELL. CONNECT.
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* CAMPUS STRIP */}

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
          ].map(
            (school, index) => (
              <div
                key={`${school}-${index}`}
                className="flex items-center"
              >

                <span className="mx-8 text-sm font-black tracking-[0.2em]">
                  {school}
                </span>

                <span className="text-2xl text-[#3A86FF]">
                  ✦
                </span>

              </div>
            )
          )}

        </div>
      </section>

      {/* FOOTER */}

      <footer className="bg-[#14213D] px-6 py-12 text-white">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">

          <div>

            <Link
              href="/"
              className="inline-flex items-center"
            >
              <ResXchangeLogo
                compact
                className="h-12 w-auto"
              />
            </Link>

            <p className="mt-3 text-sm text-[#90E0EF]">
              Your campus. Your market. Your move.
            </p>

          </div>

          <div className="flex flex-wrap gap-6 text-sm font-bold text-[#90E0EF]">

            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
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

          <div className="text-sm font-black text-[#90E0EF]">
            SOUTH AFRICA 🇿🇦
          </div>

        </div>

      </footer>

    </main>
  );
}

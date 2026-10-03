
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../utils/supabase/client";

type Product = {
  id: number;
  name: string;
  school: string;
  category: string;
  price: number | string;
  image: string;
  description: string;
};

export default function MyListingsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadListings() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("MY LISTINGS ERROR:", error);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    }

    loadListings();
  }, []);

  async function deleteListing(product: Product) {
    const confirmed = confirm(
      `Delete "${product.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("DELETE ERROR:", error);
      alert(`Delete failed: ${error.message}`);
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter((item) => item.id !== product.id)
    );

    alert("Listing deleted successfully!");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF9EF] px-6 py-20 text-[#111827]">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 animate-pulse rounded-full bg-[#3A86FF]" />
            <p className="text-sm font-black tracking-[0.15em]">
              LOADING YOUR LISTINGS...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF9EF] px-6 py-12 text-[#111827] md:py-20">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-5 inline-flex rounded-full bg-[#8B5CF6] px-4 py-2 text-xs font-black tracking-[0.15em] text-white">
              SELLER DASHBOARD
            </div>

            <h1 className="text-5xl font-black tracking-[-0.06em] md:text-7xl">
              My
              <span className="ml-2 text-[#3A86FF]">
                Listings.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-[#6B7280]">
              Manage everything you&apos;ve put on the ResXchange marketplace.
            </p>
          </div>

          <Link
            href="/sell"
            className="rounded-full bg-[#3A86FF] px-7 py-4 text-center text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#2563EB]"
          >
            + CREATE LISTING
          </Link>
        </div>

        {/* Listing count */}
        <div className="mb-8 rounded-3xl bg-[#111827] p-6 text-white md:p-8">
          <p className="text-xs font-black tracking-[0.2em] text-[#B8F500]">
            YOUR MARKET
          </p>

          <div className="mt-3 flex items-end gap-3">
            <p className="text-5xl font-black">
              {products.length}
            </p>

            <p className="pb-1 text-sm text-gray-400">
              active listing{products.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {/* Empty state */}
        {products.length === 0 ? (
          <div className="rounded-[2rem] border-2 border-dashed border-black/10 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#B8F500] text-3xl">
              🛍️
            </div>

            <h2 className="mt-6 text-3xl font-black">
              Your shop is empty.
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              Got something to sell? Put it in front of students
              around your campus.
            </p>

            <Link
              href="/sell"
              className="mt-8 inline-block rounded-full bg-[#3A86FF] px-7 py-4 text-sm font-black text-white"
            >
              CREATE YOUR FIRST LISTING →
            </Link>
          </div>
        ) : (
          /* Listings */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => {
              const accents = [
                "bg-[#3A86FF]",
                "bg-[#B8F500]",
                "bg-[#8B5CF6]",
                "bg-[#FF5C5C]",
              ];

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-[2rem] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Image */}
                  <Link
                    href={`/products/${product.id}`}
                    className="relative block overflow-hidden bg-gray-100"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-black tracking-[0.1em] ${
                        accents[index % accents.length]
                      } ${
                        index % accents.length === 1
                          ? "text-[#111827]"
                          : "text-white"
                      }`}
                    >
                      {product.category.toUpperCase()}
                    </span>
                  </Link>

                  {/* Details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="truncate text-xl font-black">
                          {product.name}
                        </h2>

                        <p className="mt-1 truncate text-xs text-gray-500">
                          📍 {product.school}
                        </p>
                      </div>

                      <p className="whitespace-nowrap text-lg font-black text-[#3A86FF]">
                        R{product.price}
                      </p>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-500">
                      {product.description}
                    </p>

                    {/* Actions */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <Link
                        href={`/products/${product.id}`}
                        className="rounded-xl bg-[#111827] py-3 text-center text-xs font-black text-white transition hover:bg-[#3A86FF]"
                      >
                        VIEW
                      </Link>

                      <Link
                        href={`/my-listings/edit/${product.id}`}
                        className="rounded-xl border-2 border-[#111827] py-3 text-center text-xs font-black transition hover:bg-[#111827] hover:text-white"
                      >
                        EDIT
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteListing(product)}
                      className="mt-3 w-full rounded-xl border-2 border-red-100 py-3 text-xs font-black text-red-500 transition hover:border-red-500 hover:bg-red-500 hover:text-white"
                    >
                      🗑️ DELETE LISTING
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

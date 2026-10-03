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

type ProductsProps = {
  search?: string;
  category?: string;
};

export default function Products({
  search = "",
  category = "All",
}: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("SUPABASE ERROR:", error);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    }

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <section className="bg-[#FFF9EF] px-6 py-20 text-[#111827]">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 animate-pulse rounded-full bg-[#3A86FF]" />
            <p className="text-sm font-black tracking-[0.15em]">
              LOADING THE MARKET...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FFF9EF] px-6 py-20 text-[#111827] md:py-24">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#111827] px-4 py-2 text-xs font-black tracking-[0.15em] text-white">
              <span className="h-2 w-2 rounded-full bg-[#B8F500]" />
              TRENDING NOW
            </div>

            <h2 className="text-5xl font-black leading-none tracking-[-0.06em] md:text-6xl">
              Fresh on
              <span className="ml-2 text-[#3A86FF]">
                Campus.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-[#6B7280]">
            Discover what students around South Africa are
            selling, creating and building right now.
          </p>

        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-black/10 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#B8F500] text-2xl">
              🔎
            </div>

            <p className="mt-6 text-2xl font-black">
              Nothing found.
            </p>

            <p className="mt-2 text-sm text-[#6B7280]">
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {filteredProducts.map((product, index) => {

              const accentColors = [
                "bg-[#3A86FF]",
                "bg-[#B8F500]",
                "bg-[#FF5C5C]",
                "bg-[#8B5CF6]",
              ];

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
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

                    {/* Category */}
                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-black tracking-[0.1em] ${
                        accentColors[index % accentColors.length]
                      } ${
                        index % 4 === 1
                          ? "text-[#111827]"
                          : "text-white"
                      }`}
                    >
                      {product.category.toUpperCase()}
                    </span>
                  </Link>

                  {/* Information */}
                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <Link href={`/products/${product.id}`}>
                          <h3 className="truncate text-lg font-black tracking-[-0.02em] transition group-hover:text-[#3A86FF]">
                            {product.name}
                          </h3>
                        </Link>

                        <p className="mt-1 truncate text-xs font-medium text-[#6B7280]">
                          📍 {product.school}
                        </p>

                      </div>

                      <p className="whitespace-nowrap text-lg font-black text-[#111827]">
                        R{product.price}
                      </p>

                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#111827] py-3 text-xs font-black tracking-[0.08em] text-white transition hover:bg-[#3A86FF]"
                    >
                      VIEW LISTING →
                    </Link>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </div>
    </section>
  );
}
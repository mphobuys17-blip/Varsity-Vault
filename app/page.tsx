"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Search from "./components/Search";
import Products from "./components/Products";
import Features from "./components/Features";

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  return (
    <main className="min-h-screen bg-[#14213D] text-white">
      <Navbar />
      <Hero />

      <Search
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      <Products
        search={search}
        category={category}
      />

      <Features />
    </main>
  );
}
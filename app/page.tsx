"use client";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Search from "./components/Search";
import Products from "./components/Products";
import Features from "./components/Features";

export default function Home() {
  const [search, setSearch] = useState("");
  return (
    <main className="min-h-screen bg-[#14213D] text-white">

      <Navbar />
      <Hero />
      <Search
  search={search}
  setSearch={setSearch}
/>
      <Products
  search={search}
/>
      <Features />

     
    

   

     

     
    
     

    </main>
  );
}
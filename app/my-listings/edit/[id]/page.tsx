"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../utils/supabase/client";

export default function EditListingPage() {
  const params = useParams();
  const id = params.id as string;

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Fashion");
  const [university, setUniversity] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("You must be logged in.");
        return;
      }

      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error || !product) {
        console.error("EDIT PRODUCT ERROR:", error);
        alert("Product not found or you don't own this listing.");
        return;
      }

      setProductName(product.name);
      setPrice(String(product.price));
      setCategory(product.category);
      setUniversity(product.school);
      setDescription(product.description);

      setLoading(false);
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-10">
        <p>Loading listing...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-2xl">

        <h1 className="text-4xl font-bold text-[#14213D]">
          Edit Listing
        </h1>

        <p className="mt-3 text-gray-500">
          Update your product details.
        </p>

        <form
  onSubmit={async (e) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const { error } = await supabase
      .from("products")
      .update({
        name: productName,
        price: price,
        category: category,
        school: university,
        description: description,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("UPDATE ERROR:", error);
      alert(`Update failed: ${error.message}`);
      return;
    }

    alert("Listing updated successfully!");
  }}
  className="mt-10 space-y-6"
> 

          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Product Name"
            className="w-full rounded-xl border p-4"
          />

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="w-full rounded-xl border p-4"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border p-4"
          >
            <option>Fashion</option>
            <option>Tech</option>
            <option>Books</option>
            <option>Food</option>
            <option>Services</option>
          </select>

          <input
            type="text"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            placeholder="University"
            className="w-full rounded-xl border p-4"
          />

          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your product..."
            className="w-full rounded-xl border p-4"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-[#3A86FF] py-4 font-bold text-white hover:bg-blue-600"
          >
            Save Changes
          </button>

        </form>
      </div>
    </main>
  );
}
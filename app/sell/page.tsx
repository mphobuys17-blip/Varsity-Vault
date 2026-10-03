
"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ResXchangeLogo from "../components/ResXchangeLogo";
import { supabase } from "../utils/supabase/client";

const categories = [
  "Perfumes",
  "Printing",
  "Snacks",
  "Tech",
  "Fashion",
  "Hair",
  "Service",
  "Other",
];

const campuses = [
  // University of Cape Town
  "University of Cape Town — Upper Campus",
  "University of Cape Town — Middle Campus",
  "University of Cape Town — Lower Campus",
  "University of Cape Town — Hiddingh Campus",
  "University of Cape Town — Health Sciences Campus",
  "University of Cape Town — Graduate School of Business",

  // University of the Western Cape
  "University of the Western Cape — Main Campus",

  // Cape Peninsula University of Technology
  "Cape Peninsula University of Technology — Cape Town Campus",
  "Cape Peninsula University of Technology — Bellville Campus",
  "Cape Peninsula University of Technology — Mowbray Campus",
  "Cape Peninsula University of Technology — Athlone Campus",
  "Cape Peninsula University of Technology — Granger Bay Campus",
  "Cape Peninsula University of Technology — Wellington Campus",
  "Cape Peninsula University of Technology — District Six Campus",

  // Stellenbosch University
  "Stellenbosch University — Stellenbosch Campus",
  "Stellenbosch University — Tygerberg Campus",
  "Stellenbosch University — Bellville Park Campus",
  "Stellenbosch University — Saldanha Campus",

  // University of Johannesburg
  "University of Johannesburg — Auckland Park Kingsway Campus",
  "University of Johannesburg — Auckland Park Bunting Road Campus",
  "University of Johannesburg — Doornfontein Campus",
  "University of Johannesburg — Soweto Campus",

  // University of the Witwatersrand
  "University of the Witwatersrand — East Campus",
  "University of the Witwatersrand — West Campus",
  "University of the Witwatersrand — Education Campus",
  "University of the Witwatersrand — Medical School",

  // University of Pretoria
  "University of Pretoria — Hatfield Campus",
  "University of Pretoria — Hillcrest Campus",
  "University of Pretoria — Groenkloof Campus",
  "University of Pretoria — Prinshof Campus",
  "University of Pretoria — Onderstepoort Campus",
  "University of Pretoria — Mamelodi Campus",
  "University of Pretoria — Hammanskraal Campus",

  // Tshwane University of Technology
  "Tshwane University of Technology — Pretoria Campus",
  "Tshwane University of Technology — Arcadia Campus",
  "Tshwane University of Technology — Soshanguve North Campus",
  "Tshwane University of Technology — Soshanguve South Campus",
  "Tshwane University of Technology — Ga-Rankuwa Campus",
  "Tshwane University of Technology — Mbombela Campus",
  "Tshwane University of Technology — eMalahleni Campus",
  "Tshwane University of Technology — Polokwane Campus",

  // University of South Africa
  "University of South Africa — Muckleneuk Campus",
  "University of South Africa — Sunnyside Campus",
  "University of South Africa — Florida Campus",
  "University of South Africa — Science Campus",
  "University of South Africa — Ekurhuleni Campus",
  "University of South Africa — Johannesburg Campus",
  "University of South Africa — Pretoria Campus",

  // Sefako Makgatho Health Sciences University
  "Sefako Makgatho Health Sciences University — Ga-Rankuwa Campus",

  // University of Limpopo
  "University of Limpopo — Turfloop Campus",

  // University of Venda
  "University of Venda — Thohoyandou Campus",

  // University of Mpumalanga
  "University of Mpumalanga — Mbombela Campus",
  "University of Mpumalanga — Siyabuswa Campus",

  // North-West University
  "North-West University — Potchefstroom Campus",
  "North-West University — Mahikeng Campus",
  "North-West University — Vanderbijlpark Campus",

  // University of the Free State
  "University of the Free State — Bloemfontein Campus",
  "University of the Free State — Qwaqwa Campus",
  "University of the Free State — South Campus",

  // Central University of Technology
  "Central University of Technology — Bloemfontein Campus",
  "Central University of Technology — Welkom Campus",

  // Vaal University of Technology
  "Vaal University of Technology — Vanderbijlpark Campus",
  "Vaal University of Technology — Sebokeng Campus",
  "Vaal University of Technology — Ekurhuleni Campus",

  // University of KwaZulu-Natal
  "University of KwaZulu-Natal — Howard College Campus",
  "University of KwaZulu-Natal — Westville Campus",
  "University of KwaZulu-Natal — Pietermaritzburg Campus",
  "University of KwaZulu-Natal — Edgewood Campus",
  "University of KwaZulu-Natal — Nelson R Mandela School of Medicine",

  // Durban University of Technology
  "Durban University of Technology — Steve Biko Campus",
  "Durban University of Technology — Ritson Campus",
  "Durban University of Technology — ML Sultan Campus",
  "Durban University of Technology — Brickfield Campus",

  // Mangosuthu University of Technology
  "Mangosuthu University of Technology — Main Campus",

  // University of Zululand
  "University of Zululand — KwaDlangezwa Campus",
  "University of Zululand — Richards Bay Campus",

  // Rhodes University
  "Rhodes University — Makhanda Campus",

  // University of Fort Hare
  "University of Fort Hare — Alice Campus",
  "University of Fort Hare — East London Campus",
  "University of Fort Hare — Bhisho Campus",

  // Walter Sisulu University
  "Walter Sisulu University — Mthatha Campus",
  "Walter Sisulu University — Butterworth Campus",
  "Walter Sisulu University — Buffalo City Campus",
  "Walter Sisulu University — Komani Campus",

  // Nelson Mandela University
  "Nelson Mandela University — South Campus",
  "Nelson Mandela University — North Campus",
  "Nelson Mandela University — Missionvale Campus",
  "Nelson Mandela University — George Campus",
  "Nelson Mandela University — Bird Street Campus",

  // Sol Plaatje University
  "Sol Plaatje University — Central Campus",
  "Sol Plaatje University — North Campus",

  // University of the Free State / other
  "University of the Free State — Bloemfontein",

  // Other
  "Other South African University",
  "Other South African College",
  "Other TVET College",
  "Other Campus",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function SellPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [campus, setCampus] = useState("");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleImageChange(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setMessage("Image must be smaller than 5MB.");
      e.target.value = "";
      return;
    }

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const preview = URL.createObjectURL(file);

    setImage(file);
    setImagePreview(preview);
    setMessage("");
  }

  function removeImage() {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview("");
    setMessage("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setMessage("");

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const numericPrice = Number(price);

    if (!trimmedName) {
      setMessage("Please enter a product or service name.");
      return;
    }

    if (
      !price ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      setMessage("Please enter a valid price.");
      return;
    }

    if (!category) {
      setMessage("Please select a category.");
      return;
    }

    if (!campus) {
      setMessage("Please select your campus.");
      return;
    }

    if (!trimmedDescription) {
      setMessage("Please add a description.");
      return;
    }

    if (!image) {
      setMessage("Please upload a product image.");
      return;
    }

    setLoading(true);

    let uploadedFilePath = "";

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("AUTH ERROR:", userError);
        setMessage("Could not verify your account.");
        return;
      }

      if (!user) {
        router.push("/login");
        return;
      }

      const fileExtension =
        image.name.split(".").pop()?.toLowerCase() || "jpg";

      uploadedFilePath =
        `${user.id}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(uploadedFilePath, image, {
          cacheControl: "3600",
          upsert: false,
          contentType: image.type,
        });

      if (uploadError) {
        console.error("IMAGE UPLOAD ERROR:", uploadError);
        setMessage(
          `Image upload failed: ${uploadError.message}`
        );
        return;
      }

      const { data: publicUrlData } =
        supabase.storage
          .from("product-images")
          .getPublicUrl(uploadedFilePath);

      const imageUrl = publicUrlData.publicUrl;

      if (!imageUrl) {
        await supabase.storage
          .from("product-images")
          .remove([uploadedFilePath]);

        uploadedFilePath = "";

        setMessage(
          "The image uploaded, but its public URL could not be created."
        );

        return;
      }

      const { error: productError } = await supabase
        .from("products")
        .insert({
          name: trimmedName,
          price: numericPrice,
          category,
          school: campus,
          description: trimmedDescription,
          image: imageUrl,
          user_id: user.id,
        });

      if (productError) {
        console.error(
          "PRODUCT CREATION ERROR:",
          productError
        );

        if (uploadedFilePath) {
          await supabase.storage
            .from("product-images")
            .remove([uploadedFilePath]);
        }

        setMessage(
          "Could not publish your product. Please try again."
        );

        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("UNEXPECTED SELL ERROR:", error);

      if (uploadedFilePath) {
        await supabase.storage
          .from("product-images")
          .remove([uploadedFilePath]);
      }

      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF9EF] text-[#111827]">

      {/* HEADER */}
      <section className="border-b border-black/5 bg-[#14213D] text-white">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">

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

          <div className="mt-8 max-w-2xl">

            <div className="mb-4 inline-flex items-center rounded-full border border-[#B8F500]/30 bg-[#B8F500]/10 px-4 py-2 text-sm font-medium text-[#B8F500]">
              SELL ON RESXCHANGE
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Turn your stuff into{" "}
              <span className="text-[#B8F500]">
                cash.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
              Add your products or services and connect
              with students on campus.
            </p>

          </div>

        </div>
      </section>

      {/* FORM */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >

          {/* MAIN FORM */}
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-[0_20px_60px_rgba(20,33,61,0.08)] sm:p-8">

            <div className="mb-8">

              <p className="text-sm font-bold uppercase tracking-wider text-[#3A86FF]">
                Product details
              </p>

              <h2 className="mt-2 text-2xl font-black">
                What are you selling?
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Give buyers enough information to know
                exactly what they&apos;re getting.
              </p>

            </div>

            <div className="space-y-6">

              {/* NAME */}
              <div>

                <label
                  htmlFor="product-name"
                  className="mb-2 block text-sm font-bold"
                >
                  Product or service name
                </label>

                <input
                  id="product-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  placeholder="e.g. AirPods Pro, Printing, Hair braiding"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm outline-none transition focus:border-[#3A86FF] focus:bg-white focus:ring-4 focus:ring-[#3A86FF]/10"
                />

              </div>

              {/* PRICE */}
              <div>

                <label
                  htmlFor="product-price"
                  className="mb-2 block text-sm font-bold"
                >
                  Price
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                    R
                  </span>

                  <input
                    id="product-price"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-10 pr-4 text-sm outline-none transition focus:border-[#3A86FF] focus:bg-white focus:ring-4 focus:ring-[#3A86FF]/10"
                  />

                </div>

              </div>

              {/* CATEGORY + CAMPUS */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label
                    htmlFor="product-category"
                    className="mb-2 block text-sm font-bold"
                  >
                    Category
                  </label>

                  <select
                    id="product-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm outline-none transition focus:border-[#3A86FF] focus:bg-white focus:ring-4 focus:ring-[#3A86FF]/10"
                  >
                    <option value="">
                      Choose category
                    </option>

                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                </div>

                <div>

                  <label
                    htmlFor="product-campus"
                    className="mb-2 block text-sm font-bold"
                  >
                    Campus
                  </label>

                  <select
                    id="product-campus"
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm outline-none transition focus:border-[#3A86FF] focus:bg-white focus:ring-4 focus:ring-[#3A86FF]/10"
                  >
                    <option value="">
                      Choose campus
                    </option>

                    {campuses.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                </div>

              </div>

              {/* DESCRIPTION */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="product-description"
                    className="text-sm font-bold"
                  >
                    Description
                  </label>

                  <span className="text-xs text-gray-400">
                    {description.length}/500
                  </span>

                </div>

                <textarea
                  id="product-description"
                  value={description}
                  maxLength={500}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Tell students about your product or service..."
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm leading-6 outline-none transition focus:border-[#3A86FF] focus:bg-white focus:ring-4 focus:ring-[#3A86FF]/10"
                />

              </div>

              {/* MESSAGE */}
              {message && (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-600"
                >
                  {message}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#B8F500] px-6 py-4 text-sm font-black text-[#14213D] shadow-lg shadow-[#B8F500]/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Publishing..."
                  : "Publish product →"}
              </button>

            </div>

          </div>

          {/* IMAGE PANEL */}
          <aside className="h-fit rounded-3xl border border-black/5 bg-white p-5 shadow-[0_20px_60px_rgba(20,33,61,0.08)] sm:p-6 lg:sticky lg:top-6">

            <div className="mb-5">

              <p className="text-sm font-bold uppercase tracking-wider text-[#8B5CF6]">
                Product image
              </p>

              <h2 className="mt-2 text-xl font-black">
                Show buyers what they&apos;re getting.
              </h2>

            </div>

            {!imagePreview ? (

              <label className="group flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center transition hover:border-[#3A86FF] hover:bg-[#3A86FF]/5">

                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#14213D] text-2xl text-white transition group-hover:scale-110">
                  📷
                </div>

                <p className="font-bold">
                  Upload an image
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG or WEBP
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Maximum size: 5MB
                </p>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

              </label>

            ) : (

              <div className="overflow-hidden rounded-3xl border border-black/5 bg-gray-50">

                <div className="relative aspect-square overflow-hidden">

                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-3 top-3 rounded-full bg-black/70 px-4 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-red-500"
                  >
                    Remove
                  </button>

                </div>

                <div className="p-4">

                  <p className="truncate text-sm font-bold">
                    {image?.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Ready to upload
                  </p>

                </div>

              </div>

            )}

            {/* TIPS */}
            <div className="mt-6 rounded-2xl bg-[#FFF9EF] p-5">

              <p className="text-sm font-black text-[#14213D]">
                💡 Product tips
              </p>

              <ul className="mt-3 space-y-2 text-xs leading-5 text-gray-500">
                <li>• Use a clear photo</li>
                <li>• Give your product a specific name</li>
                <li>• Be honest about the condition</li>
                <li>• Include useful details in the description</li>
                <li>• AND PLEASE NO DUZUS CHAT PLEASE</li>
              </ul>

            </div>

          </aside>

        </form>

      </section>

    </main>
  );
}

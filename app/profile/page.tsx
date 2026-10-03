
"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import ResXchangeLogo from "../components/ResXchangeLogo";
import { supabase } from "../utils/supabase/client";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

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
  "Unisa",
  "UCT",
  "Wits",
  "UP",
  "TUT",
  "UJ",
  "UKZN",
  "UFS",
  "NWU",
  "Other",
];

type Product = {
  id: number;
  name: string;
  school: string | null;
  category: string | null;
  price: number;
  image: string | null;
  description: string | null;
};

type ProductRow = {
  id: number;
  name: string | null;
  school: string | null;
  category: string | null;
  price: number | string | null;
  image: string | null;
  description: string | null;
};

type Profile = {
  id: string;
  email: string | null;
  whatsapp: string;
  campus: string;
};

type ProfileRow = {
  id: string;
  email: string | null;
  whatsapp: string | null;
  campus: string | null;
};

function getErrorMessage(error: unknown, fallback: string) {
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

function getStoragePathFromUrl(url: string | null) {
  if (!url) return null;

  const marker = "/storage/v1/object/public/product-images/";

  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return decodeURIComponent(
    url.slice(index + marker.length)
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const [whatsapp, setWhatsapp] = useState("");
  const [campus, setCampus] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCampus, setEditCampus] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState("");

  const [savingProduct, setSavingProduct] = useState(false);
  const [productMessage, setProductMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        if (mounted) {
          setLoading(true);
          setMessage("");
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          if (mounted) {
            setMessage("Please log in to view your profile.");
          }

          return;
        }

        const { data: profileData, error: profileError } =
          await supabase
            .from("profiles")
            .select("id, email, whatsapp, campus")
            .eq("id", user.id)
            .maybeSingle();

        if (profileError) {
          console.error(
            "PROFILE ERROR:",
            profileError
          );
        }

        const {
          data: productData,
          error: productError,
        } = await supabase
          .from("products")
          .select(
            "id, name, school, category, price, image, description"
          )
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          });

        if (productError) {
          throw productError;
        }

        const rows =
          (productData as ProductRow[] | null) ?? [];

        const formattedProducts: Product[] = rows.map(
          (product) => ({
            id: product.id,
            name: product.name ?? "Unnamed product",
            school: product.school ?? null,
            category: product.category ?? "Other",
            price: Number(product.price ?? 0),
            image: product.image ?? null,
            description: product.description ?? null,
          })
        );

        const profileRow =
          profileData as ProfileRow | null;

        const currentProfile: Profile = {
          id: user.id,
          email:
            profileRow?.email ??
            user.email ??
            null,
          whatsapp:
            profileRow?.whatsapp ??
            "",
          campus:
            profileRow?.campus ??
            "",
        };

        if (!mounted) return;

        setProducts(formattedProducts);
        setProfile(currentProfile);
        setWhatsapp(currentProfile.whatsapp);
        setCampus(currentProfile.campus);
      } catch (error: unknown) {
        console.error(
          "PROFILE PAGE ERROR:",
          error
        );

        if (mounted) {
          setMessage(
            getErrorMessage(
              error,
              "Something went wrong while loading your profile."
            )
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (
        editImagePreview &&
        editImagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(editImagePreview);
      }
    };
  }, [editImagePreview]);

  async function saveProfile() {
    if (!profile || saving) return;

    try {
      setSaving(true);
      setMessage("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setMessage("You are not logged in.");
        return;
      }

      const cleanedWhatsapp = whatsapp.trim();
      const cleanedCampus = campus.trim();

      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            email: user.email ?? null,
            whatsapp: cleanedWhatsapp,
            campus: cleanedCampus,
          },
          {
            onConflict: "id",
          }
        );

      if (error) {
        throw error;
      }

      setProfile({
        ...profile,
        whatsapp: cleanedWhatsapp,
        campus: cleanedCampus,
      });

      setWhatsapp(cleanedWhatsapp);
      setCampus(cleanedCampus);
      setMessage("Profile saved successfully.");
    } catch (error: unknown) {
      console.error(
        "SAVE PROFILE ERROR:",
        error
      );

      setMessage(
        getErrorMessage(
          error,
          "Could not save your profile."
        )
      );
    } finally {
      setSaving(false);
    }
  }

  function startEditing(product: Product) {
    setEditingProduct(product);

    setEditName(product.name);
    setEditPrice(String(product.price));
    setEditCampus(product.school ?? "");
    setEditCategory(product.category ?? "Other");
    setEditDescription(product.description ?? "");

    setEditImage(null);
    setEditImagePreview(product.image ?? "");
    setProductMessage("");

    requestAnimationFrame(() => {
      const editor =
        document.getElementById("product-editor");

      editor?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function cancelEditing() {
    if (
      editImagePreview &&
      editImagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(editImagePreview);
    }

    setEditingProduct(null);

    setEditName("");
    setEditPrice("");
    setEditCampus("");
    setEditCategory("");
    setEditDescription("");

    setEditImage(null);
    setEditImagePreview("");
    setProductMessage("");
  }

  function handleProductImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProductMessage(
        "Please choose an image file."
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setProductMessage(
        "Image must be smaller than 5MB."
      );

      event.target.value = "";
      return;
    }

    if (
      editImagePreview &&
      editImagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(editImagePreview);
    }

    const preview = URL.createObjectURL(file);

    setEditImage(file);
    setEditImagePreview(preview);
    setProductMessage("");

    event.target.value = "";
  }

  async function saveProduct() {
    if (!editingProduct || savingProduct) return;

    const cleanedName = editName.trim();
    const cleanedCampus = editCampus.trim();
    const cleanedDescription =
      editDescription.trim();
    const numericPrice = Number(editPrice);

    if (!cleanedName) {
      setProductMessage(
        "Product name is required."
      );
      return;
    }

    if (
      !editPrice ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      setProductMessage(
        "Please enter a valid price."
      );
      return;
    }

    if (!cleanedCampus) {
      setProductMessage(
        "Please choose a campus."
      );
      return;
    }

    if (!editCategory) {
      setProductMessage(
        "Please choose a category."
      );
      return;
    }

    if (!cleanedDescription) {
      setProductMessage(
        "Please add a description."
      );
      return;
    }

    try {
      setSavingProduct(true);
      setProductMessage("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setProductMessage(
          "You are not logged in."
        );
        return;
      }

      let finalImageUrl =
        editingProduct.image;

      let uploadedImagePath: string | null =
        null;

      if (editImage) {
        const fileExtension =
          editImage.name
            .split(".")
            .pop()
            ?.toLowerCase() || "jpg";

        const fileName =
          `${user.id}/${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.${fileExtension}`;

        const { error: uploadError } =
          await supabase.storage
            .from("product-images")
            .upload(
              fileName,
              editImage,
              {
                cacheControl: "3600",
                upsert: false,
                contentType: editImage.type,
              }
            );

        if (uploadError) {
          throw uploadError;
        }

        uploadedImagePath = fileName;

        const {
          data: publicUrlData,
        } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        finalImageUrl =
          publicUrlData.publicUrl;
      }

      const {
        data: updatedProduct,
        error: updateError,
      } = await supabase
        .from("products")
        .update({
          name: cleanedName,
          price: numericPrice,
          school: cleanedCampus,
          category: editCategory,
          description: cleanedDescription,
          image: finalImageUrl,
        })
        .eq("id", editingProduct.id)
        .eq("user_id", user.id)
        .select(
          "id, name, school, category, price, image, description"
        )
        .single();

      if (updateError) {
        if (uploadedImagePath) {
          await supabase.storage
            .from("product-images")
            .remove([
              uploadedImagePath,
            ]);
        }

        throw updateError;
      }

      if (!updatedProduct) {
        if (uploadedImagePath) {
          await supabase.storage
            .from("product-images")
            .remove([
              uploadedImagePath,
            ]);
        }

        throw new Error(
          "The product could not be updated."
        );
      }

      const product =
        updatedProduct as ProductRow;

      const formattedProduct: Product = {
        id: product.id,
        name:
          product.name ??
          "Unnamed product",
        school:
          product.school ??
          null,
        category:
          product.category ??
          "Other",
        price: Number(
          product.price ?? 0
        ),
        image:
          product.image ??
          null,
        description:
          product.description ??
          null,
      };

      setProducts(
        (currentProducts) =>
          currentProducts.map(
            (currentProduct) =>
              currentProduct.id ===
              formattedProduct.id
                ? formattedProduct
                : currentProduct
          )
      );

      setEditingProduct(
        formattedProduct
      );
      setEditName(
        formattedProduct.name
      );
      setEditPrice(
        String(formattedProduct.price)
      );
      setEditCampus(
        formattedProduct.school ??
          ""
      );
      setEditCategory(
        formattedProduct.category ??
          "Other"
      );
      setEditDescription(
        formattedProduct.description ??
          ""
      );
      setEditImage(null);

      if (
        uploadedImagePath &&
        editImagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          editImagePreview
        );
      }

      setEditImagePreview(
        formattedProduct.image ?? ""
      );

      setProductMessage(
        "Product updated successfully."
      );
    } catch (error: unknown) {
      console.error(
        "SAVE PRODUCT ERROR:",
        error
      );

      setProductMessage(
        getErrorMessage(
          error,
          "Something went wrong while updating the product."
        )
      );
    } finally {
      setSavingProduct(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF9EF] text-[#14213D]">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div
            className="text-center"
            role="status"
            aria-live="polite"
          >
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#14213D]/10 border-t-[#B8F500]" />

            <p className="font-semibold">
              Loading profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#FFF9EF] text-[#14213D]">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="max-w-md rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm">
            <h1 className="mb-3 text-2xl font-black">
              Profile unavailable
            </h1>

            <p className="mb-6 text-sm text-black/60">
              {message ||
                "Please log in to access your profile."}
            </p>

            <Link
              href="/login"
              className="inline-flex rounded-full bg-[#14213D] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              Log In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const totalProducts =
    products.length;

  const activeProducts =
    products.length;

  return (
    <main className="min-h-screen bg-[#FFF9EF] text-[#14213D]">
      <Navbar />

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">

        {/* HEADER */}

        <div className="mb-10">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-black/40">
            Your account
          </p>

          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Profile
          </h1>

          <p className="mt-3 max-w-xl text-black/60">
            Manage your details and see the products you are
            selling on ResXchange.
          </p>
        </div>

        {/* PROFILE */}

        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">

          {/* PROFILE SUMMARY */}

          <div className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm">

            <div className="mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-black/10 bg-[#FFF9EF]">
              <ResXchangeLogo
                compact
                className="h-12 w-auto"
              />
            </div>

            <h2 className="text-2xl font-black">
              {profile.email?.split("@")[0] ||
                "Student"}
            </h2>

            <p className="mt-1 break-all text-sm text-black/50">
              {profile.email}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">

              <div className="rounded-2xl bg-[#FFF9EF] p-4">
                <p className="text-2xl font-black">
                  {totalProducts}
                </p>

                <p className="text-xs font-semibold text-black/50">
                  Products
                </p>
              </div>

              <div className="rounded-2xl bg-[#B8F500] p-4">
                <p className="text-2xl font-black">
                  {campus ? "✓" : "—"}
                </p>

                <p className="text-xs font-semibold text-black/60">
                  Campus
                </p>
              </div>

            </div>
          </div>

          {/* PROFILE DETAILS */}

          <div className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm">

            <div className="mb-7">
              <h2 className="text-2xl font-black">
                Your details
              </h2>

              <p className="mt-1 text-sm text-black/50">
                Add your WhatsApp number so buyers can
                contact you.
              </p>
            </div>

            <div className="space-y-5">

              <div>
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm font-bold"
                >
                  Email
                </label>

                <input
                  id="profile-email"
                  type="email"
                  value={profile.email ?? ""}
                  disabled
                  className="w-full rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-whatsapp"
                  className="mb-2 block text-sm font-bold"
                >
                  WhatsApp number
                </label>

                <input
                  id="profile-whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(event) =>
                    setWhatsapp(
                      event.target.value
                    )
                  }
                  placeholder="e.g. 27821234567"
                  autoComplete="tel"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B8F500] focus:ring-4 focus:ring-[#B8F500]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-campus"
                  className="mb-2 block text-sm font-bold"
                >
                  Campus / School
                </label>

                <input
                  id="profile-campus"
                  type="text"
                  value={campus}
                  onChange={(event) =>
                    setCampus(
                      event.target.value
                    )
                  }
                  placeholder="e.g. University of Limpopo"
                  autoComplete="organization"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B8F500] focus:ring-4 focus:ring-[#B8F500]/20"
                />
              </div>

              <button
                type="button"
                onClick={saveProfile}
                disabled={saving}
                className="rounded-full bg-[#14213D] px-7 py-3 font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Profile"}
              </button>

              {message && (
                <p
                  role="status"
                  aria-live="polite"
                  className="rounded-2xl bg-[#FFF9EF] px-4 py-3 text-sm font-semibold"
                >
                  {message}
                </p>
              )}

            </div>
          </div>
        </div>

        {/* SELLER STATS */}

        <div className="mt-10">

          <div className="mb-5">
            <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-black/40">
              Seller dashboard
            </p>

            <h2 className="text-3xl font-black">
              Seller Stats
            </h2>

            <p className="mt-2 text-sm text-black/50">
              A quick overview of your ResXchange products.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">

            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF9EF] text-2xl">
                📦
              </div>

              <p className="text-sm font-bold text-black/50">
                Total Products
              </p>

              <p className="mt-1 text-4xl font-black">
                {totalProducts}
              </p>

              <p className="mt-2 text-xs font-semibold text-black/40">
                Products connected to your account
              </p>
            </div>

            <div className="rounded-[2rem] border border-black/10 bg-[#B8F500] p-6 shadow-sm">

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 text-2xl">
                🟢
              </div>

              <p className="text-sm font-bold text-black/60">
                Active Products
              </p>

              <p className="mt-1 text-4xl font-black">
                {activeProducts}
              </p>

              <p className="mt-2 text-xs font-semibold text-black/50">
                Products currently available on ResXchange
              </p>
            </div>

          </div>
        </div>

        {/* PRODUCTS */}

        <div className="mt-14">

          <div className="mb-6 flex items-end justify-between gap-4">

            <div>
              <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-black/40">
                Seller dashboard
              </p>

              <h2 className="text-3xl font-black">
                My Products
              </h2>
            </div>

            <Link
              href="/sell"
              className="rounded-full bg-[#B8F500] px-5 py-3 text-sm font-black text-[#14213D] transition hover:-translate-y-0.5"
            >
              + Sell Product
            </Link>

          </div>

          {products.length === 0 ? (

            <div className="rounded-[2rem] border border-dashed border-black/15 bg-white p-12 text-center">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF9EF] text-3xl">
                🛍️
              </div>

              <h3 className="text-xl font-black">
                No products yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-black/50">
                Products you create on ResXchange will
                automatically appear here.
              </p>

              <Link
                href="/sell"
                className="mt-6 inline-flex rounded-full bg-[#14213D] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
              >
                Sell your first product
              </Link>

            </div>

          ) : (

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {products.map((product) => (

                <div
                  key={product.id}
                  className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm"
                >

                  <div className="relative aspect-[4/3] overflow-hidden bg-[#FFF9EF]">

                    {product.image ? (

                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center text-sm font-bold text-black/30">
                        No image
                      </div>

                    )}

                    {product.category && (
                      <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black backdrop-blur">
                        {product.category}
                      </div>
                    )}

                  </div>

                  <div className="p-5">

                    <h3 className="truncate text-lg font-black">
                      {product.name}
                    </h3>

                    <div className="mt-3 flex items-center justify-between gap-3">

                      <p className="text-xl font-black">
                        R
                        {product.price.toLocaleString(
                          "en-ZA"
                        )}
                      </p>

                      <Link
                        href={`/products/${product.id}`}
                        className="text-xs font-bold text-black/40 transition hover:text-[#14213D]"
                      >
                        View →
                      </Link>

                    </div>

                    {product.school && (
                      <p className="mt-2 truncate text-xs font-semibold text-black/40">
                        {product.school}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        startEditing(product)
                      }
                      className="mt-5 w-full rounded-2xl bg-[#14213D] px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
                    >
                      Edit Product
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* EDIT PRODUCT */}

        {editingProduct && (
          <section
            id="product-editor"
            className="mt-10 scroll-mt-24 rounded-[2rem] border border-black/10 bg-white p-6 shadow-xl md:p-8"
          >

            <div className="mb-8 flex items-start justify-between gap-5">

              <div>

                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#3A86FF]">
                  Product editor
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Edit {editingProduct.name}
                </h2>

                <p className="mt-2 text-sm text-black/50">
                  Change the product details below and save
                  your changes.
                </p>

              </div>

              <button
                type="button"
                onClick={cancelEditing}
                disabled={savingProduct}
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-bold transition hover:border-black/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Close
              </button>

            </div>

            <div className="grid gap-8 lg:grid-cols-[320px_1fr]">

              <div>

                <label
                  htmlFor="product-image"
                  className="mb-3 block text-sm font-black"
                >
                  Product picture
                </label>

                <div className="overflow-hidden rounded-3xl border border-black/10 bg-[#FFF9EF]">

                  <div className="aspect-square">

                    {editImagePreview ? (

                      <img
                        src={editImagePreview}
                        alt={`${editName || "Product"} preview`}
                        className="h-full w-full object-cover"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center text-sm font-bold text-black/30">
                        No image
                      </div>

                    )}

                  </div>

                  <div className="p-4">

                    <label
                      htmlFor="product-image"
                      className="block cursor-pointer rounded-2xl bg-[#B8F500] px-4 py-3 text-center text-sm font-black text-[#14213D] transition hover:-translate-y-0.5"
                    >
                      Change picture

                      <input
                        id="product-image"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={
                          handleProductImageChange
                        }
                        className="sr-only"
                      />

                    </label>

                    <p className="mt-2 text-center text-xs text-black/40">
                      PNG, JPG or WEBP · Max 5MB
                    </p>

                  </div>

                </div>

              </div>

              <div className="space-y-5">

                <div>

                  <label
                    htmlFor="edit-product-name"
                    className="mb-2 block text-sm font-bold"
                  >
                    Product name
                  </label>

                  <input
                    id="edit-product-name"
                    type="text"
                    value={editName}
                    onChange={(event) =>
                      setEditName(
                        event.target.value
                      )
                    }
                    maxLength={100}
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#B8F500] focus:ring-4 focus:ring-[#B8F500]/20"
                  />

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>

                    <label
                      htmlFor="edit-product-price"
                      className="mb-2 block text-sm font-bold"
                    >
                      Price
                    </label>

                    <div className="relative">

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-black/40">
                        R
                      </span>

                      <input
                        id="edit-product-price"
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        value={editPrice}
                        onChange={(event) =>
                          setEditPrice(
                            event.target.value
                          )
                        }
                        className="w-full rounded-2xl border border-black/10 bg-white py-3 pl-9 pr-4 text-sm outline-none focus:border-[#B8F500] focus:ring-4 focus:ring-[#B8F500]/20"
                      />

                    </div>

                  </div>

                  <div>

                    <label
                      htmlFor="edit-product-campus"
                      className="mb-2 block text-sm font-bold"
                    >
                      Campus
                    </label>

                    <select
                      id="edit-product-campus"
                      value={editCampus}
                      onChange={(event) =>
                        setEditCampus(
                          event.target.value
                        )
                      }
                      className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#B8F500] focus:ring-4 focus:ring-[#B8F500]/20"
                    >

                      <option value="">
                        Choose campus
                      </option>

                      {campuses.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                </div>

                <div>

                  <label
                    htmlFor="edit-product-category"
                    className="mb-2 block text-sm font-bold"
                  >
                    Category
                  </label>

                  <select
                    id="edit-product-category"
                    value={editCategory}
                    onChange={(event) =>
                      setEditCategory(
                        event.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#B8F500] focus:ring-4 focus:ring-[#B8F500]/20"
                  >

                    {categories.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div>

                  <div className="mb-2 flex justify-between gap-4">

                    <label
                      htmlFor="edit-product-description"
                      className="text-sm font-bold"
                    >
                      Description
                    </label>

                    <span className="text-xs text-black/40">
                      {editDescription.length}/500
                    </span>

                  </div>

                  <textarea
                    id="edit-product-description"
                    value={editDescription}
                    maxLength={500}
                    onChange={(event) =>
                      setEditDescription(
                        event.target.value
                      )
                    }
                    rows={5}
                    className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-[#B8F500] focus:ring-4 focus:ring-[#B8F500]/20"
                  />

                </div>

                {productMessage && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="rounded-2xl bg-[#FFF9EF] px-4 py-3 text-sm font-semibold"
                  >
                    {productMessage}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">

                  <button
                    type="button"
                    onClick={saveProduct}
                    disabled={savingProduct}
                    className="rounded-2xl bg-[#B8F500] px-6 py-4 text-sm font-black text-[#14213D] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingProduct
                      ? "Saving changes..."
                      : "Save Product Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={savingProduct}
                    className="rounded-2xl border border-black/10 px-6 py-4 text-sm font-bold transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                </div>

              </div>

            </div>

          </section>
        )}

      </section>

      <Footer />
    </main>
  );
}

function Footer() {
  const names = [
    "Top Gooner",
    "Bluu Flvme",
    "Zooch",
    "KB",
  ];

  return (
    <footer className="mt-20 overflow-hidden border-t border-black/5 bg-[#14213D] text-white">

      <div className="overflow-hidden border-y border-black/10 bg-[#B8F500] py-3">

        <div className="flex w-max animate-[resxchange-marquee_18s_linear_infinite]">

          {[...names, ...names, ...names].map(
            (name, index) => (
              <div
                key={`${name}-${index}`}
                className="flex items-center"
              >

                <span className="mx-8 whitespace-nowrap text-sm font-black uppercase tracking-[0.18em] text-[#14213D] md:text-base">
                  {name}
                </span>

                <span className="text-lg font-black text-[#14213D]/40">
                  ✦
                </span>

              </div>
            )
          )}

        </div>

      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">

        <div className="flex flex-col justify-between gap-8 md:flex-row">

          <div className="max-w-md">

            <ResXchangeLogo
              compact
              className="h-12 w-auto"
            />

            <p className="mt-4 text-sm leading-6 text-white/50">
              A student marketplace for buying, selling and
              discovering products around campus.
            </p>

          </div>

          <div className="flex gap-10 text-sm">

            <div>

              <p className="mb-4 font-black">
                Explore
              </p>

              <div className="space-y-3 text-white/50">

                <Link
                  href="/"
                  className="block transition hover:text-white"
                >
                  Home
                </Link>

                <Link
                  href="/"
                  className="block transition hover:text-white"
                >
                  Marketplace
                </Link>

                <Link
                  href="/sell"
                  className="block transition hover:text-white"
                >
                  Sell
                </Link>

              </div>

            </div>

            <div>

              <p className="mb-4 font-black">
                Connect
              </p>

              <div className="space-y-3 text-white/50">

                <Link
                  href="/profile"
                  className="block transition hover:text-white"
                >
                  Profile
                </Link>

                <a
                  href="https://www.instagram.com/res.xchange/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition hover:text-white"
                >
                  Instagram
                </a>

              </div>

            </div>

          </div>

        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/40">
          © {new Date().getFullYear()} ResXchange. Built for students.
        </div>

      </div>

      <style jsx>{`
        @keyframes resxchange-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-33.333333%);
          }
        }
      `}</style>

    </footer>
  );
}

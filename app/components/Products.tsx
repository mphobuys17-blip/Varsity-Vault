type ProductsProps = {
  search?: string;
  category?: string;
};

const products = [
  {
    name: "Nike Air Force 1",
    school: "University of Pretoria",
    category: "Fashion",
    price: "R850",
    image: "https://picsum.photos/400/300?1",
  },
  {
    name: "HP Laptop",
    school: "Wits University",
    category: "Tech",
    price: "R5800",
    image: "https://picsum.photos/400/300?2",
  },
  {
    name: "Graphic Design",
    school: "TUT",
    category: "Services",
    price: "R250",
    image: "https://picsum.photos/400/300?3",
  },
  {
    name: "iPhone 13",
  
    school: "UJ",
    category: "Tech",
    price: "R9500",
    image: "https://picsum.photos/400/300?4",
  },
];

export default function Products({
  search = "",
  category = "All",
}: ProductsProps) {
  const filteredProducts = products.filter((product) => {
  const matchesSearch = product.name
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesCategory =
    category === "All" ||
    product.category === category;

  return matchesSearch && matchesCategory;
});
  return (
    <section className="px-8 py-24">
      <h2 className="mb-12 text-center text-4xl font-bold">
        🔥 Trending on Campus
      </h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {filteredProducts.map((product, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl bg-white shadow-xl"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-56 w-full object-cover"
            />

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">
                {product.name}
              </h3>

              <p className="mt-2 text-gray-500">
                {product.school}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-2xl font-bold text-[#3A86FF]">
                  {product.price}
                </span>

                <button className="rounded-lg bg-[#3A86FF] px-4 py-2 text-white">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
"use client";

type SearchProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
};

export default function Search({
  search,
  setSearch,
  category,
  setCategory,
}: SearchProps) {
  const categories = [
    "All",
    "Books",
    "Fashion",
    "Tech",
    "Food",
    "Music",
    "Services",
  ];

  return (
    <section className="bg-[#111827] px-6 py-16 text-white md:py-20">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-8">
          <div className="mb-4 inline-flex rounded-full bg-[#B8F500] px-4 py-2 text-xs font-black tracking-[0.15em] text-[#111827]">
            EXPLORE THE MARKET
          </div>

          <h2 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">
            Find your next
            <span className="ml-2 text-[#3A86FF]">
              find.
            </span>
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
            Discover products, services and student businesses
            across your campus.
          </p>
        </div>

        {/* Search box */}
        <div className="flex flex-col gap-3 rounded-3xl bg-white p-3 shadow-2xl md:flex-row">

          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-gray-400">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, services or businesses..."
              className="w-full rounded-2xl bg-gray-100 px-14 py-5 text-sm text-[#111827] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#3A86FF] placeholder:text-gray-400"
            />
          </div>

          <button
            type="button"
            className="rounded-2xl bg-[#3A86FF] px-10 py-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#2563EB]"
          >
            SEARCH
          </button>

        </div>

        {/* Categories */}
        <div className="mt-8">

          <div className="mb-4 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#FF5C5C]" />

            <p className="text-xs font-black tracking-[0.2em] text-gray-400">
              BROWSE BY CATEGORY
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            {categories.map((item, index) => {
              const accentColors = [
                "bg-[#3A86FF]",
                "bg-[#B8F500]",
                "bg-[#FF5C5C]",
                "bg-[#8B5CF6]",
                "bg-[#3A86FF]",
                "bg-[#FF5C5C]",
                "bg-[#8B5CF6]",
              ];

              const isActive = category === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-5 py-2.5 text-xs font-black tracking-[0.08em] transition ${
                    isActive
                      ? `${accentColors[index]} text-[#111827]`
                      : "border border-white/20 bg-white/5 text-gray-300 hover:border-white/40 hover:bg-white/10"
                  }`}
                >
                  {item.toUpperCase()}
                </button>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
}
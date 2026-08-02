"use client";
type SearchProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export default function Search({ search, setSearch }: SearchProps) {
  return (
     <section className="mx-auto w-[92%] max-w-6xl rounded-3xl bg-white p-8 shadow-2xl">

        <h2 className="mb-6 text-center text-3xl font-bold text-[#14213D]">
          Find Anything On Campus
        </h2>

        <div className="flex flex-col gap-4 md:flex-row">

          <input
  type="text"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Search products, services or businesses..."
  className="flex-1 rounded-xl border border-gray-300 px-5 py-4 text-black placeholder:text-gray-500 focus:border-[#3A86FF] focus:outline-none"
/>

          <button className="rounded-xl bg-[#3A86FF] px-8 py-4 font-semibold text-white hover:bg-blue-600">
            Search
          </button>

        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">

          <button className="rounded-full bg-blue-100 px-5 py-2 text-[#14213D]">📚 Books</button>
          <button className="rounded-full bg-blue-100 px-5 py-2 text-[#14213D]">👕 Fashion</button>
          <button className="rounded-full bg-blue-100 px-5 py-2 text-[#14213D]">💻 Tech</button>
          <button className="rounded-full bg-blue-100 px-5 py-2 text-[#14213D]">🍔 Food</button>
          <button className="rounded-full bg-blue-100 px-5 py-2 text-[#14213D]">🎵 Music</button>
          <button className="rounded-full bg-blue-100 px-5 py-2 text-[#14213D]">🎨 Services</button>

        </div>

      </section>


  );
}
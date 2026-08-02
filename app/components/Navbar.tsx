export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#14213D]/90 px-8 py-5 backdrop-blur-lg">

      <div className="flex items-center gap-3">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3A86FF] text-xl font-black">
          VV
        </div>

        <div>
          <h1 className="text-xl font-bold">
            Varsity Vault
          </h1>

          <p className="text-xs text-gray-400">
            Student Marketplace
          </p>
        </div>

      </div>

      <div className="hidden items-center gap-8 md:flex">

        <a href="#" className="transition hover:text-[#3A86FF]">
          Home
        </a>

        <a href="#" className="transition hover:text-[#3A86FF]">
          Marketplace
        </a>

        <a href="#" className="transition hover:text-[#3A86FF]">
          Categories
        </a>

        <a href="#" className="transition hover:text-[#3A86FF]">
          Contact
        </a>

        <button className="rounded-xl bg-[#3A86FF] px-6 py-3 font-semibold transition hover:scale-105">
          Sign In
        </button>

      </div>

    </nav>
  );
}
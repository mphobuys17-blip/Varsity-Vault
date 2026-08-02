export default function Hero() {
  return (
 <section className="flex flex-col items-center px-6 py-24 text-center">

        <h1 className="mb-6 max-w-5xl text-6xl font-black leading-tight md:text-7xl">
          Buy. Sell. Grow.
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-gray-300">
          South Africa's student marketplace where university entrepreneurs
          buy, sell and grow their businesses.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button className="rounded-xl bg-[#3A86FF] px-8 py-4 font-semibold transition hover:scale-105">
            Start Selling
          </button>

          <button className="rounded-xl border border-white px-8 py-4 font-semibold transition hover:bg-white hover:text-[#14213D]">
            Browse Products
          </button>
        </div>

        {/* Stats */}
        <div className="mt-20 flex flex-wrap justify-center gap-6">

          <div className="w-60 rounded-3xl bg-white/10 p-8 backdrop-blur-lg">
            <h2 className="text-5xl font-black text-[#3A86FF]">
              10K+
            </h2>
            <p className="mt-2 text-gray-300">
              Active Students
            </p>
          </div>

          <div className="w-60 rounded-3xl bg-white/10 p-8 backdrop-blur-lg">
            <h2 className="text-5xl font-black text-[#3A86FF]">
              3K+
            </h2>
            <p className="mt-2 text-gray-300">
              Products Listed
            </p>
          </div>

          <div className="w-60 rounded-3xl bg-white/10 p-8 backdrop-blur-lg">
            <h2 className="text-5xl font-black text-[#3A86FF]">
              120+
            </h2>
            <p className="mt-2 text-gray-300">
              Campuses
            </p>
          </div>

        </div>

        {/* Universities */}
        <div className="mt-16 flex flex-wrap justify-center gap-6 text-gray-400">
          <span>🎓 University of Pretoria</span>
          <span>🎓 Wits</span>
          <span>🎓 UJ</span>
          <span>🎓 TUT</span>
          <span>🎓 NWU</span>
          <span>🎓 UNISA</span>
        </div>

      </section>

 );
}
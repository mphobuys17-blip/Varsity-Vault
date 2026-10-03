export default function Features() {
  const features = [
    {
      number: "01",
      title: "Shop Local",
      description:
        "Find products, services and businesses created by students around your campus.",
      color: "bg-[#3A86FF]",
      textColor: "text-white",
      icon: "🛍️",
    },
    {
      number: "02",
      title: "Sell Anything",
      description:
        "Turn the things you already have or the hustle you're building into income.",
      color: "bg-[#B8F500]",
      textColor: "text-[#111827]",
      icon: "⚡",
    },
    {
      number: "03",
      title: "Grow Together",
      description:
        "Reach more students, discover new customers and build your campus network.",
      color: "bg-[#8B5CF6]",
      textColor: "text-white",
      icon: "🚀",
    },
  ];

  return (
    <section className="bg-[#FFF9EF] px-6 pb-24 pt-10 text-[#111827] md:pb-32">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <div className="mb-5 inline-flex rounded-full bg-[#FF5C5C] px-4 py-2 text-xs font-black tracking-[0.15em] text-white">
              WHY RESXCHANGE?
            </div>

            <h2 className="max-w-3xl text-5xl font-black leading-[0.9] tracking-[-0.06em] md:text-7xl">
              More than a
              <span className="ml-2 text-[#3A86FF]">
                marketplace.
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-[#6B7280]">
            ResXchange connects the people, products and ideas
            that make campus life move.
          </p>

        </div>

        {/* Feature cards */}
        <div className="grid gap-5 md:grid-cols-3">

          {features.map((feature) => (
            <div
              key={feature.number}
              className={`${feature.color} ${feature.textColor} group relative min-h-[340px] overflow-hidden rounded-[2rem] p-8 transition duration-300 hover:-translate-y-2 hover:shadow-2xl md:p-10`}
            >

              {/* Decorative circle */}
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[30px] border-white/10 transition duration-500 group-hover:scale-125" />

              {/* Number */}
              <p className="relative text-xs font-black tracking-[0.2em] opacity-60">
                {feature.number}
              </p>

              {/* Icon */}
              <div className="relative mt-10 text-5xl">
                {feature.icon}
              </div>

              {/* Content */}
              <div className="relative mt-8">
                <h3 className="text-3xl font-black tracking-[-0.04em]">
                  {feature.title}
                </h3>

                <p className="mt-4 max-w-xs text-sm leading-6 opacity-80">
                  {feature.description}
                </p>
              </div>

            </div>
          ))}

        </div>

        {/* Bottom statement */}
        <div className="mt-16 overflow-hidden rounded-[2rem] bg-[#111827] px-8 py-12 text-center text-white md:px-12">

          <p className="text-xs font-black tracking-[0.25em] text-[#B8F500]">
            RESXCHANGE
          </p>

          <h3 className="mx-auto mt-4 max-w-3xl text-3xl font-black tracking-[-0.04em] md:text-5xl">
            Your campus has a market.
            <span className="text-[#3A86FF]">
              {" "}We built the place for it.
            </span>
          </h3>

        </div>

      </div>
    </section>
  );
}
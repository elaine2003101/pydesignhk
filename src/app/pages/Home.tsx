import { Link } from "react-router";
import {
  ArrowUpRight,
  Calculator,
  ArrowRight,
  Lightbulb,
  Sparkles,
  Sofa,
} from "lucide-react";

export function Home() {
  const quickPaths = [
    {
      title: "Need ideas first",
      description: "Use the guided flow to find a direction.",
      cta: "Start Ideas",
      to: "/ideas",
    },
    {
      title: "Need a budget range",
      description: "Build a BOQ-style estimate for your flat.",
      cta: "Get Estimate",
      to: "/estimate",
    },
    {
      title: "Already started works",
      description: "Check progress and project updates.",
      cta: "Track Project",
      to: "/track",
    },
  ];

  const benefits = [
    "Built for Hong Kong flats",
    "Clearer style and budget direction",
    "Faster path to estimate",
  ];

  const heroBoards = [
    {
      title: "Japandi HK Kitchen",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      meta: "Compact flat upgrade · HKD 180k - 380k",
    },
    {
      title: "Japandi Living Room Reset",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
      meta: "Built-in storage + lighter zoning",
    },
    {
      title: "Modern Luxury Bathroom Upgrade",
      image:
        "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
      meta: "Wet-area friendly material direction",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#F9F8F6] py-20 md:py-24">
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-8 h-64 w-64 rounded-full bg-[#EFE9E3] blur-3xl opacity-80 animate-drift-slow" />
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#D9CFC7] blur-3xl opacity-70 animate-drift-delayed" />
          <div className="absolute left-1/3 bottom-0 h-52 w-52 rounded-full bg-[#C9B59C]/45 blur-3xl opacity-80 animate-pulse-soft" />
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-14 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="max-w-3xl pt-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D9CFC7] bg-white/70 px-4 py-2 text-sm text-[#7A6751] shadow-sm animate-reveal-up">
              <Sparkles className="h-4 w-4" />
              Hong Kong renovation planning
            </div>

            <h1 className="mt-6 text-5xl leading-[1.05] text-[#3F352D] md:text-7xl animate-reveal-up animation-delay-150">
              Start your renovation with a clear direction.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6E6258] md:text-xl animate-reveal-up animation-delay-300">
              Ideas, estimate, and project tracking for Hong Kong homes.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 animate-reveal-up animation-delay-450">
              <Link
                to="/ideas"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#8F775C] px-7 py-4 text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-[#7A6751]"
              >
                <Lightbulb className="w-5 h-5" />
                Start Ideas
              </Link>
              <Link
                to="/estimate"
                className="inline-flex items-center gap-2 rounded-2xl border border-[#D9CFC7] bg-white px-7 py-4 text-[#5C4C40] shadow-sm transition-transform hover:-translate-y-0.5 hover:border-[#C9B59C]"
              >
                <Calculator className="w-5 h-5" />
                Get Estimate
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3 animate-reveal-up animation-delay-600">
              {benefits.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#E6DDD5] bg-white/80 px-4 py-4 text-sm text-[#5F544B] shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[620px] animate-reveal-up animation-delay-300">
            <div className="absolute left-0 top-10 w-[72%] overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_30px_80px_rgba(76,61,46,0.14)] animate-float">
              <img
                src={heroBoards[0].image}
                alt={heroBoards[0].title}
                className="h-[420px] w-full object-cover"
              />
              <div className="p-6">
                <div className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8A7767]">
                  Featured HK Direction
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl text-[#3F352D]">{heroBoards[0].title}</h2>
                    <p className="mt-1 text-sm text-[#7A6751]">{heroBoards[0].meta}</p>
                  </div>
                  <div className="rounded-full bg-[#EFE9E3] p-3 text-[#7A6751]">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute right-2 top-0 w-[42%] rounded-[1.75rem] border border-white/70 bg-white p-4 shadow-[0_24px_60px_rgba(76,61,46,0.12)] animate-float animation-delay-300">
              <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#8A7767]">
                <Sofa className="h-4 w-4" />
                New HK Moodboard
              </div>
              <img
                src={heroBoards[1].image}
                alt={heroBoards[1].title}
                className="h-44 w-full rounded-[1.25rem] object-cover"
              />
              <div className="mt-4 text-lg text-[#3F352D]">{heroBoards[1].title}</div>
              <div className="mt-1 text-sm text-[#7A6751]">{heroBoards[1].meta}</div>
            </div>

            <div className="absolute bottom-6 right-0 w-[48%] rounded-[1.75rem] border border-[#D9CFC7] bg-[#4F4338] p-5 text-white shadow-[0_24px_60px_rgba(76,61,46,0.2)] animate-float animation-delay-600">
              <div className="text-xs uppercase tracking-[0.22em] text-[#D9CFC7]">Quick start</div>
              <div className="mt-4 text-4xl">3 paths</div>
              <div className="mt-2 text-sm text-[#EFE9E3]">Ideas, estimate, or tracking.</div>
              <div className="mt-5 overflow-hidden rounded-[1rem]">
                <img
                  src={heroBoards[2].image}
                  alt={heroBoards[2].title}
                  className="h-36 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-4xl text-gray-900">Choose your path</h2>
            <p className="mt-3 text-lg text-[#6E6258]">
              Keep it simple and start where you are.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {quickPaths.map((path) => (
              <div
                key={path.title}
                className="rounded-[2rem] border border-[#E6DDD5] bg-[#F9F8F6] p-8 shadow-sm"
              >
                <div className="text-2xl text-[#3F352D]">{path.title}</div>
                <p className="mt-3 text-[#6E6258]">{path.description}</p>
                <Link
                  to={path.to}
                  className="mt-6 inline-flex items-center gap-2 text-[#8F775C] transition-colors hover:text-[#7A6751]"
                >
                  {path.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F5F3EF]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {benefits.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[#E6DDD5] bg-white px-6 py-5 text-[#5F544B]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#4F4338]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-4xl mb-5">Ready to start?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-[#EFE9E3]">
              Get a clearer renovation estimate for your home.
            </p>
            <Link
              to="/estimate"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-medium text-[#4F4338] shadow-lg transition-colors hover:bg-[#F5F3EF]"
            >
              Get Estimate
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

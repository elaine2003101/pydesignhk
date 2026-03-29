import { Link } from "react-router";
import {
  ArrowRight,
  Calculator,
  Check,
  Home as HomeIcon,
  Lightbulb,
  Palette,
  Receipt,
  Ruler,
  Sparkles,
} from "lucide-react";

const quickEntries = [
  {
    icon: Sparkles,
    title: "Get inspiration",
    description: "Start with a style direction for your home.",
    to: "/ideas",
  },
  {
    icon: Ruler,
    title: "Plan my renovation",
    description: "Shape the space, scope, and next step.",
    to: "/ideas",
  },
  {
    icon: Calculator,
    title: "Get estimate",
    description: "See a clearer renovation cost range.",
    to: "/estimate",
  },
];

const styleCards = [
  {
    title: "Japandi",
    description: "Warm, calm, and softly layered.",
    image: "/japandi-image.png",
  },
  {
    title: "Modern Minimal",
    description: "Clean lines with smarter storage.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Modern Luxury",
    description: "Refined contrast and premium finishes.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Scandinavian",
    description: "Light, airy, and easy to live with.",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Industrial",
    description: "Textured, urban, and more graphic.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80&sat=-15",
  },
];

const steps = [
  {
    icon: Palette,
    title: "Choose your style",
    description: "Start with a look that fits your home.",
  },
  {
    icon: HomeIcon,
    title: "Tell us your space",
    description: "Share size, layout, and renovation intent.",
  },
  {
    icon: Receipt,
    title: "Get your estimate",
    description: "Move into a clearer Hong Kong BOQ range.",
  },
];

export function Home() {
  const heroBannerSrc = `${import.meta.env.BASE_URL}photo 5.jpg`;

  return (
    <div className="bg-[#F9F8F6] text-[#1C1C1C]">
      <section className="relative min-h-[88vh] overflow-hidden">
        <img
          src={heroBannerSrc}
          alt="Artistic interior"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,28,28,0.72)_0%,rgba(28,28,28,0.38)_48%,rgba(28,28,28,0.2)_100%)]" />
        <div className="absolute left-8 top-10 hidden h-32 w-32 rounded-full border border-white/20 bg-white/10 blur-sm lg:block animate-drift-slow" />
        <div className="absolute right-16 top-24 hidden h-24 w-24 rounded-full border border-white/15 bg-white/10 blur-sm lg:block animate-drift-delayed" />

        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm animate-reveal-up">
              <Sparkles className="h-4 w-4" />
              Hong Kong Interior Renovation
            </div>

            <h1 className="mt-6 text-5xl leading-[1.02] md:text-7xl animate-reveal-up animation-delay-150">
              Design your home
              <br />
              Step by step
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-white/85 md:text-xl animate-reveal-up animation-delay-300">
              From inspiration to cost to execution
            </p>

            <div className="mt-10 flex flex-wrap gap-4 animate-reveal-up animation-delay-450">
              <Link
                to="/ideas"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-[#1C1C1C] shadow-xl transition-all hover:-translate-y-0.5 hover:bg-[#F5F3EF]"
              >
                Explore Ideas
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/estimate"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-7 py-4 text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/15"
              >
                Get Estimate
                <Calculator className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <div className="text-sm uppercase tracking-[0.18em] text-[#8B6F4E]">
              Quick Entry
            </div>
            <h2 className="mt-3 text-4xl text-[#1C1C1C]">
              What are you looking for today?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {quickEntries.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  to={item.to}
                  className="group rounded-[2rem] border border-[#E8E1D9] bg-[#F9F8F6] p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-[#C9B59C] hover:shadow-[0_24px_50px_rgba(61,48,38,0.08)]"
                >
                  <div className="inline-flex rounded-2xl bg-white p-4 text-[#8B6F4E] shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl text-[#1C1C1C]">{item.title}</h3>
                  <p className="mt-3 text-[#6B5E53]">{item.description}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm text-[#8B6F4E]">
                    Start here
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F3EF] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <div className="text-sm uppercase tracking-[0.18em] text-[#8B6F4E]">
              Style Discovery
            </div>
            <h2 className="mt-3 text-4xl text-[#1C1C1C]">Find your style</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
            {styleCards.map((style) => (
              <Link
                key={style.title}
                to="/ideas"
                className="group overflow-hidden rounded-[1.8rem] border border-[#E8E1D9] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(61,48,38,0.08)]"
              >
                <div className="overflow-hidden">
                  <img
                    src={style.image}
                    alt={style.title}
                    className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="text-xl text-[#1C1C1C]">{style.title}</div>
                  <div className="mt-2 text-sm text-[#6B5E53]">
                    {style.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="text-sm uppercase tracking-[0.18em] text-[#8B6F4E]">
              Guided Flow
            </div>
            <h2 className="mt-3 text-4xl text-[#1C1C1C]">How it works</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="relative rounded-[2rem] border border-[#E8E1D9] bg-[#F9F8F6] p-8"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="inline-flex rounded-2xl bg-white p-4 text-[#8B6F4E] shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-sm text-[#A08F80]">0{index + 1}</div>
                  </div>
                  <h3 className="text-2xl text-[#1C1C1C]">{step.title}</h3>
                  <p className="mt-3 text-[#6B5E53]">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F3EF] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <div className="text-sm uppercase tracking-[0.18em] text-[#8B6F4E]">
              Inspiration
            </div>
            <h2 className="mt-3 text-4xl text-[#1C1C1C]">
              See what your home could become
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-[1.8rem] border border-[#E8E1D9] bg-white shadow-sm">
                <div className="border-b border-[#EFE9E3] px-5 py-4 text-sm uppercase tracking-[0.16em] text-[#8B6F4E]">
                  Before
                </div>
                <img
                  src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80&sat=-50"
                  alt="Before renovation inspiration"
                  className="h-[340px] w-full object-cover"
                />
              </div>

              <div className="overflow-hidden rounded-[1.8rem] border border-[#E8E1D9] bg-white shadow-sm">
                <div className="border-b border-[#EFE9E3] px-5 py-4 text-sm uppercase tracking-[0.16em] text-[#8B6F4E]">
                  After
                </div>
                <img
                  src="/japandi-image.png"
                  alt="After renovation inspiration"
                  className="h-[340px] w-full object-cover"
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#E8E1D9] bg-white p-8 shadow-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F4EFEA] px-4 py-2 text-sm text-[#8B6F4E]">
                <Lightbulb className="h-4 w-4" />
                Compact Flat Story
              </div>

              <h3 className="mt-6 text-3xl text-[#1C1C1C]">
                A darker, closed-in layout became a softer Japandi living space.
              </h3>

              <p className="mt-4 leading-7 text-[#6B5E53]">
                Better zoning, lighter finishes, and built-in storage helped the
                home feel calmer and more open without changing the entire flat.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-[#8B6F4E]" />
                  <div className="text-[#4B3A2F]">Style used: Japandi</div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-[#8B6F4E]" />
                  <div className="text-[#4B3A2F]">
                    Estimated cost: HKD 320k to 420k
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-[#8B6F4E]" />
                  <div className="text-[#4B3A2F]">
                    Focus: living room, storage wall, lighter material palette
                  </div>
                </div>
              </div>

              <Link
                to="/ideas"
                className="mt-8 inline-flex items-center gap-2 text-[#8B6F4E] transition-colors hover:text-[#6B5E53]"
              >
                Explore more ideas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#4B3A2F] py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80">
            <Calculator className="h-4 w-4" />
            Final Step
          </div>
          <h2 className="mt-6 text-4xl">Ready to plan your renovation?</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/estimate"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-[#1C1C1C] shadow-xl transition-colors hover:bg-[#F5F3EF]"
            >
              Get Estimate
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/ideas"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 text-white transition-colors hover:bg-white/15"
            >
              Explore Ideas
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

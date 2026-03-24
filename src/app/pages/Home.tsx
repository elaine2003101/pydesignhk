import { Link } from "react-router";
import {
  ArrowUpRight,
  DollarSign,
  LineChart,
  MessageSquare,
  Calculator,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Paintbrush,
  House,
  Sparkles,
  Sofa,
} from "lucide-react";

export function Home() {
  const features = [
    {
      icon: DollarSign,
      title: "Transparent HK Quotation Logic",
      description:
        "See clearer renovation ranges for Hong Kong flats with material, labour, and design logic broken down before the scope gets inflated.",
    },
    {
      icon: LineChart,
      title: "Compact-Space Planning Support",
      description:
        "Start with layout direction, storage priorities, and moodboards suited to HOS units, private apartments, and resale flats where every square foot matters.",
    },
    {
      icon: MessageSquare,
      title: "Faster Client Communication",
      description:
        "Move from inspiration to consultation with a cleaner brief, fewer back-and-forth messages, and a more actionable starting point for your contractor or design team.",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Choose A HK-Ready Direction",
      description:
        "Start with room ideas, storage logic, and finish direction that make sense for compact Hong Kong layouts.",
    },
    {
      step: "2",
      title: "Build Your Budget Range",
      description:
        "Turn your preferred direction into a more realistic renovation band for a flat, HOS unit, or family apartment.",
    },
    {
      step: "3",
      title: "Brief The Project Faster",
      description:
        "Use the moodboard, room priority, and project notes to shorten the first consultation and reduce vague discussion.",
    },
    {
      step: "4",
      title: "Track Delivery",
      description:
        "Once works start, keep the scope, milestone updates, and follow-up communication in one place.",
    },
  ];

  const stats = [
    { value: "200+", label: "Projects Completed" },
    { value: "98%", label: "On-Time Delivery" },
    { value: "100%", label: "Transparent Pricing" },
    { value: "4.9/5", label: "Customer Rating" },
  ];

  const ideaTracks = [
    {
      icon: House,
      title: "Start With The Right Flat Priority",
      description:
        "Help visitors decide whether the biggest impact should begin with the living room, kitchen, bedroom, or bathroom based on Hong Kong living patterns and budget.",
    },
    {
      icon: Paintbrush,
      title: "Choose A Style That Fits Smaller Homes",
      description:
        "Turn loose preferences like Modern Minimal, Japandi, Modern Luxury, or Korean Soft into something that works in tighter city layouts.",
    },
    {
      icon: Lightbulb,
      title: "Turn Browsing Into A Practical Brief",
      description:
        "Give undecided traffic a clearer first brief before asking them to commit to measurements, drawings, or a full quotation request.",
    },
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

  const heroProof = [
    "Built for Hong Kong flats, HOS units, and resale homes",
    "Moodboards that focus on storage, zoning, and finish practicality",
    "Estimate and lead capture that move into quotation faster",
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
              Hong Kong interior direction, quotation, and lead capture in one journey
            </div>

            <h1 className="mt-6 text-5xl leading-[1.05] text-[#3F352D] md:text-7xl animate-reveal-up animation-delay-150">
              Turn “still thinking about renovation” into a clear Hong Kong-ready starting brief.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6E6258] md:text-xl animate-reveal-up animation-delay-300">
              Help owners of private apartments, HOS units, and resale flats
              explore better room priorities, moodboards, and budget logic
              before the first contractor conversation becomes messy.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 animate-reveal-up animation-delay-450">
              <Link
                to="/ideas"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#8F775C] px-7 py-4 text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-[#7A6751]"
              >
                <Lightbulb className="w-5 h-5" />
                Browse Moodboards
              </Link>
              <Link
                to="/estimate"
                className="inline-flex items-center gap-2 rounded-2xl border border-[#D9CFC7] bg-white px-7 py-4 text-[#5C4C40] shadow-sm transition-transform hover:-translate-y-0.5 hover:border-[#C9B59C]"
              >
                <Calculator className="w-5 h-5" />
                Build Estimate
              </Link>
              <Link
                to="/track"
                className="inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-[#7A6751] transition-colors hover:text-[#4F4338]"
              >
                <BarChart3 className="w-5 h-5" />
                Track Project
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3 animate-reveal-up animation-delay-600">
              {heroProof.map((item) => (
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
              <div className="text-xs uppercase tracking-[0.22em] text-[#D9CFC7]">
                Conversion Snapshot
              </div>
              <div className="mt-4 text-4xl">3 paths</div>
              <div className="mt-2 text-sm text-[#EFE9E3]">
                Ideas, estimate, and consultation now sit in one visible flow for Hong Kong residential enquiries.
              </div>
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

      {/* Stats Section */}
      <section className="bg-white py-16 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Idea Starter Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 items-start">
            <div className="lg:sticky lg:top-24">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 mb-6">
                <Lightbulb className="w-4 h-4" />
                For Cold Traffic
              </div>
              <h2 className="text-4xl mb-5 text-gray-900">
                Not ready for a quotation yet?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Some visitors are still exploring what to renovate, how much to
                spend, and what style fits their space. Give them a lighter
                first step instead of losing them.
              </p>
              <Link
                to="/ideas"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg"
              >
                Explore Idea Starter
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ideaTracks.map((track) => {
                const Icon = track.icon;

                return (
                  <div
                    key={track.title}
                    className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl text-gray-900 mb-4">{track.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {track.description}
                    </p>
                    <Link
                      to="/ideas"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      See Suggestions
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-gray-900">
              Why Choose Pydesignhk?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're revolutionizing the renovation industry with transparency,
              technology, and trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl mb-4 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A simple, transparent process from estimate to completion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-blue-300 -ml-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1696861270495-7f35c35c3273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFuc3BhcmVudCUyMGJ1c2luZXNzJTIwaGFuZHNoYWtlJTIwdHJ1c3R8ZW58MXx8fHwxNzc0MTA2NjQzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Transparent business"
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl mb-6 text-gray-900">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                To provide a transparent and user-friendly digital platform that
                enables customers to obtain reliable renovation cost estimates and
                track project progress in real time, improving trust,
                communication, and decision-making in the interior renovation
                process.
              </p>
              <ul className="space-y-4">
                {[
                  "Transparent pricing with no hidden costs",
                  "Real-time project tracking and updates",
                  "Direct communication with contractors",
                  "Quality assurance and accountability",
                  "Data-driven insights for better decisions",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-4xl mb-6">Ready to Start Your Renovation?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Get your free estimate in minutes and take the first step towards
              your dream space.
            </p>
            <Link
              to="/estimate"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors shadow-lg text-lg font-medium"
            >
              Get Free Estimate
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

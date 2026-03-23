import { Link } from "react-router";
import {
  DollarSign,
  LineChart,
  MessageSquare,
  Calculator,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Home() {
  const features = [
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description:
        "Get accurate cost estimates upfront with detailed breakdowns of materials, labor, and design fees. No hidden charges.",
    },
    {
      icon: LineChart,
      title: "Real-time Progress Tracking",
      description:
        "Monitor your renovation project's progress with live updates, photos, and milestone tracking.",
    },
    {
      icon: MessageSquare,
      title: "Improved Communication",
      description:
        "Stay connected with your contractor through our platform. Get updates, ask questions, and receive timely responses.",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Get Your Estimate",
      description:
        "Enter your property details and renovation requirements to receive an instant cost estimate with detailed breakdown.",
    },
    {
      step: "2",
      title: "Request Consultation",
      description:
        "Schedule a consultation with our team to discuss your project in detail and finalize the scope.",
    },
    {
      step: "3",
      title: "Track Progress",
      description:
        "Once your project begins, log in to track milestones, view photos, and monitor budget in real-time.",
    },
    {
      step: "4",
      title: "Project Completion",
      description:
        "Review the final work, provide feedback, and enjoy your beautifully renovated space.",
    },
  ];

  const stats = [
    { value: "200+", label: "Projects Completed" },
    { value: "98%", label: "On-Time Delivery" },
    { value: "100%", label: "Transparent Pricing" },
    { value: "4.9/5", label: "Customer Rating" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl mb-6 leading-tight">
              Transparent Renovation Starts Here
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Get accurate cost estimates, track your project in real-time, and
              communicate seamlessly with your renovation team.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/estimate"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                <Calculator className="w-5 h-5" />
                Get Estimate
              </Link>
              <Link
                to="/track"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors border border-white/20"
              >
                <BarChart3 className="w-5 h-5" />
                Track Project
              </Link>
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
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1696861270495-7f35c35c3273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFuc3BhcmVudCUyMGJ1c2luZXNzJTIwaGFuZHNoYWtlJTIwdHJ1c3R8ZW58MXx8fHwxNzc0MTA2NjQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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

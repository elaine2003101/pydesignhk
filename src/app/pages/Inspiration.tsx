import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ClipboardList,
  Eye,
  Lightbulb,
  Palette,
  Ruler,
  Wallet,
} from "lucide-react";
import type { PricingTier, StyleDirection } from "../lib/boqEstimate";
import {
  IDEA_ESTIMATE_DRAFT_KEY,
  type IdeaEstimateDraft,
} from "../lib/ideaEstimateDraft";

type FlowStep = 1 | 2 | 3 | 4 | 5;
type IntentId = "inspiration" | "plan-renovation" | "just-browsing";
type SpaceSizeId = "compact" | "family" | "spacious";

type IntentOption = {
  id: IntentId;
  label: string;
  description: string;
  icon: typeof Lightbulb;
};

type StyleCard = {
  id: StyleDirection;
  label: string;
  description: string;
  image: string;
  palette: string[];
  highlights: string[];
  explanation: string;
  costFactor: number;
};

type SpaceSizeOption = {
  id: SpaceSizeId;
  label: string;
  description: string;
  areaHint: string;
  defaultArea: string;
};

type BudgetOption = {
  id: PricingTier;
  label: string;
  description: string;
};

const steps = [
  { id: 1 as FlowStep, label: "Intent" },
  { id: 2 as FlowStep, label: "Style" },
  { id: 3 as FlowStep, label: "Personalize" },
  { id: 4 as FlowStep, label: "Result" },
  { id: 5 as FlowStep, label: "Estimate" },
];

const intentOptions: IntentOption[] = [
  {
    id: "inspiration",
    label: "Get inspiration",
    description: "I want a clear design direction before I decide anything else.",
    icon: Lightbulb,
  },
  {
    id: "plan-renovation",
    label: "Plan renovation",
    description: "I am ready to narrow the style and move toward pricing.",
    icon: ClipboardList,
  },
  {
    id: "just-browsing",
    label: "Just browsing",
    description: "I want something simple that helps me understand what I like.",
    icon: Eye,
  },
];

const styleCards: StyleCard[] = [
  {
    id: "modern-minimal",
    label: "Modern Minimal",
    description: "Calm lines, hidden storage, and a clean Hong Kong flat feel.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
    palette: ["#F5F5F2", "#D9D9D6", "#3A3A3A", "#E8E1D9", "#1C1C1C"],
    highlights: [
      "Storage-led joinery to reduce clutter",
      "Matte finishes that stay quiet visually",
      "Slim details that suit compact layouts",
    ],
    explanation:
      "A practical fit for owners who want the home to feel lighter, tidier, and easier to brief.",
    costFactor: 1,
  },
  {
    id: "japandi",
    label: "Japandi",
    description: "Soft timber warmth with a grounded, restful atmosphere.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
    palette: ["#F4EFEA", "#D6C3A3", "#7A8C66", "#8B6F4E", "#4B3A2F"],
    highlights: [
      "Natural oak and warm stone tones",
      "Layered neutrals that soften small rooms",
      "Balanced styling without overdecorating",
    ],
    explanation:
      "Good for clients who want warmth and calm without pushing into a heavy luxury look.",
    costFactor: 1.04,
  },
  {
    id: "modern-luxury",
    label: "Modern Luxury",
    description: "Refined contrast, premium finishes, and stronger presence.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80",
    palette: ["#F8F7F5", "#CFCFCF", "#C6A96E", "#6B5E53", "#1A1A1A"],
    highlights: [
      "Feature stone or fluted finish moments",
      "Hotel-style detailing in key areas",
      "Sharper visual contrast and richer materials",
    ],
    explanation:
      "Best for owners who want a more premium result and are comfortable with upgraded finishes.",
    costFactor: 1.14,
  },
  {
    id: "scandinavian",
    label: "Scandinavian",
    description: "Bright, airy, and easy to live with for family homes.",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
    palette: ["#FFFFFF", "#E5E5E5", "#AFCBDA", "#EADBC8", "#2E2E2E"],
    highlights: [
      "Lighter tones to open up the room",
      "Soft contrast for a friendly family feel",
      "Simple styling that stays flexible over time",
    ],
    explanation:
      "A safe and welcoming choice if you want the home to feel brighter and more open.",
    costFactor: 1.02,
  },
  {
    id: "industrial",
    label: "Industrial",
    description: "Darker tones, texture, and a sharper urban edge.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80&sat=-20",
    palette: ["#B0B0B0", "#6E6E6E", "#A0522D", "#5A4634", "#121212"],
    highlights: [
      "Richer texture with darker joinery tones",
      "Graphic finishes that create stronger character",
      "Good for statement corners and bachelor flats",
    ],
    explanation:
      "Suited to clients who prefer a moodier, more graphic look than a soft neutral home.",
    costFactor: 1.08,
  },
  {
    id: "korean-soft",
    label: "Korean Soft / Feminine",
    description: "Muted warmth, rounded edges, and a gentler finish palette.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80&sat=-10",
    palette: ["#FAF8F6", "#F2DCDC", "#D8A7A7", "#EAD8C0", "#6B4F4F"],
    highlights: [
      "Soft painted joinery and curved detailing",
      "Warm blush and cream layering",
      "A lighter, more delicate bedroom-friendly tone",
    ],
    explanation:
      "Works well for owners who want a softer and more personal home mood without going ornate.",
    costFactor: 1.03,
  },
];

const spaceSizeOptions: SpaceSizeOption[] = [
  {
    id: "compact",
    label: "Compact",
    description: "Small flat with tighter planning needs.",
    areaHint: "Up to about 450 sq ft",
    defaultArea: "380",
  },
  {
    id: "family",
    label: "Family",
    description: "Typical home size for a fuller renovation brief.",
    areaHint: "Around 450 to 700 sq ft",
    defaultArea: "580",
  },
  {
    id: "spacious",
    label: "Spacious",
    description: "Larger home with more rooms or styling scope.",
    areaHint: "Around 700 sq ft or above",
    defaultArea: "820",
  },
];

const budgetOptions: BudgetOption[] = [
  {
    id: "basic",
    label: "Basic",
    description: "Smart essentials with more controlled finish choices.",
  },
  {
    id: "standard",
    label: "Standard",
    description: "Balanced finish quality for a full mid-range result.",
  },
  {
    id: "premium",
    label: "Premium",
    description: "Higher-end detailing, materials, and visual impact.",
  },
];

const baseCostMatrix: Record<SpaceSizeId, Record<PricingTier, [number, number]>> = {
  compact: {
    basic: [180000, 280000],
    standard: [280000, 420000],
    premium: [420000, 620000],
  },
  family: {
    basic: [280000, 420000],
    standard: [420000, 620000],
    premium: [620000, 880000],
  },
  spacious: {
    basic: [420000, 580000],
    standard: [580000, 860000],
    premium: [860000, 1280000],
  },
};

const intentSummaries: Record<IntentId, string> = {
  inspiration:
    "You want a direction first, so the recommendation focuses on something clear and easy to picture.",
  "plan-renovation":
    "You are moving closer to renovation, so the recommendation leans toward buildable choices that can turn into a practical estimate.",
  "just-browsing":
    "You are still feeling out your taste, so the recommendation stays approachable and easy to compare.",
};

function formatCurrency(value: number) {
  return `HKD ${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function roundToNearestThousand(value: number) {
  return Math.round(value / 1000) * 1000;
}

function getProgressWidth(step: FlowStep) {
  return (step / steps.length) * 100;
}

export function Inspiration() {
  const [currentStep, setCurrentStep] = useState<FlowStep>(1);
  const [selectedIntent, setSelectedIntent] = useState<IntentId | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleDirection | null>(null);
  const [selectedSpaceSize, setSelectedSpaceSize] = useState<SpaceSizeId | null>(
    null,
  );
  const [selectedBudget, setSelectedBudget] = useState<PricingTier | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  const chosenStyle = useMemo(
    () => styleCards.find((style) => style.id === selectedStyle) ?? null,
    [selectedStyle],
  );
  const chosenIntent = useMemo(
    () => intentOptions.find((intent) => intent.id === selectedIntent) ?? null,
    [selectedIntent],
  );
  const chosenSpaceSize = useMemo(
    () => spaceSizeOptions.find((size) => size.id === selectedSpaceSize) ?? null,
    [selectedSpaceSize],
  );
  const chosenBudget = useMemo(
    () => budgetOptions.find((budget) => budget.id === selectedBudget) ?? null,
    [selectedBudget],
  );

  const recommendation = useMemo(() => {
    if (!chosenStyle || !chosenIntent || !chosenSpaceSize || !chosenBudget) {
      return null;
    }

    const [baseMin, baseMax] =
      baseCostMatrix[chosenSpaceSize.id][chosenBudget.id];
    const estimatedMin = roundToNearestThousand(baseMin * chosenStyle.costFactor);
    const estimatedMax = roundToNearestThousand(baseMax * chosenStyle.costFactor);

    return {
      style: chosenStyle,
      intent: chosenIntent,
      size: chosenSpaceSize,
      budget: chosenBudget,
      estimatedMin,
      estimatedMax,
      explanation: `${intentSummaries[chosenIntent.id]} ${chosenStyle.explanation}`,
    };
  }, [chosenBudget, chosenIntent, chosenSpaceSize, chosenStyle]);

  const canContinue =
    (currentStep === 1 && Boolean(selectedIntent)) ||
    (currentStep === 2 && Boolean(selectedStyle)) ||
    (currentStep === 3 && Boolean(selectedSpaceSize && selectedBudget)) ||
    currentStep === 4;

  const goNext = () => {
    if (!canContinue) {
      setShowErrors(true);
      return;
    }

    setShowErrors(false);
    setCurrentStep((step) => (step < 5 ? ((step + 1) as FlowStep) : step));
  };

  const goBack = () => {
    setShowErrors(false);
    setCurrentStep((step) => (step > 1 ? ((step - 1) as FlowStep) : step));
  };

  const handleEstimateClick = () => {
    if (!recommendation) {
      return;
    }

    const estimateDraft: IdeaEstimateDraft = {
      propertySize: recommendation.size.defaultArea,
      pricingTier: recommendation.budget.id,
      style: recommendation.style.id,
      projectBrief:
        `Ideas flow recommendation: ${recommendation.style.label}. ` +
        `Intent: ${recommendation.intent.label}. ` +
        `Space size: ${recommendation.size.label}. ` +
        `Budget: ${recommendation.budget.label}.`,
    };

    sessionStorage.setItem(
      IDEA_ESTIMATE_DRAFT_KEY,
      JSON.stringify(estimateDraft),
    );
  };

  return (
    <div className="bg-[#F9F8F6] text-[#1C1C1C]">
      <section className="border-b border-[#E8E1D9] bg-gradient-to-br from-[#F9F8F6] via-[#F5F3EF] to-[#EFE9E3]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D9D9D6] bg-white/80 px-4 py-2 text-sm text-[#6B5E53]">
              <Lightbulb className="h-4 w-4" />
              Guided Ideas Flow
            </div>
            <h1 className="mt-6 text-4xl leading-tight md:text-5xl">
              Find one renovation direction first. Then move into pricing.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[#6B5E53]">
              A shorter, guided way to help Hong Kong homeowners decide what
              style fits before asking for an estimate.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#E8E1D9] bg-white/80">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.18em] text-[#8B6F4E]">
                Step {currentStep} / {steps.length}
              </div>
              <div className="mt-2 text-2xl">
                {steps.find((step) => step.id === currentStep)?.label}
              </div>
            </div>
            <div className="text-sm text-[#6B5E53]">
              {currentStep < 4
                ? "Make one choice at a time."
                : "Review the recommendation and move to estimate."}
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-full bg-[#E8E1D9]">
            <div
              className="h-2 rounded-full bg-[#8B6F4E] transition-all duration-500"
              style={{ width: `${getProgressWidth(currentStep)}%` }}
            />
          </div>

          <div className="mt-5 grid grid-cols-5 gap-2">
            {steps.map((step) => {
              const isActive = step.id === currentStep;
              const isDone = step.id < currentStep;

              return (
                <div
                  key={step.id}
                  className={`rounded-2xl border px-3 py-3 text-center text-sm ${
                    isActive
                      ? "border-[#8B6F4E] bg-[#F4EFEA] text-[#4B3A2F]"
                      : isDone
                        ? "border-[#D9D9D6] bg-white text-[#6B5E53]"
                        : "border-[#ECE7E1] bg-[#FCFBFA] text-[#A49586]"
                  }`}
                >
                  <div className="mb-1 text-xs uppercase tracking-[0.14em]">
                    {step.id}
                  </div>
                  <div className="hidden sm:block">{step.label}</div>
                  <div className="sm:hidden">Step</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div
            key={currentStep}
            className="rounded-[2rem] border border-[#E8E1D9] bg-white p-6 shadow-[0_18px_60px_rgba(31,24,19,0.06)] animate-reveal-up md:p-10"
          >
            {currentStep === 1 && (
              <div>
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#F4EFEA] px-4 py-2 text-sm text-[#8B6F4E]">
                    <Lightbulb className="h-4 w-4" />
                    Step 1
                  </div>
                  <h2 className="mt-5 text-3xl">What do you need today?</h2>
                  <p className="mt-3 text-[#6B5E53]">
                    Pick the closest intent so we can guide the next steps with
                    less noise.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                  {intentOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedIntent === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setSelectedIntent(option.id);
                          setShowErrors(false);
                        }}
                        className={`rounded-[1.75rem] border p-6 text-left transition-all ${
                          isSelected
                            ? "border-[#8B6F4E] bg-[#F4EFEA] shadow-sm"
                            : "border-[#E8E1D9] bg-white hover:border-[#C6A96E] hover:-translate-y-0.5"
                        }`}
                      >
                        <div className="mb-5 inline-flex rounded-2xl bg-white p-3 text-[#8B6F4E]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-xl">{option.label}</div>
                        <div className="mt-2 text-sm leading-6 text-[#6B5E53]">
                          {option.description}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showErrors && !selectedIntent && (
                  <p className="mt-5 text-sm text-red-600">
                    Choose one option to continue.
                  </p>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#F4EFEA] px-4 py-2 text-sm text-[#8B6F4E]">
                    <Palette className="h-4 w-4" />
                    Step 2
                  </div>
                  <h2 className="mt-5 text-3xl">Choose the style you lean toward.</h2>
                  <p className="mt-3 text-[#6B5E53]">
                    Keep it simple. Pick the one card that feels closest to your
                    ideal home.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {styleCards.map((style) => {
                    const isSelected = selectedStyle === style.id;

                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => {
                          setSelectedStyle(style.id);
                          setShowErrors(false);
                        }}
                        className={`overflow-hidden rounded-[1.75rem] border text-left transition-all ${
                          isSelected
                            ? "border-[#8B6F4E] bg-[#F4EFEA] shadow-sm"
                            : "border-[#E8E1D9] bg-white hover:border-[#C6A96E] hover:-translate-y-0.5"
                        }`}
                      >
                        <img
                          src={style.image}
                          alt={style.label}
                          className="h-48 w-full object-cover"
                        />
                        <div className="p-5">
                          <div className="text-xl">{style.label}</div>
                          <div className="mt-2 text-sm text-[#6B5E53]">
                            {style.description}
                          </div>
                          <div className="mt-4 flex gap-2">
                            {style.palette.slice(0, 4).map((color) => (
                              <div
                                key={`${style.id}-${color}`}
                                className="h-8 flex-1 rounded-xl border border-black/5"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showErrors && !selectedStyle && (
                  <p className="mt-5 text-sm text-red-600">
                    Pick one style card to continue.
                  </p>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#F4EFEA] px-4 py-2 text-sm text-[#8B6F4E]">
                    <Ruler className="h-4 w-4" />
                    Step 3
                  </div>
                  <h2 className="mt-5 text-3xl">Add two quick details.</h2>
                  <p className="mt-3 text-[#6B5E53]">
                    These two inputs are enough to shape a more realistic
                    recommendation.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
                  <div>
                    <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[#8B6F4E]">
                      <Ruler className="h-4 w-4" />
                      Space size
                    </div>
                    <div className="space-y-4">
                      {spaceSizeOptions.map((option) => {
                        const isSelected = selectedSpaceSize === option.id;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              setSelectedSpaceSize(option.id);
                              setShowErrors(false);
                            }}
                            className={`w-full rounded-[1.5rem] border p-5 text-left transition-all ${
                              isSelected
                                ? "border-[#8B6F4E] bg-[#F4EFEA] shadow-sm"
                                : "border-[#E8E1D9] bg-white hover:border-[#C6A96E]"
                            }`}
                          >
                            <div className="text-lg">{option.label}</div>
                            <div className="mt-1 text-sm text-[#6B5E53]">
                              {option.description}
                            </div>
                            <div className="mt-3 text-sm text-[#8B6F4E]">
                              {option.areaHint}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[#8B6F4E]">
                      <Wallet className="h-4 w-4" />
                      Budget level
                    </div>
                    <div className="space-y-4">
                      {budgetOptions.map((option) => {
                        const isSelected = selectedBudget === option.id;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              setSelectedBudget(option.id);
                              setShowErrors(false);
                            }}
                            className={`w-full rounded-[1.5rem] border p-5 text-left transition-all ${
                              isSelected
                                ? "border-[#8B6F4E] bg-[#F4EFEA] shadow-sm"
                                : "border-[#E8E1D9] bg-white hover:border-[#C6A96E]"
                            }`}
                          >
                            <div className="text-lg">{option.label}</div>
                            <div className="mt-2 text-sm text-[#6B5E53]">
                              {option.description}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {showErrors && (!selectedSpaceSize || !selectedBudget) && (
                  <p className="mt-5 text-sm text-red-600">
                    Choose both space size and budget to continue.
                  </p>
                )}
              </div>
            )}

            {currentStep === 4 && recommendation && (
              <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="overflow-hidden rounded-[1.75rem] border border-[#E8E1D9] bg-[#F9F8F6]">
                  <img
                    src={recommendation.style.image}
                    alt={recommendation.style.label}
                    className="h-[360px] w-full object-cover animate-slow-zoom"
                  />
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#F4EFEA] px-4 py-2 text-sm text-[#8B6F4E]">
                    <CheckCircle className="h-4 w-4" />
                    Step 4
                  </div>
                  <h2 className="mt-5 text-3xl">
                    Recommended style: {recommendation.style.label}
                  </h2>
                  <p className="mt-4 leading-7 text-[#6B5E53]">
                    {recommendation.explanation}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="rounded-full bg-[#F4EFEA] px-4 py-2 text-sm text-[#6B5E53]">
                      {recommendation.intent.label}
                    </span>
                    <span className="rounded-full bg-[#F4EFEA] px-4 py-2 text-sm text-[#6B5E53]">
                      {recommendation.size.label}
                    </span>
                    <span className="rounded-full bg-[#F4EFEA] px-4 py-2 text-sm text-[#6B5E53]">
                      {recommendation.budget.label}
                    </span>
                  </div>

                  <div className="mt-8 rounded-[1.5rem] border border-[#E8E1D9] bg-white p-6">
                    <div className="text-sm uppercase tracking-[0.16em] text-[#8B6F4E]">
                      Estimated renovation range
                    </div>
                    <div className="mt-3 text-3xl">
                      {formatCurrency(recommendation.estimatedMin)} to{" "}
                      {formatCurrency(recommendation.estimatedMax)}
                    </div>
                    <div className="mt-2 text-sm text-[#6B5E53]">
                      Early guide only. Final pricing depends on scope, hidden
                      works, and finish specification.
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="mb-3 text-sm uppercase tracking-[0.16em] text-[#8B6F4E]">
                      Design highlights
                    </div>
                    <div className="space-y-3">
                      {recommendation.style.highlights.map((highlight) => (
                        <div key={highlight} className="flex items-start gap-3">
                          <CheckCircle className="mt-0.5 h-5 w-5 text-[#8B6F4E]" />
                          <div className="text-[#4B3A2F]">{highlight}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && recommendation && (
              <div className="grid grid-cols-1 gap-8 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[1.75rem] border border-[#E8E1D9] bg-[#F9F8F6] p-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-[#8B6F4E]">
                    <CheckCircle className="h-4 w-4" />
                    Ready for the next step
                  </div>
                  <h2 className="mt-5 text-3xl">Turn this direction into an estimate.</h2>
                  <p className="mt-4 leading-7 text-[#6B5E53]">
                    We will carry your style and budget direction into the BOQ
                    form so the estimate starts from a more realistic brief.
                  </p>

                  <div className="mt-8 space-y-4 rounded-[1.5rem] border border-[#E8E1D9] bg-white p-6">
                    <div className="flex items-start justify-between gap-4 border-b border-[#EFE9E3] pb-4">
                      <div className="text-sm text-[#6B5E53]">Recommended style</div>
                      <div className="text-right">{recommendation.style.label}</div>
                    </div>
                    <div className="flex items-start justify-between gap-4 border-b border-[#EFE9E3] pb-4">
                      <div className="text-sm text-[#6B5E53]">Space size</div>
                      <div className="text-right">{recommendation.size.label}</div>
                    </div>
                    <div className="flex items-start justify-between gap-4 border-b border-[#EFE9E3] pb-4">
                      <div className="text-sm text-[#6B5E53]">Budget level</div>
                      <div className="text-right">{recommendation.budget.label}</div>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-sm text-[#6B5E53]">Estimated range</div>
                      <div className="text-right">
                        {formatCurrency(recommendation.estimatedMin)} to{" "}
                        {formatCurrency(recommendation.estimatedMax)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-[#E8E1D9] bg-white p-8">
                  <div className="text-sm uppercase tracking-[0.16em] text-[#8B6F4E]">
                    Primary action
                  </div>
                  <h3 className="mt-4 text-3xl">Get Estimate</h3>
                  <p className="mt-4 leading-7 text-[#6B5E53]">
                    Continue to the estimate form with your selected direction
                    already prepared.
                  </p>

                  <Link
                    to="/estimate"
                    onClick={handleEstimateClick}
                    className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#1C1C1C] px-7 py-4 text-white transition-colors hover:bg-[#3A3A3A]"
                  >
                    Get Estimate
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1);
                      setShowErrors(false);
                    }}
                    className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-[#D9D9D6] px-7 py-4 text-[#4B3A2F] transition-colors hover:bg-[#F5F3EF]"
                  >
                    Start Again
                  </button>
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#EFE9E3] pt-6">
              <button
                type="button"
                onClick={goBack}
                disabled={currentStep === 1}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#D9D9D6] px-5 py-3 text-[#4B3A2F] transition-colors hover:bg-[#F5F3EF] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              {currentStep < 5 && (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#8B6F4E] px-5 py-3 text-white transition-colors hover:bg-[#6B5E53]"
                >
                  {currentStep === 4 ? "Continue to CTA" : "Continue"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

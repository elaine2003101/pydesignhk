import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  Bath,
  CheckCircle,
  Hammer,
  House,
  Lightbulb,
  Paintbrush,
} from "lucide-react";
import { toast } from "sonner";
import {
  createLeadId,
  getLeadDestinationSettings,
  saveIdeaStarterLead,
  submitLeadToDestinations,
} from "../lib/leadPipeline";

const roomOptions = [
  { id: "living-room", label: "Living Room", icon: House },
  { id: "kitchen", label: "Kitchen", icon: Hammer },
  { id: "bedroom", label: "Bedroom", icon: Paintbrush },
  { id: "bathroom", label: "Bathroom", icon: Bath },
];

const budgetOptions = [
  { id: "starter", label: "Starter Refresh", range: "HKD 80k - 180k" },
  { id: "mid", label: "Family Upgrade", range: "HKD 180k - 380k" },
  { id: "premium", label: "Signature Makeover", range: "HKD 380k+" },
];

const styleOptions = [
  { id: "calm", label: "Calm Minimal" },
  { id: "warm", label: "Warm Modern" },
  { id: "smart", label: "Storage-Focused" },
];

const presetMoodboards = [
  {
    id: "urban-calm",
    room: "living-room",
    style: "calm",
    title: "Urban Calm",
    fit: "Living Room · Calm Minimal",
    description:
      "Soft stone, warm white, ash wood, and low-contrast styling for homeowners who want the space to feel brighter and less busy.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    materials: ["Warm white walls", "Ash wood joinery", "Linen textures", "Soft ambient lighting"],
    tags: ["Curved sofa", "Open shelving", "Oak veneer", "Textured rug"],
    palette: ["#F3EFE9", "#D6CEC2", "#A89582", "#5D6B68"],
  },
  {
    id: "modern-harvest",
    room: "kitchen",
    style: "warm",
    title: "Modern Harvest",
    fit: "Kitchen · Warm Modern",
    description:
      "A richer kitchen direction using oak tones, stone-look surfaces, and muted brass accents to feel premium without going too dark.",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    materials: ["Oak cabinetry", "Travertine-look top", "Muted brass accents", "Layered task lights"],
    tags: ["Stone backsplash", "Wood island", "Warm pendants", "Integrated storage"],
    palette: ["#EEE3D3", "#C7AA86", "#8A6A4A", "#43413B"],
  },
  {
    id: "smart-retreat",
    room: "bedroom",
    style: "smart",
    title: "Smart Retreat",
    fit: "Bedroom · Storage-Focused",
    description:
      "A bedroom board built around hidden storage, cleaner lines, and softer lighting for smaller homes that still need to feel restful.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80&sat=-15",
    materials: ["Full-height wardrobes", "Fabric headboard wall", "Concealed storage", "Warm cove lighting"],
    tags: ["Built-in wardrobe", "Platform bed", "Soft taupe", "Concealed handles"],
    palette: ["#F4F1EC", "#D8D2C8", "#8F8477", "#38414A"],
  },
  {
    id: "spa-reset",
    room: "bathroom",
    style: "calm",
    title: "Spa Reset",
    fit: "Bathroom · Calm Minimal",
    description:
      "A cleaner bathroom direction with stone tones, subtle contrast, and hotel-inspired detailing for small spaces that need to feel more premium.",
    image:
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
    materials: ["Stone-look wall tiles", "Matte black hardware", "Floating vanity", "Backlit mirror"],
    tags: ["Wall-hung vanity", "Large-format tile", "Soft beige", "Mirror lighting"],
    palette: ["#F2ECE5", "#D8CDC1", "#A58E79", "#2F3135"],
  },
];

const suggestionLibrary = [
  {
    room: "living-room",
    budget: "starter",
    style: "calm",
    title: "Soft Minimal Living Room Reset",
    summary:
      "A low-risk upgrade for first-time homeowners who want the space to feel brighter, cleaner, and easier to style.",
    outcomes: [
      "Neutral wall refresh with warmer lighting",
      "Slim TV wall storage to reduce clutter",
      "Sofa and rug palette guidance for a cleaner look",
    ],
    timeline: "2 to 3 weeks",
  },
  {
    room: "living-room",
    budget: "mid",
    style: "smart",
    title: "Family Living Room With Hidden Storage",
    summary:
      "Designed for households that need a more polished living area without losing practicality.",
    outcomes: [
      "Full-height cabinetry around feature wall",
      "Bench seating or display-led storage zone",
      "Layered lighting for daily use and entertaining",
    ],
    timeline: "3 to 5 weeks",
  },
  {
    room: "kitchen",
    budget: "mid",
    style: "warm",
    title: "Warm Modern Kitchen Upgrade",
    summary:
      "A balanced renovation concept focused on function, durable finishes, and a more premium daily experience.",
    outcomes: [
      "Cabinet redesign for better workflow",
      "Wood-tone and stone-look finish pairing",
      "Lighting and backsplash plan for visual depth",
    ],
    timeline: "4 to 6 weeks",
  },
  {
    room: "kitchen",
    budget: "premium",
    style: "smart",
    title: "High-Storage Signature Kitchen",
    summary:
      "For owners who want a showpiece kitchen with custom storage and a stronger resale impression.",
    outcomes: [
      "Custom island or breakfast counter concept",
      "Appliance integration and pantry zoning",
      "Premium finishes with lighting-led focal points",
    ],
    timeline: "6 to 8 weeks",
  },
  {
    room: "bedroom",
    budget: "starter",
    style: "warm",
    title: "Bedroom Comfort Refresh",
    summary:
      "A lighter-touch package for clients who want a calmer room and clearer design direction before committing to bigger works.",
    outcomes: [
      "Color palette and feature wall direction",
      "Wardrobe and bedside layout advice",
      "Lighting improvements for a softer atmosphere",
    ],
    timeline: "2 to 3 weeks",
  },
  {
    room: "bedroom",
    budget: "premium",
    style: "calm",
    title: "Hotel-Inspired Master Bedroom",
    summary:
      "A more aspirational concept for clients looking for premium finishes and a restful luxury feel.",
    outcomes: [
      "Full feature wall and headboard planning",
      "Integrated wardrobe and vanity concept",
      "Ambient lighting scheme with layered textures",
    ],
    timeline: "4 to 6 weeks",
  },
  {
    room: "bathroom",
    budget: "starter",
    style: "calm",
    title: "Bathroom Reset With Clean Finishes",
    summary:
      "A practical bathroom refresh that improves daily comfort and updates the look without turning it into a full luxury scope.",
    outcomes: [
      "Tile and sanitaryware direction for a cleaner visual baseline",
      "Mirror and vanity suggestions to improve perceived space",
      "Lighting upgrade to make the room feel brighter and more premium",
    ],
    timeline: "2 to 3 weeks",
  },
  {
    room: "bathroom",
    budget: "mid",
    style: "smart",
    title: "Storage-Led Bathroom Upgrade",
    summary:
      "Built for tighter layouts where concealed storage and cleaner zoning matter more than raw square footage.",
    outcomes: [
      "Wall-hung vanity and recessed shelf planning",
      "More efficient shower and basin arrangement",
      "Material choices that hold up better in daily use",
    ],
    timeline: "3 to 4 weeks",
  },
];

const fallbackSuggestions = [
  {
    title: "Whole-Home Direction Session",
    summary:
      "Best for visitors who are still comparing ideas and need clarity before talking budget.",
    outcomes: [
      "Shortlist the best room to renovate first",
      "Pick a visual direction that fits the property",
      "Move into an estimate with fewer revisions",
    ],
    timeline: "1 planning session",
  },
  {
    title: "High-Impact First Project",
    summary:
      "A starting concept focused on one room that changes the feel of the home quickly and helps unlock future work.",
    outcomes: [
      "Choose one conversion-focused renovation target",
      "Build a sensible budget range before overcommitting",
      "Create a cleaner next step into design and quotation",
    ],
    timeline: "1 to 2 planning sessions",
  },
];

export function Inspiration() {
  const [selectedRoom, setSelectedRoom] = useState(roomOptions[0].id);
  const [selectedBudget, setSelectedBudget] = useState(budgetOptions[1].id);
  const [selectedStyle, setSelectedStyle] = useState(styleOptions[0].id);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    contact: "",
    requestType: "moodboard",
    notes: "",
  });

  const matchingSuggestions = useMemo(() => {
    const matches = suggestionLibrary.filter(
      (suggestion) =>
        suggestion.room === selectedRoom &&
        suggestion.budget === selectedBudget &&
        suggestion.style === selectedStyle,
    );

    return matches.length > 0 ? matches : fallbackSuggestions;
  }, [selectedBudget, selectedRoom, selectedStyle]);

  const selectedRoomLabel =
    roomOptions.find((option) => option.id === selectedRoom)?.label ?? "";
  const selectedBudgetLabel =
    budgetOptions.find((option) => option.id === selectedBudget)?.label ?? "";
  const selectedStyleLabel =
    styleOptions.find((option) => option.id === selectedStyle)?.label ?? "";
  const moodboardGroups = roomOptions
    .map((room) => ({
      roomId: room.id,
      roomLabel: room.label,
      boards: presetMoodboards.filter((moodboard) => moodboard.room === room.id),
    }))
    .filter((group) => group.boards.length > 0);

  const openLeadCapture = () => {
    document.getElementById("lead-capture")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleLeadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const leadEntry = {
      id: createLeadId(),
      ...leadForm,
      room: selectedRoomLabel,
      budget: selectedBudgetLabel,
      style: selectedStyleLabel,
      createdAt: new Date().toISOString(),
      stage: "new" as const,
      source: "idea-starter" as const,
    };

    saveIdeaStarterLead(leadEntry);

    const submissionResult = await submitLeadToDestinations(
      leadEntry,
      getLeadDestinationSettings(),
    );

    if (submissionResult.errors.length > 0) {
      toast.warning(
        `Lead saved locally. ${submissionResult.errors[0]}`,
      );
    } else if (submissionResult.actions.length > 0) {
      toast.success(
        `Lead captured and sent to ${submissionResult.actions.join(", ")}.`,
      );
    } else {
      toast.success("Lead captured. Follow up with this visitor soon.");
    }

    setLeadForm({
      name: "",
      email: "",
      contact: "",
      requestType: "moodboard",
      notes: "",
    });
  };

  const handleUseMoodboard = (moodboard: (typeof presetMoodboards)[number]) => {
    setSelectedRoom(moodboard.room);
    setSelectedStyle(moodboard.style);

    setLeadForm((current) => ({
      ...current,
      requestType: current.requestType === "consultation" ? "both" : "moodboard",
      notes: current.notes
        ? `${current.notes}\nPreferred moodboard: ${moodboard.title} (${moodboard.fit})`
        : `Preferred moodboard: ${moodboard.title} (${moodboard.fit})`,
    }));

    document.getElementById("lead-capture")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    toast.success(`${moodboard.title} added to the lead request.`);
  };

  return (
    <div className="bg-gray-50">
      <section className="bg-gradient-to-br from-[#F9F8F6] via-[#EFE9E3] to-[#D9CFC7] text-[#4F4338] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-[#D9CFC7] text-sm text-[#7A6751] mb-6">
                <Lightbulb className="w-4 h-4" />
                Idea Starter For Early-Stage Visitors
              </div>
              <h1 className="text-4xl md:text-6xl leading-tight mb-6">
                Not sure what to renovate yet? Start with a direction, not a quotation.
              </h1>
              <p className="text-lg md:text-xl text-[#6E6258] max-w-2xl">
                This page helps colder traffic move from “just browsing” to a
                clearer project idea, budget range, and next step.
              </p>
            </div>

            <div className="bg-white/75 backdrop-blur-sm border border-[#D9CFC7] rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl mb-2">What you get</h2>
              <p className="text-[#6E6258] mb-6">
                A practical starting point you can turn into an estimate or consultation.
              </p>
              <div className="space-y-4">
                {[
                  "Suggested room priorities based on your interest",
                  "A realistic renovation budget band",
                  "A concept direction to speed up your consultation",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#8F775C] mt-0.5 flex-shrink-0" />
                    <span className="text-[#4F4338]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-8">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-3xl text-gray-900 mb-2">Build Your Idea Direction</h2>
              <p className="text-gray-600 mb-8">
                Choose a room, budget, and style. We will suggest a practical concept you can sell into.
              </p>

              <div className="space-y-8">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500 mb-3">
                    Room
                  </p>
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                    {roomOptions.map((option) => {
                      const Icon = option.icon;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setSelectedRoom(option.id)}
                          className={`rounded-2xl border p-4 text-left transition-all ${
                            selectedRoom === option.id
                              ? "border-blue-600 bg-blue-50 shadow-sm"
                              : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="w-5 h-5 text-blue-600 mb-3" />
                          <div className="font-medium text-gray-900">{option.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500 mb-3">
                    Budget
                  </p>
                  <div className="space-y-3">
                    {budgetOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedBudget(option.id)}
                        className={`w-full rounded-2xl border px-4 py-4 text-left transition-all ${
                          selectedBudget === option.id
                            ? "border-blue-600 bg-blue-50 shadow-sm"
                            : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.range}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500 mb-3">
                    Style
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {styleOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedStyle(option.id)}
                        className={`px-4 py-3 rounded-full border transition-all ${
                          selectedStyle === option.id
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-200 bg-white text-gray-700 hover:border-blue-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {matchingSuggestions.map((suggestion) => (
                <div
                  key={suggestion.title}
                  className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                      Suggested Concept
                    </span>
                    <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                      Timeline: {suggestion.timeline}
                    </span>
                  </div>

                  <h3 className="text-3xl text-gray-900 mb-3">{suggestion.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {suggestion.summary}
                  </p>

                  <div className="space-y-4 mb-8">
                    {suggestion.outcomes.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      to="/estimate"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Turn This Into An Estimate
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      Save And Discuss Later
                    </Link>
                    <button
                      type="button"
                      onClick={openLeadCapture}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors"
                    >
                      Request Moodboard / Consultation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-4xl text-gray-900 mb-4">Ready-Made Moodboards</h2>
            <p className="text-lg text-gray-600">
              Yes, you can pre-set mood boards already. These act as starter directions for visitors who want inspiration before discussing scope or budget in detail.
            </p>
          </div>

          <div className="space-y-12">
            {moodboardGroups.map((group) => (
              <div key={group.roomId}>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <h3 className="text-2xl text-gray-900">{group.roomLabel} Boards</h3>
                  <div className="text-sm text-gray-500">
                    Ready-made direction for {group.roomLabel.toLowerCase()} enquiries
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {group.boards.map((moodboard) => (
                    <div
                      key={moodboard.id}
                      className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
                    >
                      <div className="relative h-72 overflow-hidden">
                        <img
                          src={moodboard.image}
                          alt={moodboard.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <div className="absolute left-6 right-6 bottom-6">
                          <div className="text-xs uppercase tracking-[0.22em] text-white/75 mb-2">
                            {moodboard.fit}
                          </div>
                          <h4 className="text-3xl text-white">{moodboard.title}</h4>
                        </div>
                      </div>

                      <div className="p-6 border-b border-gray-100">
                        <p className="text-gray-600 leading-relaxed mb-5">
                          {moodboard.description}
                        </p>

                        <div className="flex gap-2 mb-5">
                          {moodboard.palette.map((color) => (
                            <div
                              key={color}
                              className="h-12 flex-1 rounded-2xl border border-black/5"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {moodboard.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-2 rounded-full bg-gray-100 text-gray-700 text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="space-y-3 mb-6">
                          {moodboard.materials.map((item) => (
                            <div key={item} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleUseMoodboard(moodboard)}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                        >
                          Use This Moodboard
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="lead-capture" className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8">
            <div className="bg-slate-900 text-white rounded-3xl p-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm text-slate-100 mb-6">
                <Lightbulb className="w-4 h-4" />
                Lead Capture
              </div>
              <h2 className="text-3xl mb-4">Turn early interest into a sales conversation.</h2>
              <p className="text-slate-300 leading-relaxed mb-8">
                Offer a moodboard or short consultation so visitors can move forward even if
                they are not ready for a full estimate yet.
              </p>
              <div className="space-y-4">
                {[
                  `Current room focus: ${selectedRoomLabel}`,
                  `Budget direction: ${selectedBudgetLabel}`,
                  `Style preference: ${selectedStyleLabel}`,
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-300 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-100">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
              <h3 className="text-3xl text-gray-900 mb-2">Request Moodboard / Consultation</h3>
              <p className="text-gray-600 mb-8">
                Capture the lead now and follow up with a suggestion pack or a short discovery call.
              </p>

              <form onSubmit={handleLeadSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="lead-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      required
                      value={leadForm.name}
                      onChange={(event) =>
                        setLeadForm({ ...leadForm, name: event.target.value })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                      placeholder="Client name"
                    />
                  </div>

                  <div>
                    <label htmlFor="lead-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      required
                      value={leadForm.email}
                      onChange={(event) =>
                        setLeadForm({ ...leadForm, email: event.target.value })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="lead-contact" className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp / Phone
                    </label>
                    <input
                      id="lead-contact"
                      type="text"
                      value={leadForm.contact}
                      onChange={(event) =>
                        setLeadForm({ ...leadForm, contact: event.target.value })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                      placeholder="+852 ..."
                    />
                  </div>

                  <div>
                    <label htmlFor="lead-request-type" className="block text-sm font-medium text-gray-700 mb-2">
                      Request Type
                    </label>
                    <select
                      id="lead-request-type"
                      value={leadForm.requestType}
                      onChange={(event) =>
                        setLeadForm({ ...leadForm, requestType: event.target.value })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 bg-white"
                    >
                      <option value="moodboard">Moodboard</option>
                      <option value="consultation">Consultation</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="lead-notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    id="lead-notes"
                    rows={5}
                    value={leadForm.notes}
                    onChange={(event) =>
                      setLeadForm({ ...leadForm, notes: event.target.value })
                    }
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Any goals, preferred timeline, or property details"
                  />
                </div>

                <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-900">
                  This lead will be saved with the current room, budget, and style choices from the Idea Starter.
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Save Lead Request
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

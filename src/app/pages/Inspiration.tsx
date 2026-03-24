import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  CheckCircle,
  Hammer,
  House,
  Lightbulb,
  Palette,
  Paintbrush,
  Sparkles,
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
  {
    id: "modern-minimal",
    label: "Modern Minimal",
    palette: ["#F5F5F2", "#D9D9D6", "#3A3A3A", "#E8E1D9", "#1C1C1C"],
  },
  {
    id: "japandi",
    label: "Japandi",
    palette: ["#F4EFEA", "#D6C3A3", "#7A8C66", "#8B6F4E", "#4B3A2F"],
  },
  {
    id: "modern-luxury",
    label: "Modern Luxury",
    palette: ["#F8F7F5", "#CFCFCF", "#C6A96E", "#6B5E53", "#1A1A1A"],
  },
  {
    id: "scandinavian",
    label: "Scandinavian",
    palette: ["#FFFFFF", "#E5E5E5", "#AFCBDA", "#EADBC8", "#2E2E2E"],
  },
  {
    id: "industrial",
    label: "Industrial",
    palette: ["#B0B0B0", "#6E6E6E", "#A0522D", "#5A4634", "#121212"],
  },
  {
    id: "korean-soft",
    label: "Korean Soft / Feminine",
    palette: ["#FAF8F6", "#F2DCDC", "#D8A7A7", "#EAD8C0", "#6B4F4F"],
  },
] as const;

type RoomId = (typeof roomOptions)[number]["id"];
type BudgetId = (typeof budgetOptions)[number]["id"];
type StyleId = (typeof styleOptions)[number]["id"];

type QuizOption = {
  id: string;
  label: string;
  description: string;
  room?: RoomId;
  styleScores?: Partial<Record<StyleId, number>>;
  budget?: BudgetId;
  palettePreview?: string[];
};

type QuizQuestion = {
  id: string;
  prompt: string;
  helper: string;
  options: QuizOption[];
};

type LeadFormState = {
  name: string;
  email: string;
  contact: string;
  requestType: string;
  notes: string;
};

type LeadFormErrors = Partial<Record<keyof LeadFormState, string>>;

const quizQuestions: QuizQuestion[] = [
  {
    id: "focus-room",
    prompt: "Which area should feel better first?",
    helper:
      "This helps us suggest the most sensible first moodboard for a Hong Kong home.",
    options: [
      {
        id: "living-room",
        label: "Living room first",
        description: "Best if you want the home to feel more polished for daily living and guests.",
        room: "living-room",
        styleScores: { "modern-minimal": 1, scandinavian: 1, "modern-luxury": 1 },
      },
      {
        id: "kitchen",
        label: "Kitchen first",
        description: "Best if workflow, storage, and resale impact matter most.",
        room: "kitchen",
        styleScores: { japandi: 2, industrial: 1, "modern-minimal": 1 },
      },
      {
        id: "bedroom",
        label: "Bedroom first",
        description: "Best if comfort, storage, and softness matter more than showpiece design.",
        room: "bedroom",
        styleScores: { "korean-soft": 2, japandi: 1, scandinavian: 1 },
      },
      {
        id: "bathroom",
        label: "Bathroom first",
        description: "Best if you want a fast visual upgrade in a small footprint.",
        room: "bathroom",
        styleScores: { "modern-minimal": 1, "modern-luxury": 1, scandinavian: 1 },
      },
    ],
  },
  {
    id: "daily-priority",
    prompt: "What matters most in your renovation?",
    helper:
      "Choose the goal that sounds closest to your real day-to-day frustration.",
    options: [
      {
        id: "calm-space",
        label: "I want it to feel calmer",
        description: "Cleaner visual lines, softer layering, and less noise.",
        styleScores: { "modern-minimal": 3, japandi: 2, scandinavian: 2 },
      },
      {
        id: "more-storage",
        label: "I need smarter storage",
        description: "Built-ins, hidden joinery, and more efficient planning.",
        styleScores: { "modern-minimal": 4, industrial: 1, scandinavian: 1 },
      },
      {
        id: "more-warmth",
        label: "I want it warmer and more welcoming",
        description: "Wood tones, softer stone, and a more inviting feel.",
        styleScores: { japandi: 4, "korean-soft": 2, "modern-luxury": 1 },
      },
      {
        id: "more-luxury",
        label: "I want it to feel more premium",
        description: "Hotel-like detailing, feature finishes, and stronger impact.",
        styleScores: { "modern-luxury": 4, industrial: 1, japandi: 1 },
      },
    ],
  },
  {
    id: "visual-mood",
    prompt: "Which visual mood are you naturally drawn to?",
    helper:
      "Most clients know how they want the room to feel before they know the style name.",
    options: [
      {
        id: "soft-airy",
        label: "Soft and airy",
        description: "Light, open, and easy to live with.",
        styleScores: { scandinavian: 3, "modern-minimal": 2, "korean-soft": 1 },
        palettePreview: ["#FFFFFF", "#E5E5E5", "#AFCBDA", "#EADBC8", "#2E2E2E"],
      },
      {
        id: "warm-layered",
        label: "Warm and layered",
        description: "Natural materials, grounded tones, and richer warmth.",
        styleScores: { japandi: 3, "modern-luxury": 1, "korean-soft": 1 },
        palettePreview: ["#F4EFEA", "#D6C3A3", "#7A8C66", "#8B6F4E", "#4B3A2F"],
      },
      {
        id: "clean-practical",
        label: "Clean and practical",
        description: "Simple, efficient, and strongly layout-driven.",
        styleScores: { "modern-minimal": 3, industrial: 1, scandinavian: 1 },
        palettePreview: ["#F5F5F2", "#D9D9D6", "#3A3A3A", "#E8E1D9", "#1C1C1C"],
      },
      {
        id: "bold-contrast",
        label: "Bold with contrast",
        description: "Deeper tones, stronger edges, and more drama.",
        styleScores: { industrial: 4, "modern-luxury": 2 },
        palettePreview: ["#B0B0B0", "#6E6E6E", "#A0522D", "#5A4634", "#121212"],
      },
    ],
  },
  {
    id: "finish-direction",
    prompt: "Which finish family feels most like you?",
    helper:
      "This pushes the recommendation closer to the material language you actually like.",
    options: [
      {
        id: "oak-stone",
        label: "Oak and soft stone",
        description: "Quiet, warm, and easy to maintain visually.",
        styleScores: { japandi: 3, scandinavian: 1, "korean-soft": 1 },
      },
      {
        id: "painted-joinery",
        label: "Painted joinery and hidden storage",
        description: "Sharper planning with less visual clutter.",
        styleScores: { "modern-minimal": 4, scandinavian: 1 },
      },
      {
        id: "fluted-brass",
        label: "Fluted details and brass",
        description: "Boutique-hotel cues with stronger styling intent.",
        styleScores: { "modern-luxury": 4, japandi: 1 },
        budget: "premium",
      },
      {
        id: "charcoal-stone",
        label: "Charcoal and richer stone",
        description: "A darker, more graphic interior direction.",
        styleScores: { industrial: 4, "modern-luxury": 1 },
        budget: "premium",
      },
    ],
  },
];

// Replace these URLs later with your own project photos, renders, or portfolio images.
const MOODBOARD_IMAGE_LIBRARY = {
  urbanCalm:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  galleryJapandi:
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  modernHarvest:
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  shadowLine:
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
  smartRetreat:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80&sat=-15",
  suiteLuxe:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80&contrast=20",
  spaReset:
    "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
  marbleGlow:
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
} as const;

const presetMoodboards = [
  {
    id: "harbour-quiet",
    room: "living-room",
    style: "modern-minimal",
    title: "Harbour Quiet",
    fit: "Living Room · Modern Minimal",
    description:
      "A restrained living room direction with softened greys, warm off-whites, and sharper detailing for Hong Kong flats that need to feel calm without losing edge.",
    image: MOODBOARD_IMAGE_LIBRARY.urbanCalm,
    materials: ["Low-profile TV wall", "Stone-look coffee table", "Textured off-white upholstery", "Slim black metal details"],
    tags: ["Quiet palette", "Slim joinery", "City flat", "Minimal styling"],
    swatches: [
      { label: "Base", color: "#F5F5F2" },
      { label: "Stone", color: "#D9D9D6" },
      { label: "Joinery", color: "#3A3A3A" },
      { label: "Textile", color: "#E8E1D9" },
      { label: "Outline", color: "#1C1C1C" },
    ],
  },
  {
    id: "nordic-daylight",
    room: "living-room",
    style: "scandinavian",
    title: "Nordic Daylight",
    fit: "Living Room · Scandinavian",
    description:
      "A brighter board for compact apartments using pale timber, cloud whites, muted blue-grey accents, and soft layering that opens up the room visually.",
    image: MOODBOARD_IMAGE_LIBRARY.galleryJapandi,
    materials: ["Pale oak media wall", "Soft woven fabrics", "Light blue-grey accents", "Round-edged loose furniture"],
    tags: ["Nordic sofa", "Airy palette", "Timber legs", "Soft daylight"],
    swatches: [
      { label: "Wall", color: "#FFFFFF" },
      { label: "Floor", color: "#E5E5E5" },
      { label: "Accent", color: "#AFCBDA" },
      { label: "Timber", color: "#EADBC8" },
      { label: "Outline", color: "#2E2E2E" },
    ],
  },
  {
    id: "timber-balance",
    room: "kitchen",
    style: "japandi",
    title: "Timber Balance",
    fit: "Kitchen · Japandi",
    description:
      "A calmer kitchen built around soft plaster tones, honeyed timber, olive accents, and grounded brown details for a warm but uncluttered family upgrade.",
    image: MOODBOARD_IMAGE_LIBRARY.modernHarvest,
    materials: ["Timber-faced cabinets", "Quiet open shelf niche", "Warm task lighting", "Muted feature hardware"],
    tags: ["Natural wood", "Soft green", "Organic edges", "Calm workflow"],
    swatches: [
      { label: "Plaster", color: "#F4EFEA" },
      { label: "Oak", color: "#D6C3A3" },
      { label: "Accent", color: "#7A8C66" },
      { label: "Wood", color: "#8B6F4E" },
      { label: "Outline", color: "#4B3A2F" },
    ],
  },
  {
    id: "atelier-steel",
    room: "kitchen",
    style: "industrial",
    title: "Atelier Steel",
    fit: "Kitchen · Industrial",
    description:
      "A sharper kitchen concept with concrete greys, darker timber, and burnished rust notes for owners who want a more architectural statement.",
    image: MOODBOARD_IMAGE_LIBRARY.shadowLine,
    materials: ["Matte grey joinery", "Dark wood shelving", "Black-framed lighting", "Textured industrial hardware"],
    tags: ["Concrete tones", "Loft feel", "Black metal", "Statement kitchen"],
    swatches: [
      { label: "Concrete", color: "#B0B0B0" },
      { label: "Steel", color: "#6E6E6E" },
      { label: "Rust", color: "#A0522D" },
      { label: "Timber", color: "#5A4634" },
      { label: "Outline", color: "#121212" },
    ],
  },
  {
    id: "soft-seoul",
    room: "bedroom",
    style: "korean-soft",
    title: "Soft Seoul",
    fit: "Bedroom · Korean Soft / Feminine",
    description:
      "A softer bedroom direction with blush undertones, rounded forms, and creamy layers for clients who want a calm room with a more feminine tone.",
    image: MOODBOARD_IMAGE_LIBRARY.smartRetreat,
    materials: ["Curved bedside details", "Layered drapery", "Creamy built-in wardrobe", "Soft pink-beige accents"],
    tags: ["Rounded forms", "Powder tones", "Soft fabric", "Quiet bedroom"],
    swatches: [
      { label: "Base", color: "#FAF8F6" },
      { label: "Blush", color: "#F2DCDC" },
      { label: "Accent", color: "#D8A7A7" },
      { label: "Cream", color: "#EAD8C0" },
      { label: "Outline", color: "#6B4F4F" },
    ],
  },
  {
    id: "suite-brass",
    room: "bedroom",
    style: "modern-luxury",
    title: "Suite Brass",
    fit: "Bedroom · Modern Luxury",
    description:
      "A more tailored bedroom concept using pale stone, brass accents, deeper taupe joinery, and clean-lined luxury detailing.",
    image: MOODBOARD_IMAGE_LIBRARY.suiteLuxe,
    materials: ["Fluted bedside panel", "Brushed brass lines", "Tailored upholstery", "Stone-look side table"],
    tags: ["Hotel tone", "Brass trim", "Premium joinery", "Tailored lighting"],
    swatches: [
      { label: "Base", color: "#F8F7F5" },
      { label: "Stone", color: "#CFCFCF" },
      { label: "Brass", color: "#C6A96E" },
      { label: "Taupe", color: "#6B5E53" },
      { label: "Outline", color: "#1A1A1A" },
    ],
  },
  {
    id: "minimal-spa",
    room: "bathroom",
    style: "modern-minimal",
    title: "Minimal Spa",
    fit: "Bathroom · Modern Minimal",
    description:
      "A cleaner bathroom board focused on soft greys, creamy stone, and sharp black edges that make small bathrooms feel more deliberate and refined.",
    image: MOODBOARD_IMAGE_LIBRARY.spaReset,
    materials: ["Large-format tile", "Slim floating vanity", "Frameless mirror", "Quiet black trim"],
    tags: ["Hotel clean", "Stone feel", "Simple vanity", "Sharp detailing"],
    swatches: [
      { label: "Base", color: "#F5F5F2" },
      { label: "Tile", color: "#D9D9D6" },
      { label: "Vanity", color: "#3A3A3A" },
      { label: "Stone", color: "#E8E1D9" },
      { label: "Outline", color: "#1C1C1C" },
    ],
  },
  {
    id: "brass-veil",
    room: "bathroom",
    style: "modern-luxury",
    title: "Brass Veil",
    fit: "Bathroom · Modern Luxury",
    description:
      "An elevated bathroom concept with brushed brass, pale stone, and deep taupe contrasts aimed at clients who want a strong boutique-hotel finish.",
    image: MOODBOARD_IMAGE_LIBRARY.marbleGlow,
    materials: ["Stone slab wall", "Brushed brass fittings", "Custom vanity block", "Integrated mirror lighting"],
    tags: ["Warm brass", "Luxury bath", "Stone slab", "Hotel vanity"],
    swatches: [
      { label: "Base", color: "#F8F7F5" },
      { label: "Stone", color: "#CFCFCF" },
      { label: "Brass", color: "#C6A96E" },
      { label: "Joinery", color: "#6B5E53" },
      { label: "Outline", color: "#1A1A1A" },
    ],
  },
];

const suggestionLibrary = [
  {
    room: "living-room",
    budget: "starter",
    style: "modern-minimal",
    title: "Modern Minimal Living Room Reset",
    summary:
      "A restrained first upgrade for homeowners who want the living room to feel calmer, cleaner, and easier to maintain visually.",
    outcomes: [
      "Quiet wall palette with stronger contrast control",
      "Slim TV wall or media storage to reduce clutter",
      "Furniture and rug direction that keeps the room lighter",
    ],
    timeline: "2 to 3 weeks",
  },
  {
    room: "living-room",
    budget: "mid",
    style: "scandinavian",
    title: "Scandinavian Family Living Room",
    summary:
      "A brighter family room concept that improves openness without making the space feel cold or unfinished.",
    outcomes: [
      "Light timber and off-white palette for better perceived space",
      "Softer furniture planning for daily living",
      "Airier lighting and loose-furniture direction",
    ],
    timeline: "3 to 5 weeks",
  },
  {
    room: "kitchen",
    budget: "mid",
    style: "japandi",
    title: "Japandi Kitchen Upgrade",
    summary:
      "A balanced kitchen direction focused on flow, warm timber, and a calmer material mix that still feels premium.",
    outcomes: [
      "Cabinet redesign for clearer daily workflow",
      "Natural wood and stone palette pairing",
      "Task-lighting and niche planning for visual calm",
    ],
    timeline: "4 to 6 weeks",
  },
  {
    room: "kitchen",
    budget: "premium",
    style: "industrial",
    title: "Industrial Signature Kitchen",
    summary:
      "For owners who want a more architectural showpiece kitchen with stronger contrast and material character.",
    outcomes: [
      "Darker joinery and metal-led detailing",
      "Feature shelving or statement counter concept",
      "Stronger material contrast with premium hardware",
    ],
    timeline: "6 to 8 weeks",
  },
  {
    room: "bedroom",
    budget: "starter",
    style: "korean-soft",
    title: "Korean Soft Bedroom Refresh",
    summary:
      "A lighter-touch concept for clients who want a softer, more feminine room direction before committing to larger built-in works.",
    outcomes: [
      "Cream, blush, and fabric palette direction",
      "Rounded bedside and wardrobe styling ideas",
      "Lighting upgrades for a gentler atmosphere",
    ],
    timeline: "2 to 3 weeks",
  },
  {
    room: "bedroom",
    budget: "premium",
    style: "modern-luxury",
    title: "Modern Luxury Master Bedroom",
    summary:
      "A more aspirational concept for clients looking for premium finishes and a stronger hotel-style finish.",
    outcomes: [
      "Feature headboard wall and tailored bedside detailing",
      "Integrated wardrobe and vanity concept",
      "Brass-led palette and layered lighting plan",
    ],
    timeline: "4 to 6 weeks",
  },
  {
    room: "bathroom",
    budget: "starter",
    style: "modern-minimal",
    title: "Modern Minimal Bathroom Reset",
    summary:
      "A practical bathroom refresh that improves daily comfort with cleaner lines and a more considered material mix.",
    outcomes: [
      "Large-format tile and sanitaryware direction",
      "Mirror and vanity choices that improve perceived space",
      "Lighting upgrade to make the room feel more deliberate",
    ],
    timeline: "2 to 3 weeks",
  },
  {
    room: "bathroom",
    budget: "mid",
    style: "modern-luxury",
    title: "Modern Luxury Bathroom Upgrade",
    summary:
      "Built for tighter layouts where a stronger boutique-hotel feel matters more than raw square footage.",
    outcomes: [
      "Wall-hung vanity and brass-led fixture planning",
      "More premium shower and basin arrangement",
      "Stone and lighting selections with stronger visual impact",
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
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [leadFormErrors, setLeadFormErrors] = useState<LeadFormErrors>({});
  const [leadForm, setLeadForm] = useState<LeadFormState>({
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
  const answeredQuizCount = quizQuestions.filter(
    (question) => quizAnswers[question.id],
  ).length;
  const moodboardGroups = roomOptions
    .map((room) => ({
      roomId: room.id,
      roomLabel: room.label,
      boards: presetMoodboards.filter((moodboard) => moodboard.room === room.id),
    }))
    .filter((group) => group.boards.length > 0);
  const carouselBoards = useMemo(() => {
    const roomBoards = presetMoodboards.filter(
      (moodboard) => moodboard.room === selectedRoom,
    );

    const matchingStyleBoards = roomBoards.filter(
      (moodboard) => moodboard.style === selectedStyle,
    );
    const otherBoards = roomBoards.filter(
      (moodboard) => moodboard.style !== selectedStyle,
    );

    return [...matchingStyleBoards, ...otherBoards];
  }, [selectedRoom, selectedStyle]);
  const currentCarouselBoard = carouselBoards[carouselIndex] ?? presetMoodboards[0];
  const quizResult = useMemo(() => {
    const scoreMap = Object.fromEntries(
      styleOptions.map((option) => [option.id, 0]),
    ) as Record<StyleId, number>;

    let recommendedRoom: RoomId = selectedRoom as RoomId;
    let suggestedBudget: BudgetId | null = null;

    quizQuestions.forEach((question) => {
      const answerId = quizAnswers[question.id];
      const answer = question.options.find((option) => option.id === answerId);

      if (!answer) {
        return;
      }

      if (answer.room) {
        recommendedRoom = answer.room;
      }

      if (answer.budget) {
        suggestedBudget = answer.budget;
      }

      Object.entries(answer.styleScores ?? {}).forEach(([styleId, value]) => {
        scoreMap[styleId as StyleId] += value ?? 0;
      });
    });

    const recommendedStyle = styleOptions.reduce<StyleId>((best, option) => {
      if (scoreMap[option.id] > scoreMap[best]) {
        return option.id;
      }
      return best;
    }, selectedStyle as StyleId);

    const recommendedBoard =
      presetMoodboards.find(
        (board) =>
          board.room === recommendedRoom && board.style === recommendedStyle,
      ) ??
      presetMoodboards.find((board) => board.room === recommendedRoom) ??
      presetMoodboards[0];

    return {
      room: recommendedRoom,
      style: recommendedStyle,
      budget: suggestedBudget,
      board: recommendedBoard,
      reasons: quizQuestions
        .map((question) =>
          question.options.find((option) => option.id === quizAnswers[question.id]),
        )
        .filter((value): value is QuizOption => Boolean(value)),
    };
  }, [quizAnswers, selectedRoom, selectedStyle]);
  const isQuizReady = answeredQuizCount === quizQuestions.length;

  useEffect(() => {
    setCarouselIndex(0);
  }, [selectedRoom, selectedStyle]);

  useEffect(() => {
    if (carouselBoards.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCarouselIndex((current) => (current + 1) % carouselBoards.length);
    }, 5200);

    return () => window.clearInterval(intervalId);
  }, [carouselBoards.length, selectedRoom, selectedStyle]);

  const openLeadCapture = () => {
    document.getElementById("lead-capture")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const getLeadFieldClassName = (hasError: boolean) =>
    `w-full rounded-xl px-4 py-3 outline-none transition-all ${
      hasError
        ? "border border-red-400 bg-red-50 focus:border-red-500"
        : "border border-gray-300 bg-white focus:border-blue-600"
    }`;

  const updateLeadFormField = <K extends keyof LeadFormState>(
    key: K,
    value: LeadFormState[K],
  ) => {
    setLeadForm((current) => ({ ...current, [key]: value }));
    setLeadFormErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const validateLeadForm = (form: LeadFormState) => {
    const errors: LeadFormErrors = {};

    if (!form.name.trim()) {
      errors.name = "Name is required.";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (!form.contact.trim()) {
      errors.contact = "WhatsApp / phone is required.";
    }

    return errors;
  };

  const handleLeadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateLeadForm(leadForm);

    if (Object.keys(errors).length > 0) {
      setLeadFormErrors(errors);
      toast.error("Please fill in the required fields.");
      return;
    }

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
    setLeadFormErrors({});
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

  const handleApplyQuizResult = () => {
    setSelectedRoom(quizResult.room);
    setSelectedStyle(quizResult.style);

    if (quizResult.budget) {
      setSelectedBudget(quizResult.budget);
    }

    setLeadForm((current) => ({
      ...current,
      requestType: current.requestType === "consultation" ? "both" : "moodboard",
      notes: current.notes
        ? `${current.notes}\nQuiz result: ${quizResult.board.title} · ${quizResult.board.fit}`
        : `Quiz result: ${quizResult.board.title} · ${quizResult.board.fit}`,
    }));

    document.getElementById("featured-moodboards")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    toast.success("Style quiz applied to your moodboard direction.");
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
  };

  const handleCarouselMove = (direction: "prev" | "next") => {
    if (carouselBoards.length === 0) {
      return;
    }

    setCarouselIndex((current) =>
      direction === "next"
        ? (current + 1) % carouselBoards.length
        : (current - 1 + carouselBoards.length) % carouselBoards.length,
    );
  };

  return (
    <div className="bg-gray-50">
      <section className="bg-gradient-to-br from-[#F9F8F6] via-[#EFE9E3] to-[#D9CFC7] text-[#4F4338] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-[#D9CFC7] text-sm text-[#7A6751] mb-6">
                <Lightbulb className="w-4 h-4" />
                Hong Kong Idea Starter
              </div>
              <h1 className="text-4xl md:text-6xl leading-tight mb-6">
                Not sure how to renovate your Hong Kong flat yet? Start with a direction, not a blind quotation.
              </h1>
              <p className="text-lg md:text-xl text-[#6E6258] max-w-2xl">
                This page is built for Hong Kong owners comparing ideas for
                private flats, HOS units, resale apartments, and compact family
                homes before they are ready to commit.
              </p>
            </div>

            <div className="bg-white/75 backdrop-blur-sm border border-[#D9CFC7] rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl mb-2">What you get</h2>
              <p className="text-[#6E6258] mb-6">
                A practical starting point you can turn into a quotation or consultation.
              </p>
              <div className="space-y-4">
                {[
                  "Suggested room priorities for compact Hong Kong layouts",
                  "A realistic Hong Kong renovation budget band",
                  "A concept direction that shortens your briefing process",
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
          <div className="mb-10 grid grid-cols-1 xl:grid-cols-[1fr_0.9fr] gap-8">
            <div className="rounded-[2rem] border border-[#D9CFC7] bg-white p-8 shadow-sm">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E6DDD5] bg-[#F9F8F6] px-4 py-2 text-sm text-[#7A6751] mb-6">
                <Sparkles className="h-4 w-4" />
                Guided Style Quiz
              </div>
              <h2 className="text-3xl text-gray-900 mb-3">
                Not sure what you want yet? Answer a few simple questions.
              </h2>
              <p className="text-gray-600 mb-8 max-w-3xl">
                This works better for visitors who do not know style names yet.
                Pick what feels right, and we will turn it into a room direction,
                likely design style, and colour palette suggestion.
              </p>

              <div className="space-y-8">
                {quizQuestions.map((question, index) => (
                  <div key={question.id}>
                    <div className="mb-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-[#8F775C] mb-2">
                        Question {index + 1}
                      </div>
                      <h3 className="text-xl text-gray-900 mb-1">{question.prompt}</h3>
                      <p className="text-sm text-gray-500">{question.helper}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {question.options.map((option) => {
                        const isSelected = quizAnswers[question.id] === option.id;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              setQuizAnswers((current) => ({
                                ...current,
                                [question.id]: option.id,
                              }))
                            }
                            className={`rounded-[1.6rem] border p-5 text-left transition-all ${
                              isSelected
                                ? "border-[#C9B59C] bg-[#F9F4EF] shadow-sm"
                                : "border-[#E6DDD5] bg-white hover:border-[#D9CFC7] hover:-translate-y-0.5"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="font-medium text-gray-900">{option.label}</div>
                              {isSelected && (
                                <span className="rounded-full bg-[#8F775C] px-2 py-1 text-xs text-white">
                                  Picked
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">{option.description}</div>
                            {option.palettePreview && (
                              <div className="mt-4 flex gap-2">
                                {option.palettePreview.map((color) => (
                                  <div
                                    key={`${question.id}-${option.id}-${color}`}
                                    className="h-9 flex-1 rounded-2xl border border-black/5"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#D9CFC7] bg-[#F9F8F6] p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-[#7A6751] border border-[#E6DDD5] mb-4">
                    <Palette className="h-4 w-4" />
                    Quiz Recommendation
                  </div>
                  <h2 className="text-3xl text-gray-900 mb-2">Your likely direction</h2>
                  <p className="text-gray-600">
                    We use your answers to suggest a board before you even know the style name.
                  </p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 text-center border border-[#E6DDD5] min-w-[110px]">
                  <div className="text-2xl text-[#8F775C]">{answeredQuizCount}/{quizQuestions.length}</div>
                  <div className="text-xs uppercase tracking-[0.16em] text-gray-500">
                    Answered
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.8rem] border border-[#E6DDD5] bg-white">
                <img
                  src={quizResult.board.image}
                  alt={quizResult.board.title}
                  className="h-64 w-full object-cover"
                />
                <div className="p-6">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#7A6751] mb-2">
                    Suggested room · {
                      roomOptions.find((option) => option.id === quizResult.room)?.label
                    }
                  </div>
                  <h3 className="text-3xl text-gray-900 mb-2">{quizResult.board.title}</h3>
                  <p className="text-gray-600 mb-5">{quizResult.board.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="rounded-2xl bg-[#F9F8F6] border border-[#E6DDD5] p-4">
                      <div className="text-sm text-gray-500 mb-1">Likely style</div>
                      <div className="text-lg text-gray-900">
                        {styleOptions.find((option) => option.id === quizResult.style)?.label}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[#F9F8F6] border border-[#E6DDD5] p-4">
                      <div className="text-sm text-gray-500 mb-1">Suggested budget band</div>
                      <div className="text-lg text-gray-900">
                        {budgetOptions.find((option) => option.id === quizResult.budget)?.label ?? "Flexible"}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm uppercase tracking-[0.18em] text-[#7A6751] mb-3">
                      Recommended colour direction
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {quizResult.board.swatches.map((swatch) => (
                        <div
                          key={`quiz-result-${swatch.label}`}
                          className="flex items-center gap-4 rounded-2xl border border-[#E6DDD5] bg-[#F9F8F6] p-3"
                        >
                          <div
                            className="h-12 w-12 rounded-2xl border border-black/5"
                            style={{ backgroundColor: swatch.color }}
                          />
                          <div>
                            <div className="text-sm text-gray-500">{swatch.label}</div>
                            <div className="text-base text-gray-900">{swatch.color}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm uppercase tracking-[0.18em] text-[#7A6751] mb-3">
                      Why this fits
                    </div>
                    <div className="space-y-3">
                      {quizResult.reasons.map((reason) => (
                        <div key={reason.id} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-[#8F775C] mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-gray-900">{reason.label}</div>
                            <div className="text-sm text-gray-500">{reason.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleApplyQuizResult}
                      disabled={!isQuizReady}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#8F775C] px-5 py-3 text-white transition-colors hover:bg-[#7A6751] disabled:cursor-not-allowed disabled:bg-[#C9B59C]"
                    >
                      Apply This Direction
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={openLeadCapture}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#D9CFC7] bg-white px-5 py-3 text-[#6E6258] hover:bg-[#F3EEE8] transition-colors"
                    >
                      Request This Style
                    </button>
                    <button
                      type="button"
                      onClick={handleResetQuiz}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#E6DDD5] bg-transparent px-5 py-3 text-gray-600 hover:bg-white transition-colors"
                    >
                      Reset Answers
                    </button>
                  </div>

                  {!isQuizReady && (
                    <p className="mt-4 text-sm text-gray-500">
                      Finish all {quizQuestions.length} questions to lock this recommendation into the moodboard flow.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-8">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-3xl text-gray-900 mb-2">Build Your Idea Direction</h2>
              <p className="text-gray-600 mb-8">
                Choose a room, budget, and style. We will suggest a practical direction suited to Hong Kong homes where layout efficiency, storage, and material durability matter.
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
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {styleOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedStyle(option.id)}
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          selectedStyle === option.id
                            ? "border-[#8F775C] bg-[#F7F1EB] shadow-sm"
                            : "border-gray-200 bg-white text-gray-700 hover:border-[#D9CFC7]"
                        }`}
                      >
                        <div className="font-medium text-gray-900 mb-3">{option.label}</div>
                        <div className="flex gap-2">
                          {option.palette.map((color) => (
                            <div
                              key={`${option.id}-${color}`}
                              className="h-7 flex-1 rounded-xl border border-black/5"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
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

      <section id="featured-moodboards" className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-4xl text-gray-900 mb-4">Ready-Made Moodboards</h2>
            <p className="text-lg text-gray-600">
              These moodboards are tuned for Hong Kong interior projects, where built-in storage, clean zoning, wet-area durability, and visual openness usually matter more than pure floor area.
            </p>
          </div>

          <div className="mb-10 rounded-[2rem] border border-[#D9CFC7] bg-white/80 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full bg-[#EFE9E3] text-[#7A6751] text-sm">
                    Featured carousel
                  </span>
                  <span className="text-sm text-gray-500">
                    {selectedRoomLabel} · {selectedStyleLabel}
                  </span>
                </div>
                <h3 className="text-2xl text-gray-900">
                  Browse room-specific boards before you request a quotation
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCarouselMove("prev")}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D9CFC7] bg-white text-[#6E6258] hover:border-[#C9B59C]"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCarouselMove("next")}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D9CFC7] bg-white text-[#6E6258] hover:border-[#C9B59C]"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
              <div
                key={currentCarouselBoard.id}
                className="overflow-hidden rounded-[2rem] border border-[#E6DDD5] bg-[#F9F8F6] shadow-[0_24px_70px_rgba(76,61,46,0.08)] animate-reveal-up"
              >
                <img
                  src={currentCarouselBoard.image}
                  alt={currentCarouselBoard.title}
                  className="h-[360px] w-full object-cover animate-slow-zoom"
                />
                <div className="p-6">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#7A6751] mb-2">
                    {currentCarouselBoard.fit}
                  </div>
                  <h4 className="text-3xl text-gray-900 mb-3">
                    {currentCarouselBoard.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {currentCarouselBoard.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentCarouselBoard.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-2 rounded-full bg-[#EFE9E3] text-[#6E6258] text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUseMoodboard(currentCarouselBoard)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#8F775C] px-5 py-3 text-white hover:bg-[#7A6751] transition-colors"
                  >
                    Use This Board
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="mt-6 h-1.5 rounded-full bg-[#EFE9E3] overflow-hidden">
                    <div
                      key={currentCarouselBoard.id}
                      className="h-full rounded-full bg-[#8F775C] animate-carousel-progress"
                    />
                  </div>
                </div>
              </div>

              <div
                key={`${currentCarouselBoard.id}-swatches`}
                className="rounded-[2rem] border border-[#E6DDD5] bg-white p-6 animate-reveal-up"
              >
                <div className="text-sm uppercase tracking-[0.18em] text-[#7A6751] mb-4">
                  Colour codes inside this board
                </div>
                <div className="space-y-3 mb-8">
                  {currentCarouselBoard.swatches.map((swatch) => (
                    <div
                      key={`${currentCarouselBoard.id}-${swatch.label}`}
                      className="flex items-center gap-4 rounded-2xl border border-[#E6DDD5] bg-[#F9F8F6] p-3 hover:-translate-y-0.5 transition-transform"
                    >
                      <div
                        className="h-12 w-12 rounded-2xl border border-black/5"
                        style={{ backgroundColor: swatch.color }}
                      />
                      <div>
                        <div className="text-sm text-gray-500">{swatch.label}</div>
                        <div className="text-lg text-gray-900">{swatch.color}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-sm uppercase tracking-[0.18em] text-[#7A6751] mb-3">
                  More boards in this room
                </div>
                <div className="space-y-3">
                  {carouselBoards.map((board, index) => (
                    <button
                      key={board.id}
                      type="button"
                      onClick={() => setCarouselIndex(index)}
                      className={`w-full text-left rounded-2xl border p-4 transition-all ${
                        index === carouselIndex
                          ? "border-[#C9B59C] bg-[#EFE9E3]"
                          : "border-[#E6DDD5] bg-white hover:border-[#D9CFC7]"
                      }`}
                    >
                      <div className="text-sm text-[#7A6751] mb-1">{board.fit}</div>
                      <div className="text-lg text-gray-900">{board.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
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
                          {moodboard.swatches.map((swatch) => (
                            <div
                              key={`${moodboard.id}-${swatch.label}`}
                              className="h-12 flex-1 rounded-2xl border border-black/5"
                              style={{ backgroundColor: swatch.color }}
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
                <div className="text-sm text-gray-500">
                  Required fields are marked with <span className="text-red-500">*</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="lead-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      value={leadForm.name}
                      onChange={(event) => updateLeadFormField("name", event.target.value)}
                      className={getLeadFieldClassName(Boolean(leadFormErrors.name))}
                      placeholder="Client name"
                    />
                    {leadFormErrors.name && (
                      <p className="mt-2 text-sm text-red-600">{leadFormErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lead-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      value={leadForm.email}
                      onChange={(event) => updateLeadFormField("email", event.target.value)}
                      className={getLeadFieldClassName(Boolean(leadFormErrors.email))}
                      placeholder="name@example.com"
                    />
                    {leadFormErrors.email && (
                      <p className="mt-2 text-sm text-red-600">{leadFormErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="lead-contact" className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp / Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="lead-contact"
                      type="text"
                      value={leadForm.contact}
                      onChange={(event) => updateLeadFormField("contact", event.target.value)}
                      className={getLeadFieldClassName(Boolean(leadFormErrors.contact))}
                      placeholder="+852 ..."
                    />
                    {leadFormErrors.contact && (
                      <p className="mt-2 text-sm text-red-600">{leadFormErrors.contact}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lead-request-type" className="block text-sm font-medium text-gray-700 mb-2">
                      Request Type
                    </label>
                    <select
                      id="lead-request-type"
                      value={leadForm.requestType}
                      onChange={(event) =>
                        updateLeadFormField("requestType", event.target.value)
                      }
                      className={getLeadFieldClassName(false)}
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
                    onChange={(event) => updateLeadFormField("notes", event.target.value)}
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

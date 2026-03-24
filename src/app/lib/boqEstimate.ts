export type PricingTier = "basic" | "standard" | "premium";
export type RenovationScope = "full" | "partial" | "kitchen" | "bathroom";
export type PropertyType =
  | "private-flat"
  | "hos"
  | "resale-flat"
  | "village-house";
export type StyleDirection =
  | "modern-minimal"
  | "japandi"
  | "modern-luxury"
  | "scandinavian"
  | "industrial"
  | "korean-soft";

export interface BoqInput {
  propertyType: PropertyType;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  livingRooms: number;
  scope: RenovationScope;
  style: StyleDirection;
  pricingTier: PricingTier;
  addOns: string[];
}

export interface BoqItem {
  item_name: string;
  description: string;
  quantity: number;
  unit: string;
  unit_rate: number;
  total_cost: number;
}

export interface BoqCategory {
  category_name: string;
  items: BoqItem[];
}

export interface BoqEstimate {
  summary: {
    total_estimated_cost: number;
    pricing_tier: PricingTier;
  };
  categories: BoqCategory[];
  notes: string[];
}

const CATEGORY_NAMES = [
  "Preliminary / General Works",
  "Demolition Works",
  "Partition & Wall Works",
  "Flooring Works",
  "Ceiling Works",
  "Electrical Works",
  "Plumbing & Sanitary Works",
  "Painting & Finishes",
  "Carpentry / Built-in Furniture",
  "Doors & Windows",
  "Air Conditioning & Ventilation",
  "Smart / Security Systems",
] as const;

const tierFactor: Record<PricingTier, number> = {
  basic: 0.82,
  standard: 1,
  premium: 1.42,
};

const propertyTypeFactor: Record<PropertyType, number> = {
  "private-flat": 1,
  hos: 0.97,
  "resale-flat": 1.08,
  "village-house": 1.12,
};

const styleFactor: Record<StyleDirection, number> = {
  "modern-minimal": 1.01,
  japandi: 1.08,
  "modern-luxury": 1.18,
  scandinavian: 1.03,
  industrial: 1.09,
  "korean-soft": 1.05,
};

const scopeAreaFactor: Record<RenovationScope, number> = {
  full: 1,
  partial: 0.58,
  kitchen: 0.18,
  bathroom: 0.1,
};

function roundMoney(value: number) {
  return Math.round(value);
}

function qty(value: number) {
  return Number(value.toFixed(2));
}

function pickRate(
  standardRate: number,
  input: BoqInput,
  options?: { includePropertyFactor?: boolean; includeStyleFactor?: boolean },
) {
  const includePropertyFactor = options?.includePropertyFactor ?? true;
  const includeStyleFactor = options?.includeStyleFactor ?? true;

  const multiplier =
    tierFactor[input.pricingTier] *
    (includePropertyFactor ? propertyTypeFactor[input.propertyType] : 1) *
    (includeStyleFactor ? styleFactor[input.style] : 1);

  return roundMoney(standardRate * multiplier);
}

function buildItem(
  input: BoqInput,
  itemName: string,
  description: string,
  quantity: number,
  unit: string,
  standardRate: number,
  options?: { includePropertyFactor?: boolean; includeStyleFactor?: boolean },
): BoqItem {
  const normalizedQuantity = qty(quantity);
  const unitRate = pickRate(standardRate, input, options);

  return {
    item_name: itemName,
    description,
    quantity: normalizedQuantity,
    unit,
    unit_rate: unitRate,
    total_cost: roundMoney(normalizedQuantity * unitRate),
  };
}

function createCategoryMap() {
  return Object.fromEntries(
    CATEGORY_NAMES.map((name) => [name, [] as BoqItem[]]),
  ) as Record<(typeof CATEGORY_NAMES)[number], BoqItem[]>;
}

export function generateBoqEstimate(input: BoqInput): BoqEstimate {
  const categories = createCategoryMap();

  const area = Math.max(input.areaSqFt, 250);
  const activeArea = area * scopeAreaFactor[input.scope];
  const paintArea = activeArea * 2.8;
  const flooringArea =
    input.scope === "bathroom" ? Math.max(35 * input.bathrooms, activeArea * 0.7) : activeArea * 0.88;
  const ceilingArea = activeArea * 0.72;
  const partitionArea =
    input.scope === "full" || input.scope === "partial"
      ? input.bedrooms * 55 + input.bathrooms * 12
      : 0;
  const roomDoorQty =
    input.scope === "kitchen"
      ? 1
      : Math.max(input.bedrooms + input.bathrooms, 1);
  const lightingPoints =
    input.livingRooms * 6 +
    input.bedrooms * 3 +
    input.kitchens * 4 +
    input.bathrooms * 2;
  const socketPoints =
    input.livingRooms * 7 +
    input.bedrooms * 5 +
    input.kitchens * 6 +
    input.bathrooms * 2;
  const acQty = Math.max(input.bedrooms + input.livingRooms, 1);
  const wardrobeQty =
    input.scope === "kitchen" || input.scope === "bathroom" ? 0 : input.bedrooms;
  const kitchenCabinetRun =
    input.scope === "bathroom"
      ? 0
      : Math.max(input.kitchens * 16, activeArea > 650 ? 18 : 14);

  categories["Preliminary / General Works"].push(
    buildItem(
      input,
      "Site protection and temporary works",
      "Floor, lift lobby, common area, and finished surface protection according to typical Hong Kong residential renovation practice.",
      activeArea,
      "ft²",
      28,
      { includeStyleFactor: false },
    ),
    buildItem(
      input,
      "Daily debris handling and final cleaning",
      "Daily packing, debris transfer, and end-of-project cleaning for a residential flat.",
      activeArea,
      "ft²",
      12,
      { includeStyleFactor: false },
    ),
    buildItem(
      input,
      "Project supervision and handover coordination",
      "Site coordination, programme follow-up, and snagging / handover arrangement.",
      input.scope === "full" ? 1 : 0.75,
      "item",
      input.scope === "full" ? 9000 : 6500,
      { includeStyleFactor: false },
    ),
  );

  categories["Demolition Works"].push(
    buildItem(
      input,
      "Existing finish hacking",
      "Hacking of existing floor and wall finishes within renovation area, excluding structural members.",
      input.scope === "bathroom" ? Math.max(65 * input.bathrooms, 70) : activeArea,
      "ft²",
      input.scope === "bathroom" ? 52 : 45,
      { includeStyleFactor: false },
    ),
    buildItem(
      input,
      "Removal of existing sanitary / kitchen fixtures",
      "Removal of existing cabinets, sanitary fittings, countertop, and minor accessories within affected zones.",
      input.scope === "bathroom"
        ? input.bathrooms
        : input.scope === "kitchen"
          ? input.kitchens
          : input.kitchens + input.bathrooms,
      "item",
      4800,
      { includeStyleFactor: false },
    ),
  );

  if (partitionArea > 0) {
    categories["Partition & Wall Works"].push(
      buildItem(
        input,
        "Lightweight partition wall",
        "New metal stud and gypsum board partition wall with insulation infill where required for room re-planning.",
        partitionArea,
        "ft²",
        128,
      ),
      buildItem(
        input,
        "Door frame / wall opening modification",
        "Minor adjustment to door openings and wall edge build-up to suit revised layout.",
        Math.max(input.bedrooms + input.bathrooms - 1, 1),
        "item",
        3200,
      ),
    );
  }

  categories["Flooring Works"].push(
    buildItem(
      input,
      "New floor finish",
      input.scope === "bathroom"
        ? "Supply and installation of non-slip floor tiles to bathroom."
        : "Supply and installation of floor finish to living, bedroom, and circulation zones.",
      flooringArea,
      "ft²",
      input.scope === "bathroom" ? 118 : 92,
    ),
    buildItem(
      input,
      "Screed levelling and skirting",
      "Subfloor levelling, local repair, and matching skirting / edge finishing.",
      flooringArea,
      "ft²",
      32,
      { includeStyleFactor: false },
    ),
  );

  categories["Ceiling Works"].push(
    buildItem(
      input,
      "Gypsum board ceiling",
      "Flat gypsum board ceiling or localized bulkhead / cove treatment to suit MEP coordination.",
      ceilingArea,
      "ft²",
      96,
    ),
  );

  categories["Electrical Works"].push(
    buildItem(
      input,
      "Lighting points",
      "Concealed wiring and point installation for general lighting points.",
      lightingPoints,
      "point",
      920,
    ),
    buildItem(
      input,
      "Power socket points",
      "General power points for bedrooms, living room, kitchen, and bathrooms.",
      socketPoints,
      "point",
      680,
      { includeStyleFactor: false },
    ),
    buildItem(
      input,
      "Distribution board and circuit improvement",
      "Upgrade / rationalization of DB layout, breakers, and dedicated circuits where required.",
      1,
      "item",
      7800,
      { includeStyleFactor: false },
    ),
  );

  categories["Plumbing & Sanitary Works"].push(
    buildItem(
      input,
      "Bathroom plumbing and sanitary set",
      "Water supply / drainage adaptation with standard sanitaryware set, including WC, basin, shower mixer, and floor drain allowance.",
      Math.max(input.bathrooms, 1),
      "item",
      18500,
    ),
    buildItem(
      input,
      "Kitchen plumbing points",
      "Cold / hot water and waste pipe points for sink, washing machine, and water heater / kitchen appliances where applicable.",
      Math.max(input.kitchens, 1),
      "item",
      11800,
    ),
  );

  categories["Painting & Finishes"].push(
    buildItem(
      input,
      "Wall and ceiling painting",
      "Surface preparation, putty, primer, and emulsion paint to internal walls and ceilings.",
      paintArea,
      "ft²",
      18,
    ),
  );

  categories["Carpentry / Built-in Furniture"].push(
    buildItem(
      input,
      "Bedroom wardrobe",
      "Built-in laminate wardrobe with standard internal fittings sized for Hong Kong apartment storage needs.",
      Math.max(wardrobeQty, 0),
      "item",
      14800,
    ),
    buildItem(
      input,
      "Kitchen base and wall cabinets",
      "Custom kitchen cabinets with soft-close hardware and countertop allowance.",
      kitchenCabinetRun,
      "ft run",
      1950,
    ),
    buildItem(
      input,
      "Living room feature storage",
      "TV wall / feature storage cabinet with display and concealed storage zones.",
      input.scope === "kitchen" || input.scope === "bathroom" ? 0 : input.livingRooms,
      "item",
      15800,
    ),
  );

  categories["Doors & Windows"].push(
    buildItem(
      input,
      "Internal door replacement",
      "Supply and installation of flush timber door leaf with basic ironmongery.",
      roomDoorQty,
      "item",
      4200,
    ),
    buildItem(
      input,
      "Silicone, trims, and localized window repair",
      "Allowance for minor trim works and resealing to internal window perimeter / interfaces.",
      Math.max(input.bedrooms + input.livingRooms, 1),
      "item",
      1600,
      { includeStyleFactor: false },
    ),
  );

  categories["Air Conditioning & Ventilation"].push(
    buildItem(
      input,
      "Split-type air-conditioning allowance",
      "Allowance for supply and installation of wall-mounted split AC units with basic piping run.",
      acQty,
      "item",
      7200,
      { includePropertyFactor: false },
    ),
    buildItem(
      input,
      "Toilet exhaust fan and ventilation",
      "Bathroom exhaust fan / ducting improvement allowance.",
      Math.max(input.bathrooms, 1),
      "item",
      2200,
      { includeStyleFactor: false },
    ),
  );

  categories["Smart / Security Systems"].push(
    buildItem(
      input,
      "Digital door lock",
      "Residential digital lock allowance for main entrance door.",
      1,
      "item",
      4200,
      { includePropertyFactor: false },
    ),
  );

  if (input.addOns.includes("Custom Carpentry")) {
    categories["Carpentry / Built-in Furniture"].push(
      buildItem(
        input,
        "Additional storage carpentry",
        "Extra built-in storage for bay window, shoe cabinet, or utility niches.",
        1,
        "item",
        16800,
      ),
    );
  }

  if (input.addOns.includes("Smart Home Integration")) {
    categories["Smart / Security Systems"].push(
      buildItem(
        input,
        "Smart home starter package",
        "Smart switches, gateway, and app-linked lighting / AC control starter package.",
        1,
        "item",
        9800,
      ),
    );
  }

  if (input.addOns.includes("Premium Lighting")) {
    categories["Electrical Works"].push(
      buildItem(
        input,
        "Decorative lighting package",
        "Additional feature lighting, strip lighting, and premium fitting allowance.",
        1,
        "item",
        8800,
      ),
    );
  }

  if (input.addOns.includes("Flooring Upgrade")) {
    categories["Flooring Works"].push(
      buildItem(
        input,
        "Premium flooring upgrade allowance",
        "Upgrade from standard finish to engineered wood / large-format tile / higher-grade finish.",
        flooringArea,
        "ft²",
        28,
      ),
    );
  }

  if (input.addOns.includes("Appliance Package")) {
    categories["Carpentry / Built-in Furniture"].push(
      buildItem(
        input,
        "Kitchen appliance package allowance",
        "Allowance for hob, hood, sink accessories, and compact kitchen appliance coordination.",
        Math.max(input.kitchens, 1),
        "item",
        14500,
        { includePropertyFactor: false },
      ),
    );
  }

  const normalizedCategories: BoqCategory[] = CATEGORY_NAMES.map((name) => ({
    category_name: name,
    items: categories[name].filter((item) => item.quantity > 0),
  }));

  const total = normalizedCategories.reduce(
    (sum, category) =>
      sum +
      category.items.reduce((categorySum, item) => categorySum + item.total_cost, 0),
    0,
  );

  const notes = [
    `Assumption: residential Hong Kong project for a ${
      input.propertyType === "private-flat"
        ? "private apartment"
        : input.propertyType === "hos"
          ? "HOS / subsidized flat"
          : input.propertyType === "resale-flat"
            ? "resale apartment"
            : "village house / low-rise home"
    } with approximate saleable area of ${roundMoney(area)} sq ft.`,
    `Assumption: scope is ${
      input.scope
    } renovation with style direction set to ${input.style}, priced at ${input.pricingTier} tier using current Hong Kong residential market logic.`,
    "Excluded: statutory submissions, AP / structural engineer services, government fees, major structural alteration, custom glazing, loose furniture, curtain package, and building management deposits unless separately stated.",
    "Variation risk: hidden MEP diversion, wet-area waterproofing failure, uneven screed, window leakage, unauthorized works, and older resale-flat conditions can materially change final cost.",
    "Variation risk: management office restrictions, restricted loading / debris hours, difficult lift access, and night-noise constraints in dense Hong Kong buildings may add time and preliminaries.",
  ];

  return {
    summary: {
      total_estimated_cost: roundMoney(total),
      pricing_tier: input.pricingTier,
    },
    categories: normalizedCategories,
    notes,
  };
}

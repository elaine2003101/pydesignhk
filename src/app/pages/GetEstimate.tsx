import { useEffect, useState } from "react";
import {
  Calculator,
  Save,
  Send,
  DollarSign,
  CheckCircle,
  ClipboardList,
  FileJson,
} from "lucide-react";
import { toast } from "sonner";
import {
  BoqEstimate,
  generateBoqEstimate,
  PricingTier,
  PropertyType,
  RenovationScope,
  StyleDirection,
} from "../lib/boqEstimate";
import {
  consumeQueuedLeadForEstimate,
  IdeaStarterLead,
  mapLeadToEstimateDraft,
  updateIdeaStarterLead,
} from "../lib/leadPipeline";

type EstimateFormData = {
  clientName: string;
  clientEmail: string;
  propertyType: PropertyType;
  propertySize: string;
  bedrooms: string;
  bathrooms: string;
  kitchens: string;
  livingRooms: string;
  scope: RenovationScope;
  pricingTier: PricingTier;
  style: StyleDirection;
  addOns: string[];
  projectBrief: string;
};

type EstimateFormErrors = Partial<
  Record<
    | keyof EstimateFormData
    | "roomCount"
    | "projectConfiguration",
    string
  >
>;

const addOnOptions = [
  { label: "Custom Carpentry", description: "Extra built-in storage or bespoke feature joinery" },
  { label: "Smart Home Integration", description: "Digital lock, smart switches, and app-linked controls" },
  { label: "Premium Lighting", description: "Feature lights, strip lighting, and upgraded fittings" },
  { label: "Flooring Upgrade", description: "Upgrade to higher-grade tile or engineered wood finish" },
  { label: "Appliance Package", description: "Kitchen appliance and fitting allowance" },
];

const roomFields = [
  { key: "bedrooms", label: "Bedrooms" },
  { key: "bathrooms", label: "Bathrooms" },
  { key: "kitchens", label: "Kitchens" },
  { key: "livingRooms", label: "Living Rooms" },
] as const;

function mapLeadStyleToDirection(style: string): StyleDirection {
  const normalized = style.toLowerCase();

  if (normalized.includes("modern luxury") || normalized.includes("luxury")) {
    return "modern-luxury";
  }
  if (normalized.includes("japandi")) {
    return "japandi";
  }
  if (normalized.includes("industrial")) {
    return "industrial";
  }
  if (normalized.includes("scandinavian") || normalized.includes("nordic")) {
    return "scandinavian";
  }
  if (
    normalized.includes("korean") ||
    normalized.includes("feminine") ||
    normalized.includes("soft")
  ) {
    return "korean-soft";
  }
  if (
    normalized.includes("minimal") ||
    normalized.includes("calm") ||
    normalized.includes("storage") ||
    normalized.includes("smart")
  ) {
    return "modern-minimal";
  }
  if (normalized.includes("dark") || normalized.includes("contrast")) {
    return "industrial";
  }

  return "modern-minimal";
}

function formatCurrency(amount: number) {
  return `HKD $${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function getCategoryTotal(category: BoqEstimate["categories"][number]) {
  return category.items.reduce((sum, item) => sum + item.total_cost, 0);
}

function getInputClassName(hasError: boolean) {
  return `w-full px-4 py-3 border rounded-lg outline-none transition-all ${
    hasError
      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300 focus:border-red-400"
      : "border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
  }`;
}

function validateEstimateForm(formData: EstimateFormData): EstimateFormErrors {
  const errors: EstimateFormErrors = {};

  if (!formData.clientName.trim()) {
    errors.clientName = "Client name is required.";
  }

  if (!formData.clientEmail.trim()) {
    errors.clientEmail = "Client email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail.trim())) {
    errors.clientEmail = "Enter a valid email address.";
  }

  if (!formData.projectBrief.trim()) {
    errors.projectBrief = "Project brief is required.";
  }

  const areaSqFt = Number(formData.propertySize);
  if (!formData.propertySize.trim()) {
    errors.propertySize = "Saleable area is required.";
  } else if (!Number.isFinite(areaSqFt) || areaSqFt <= 0) {
    errors.propertySize = "Enter a valid saleable area.";
  }

  const roomCounts = roomFields.map(({ key }) => Number(formData[key]));
  const invalidRoomCount = roomCounts.some(
    (value) => !Number.isFinite(value) || value < 0 || !Number.isInteger(value),
  );

  if (invalidRoomCount) {
    errors.roomCount = "Room counts must be whole numbers of 0 or above.";
  } else if (roomCounts.reduce((sum, value) => sum + value, 0) === 0) {
    errors.roomCount = "At least one room / area must be included.";
  }

  if (Number(formData.kitchens) === 0 && formData.scope === "kitchen") {
    errors.projectConfiguration = "Kitchen count must be at least 1 for kitchen-only works.";
  }

  if (Number(formData.bathrooms) === 0 && formData.scope === "bathroom") {
    errors.projectConfiguration = "Bathroom count must be at least 1 for bathroom-only works.";
  }

  return errors;
}

export function GetEstimate() {
  const [selectedLead, setSelectedLead] = useState<IdeaStarterLead | null>(null);
  const [estimate, setEstimate] = useState<BoqEstimate | null>(null);
  const [formErrors, setFormErrors] = useState<EstimateFormErrors>({});
  const [formData, setFormData] = useState<EstimateFormData>({
    clientName: "",
    clientEmail: "",
    propertyType: "private-flat" as PropertyType,
    propertySize: "",
    bedrooms: "2",
    bathrooms: "1",
    kitchens: "1",
    livingRooms: "1",
    scope: "full" as RenovationScope,
    pricingTier: "standard" as PricingTier,
    style: "modern-minimal" as StyleDirection,
    addOns: [] as string[],
    projectBrief: "",
  });

  const updateField = <K extends keyof EstimateFormData>(
    key: K,
    value: EstimateFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      if (key === "bedrooms" || key === "bathrooms" || key === "kitchens" || key === "livingRooms") {
        delete next.roomCount;
        delete next.projectConfiguration;
      }
      if (key === "scope") {
        delete next.projectConfiguration;
      }
      return next;
    });
  };

  useEffect(() => {
    const queuedLead = consumeQueuedLeadForEstimate();
    if (!queuedLead) {
      return;
    }

    const draft = mapLeadToEstimateDraft(queuedLead);
    setSelectedLead(queuedLead);
    setFormData((prev) => ({
      ...prev,
      clientName: draft.clientName,
      clientEmail: draft.clientEmail,
      scope: draft.renovationType as RenovationScope,
      pricingTier: draft.materialTier as PricingTier,
      style: mapLeadStyleToDirection(queuedLead.style),
      addOns: draft.addOns,
      projectBrief: draft.projectBrief,
    }));
    toast.success("Lead details loaded into the BOQ form.");
  }, []);

  const handleAddOnToggle = (addOn: string) => {
    setFormData((prev) => ({
      ...prev,
      addOns: prev.addOns.includes(addOn)
        ? prev.addOns.filter((item) => item !== addOn)
        : [...prev.addOns, addOn],
    }));
  };

  const calculateEstimate = () => {
    const errors = validateEstimateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please complete the compulsory fields first.");
      return;
    }

    const areaSqFt = Number(formData.propertySize);
    const boq = generateBoqEstimate({
      propertyType: formData.propertyType,
      areaSqFt,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      kitchens: Number(formData.kitchens) || 0,
      livingRooms: Number(formData.livingRooms) || 0,
      scope: formData.scope,
      style: formData.style,
      pricingTier: formData.pricingTier,
      addOns: formData.addOns,
    });

    setEstimate(boq);
    toast.success("BOQ estimate ready.");
  };

  const handleSave = () => {
    if (!estimate) {
      toast.error("Please generate the BOQ estimate first");
      return;
    }

    if (selectedLead) {
      updateIdeaStarterLead(selectedLead.id, { stage: "quoted" });
    }

    localStorage.setItem(
      "savedEstimate",
      JSON.stringify({
        formData,
        estimate,
        leadId: selectedLead?.id ?? null,
        date: new Date().toISOString(),
      }),
    );
    toast.success("Estimate saved.");
  };

  const handleRequestConsultation = () => {
    if (!estimate) {
      toast.error("Please generate the BOQ estimate first");
      return;
    }

    if (selectedLead) {
      updateIdeaStarterLead(selectedLead.id, { stage: "qualified" });
    }

    toast.success("Consultation requested.");
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl text-gray-900">HK Residential BOQ Estimate</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build a Hong Kong residential BOQ with room counts, scope, and finish tier.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Compulsory fields are marked with <span className="text-red-500">*</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl mb-6 text-gray-900">Project Inputs</h2>

            <div className="space-y-6">
              {selectedLead && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-emerald-900">
                        Lead loaded
                      </div>
                      <div className="text-sm text-emerald-800 mt-1">
                        {selectedLead.name} · {selectedLead.room} · {selectedLead.budget} · {selectedLead.style}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(event) => updateField("clientName", event.target.value)}
                    className={getInputClassName(Boolean(formErrors.clientName))}
                    placeholder="Client name"
                  />
                  {formErrors.clientName && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.clientName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(event) => updateField("clientEmail", event.target.value)}
                    className={getInputClassName(Boolean(formErrors.clientEmail))}
                    placeholder="name@example.com"
                  />
                  {formErrors.clientEmail && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.clientEmail}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Brief <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.projectBrief}
                  onChange={(event) => updateField("projectBrief", event.target.value)}
                  className={`${getInputClassName(Boolean(formErrors.projectBrief))} resize-none`}
                  placeholder="Property condition, goals, or timeline"
                />
                {formErrors.projectBrief && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.projectBrief}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(event) =>
                      updateField("propertyType", event.target.value as PropertyType)
                    }
                    className={getInputClassName(false)}
                  >
                    <option value="private-flat">Private Flat</option>
                    <option value="hos">HOS / Subsidized Flat</option>
                    <option value="resale-flat">Resale Flat</option>
                    <option value="village-house">Village House / Low-rise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saleable Area (sq ft) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.propertySize}
                    onChange={(event) => updateField("propertySize", event.target.value)}
                    className={getInputClassName(Boolean(formErrors.propertySize))}
                    placeholder="e.g. 560"
                  />
                  {formErrors.propertySize && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.propertySize}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Room Count <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {roomFields.map((room) => (
                    <div key={room.key}>
                      <div className="text-sm text-gray-600 mb-2">{room.label}</div>
                      <input
                        type="number"
                        min="0"
                        value={formData[room.key]}
                        onChange={(event) => updateField(room.key, event.target.value)}
                        className={getInputClassName(
                          Boolean(formErrors.roomCount || formErrors.projectConfiguration),
                        )}
                      />
                    </div>
                  ))}
                </div>
                {formErrors.roomCount && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.roomCount}</p>
                )}
                {formErrors.projectConfiguration && (
                  <p className="mt-2 text-sm text-red-600">
                    {formErrors.projectConfiguration}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renovation Scope
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      value: "full",
                      label: "Full Renovation",
                      desc: "Whole flat renovation with wider demolition, finishes, and MEP coordination",
                    },
                    {
                      value: "partial",
                      label: "Partial Renovation",
                      desc: "Selected zones only.",
                    },
                    {
                      value: "kitchen",
                      label: "Kitchen Only",
                      desc: "Kitchen works only.",
                    },
                    {
                      value: "bathroom",
                      label: "Bathroom Only",
                      desc: "Bathroom works only.",
                    },
                  ].map((scope) => (
                    <label
                      key={scope.value}
                      className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.scope === scope.value
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="scope"
                        value={scope.value}
                        checked={formData.scope === scope.value}
                        onChange={(event) =>
                          updateField("scope", event.target.value as RenovationScope)
                        }
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{scope.label}</div>
                        <div className="text-sm text-gray-600">{scope.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pricing Tier
                  </label>
                  <select
                    value={formData.pricingTier}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        pricingTier: event.target.value as PricingTier,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  >
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Style Direction
                  </label>
                  <select
                    value={formData.style}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        style: event.target.value as StyleDirection,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  >
                    <option value="modern-minimal">Modern Minimal</option>
                    <option value="japandi">Japandi</option>
                    <option value="modern-luxury">Modern Luxury</option>
                    <option value="scandinavian">Scandinavian</option>
                    <option value="industrial">Industrial</option>
                    <option value="korean-soft">Korean Soft / Feminine</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Optional Enhancements
                </label>
                <div className="space-y-2">
                  {addOnOptions.map((option) => (
                    <label
                      key={option.label}
                      className="flex items-start justify-between gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={formData.addOns.includes(option.label)}
                          onChange={() => handleAddOnToggle(option.label)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={calculateEstimate}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg font-medium shadow-lg"
              >
                <Calculator className="w-5 h-5" />
                Generate BOQ Estimate
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {estimate ? (
              <>
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-8 h-8" />
                    <h2 className="text-2xl">Estimated BOQ Summary</h2>
                  </div>
                  <div className="text-5xl font-bold mb-2">
                    {formatCurrency(estimate.summary.total_estimated_cost)}
                  </div>
                  <div className="text-blue-100 text-lg capitalize">
                    {estimate.summary.pricing_tier} tier
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="rounded-xl bg-white/10 p-4">
                      <div className="text-sm text-blue-100 mb-1">BOQ Categories</div>
                      <div className="text-2xl font-semibold">
                        {estimate.categories.filter((category) => category.items.length > 0).length}
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/10 p-4">
                      <div className="text-sm text-blue-100 mb-1">Scope</div>
                      <div className="text-2xl font-semibold capitalize">
                        {formData.scope.replace("-", " ")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <ClipboardList className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl text-gray-900">Structured BOQ</h2>
                  </div>

                  <div className="space-y-8">
                    {estimate.categories
                      .filter((category) => category.items.length > 0)
                      .map((category) => (
                        <div key={category.category_name} className="border border-gray-200 rounded-xl overflow-hidden">
                          <div className="flex items-center justify-between gap-4 px-5 py-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-lg text-gray-900">{category.category_name}</h3>
                            <div className="text-sm font-medium text-blue-600">
                              {formatCurrency(getCategoryTotal(category))}
                            </div>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                              <thead className="bg-white">
                                <tr className="text-left text-gray-500">
                                  <th className="px-4 py-3">Item</th>
                                  <th className="px-4 py-3">Description</th>
                                  <th className="px-4 py-3">Qty</th>
                                  <th className="px-4 py-3">Unit</th>
                                  <th className="px-4 py-3">Rate</th>
                                  <th className="px-4 py-3">Total</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {category.items.map((item) => (
                                  <tr key={`${category.category_name}-${item.item_name}`}>
                                    <td className="px-4 py-4 font-medium text-gray-900 align-top">
                                      {item.item_name}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600 min-w-[280px] align-top">
                                      {item.description}
                                    </td>
                                    <td className="px-4 py-4 text-gray-700 align-top">
                                      {item.quantity}
                                    </td>
                                    <td className="px-4 py-4 text-gray-700 align-top">
                                      {item.unit}
                                    </td>
                                    <td className="px-4 py-4 text-gray-700 align-top">
                                      {formatCurrency(item.unit_rate)}
                                    </td>
                                    <td className="px-4 py-4 font-semibold text-gray-900 align-top">
                                      {formatCurrency(item.total_cost)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-xl mb-4 text-gray-900">Assumptions and Risk Notes</h3>
                  <div className="space-y-3">
                    {estimate.notes.map((note) => (
                      <div key={note} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <FileJson className="w-5 h-5 text-blue-600" />
                    <h3 className="text-xl text-gray-900">JSON Preview</h3>
                  </div>
                  <div className="rounded-xl bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm">
                    <pre>{JSON.stringify(estimate, null, 2)}</pre>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-xl mb-4 text-gray-900">Next Steps</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleSave}
                      className="w-full px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Save BOQ Estimate
                    </button>
                    <button
                      onClick={handleRequestConsultation}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Request Consultation
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Final quotation still depends on site measure, hidden works, and selected materials.
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl text-gray-600 mb-2">No BOQ Yet</h3>
                <p className="text-gray-500">
                  Fill in the form to generate the BOQ.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

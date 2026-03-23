import { useState } from "react";
import { Calculator, Save, Send, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export function GetEstimate() {
  const [formData, setFormData] = useState({
    propertySize: "",
    renovationType: "",
    materialTier: "",
    addOns: [] as string[],
  });

  const [estimate, setEstimate] = useState<{
    total: number;
    materials: number;
    labor: number;
    designFee: number;
    range: { min: number; max: number };
  } | null>(null);

  // Pricing structure
  const basePrices = {
    full: { basic: 800, standard: 1200, premium: 1800 },
    kitchen: { basic: 1000, standard: 1500, premium: 2200 },
    bathroom: { basic: 900, standard: 1400, premium: 2000 },
  };

  const addOnPrices: { [key: string]: number } = {
    "Custom Carpentry": 5000,
    "Smart Home Integration": 8000,
    "Premium Lighting": 3000,
    "Flooring Upgrade": 4000,
    "Appliance Package": 10000,
  };

  const calculateEstimate = () => {
    if (!formData.propertySize || !formData.renovationType || !formData.materialTier) {
      toast.error("Please fill in all required fields");
      return;
    }

    const size = parseFloat(formData.propertySize);
    const type = formData.renovationType as keyof typeof basePrices;
    const tier = formData.materialTier as keyof (typeof basePrices)["full"];

    const basePrice = basePrices[type][tier];
    const baseTotal = size * basePrice;

    // Calculate breakdown (typical percentages)
    const materials = baseTotal * 0.45; // 45% materials
    const labor = baseTotal * 0.40; // 40% labor
    const designFee = baseTotal * 0.15; // 15% design fee

    // Add optional add-ons
    const addOnsTotal = formData.addOns.reduce(
      (sum, addOn) => sum + (addOnPrices[addOn] || 0),
      0
    );

    const total = baseTotal + addOnsTotal;

    setEstimate({
      total,
      materials: materials + addOnsTotal * 0.6,
      labor: labor + addOnsTotal * 0.3,
      designFee: designFee + addOnsTotal * 0.1,
      range: {
        min: total * 0.9, // -10%
        max: total * 1.1, // +10%
      },
    });

    toast.success("Estimate calculated successfully!");
  };

  const handleAddOnToggle = (addOn: string) => {
    setFormData((prev) => ({
      ...prev,
      addOns: prev.addOns.includes(addOn)
        ? prev.addOns.filter((a) => a !== addOn)
        : [...prev.addOns, addOn],
    }));
  };

  const handleSave = () => {
    if (!estimate) {
      toast.error("Please calculate estimate first");
      return;
    }
    localStorage.setItem(
      "savedEstimate",
      JSON.stringify({ formData, estimate, date: new Date().toISOString() })
    );
    toast.success("Estimate saved successfully!");
  };

  const handleRequestConsultation = () => {
    if (!estimate) {
      toast.error("Please calculate estimate first");
      return;
    }
    toast.success("Consultation request sent! We'll contact you within 24 hours.");
  };

  const formatCurrency = (amount: number) => {
    return `HKD $${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl text-gray-900">Cost Estimation</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get an instant, transparent cost estimate for your renovation project
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl mb-6 text-gray-900">Project Details</h2>

            <div className="space-y-6">
              {/* Property Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Size (sq ft) *
                </label>
                <input
                  type="number"
                  value={formData.propertySize}
                  onChange={(e) =>
                    setFormData({ ...formData, propertySize: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., 800"
                  min="0"
                />
              </div>

              {/* Renovation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renovation Type *
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { value: "full", label: "Full Renovation", desc: "Complete home renovation" },
                    { value: "kitchen", label: "Kitchen Only", desc: "Kitchen remodeling" },
                    { value: "bathroom", label: "Bathroom Only", desc: "Bathroom renovation" },
                  ].map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.renovationType === type.value
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="renovationType"
                        value={type.value}
                        checked={formData.renovationType === type.value}
                        onChange={(e) =>
                          setFormData({ ...formData, renovationType: e.target.value })
                        }
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{type.label}</div>
                        <div className="text-sm text-gray-600">{type.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Material Tier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Tier *
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { value: "basic", label: "Basic", desc: "Cost-effective options", price: "HKD 800-1,000/sq ft" },
                    { value: "standard", label: "Standard", desc: "Mid-range quality", price: "HKD 1,200-1,500/sq ft" },
                    { value: "premium", label: "Premium", desc: "High-end materials", price: "HKD 1,800-2,200/sq ft" },
                  ].map((tier) => (
                    <label
                      key={tier.value}
                      className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.materialTier === tier.value
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="materialTier"
                        value={tier.value}
                        checked={formData.materialTier === tier.value}
                        onChange={(e) =>
                          setFormData({ ...formData, materialTier: e.target.value })
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-900">{tier.label}</div>
                          <div className="text-sm text-blue-600 font-medium">{tier.price}</div>
                        </div>
                        <div className="text-sm text-gray-600">{tier.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Optional Add-ons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Optional Add-ons
                </label>
                <div className="space-y-2">
                  {Object.entries(addOnPrices).map(([addOn, price]) => (
                    <label
                      key={addOn}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.addOns.includes(addOn)}
                          onChange={() => handleAddOnToggle(addOn)}
                        />
                        <span className="text-gray-900">{addOn}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        +{formatCurrency(price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={calculateEstimate}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg font-medium shadow-lg"
              >
                <Calculator className="w-5 h-5" />
                Calculate Estimate
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {estimate ? (
              <>
                {/* Estimated Cost Range */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-8 h-8" />
                    <h2 className="text-2xl">Estimated Cost Range</h2>
                  </div>
                  <div className="mb-6">
                    <div className="text-5xl font-bold mb-2">
                      {formatCurrency(estimate.range.min)}
                    </div>
                    <div className="text-xl text-blue-100">
                      to {formatCurrency(estimate.range.max)}
                    </div>
                  </div>
                  <div className="text-blue-100">
                    <p className="text-sm">
                      This estimate may vary by ±10% depending on final specifications
                      and unforeseen circumstances.
                    </p>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl text-gray-900">Cost Breakdown</h2>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: "Materials", amount: estimate.materials, color: "bg-blue-600" },
                      { label: "Labor", amount: estimate.labor, color: "bg-green-600" },
                      { label: "Design Fee", amount: estimate.designFee, color: "bg-purple-600" },
                    ].map((item) => {
                      const percentage = (item.amount / estimate.total) * 100;
                      return (
                        <div key={item.label}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700 font-medium">{item.label}</span>
                            <span className="text-gray-900 font-semibold">
                              {formatCurrency(item.amount)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full ${item.color} rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {percentage.toFixed(1)}% of total
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total Estimate</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatCurrency(estimate.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Add-ons Summary */}
                {formData.addOns.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <h3 className="text-xl mb-4 text-gray-900">Selected Add-ons</h3>
                    <ul className="space-y-2">
                      {formData.addOns.map((addOn) => (
                        <li
                          key={addOn}
                          className="flex items-center justify-between py-2 border-b border-gray-100"
                        >
                          <span className="text-gray-700">{addOn}</span>
                          <span className="text-gray-900 font-medium">
                            {formatCurrency(addOnPrices[addOn])}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-xl mb-4 text-gray-900">Next Steps</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleSave}
                      className="w-full px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Save Estimate
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
                    Our team will review your requirements and contact you within 24
                    hours to discuss the project details.
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl text-gray-600 mb-2">No Estimate Yet</h3>
                <p className="text-gray-500">
                  Fill in the project details and click "Calculate Estimate" to see
                  your cost breakdown.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

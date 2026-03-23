import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Settings,
  Upload,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  Users,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { AppUser, getCurrentAppUser } from "../lib/auth";
import {
  getIdeaStarterLeads,
  getLeadDestinationSettings,
  IdeaStarterLead,
  LeadDestinationSettings,
  LeadStage,
  queueLeadForEstimate,
  saveLeadDestinationSettings,
  submitLeadToDestinations,
  updateIdeaStarterLead,
} from "../lib/leadPipeline";

interface Project {
  id: string;
  name: string;
  customerEmail: string;
  status: "Planning" | "In Progress" | "Completed";
  progress: number;
}

export function AdminPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AppUser | null>(null);
  const [activeTab, setActiveTab] = useState<
    "projects" | "pricing" | "updates" | "leads"
  >("projects");
  const [leads, setLeads] = useState<IdeaStarterLead[]>([]);
  const [leadSettings, setLeadSettings] = useState<LeadDestinationSettings>(
    getLeadDestinationSettings(),
  );

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "PRJ-001",
      name: "Living Room & Kitchen Renovation",
      customerEmail: "customer@demo.com",
      status: "In Progress",
      progress: 65,
    },
    {
      id: "PRJ-002",
      name: "Full Apartment Renovation",
      customerEmail: "john@example.com",
      status: "Planning",
      progress: 15,
    },
    {
      id: "PRJ-003",
      name: "Bathroom Remodel",
      customerEmail: "sarah@example.com",
      status: "Completed",
      progress: 100,
    },
  ]);

  const [selectedProject, setSelectedProject] = useState<string>(projects[0].id);
  const [updateForm, setUpdateForm] = useState({
    message: "",
    photos: [] as string[],
  });

  const [pricingForm, setPricingForm] = useState({
    renovationType: "full" as "full" | "kitchen" | "bathroom",
    materialTier: "basic" as "basic" | "standard" | "premium",
    pricePerSqFt: "800",
  });

  useEffect(() => {
    getCurrentAppUser().then((currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      if (currentUser.role !== "admin") {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
        return;
      }

      setUser(currentUser);
      setLeads(getIdeaStarterLeads());
      setLeadSettings(getLeadDestinationSettings());
    });
  }, [navigate]);

  const handleUpdateProject = (projectId: string, field: string, value: any) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId ? { ...p, [field]: value } : p
      )
    );
    toast.success("Project updated successfully");
  };

  const handleAddUpdate = () => {
    if (!updateForm.message) {
      toast.error("Please enter an update message");
      return;
    }

    // In a real app, this would save to database
    toast.success("Progress update added successfully!");
    setUpdateForm({ message: "", photos: [] });
  };

  const handleUploadPhoto = () => {
    // Mock photo upload
    toast.info("Photo upload feature - In production, this would upload files to server");
    setUpdateForm({
      ...updateForm,
      photos: [
        ...updateForm.photos,
        "https://images.unsplash.com/photo-1760331840595-72c9681e7e71?w=400",
      ],
    });
  };

  const handleUpdatePricing = () => {
    toast.success("Pricing parameters updated successfully!");
  };

  const handleLeadStageChange = (leadId: string, stage: LeadStage) => {
    const updatedLead = updateIdeaStarterLead(leadId, { stage });
    if (!updatedLead) {
      toast.error("Lead not found");
      return;
    }

    setLeads(getIdeaStarterLeads());
    toast.success("Lead stage updated");
  };

  const handleSaveLeadSettings = () => {
    saveLeadDestinationSettings(leadSettings);
    toast.success("Lead integration settings saved");
  };

  const handleOpenEstimateFromLead = (lead: IdeaStarterLead) => {
    queueLeadForEstimate(lead.id);
    navigate("/estimate");
    toast.success("Lead sent to estimate flow");
  };

  const handleResubmitLead = async (lead: IdeaStarterLead) => {
    const result = await submitLeadToDestinations(lead, leadSettings);

    if (result.errors.length > 0) {
      toast.error(result.errors[0]);
      return;
    }

    if (result.actions.length === 0) {
      toast.info("No external destination is configured yet");
      return;
    }

    toast.success(`Lead sent to ${result.actions.join(", ")}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Admin privileges required.</p>
        </div>
      </div>
    );
  }

  const currentProject = projects.find((p) => p.id === selectedProject);

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl text-gray-900">Admin Panel</h1>
          </div>
          <p className="text-gray-600">
            Manage projects, update progress, and adjust pricing
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: "projects", label: "Project Management", icon: FileText },
                { id: "pricing", label: "Cost Management", icon: DollarSign },
                { id: "updates", label: "Progress Updates", icon: Upload },
                { id: "leads", label: "Lead Pipeline", icon: Users },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            {/* Project Management Tab */}
            {activeTab === "projects" && (
              <div>
                <h2 className="text-2xl mb-6 text-gray-900">
                  Project Management
                </h2>

                <div className="space-y-6">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            Project ID
                          </div>
                          <div className="font-semibold text-gray-900">
                            {project.id}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            Project Name
                          </div>
                          <div className="font-semibold text-gray-900">
                            {project.name}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            Customer
                          </div>
                          <div className="text-gray-700">
                            {project.customerEmail}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-600 mb-2">Status</div>
                          <select
                            value={project.status}
                            onChange={(e) =>
                              handleUpdateProject(
                                project.id,
                                "status",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                          >
                            <option value="Planning">Planning</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>

                        <div>
                          <div className="text-sm text-gray-600 mb-2">
                            Progress
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={project.progress}
                              onChange={(e) =>
                                handleUpdateProject(
                                  project.id,
                                  "progress",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                            />
                            <span className="text-gray-600">%</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cost Management Tab */}
            {activeTab === "pricing" && (
              <div>
                <h2 className="text-2xl mb-6 text-gray-900">
                  Cost Management
                </h2>
                <p className="text-gray-600 mb-8">
                  Adjust estimation parameters and pricing ranges
                </p>

                <div className="max-w-2xl space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Renovation Type
                    </label>
                    <select
                      value={pricingForm.renovationType}
                      onChange={(e) =>
                        setPricingForm({
                          ...pricingForm,
                          renovationType: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    >
                      <option value="full">Full Renovation</option>
                      <option value="kitchen">Kitchen Only</option>
                      <option value="bathroom">Bathroom Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material Tier
                    </label>
                    <select
                      value={pricingForm.materialTier}
                      onChange={(e) =>
                        setPricingForm({
                          ...pricingForm,
                          materialTier: e.target.value as any,
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
                      Price per Square Foot (HKD)
                    </label>
                    <input
                      type="number"
                      value={pricingForm.pricePerSqFt}
                      onChange={(e) =>
                        setPricingForm({
                          ...pricingForm,
                          pricePerSqFt: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      placeholder="800"
                    />
                  </div>

                  <button
                    onClick={handleUpdatePricing}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Update Pricing Parameters
                  </button>
                </div>

                {/* Pricing Table */}
                <div className="mt-12">
                  <h3 className="text-xl mb-4 text-gray-900">
                    Current Pricing Structure
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                            Basic
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                            Standard
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                            Premium
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 text-gray-900">
                            Full Renovation
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            HKD 800/sq ft
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            HKD 1,200/sq ft
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            HKD 1,800/sq ft
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-gray-900">Kitchen</td>
                          <td className="px-6 py-4 text-gray-700">
                            HKD 1,000/sq ft
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            HKD 1,500/sq ft
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            HKD 2,200/sq ft
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-gray-900">Bathroom</td>
                          <td className="px-6 py-4 text-gray-700">
                            HKD 900/sq ft
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            HKD 1,400/sq ft
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            HKD 2,000/sq ft
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Updates Tab */}
            {activeTab === "updates" && (
              <div>
                <h2 className="text-2xl mb-6 text-gray-900">
                  Add Progress Updates
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Project
                    </label>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    >
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.id} - {project.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {currentProject && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-blue-900">
                            {currentProject.name}
                          </div>
                          <div className="text-sm text-blue-700">
                            Customer: {currentProject.customerEmail}
                          </div>
                          <div className="text-sm text-blue-700">
                            Status: {currentProject.status} ({currentProject.progress}%
                            complete)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Message
                    </label>
                    <textarea
                      value={updateForm.message}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, message: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                      placeholder="Enter progress update details..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Progress Photos
                    </label>
                    <button
                      onClick={handleUploadPhoto}
                      className="px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors w-full flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
                    >
                      <ImageIcon className="w-5 h-5" />
                      Upload Photos
                    </button>

                    {updateForm.photos.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {updateForm.photos.map((photo, index) => (
                          <div
                            key={index}
                            className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                          >
                            <img
                              src={photo}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleAddUpdate}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Add Update
                    </button>
                    <button
                      onClick={() =>
                        setUpdateForm({ message: "", photos: [] })
                      }
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "leads" && (
              <div className="space-y-10">
                <div>
                  <h2 className="text-2xl mb-2 text-gray-900">Lead Pipeline</h2>
                  <p className="text-gray-600">
                    Review cold-traffic leads, mirror them to external tools, and push them into quotation faster.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Leads", value: leads.length },
                    {
                      label: "New",
                      value: leads.filter((lead) => lead.stage === "new").length,
                    },
                    {
                      label: "Qualified",
                      value: leads.filter((lead) => lead.stage === "qualified").length,
                    },
                    {
                      label: "Quoted",
                      value: leads.filter((lead) => lead.stage === "quoted").length,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                    >
                      <div className="text-sm text-gray-600 mb-2">{item.label}</div>
                      <div className="text-3xl font-semibold text-gray-900">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[0.85fr_1.15fr] gap-8">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl text-gray-900 mb-2">Lead Integrations</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Local storage stays enabled for demo use. Add email or webhook endpoints if you want these leads to flow into operational tools.
                    </p>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Recipients
                        </label>
                        <input
                          type="text"
                          value={leadSettings.emailRecipients}
                          onChange={(e) =>
                            setLeadSettings({
                              ...leadSettings,
                              emailRecipients: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                          placeholder="sales@pydesignhk.com"
                        />
                      </div>

                      <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-white">
                        <input
                          type="checkbox"
                          checked={leadSettings.openMailClient}
                          onChange={(e) =>
                            setLeadSettings({
                              ...leadSettings,
                              openMailClient: e.target.checked,
                            })
                          }
                        />
                        <span className="text-sm text-gray-700">
                          Open the user lead in the mail client when email recipients are configured
                        </span>
                      </label>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Google Sheets Webhook URL
                        </label>
                        <input
                          type="url"
                          value={leadSettings.googleSheetsWebhookUrl}
                          onChange={(e) =>
                            setLeadSettings({
                              ...leadSettings,
                              googleSheetsWebhookUrl: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                          placeholder="https://script.google.com/macros/s/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Airtable Webhook URL
                        </label>
                        <input
                          type="url"
                          value={leadSettings.airtableWebhookUrl}
                          onChange={(e) =>
                            setLeadSettings({
                              ...leadSettings,
                              airtableWebhookUrl: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                          placeholder="https://hooks.airtable.com/..."
                        />
                      </div>

                      <button
                        onClick={handleSaveLeadSettings}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save Lead Integrations
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {leads.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl text-gray-900 mb-2">No Leads Yet</h3>
                        <p className="text-gray-600">
                          New Idea Starter submissions will appear here.
                        </p>
                      </div>
                    ) : (
                      leads.map((lead) => (
                        <div
                          key={lead.id}
                          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-xl text-gray-900">{lead.name}</h3>
                                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium capitalize">
                                  {lead.requestType}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm capitalize">
                                  {lead.stage}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div>{lead.email}</div>
                                <div>{lead.contact || "No phone provided"}</div>
                                <div>
                                  Captured {new Date(lead.createdAt).toLocaleString("en-US")}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                <div className="rounded-lg bg-gray-50 p-3">
                                  <div className="text-gray-500 mb-1">Room</div>
                                  <div className="font-medium text-gray-900">{lead.room}</div>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-3">
                                  <div className="text-gray-500 mb-1">Budget</div>
                                  <div className="font-medium text-gray-900">{lead.budget}</div>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-3">
                                  <div className="text-gray-500 mb-1">Style</div>
                                  <div className="font-medium text-gray-900">{lead.style}</div>
                                </div>
                              </div>
                              {lead.notes && (
                                <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
                                  {lead.notes}
                                </div>
                              )}
                            </div>

                            <div className="lg:w-64 space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Lead Stage
                                </label>
                                <select
                                  value={lead.stage}
                                  onChange={(e) =>
                                    handleLeadStageChange(
                                      lead.id,
                                      e.target.value as LeadStage,
                                    )
                                  }
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                                >
                                  <option value="new">New</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="qualified">Qualified</option>
                                  <option value="quoted">Quoted</option>
                                </select>
                              </div>

                              <button
                                onClick={() => handleOpenEstimateFromLead(lead)}
                                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Use In Estimate
                              </button>

                              <button
                                onClick={() => handleResubmitLead(lead)}
                                className="w-full px-4 py-3 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                              >
                                <Send className="w-4 h-4" />
                                Resubmit Lead
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Projects</div>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {projects.length}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">In Progress</div>
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {projects.filter((p) => p.status === "In Progress").length}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Completed</div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {projects.filter((p) => p.status === "Completed").length}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Planning</div>
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {projects.filter((p) => p.status === "Planning").length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

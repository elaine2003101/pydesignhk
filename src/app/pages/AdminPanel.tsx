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
  Calendar,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  customerEmail: string;
  status: "Planning" | "In Progress" | "Completed";
  progress: number;
}

export function AdminPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "projects" | "pricing" | "updates"
  >("projects");

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
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }
    setUser(parsedUser);
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

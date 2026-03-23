import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  BarChart3,
  Clock,
  DollarSign,
  ImageIcon,
  MessageSquare,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  estimatedCost: number;
  actualCost: number;
  startDate: string;
  endDate: string;
  milestones: Array<{
    name: string;
    status: "completed" | "in-progress" | "pending";
    date: string;
  }>;
  updates: Array<{
    date: string;
    message: string;
    photos?: string[];
  }>;
  upcomingTasks: string[];
}

export function TrackProject() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  
  // Mock project data
  const [project] = useState<Project>({
    id: "PRJ-001",
    name: "Living Room & Kitchen Renovation",
    status: "In Progress",
    progress: 65,
    estimatedCost: 850000,
    actualCost: 520000,
    startDate: "2026-02-01",
    endDate: "2026-04-15",
    milestones: [
      {
        name: "Planning & Design",
        status: "completed",
        date: "2026-02-01 - 2026-02-10",
      },
      {
        name: "Demolition",
        status: "completed",
        date: "2026-02-11 - 2026-02-18",
      },
      {
        name: "Installation",
        status: "in-progress",
        date: "2026-02-19 - 2026-03-25",
      },
      {
        name: "Completion & Handover",
        status: "pending",
        date: "2026-03-26 - 2026-04-15",
      },
    ],
    updates: [
      {
        date: "2026-03-20",
        message: "Kitchen cabinets installation completed. Proceeding with countertop installation.",
        photos: [
          "https://images.unsplash.com/photo-1772567732969-c1506edf80a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwcmVub3ZhdGlvbiUyMG1vZGVybnxlbnwxfHx8fDE3NzQwMTg0NzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        ],
      },
      {
        date: "2026-03-15",
        message: "Living room flooring installation in progress. Expected completion by March 18.",
        photos: [
          "https://images.unsplash.com/photo-1707299231603-6c0a93e0f7fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZpbmclMjByb29tJTIwaW50ZXJpb3IlMjBlbGVnYW50fGVufDF8fHx8MTc3NDEwNjAyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        ],
      },
      {
        date: "2026-03-10",
        message: "Electrical and plumbing rough-in completed. Inspection passed.",
      },
      {
        date: "2026-02-20",
        message: "Demolition phase completed successfully. Ready for installation phase.",
        photos: [
          "https://images.unsplash.com/photo-1760331840595-72c9681e7e71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZW5vdmF0aW9uJTIwY29uc3RydWN0aW9uJTIwcHJvZ3Jlc3N8ZW58MXx8fHwxNzc0MTA2NjQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        ],
      },
    ],
    upcomingTasks: [
      "Countertop installation (March 22-24)",
      "Backsplash tiling (March 25-27)",
      "Lighting fixture installation (March 28-30)",
      "Final painting touch-ups (April 1-5)",
    ],
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl text-gray-900 mb-2">Please Log In</h2>
          <p className="text-gray-600">You need to be logged in to track your project.</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return `HKD $${amount.toLocaleString("en-US")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "in-progress":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getMilestoneIcon = (status: string) => {
    if (status === "completed") {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    }
    if (status === "in-progress") {
      return <Clock className="w-6 h-6 text-blue-600" />;
    }
    return <div className="w-6 h-6 rounded-full border-2 border-gray-300" />;
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl text-gray-900">Project Dashboard</h1>
          </div>
          <p className="text-gray-600">Welcome back, {user.email}</p>
        </div>

        {/* Project Overview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-1">{project.name}</h2>
              <p className="text-gray-600">Project ID: {project.id}</p>
            </div>
            <div
              className={`px-4 py-2 rounded-full font-medium ${getStatusColor(
                "in-progress"
              )}`}
            >
              {project.status}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Overall Progress
              </span>
              <span className="text-sm font-bold text-blue-600">
                {project.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Timeline</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatDate(project.startDate)}
                </div>
                <div className="text-sm text-gray-600">
                  to {formatDate(project.endDate)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Estimated Cost</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(project.estimatedCost)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Actual Cost</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(project.actualCost)}
                </div>
                <div className="text-sm text-gray-600">
                  {((project.actualCost / project.estimatedCost) * 100).toFixed(1)}%
                  of budget
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Milestone Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl mb-6 text-gray-900">Milestone Timeline</h2>
            <div className="space-y-6">
              {project.milestones.map((milestone, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {getMilestoneIcon(milestone.status)}
                    {index < project.milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {milestone.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                          milestone.status
                        )}`}
                      >
                        {milestone.status.replace("-", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{milestone.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl mb-6 text-gray-900">Upcoming Tasks</h2>
            <ul className="space-y-3">
              {project.upcomingTasks.map((task, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100"
                >
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{task}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl mb-6 text-gray-900">Budget Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700">Estimated Cost</span>
                <span className="text-xl font-semibold text-gray-900">
                  {formatCurrency(project.estimatedCost)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700">Actual Cost (to date)</span>
                <span className="text-xl font-semibold text-blue-600">
                  {formatCurrency(project.actualCost)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-gray-700 font-medium">Remaining Budget</span>
                <span className="text-xl font-semibold text-green-600">
                  {formatCurrency(project.estimatedCost - project.actualCost)}
                </span>
              </div>
            </div>
            <div>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-48 h-48">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="#e5e7eb"
                        strokeWidth="16"
                        fill="none"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="#3b82f6"
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray={`${
                          2 * Math.PI * 88 * (project.actualCost / project.estimatedCost)
                        } ${2 * Math.PI * 88}`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">
                          {((project.actualCost / project.estimatedCost) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Used</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Updates Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl text-gray-900">Progress Updates</h2>
          </div>
          <div className="space-y-6">
            {project.updates.map((update, index) => (
              <div
                key={index}
                className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {formatDate(update.date)}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{update.message}</p>
                {update.photos && update.photos.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ImageIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Progress Photos
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {update.photos.map((photo, photoIndex) => (
                        <div
                          key={photoIndex}
                          className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                        >
                          <ImageWithFallback
                            src={photo}
                            alt={`Progress photo ${photoIndex + 1}`}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

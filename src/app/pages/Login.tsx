import { useState } from "react";
import { useNavigate } from "react-router";
import { LogIn, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Demo credentials
    const demoUsers = [
      { email: "customer@demo.com", password: "customer123", role: "customer" },
      { email: "admin@demo.com", password: "admin123", role: "admin" },
    ];

    const user = demoUsers.find(
      (u) =>
        u.email === formData.email && u.password === formData.password
    );

    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify({ email: user.email, role: user.role })
      );
      toast.success("Login successful!");
      
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/track");
      }
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">PY</span>
            </div>
            <span className="font-bold text-2xl text-gray-900">Pydesignhk</span>
          </div>
          <h2 className="text-3xl text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to track your renovation project</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Demo Credentials
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-sm font-medium text-blue-900 mb-1">
                  Customer Account
                </div>
                <div className="text-xs text-blue-700">
                  Email: customer@demo.com
                </div>
                <div className="text-xs text-blue-700">
                  Password: customer123
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="text-sm font-medium text-purple-900 mb-1">
                  Admin Account
                </div>
                <div className="text-xs text-purple-700">
                  Email: admin@demo.com
                </div>
                <div className="text-xs text-purple-700">Password: admin123</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => toast.info("Registration coming soon!")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact us
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

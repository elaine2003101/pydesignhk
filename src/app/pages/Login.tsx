import { useState } from "react";
import { useNavigate } from "react-router";
import { LogIn, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { getAppUserFromSupabaseUser } from "../lib/auth";
import {
  getHashRedirectUrl,
  isSupabaseConfigured,
  supabase,
} from "../lib/supabase";

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const getInputClassName = (hasError: boolean) =>
    `block w-full py-3 rounded-lg outline-none transition-all ${
      hasError
        ? "border border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300 focus:border-red-400"
        : "border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
    }`;

  const updateField = (key: "email" | "password", value: string) => {
    setFormData((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const validateForm = () => {
    const nextErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.password.trim()) {
      nextErrors.password = "Password is required.";
    }

    return nextErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please fill in the required fields.");
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      toast.error("Supabase is not configured yet. Add your env keys first.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Login successful!");

    const appUser = await getAppUserFromSupabaseUser(data.user);

    if (appUser?.role === "admin") {
      navigate("/admin");
      return;
    }

    navigate("/track");
  };

  const handleResendConfirmation = async () => {
    if (!isSupabaseConfigured || !supabase) {
      toast.error("Supabase is not configured yet.");
      return;
    }

    if (!formData.email) {
      toast.error("Enter your email first");
      return;
    }

    setResendLoading(true);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: formData.email,
      options: {
        emailRedirectTo: getHashRedirectUrl("/auth/callback?mode=signup"),
      },
    });

    setResendLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Confirmation email sent again.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9F8F6] to-[#EFE9E3] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#C9B59C] to-[#D9CFC7] rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-[#4F4338] font-bold text-2xl">PY</span>
            </div>
            <span className="font-bold text-2xl text-gray-900">Pydesignhk</span>
          </div>
          <h2 className="text-3xl text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to track your renovation project</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!isSupabaseConfigured && (
            <div className="mb-6 rounded-xl border border-[#D9CFC7] bg-[#F9F8F6] p-4 text-sm text-[#6E6258]">
              Supabase keys are not configured yet. Add `VITE_SUPABASE_URL` and
              `VITE_SUPABASE_ANON_KEY` to enable real signup and login.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-sm text-gray-500">
              Required fields are marked with <span className="text-red-500">*</span>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${errors.email ? "text-red-400" : "text-gray-400"}`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={`${getInputClassName(Boolean(errors.email))} pl-10 pr-3`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${errors.password ? "text-red-400" : "text-gray-400"}`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className={`${getInputClassName(Boolean(errors.password))} pl-10 pr-3`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600">
            Email/password login is now backed by Supabase Auth once your
            environment keys are configured.
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resendLoading}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {resendLoading ? "Sending..." : "Resend confirmation email"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </button>
            </div>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Lock, Mail, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  getHashRedirectUrl,
  isSupabaseConfigured,
  supabase,
} from "../lib/supabase";

export function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const getInputClassName = (hasError: boolean) =>
    `w-full py-3 rounded-lg outline-none transition-all ${
      hasError
        ? "border border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300 focus:border-red-400"
        : "border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
    }`;

  const updateField = (
    key: "fullName" | "email" | "password" | "confirmPassword",
    value: string,
  ) => {
    setFormData((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      if (key === "password" || key === "confirmPassword") {
        delete next.password;
        delete next.confirmPassword;
      }
      return next;
    });
  };

  const validateForm = () => {
    const nextErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          role: "customer",
        },
        emailRedirectTo: getHashRedirectUrl("/auth/callback?mode=signup"),
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      "Account created. Check your email if confirmation is enabled in Supabase.",
    );
    setPendingEmail(formData.email);
  };

  const handleResendConfirmation = async () => {
    if (!supabase || !pendingEmail) {
      return;
    }

    setResendLoading(true);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: pendingEmail,
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
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="inline-flex items-center gap-2 text-[#7A6751] hover:text-[#4F4338] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C9B59C] to-[#D9CFC7] mb-4 shadow-lg">
              <UserPlus className="w-7 h-7 text-[#4F4338]" />
            </div>
            <h1 className="text-3xl text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">
              Set up a real customer account backed by Supabase Auth.
            </p>
          </div>

          {!isSupabaseConfigured && (
            <div className="mb-6 rounded-xl border border-[#D9CFC7] bg-[#F9F8F6] p-4 text-sm text-[#6E6258]">
              Supabase keys are not configured yet. Add `VITE_SUPABASE_URL` and
              `VITE_SUPABASE_ANON_KEY` before using account creation.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-sm text-gray-500">
              Required fields are marked with <span className="text-red-500">*</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                className={`${getInputClassName(Boolean(errors.fullName))} px-4`}
                placeholder="Your name"
              />
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${errors.email ? "text-red-400" : "text-gray-400"}`} />
                </div>
                <input
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className={`${getInputClassName(Boolean(errors.email))} pl-10 pr-3`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${errors.password ? "text-red-400" : "text-gray-400"}`} />
                </div>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  className={`${getInputClassName(Boolean(errors.password))} pl-10 pr-3`}
                  placeholder="Minimum 8 characters"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={(event) => updateField("confirmPassword", event.target.value)}
                className={`${getInputClassName(Boolean(errors.confirmPassword))} px-4`}
                placeholder="Repeat your password"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {pendingEmail && (
            <div className="mt-8 rounded-xl border border-[#D9CFC7] bg-[#F9F8F6] p-4 text-sm text-[#6E6258]">
              <div className="font-medium text-[#4F4338] mb-2">
                Check your inbox
              </div>
              <div className="mb-3">
                We sent a confirmation link to `{pendingEmail}`. Open it to
                activate the account.
              </div>
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resendLoading}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {resendLoading ? "Sending..." : "Resend confirmation email"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

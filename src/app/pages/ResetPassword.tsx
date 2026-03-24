import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, KeyRound, Lock } from "lucide-react";
import { toast } from "sonner";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const getInputClassName = (hasError: boolean) =>
    `w-full py-3 rounded-lg outline-none transition-all ${
      hasError
        ? "border border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300 focus:border-red-400"
        : "border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
    }`;

  const updateField = (key: "password" | "confirmPassword", value: string) => {
    setFormData((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next.password;
      delete next.confirmPassword;
      return next;
    });
  };

  const validateForm = () => {
    const nextErrors: { password?: string; confirmPassword?: string } = {};

    if (!formData.password.trim()) {
      nextErrors.password = "New password is required.";
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

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted && data.session) {
        setHasRecoverySession(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) {
        return;
      }

      if (event === "PASSWORD_RECOVERY" || session) {
        setHasRecoverySession(true);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please fill in the required fields.");
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      toast.error("Supabase is not configured yet.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: formData.password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password updated. Please sign in with your new password.");
    navigate("/login");
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
              <KeyRound className="w-7 h-7 text-[#4F4338]" />
            </div>
            <h1 className="text-3xl text-gray-900 mb-2">Choose New Password</h1>
            <p className="text-gray-600">
              Open the email link, then set a new password here.
            </p>
          </div>

          {!hasRecoverySession && (
            <div className="mb-6 rounded-xl border border-[#D9CFC7] bg-[#F9F8F6] p-4 text-sm text-[#6E6258]">
              Open the reset email link first.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-sm text-gray-500">
              Required fields are marked with <span className="text-red-500">*</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${errors.password ? "text-red-400" : "text-gray-400"}`} />
                </div>
                <input
                  type="password"
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
              disabled={loading || !hasRecoverySession}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              <KeyRound className="w-5 h-5" />
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

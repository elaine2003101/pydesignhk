import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import { toast } from "sonner";
import {
  getHashRedirectUrl,
  isSupabaseConfigured,
  supabase,
} from "../lib/supabase";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClassName = `w-full pl-10 pr-3 py-3 rounded-lg outline-none transition-all ${
    error
      ? "border border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300 focus:border-red-400"
      : "border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
  }`;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Email address is required.");
      toast.error("Please fill in the required field.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      toast.error("Please enter a valid email.");
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      toast.error("Supabase is not configured yet.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getHashRedirectUrl("/reset-password"),
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password reset email sent. Check your inbox.");
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
            <h1 className="text-3xl text-gray-900 mb-2">Reset Your Password</h1>
            <p className="text-gray-600">
              Enter your email and we will send a secure reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-sm text-gray-500">
              Required fields are marked with <span className="text-red-500">*</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${error ? "text-red-400" : "text-gray-400"}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  className={inputClassName}
                  placeholder="you@example.com"
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <KeyRound className="w-5 h-5" />
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

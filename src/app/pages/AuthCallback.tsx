import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { CheckCircle, LoaderCircle } from "lucide-react";
import { getAppUserFromSupabaseUser } from "../lib/auth";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Confirming your account...");

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setStatus("error");
      setMessage("Supabase is not configured yet.");
      return;
    }

    let isMounted = true;
    const mode =
      new URLSearchParams(location.search).get("mode") ?? "signup";

    const resolveSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const appUser = await getAppUserFromSupabaseUser(session?.user ?? null);

      if (!isMounted) {
        return;
      }

      if (!appUser) {
        setStatus("error");
        setMessage("The email link could not be completed. Try opening it again.");
        return;
      }

      setStatus("success");
      setMessage(
        mode === "signup"
          ? "Email confirmed. Your account is ready."
          : "Authentication completed successfully.",
      );

      window.setTimeout(() => {
        navigate(appUser.role === "admin" ? "/admin" : "/track");
      }, 1800);
    };

    resolveSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      getAppUserFromSupabaseUser(session?.user ?? null).then((appUser) => {
        if (!isMounted || !appUser) {
          return;
        }

        setStatus("success");
        setMessage(
          mode === "signup"
            ? "Email confirmed. Redirecting you now."
            : "Authentication completed. Redirecting you now.",
        );

        window.setTimeout(() => {
          navigate(appUser.role === "admin" ? "/admin" : "/track");
        }, 1200);
      });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9F8F6] to-[#EFE9E3] px-4">
      <div className="max-w-lg w-full rounded-3xl bg-white shadow-xl p-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#EFE9E3] mb-6">
          {status === "loading" ? (
            <LoaderCircle className="w-8 h-8 text-[#8F775C] animate-spin" />
          ) : (
            <CheckCircle className="w-8 h-8 text-[#8F775C]" />
          )}
        </div>

        <h1 className="text-3xl text-gray-900 mb-3">Auth Callback</h1>
        <p className="text-gray-600 mb-8">{message}</p>

        {status === "error" && (
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#8F775C] text-white hover:bg-[#7A6751] transition-colors"
          >
            Back to login
          </Link>
        )}
      </div>
    </div>
  );
}

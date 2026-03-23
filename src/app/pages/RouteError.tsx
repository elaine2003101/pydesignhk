import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

export function RouteError() {
  const error = useRouteError();

  let title = "Something went wrong";
  let description =
    "The page hit an unexpected problem. You can go back home or try refreshing the app.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    description =
      typeof error.data === "string"
        ? error.data
        : "The requested page could not be loaded.";
  } else if (error instanceof Error) {
    description = error.message;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F8F6] to-[#EFE9E3] flex items-center justify-center px-4">
      <div className="max-w-xl w-full rounded-[2rem] border border-[#D9CFC7] bg-white shadow-xl p-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#EFE9E3] text-[#8F775C] mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="text-sm uppercase tracking-[0.22em] text-[#7A6751] mb-3">
          Page Error
        </div>
        <h1 className="text-4xl text-[#3F352D] mb-4">{title}</h1>
        <p className="text-[#6E6258] leading-relaxed mb-8">{description}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8F775C] px-6 py-3 text-white hover:bg-[#7A6751] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back Home
          </Link>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D9CFC7] bg-white px-6 py-3 text-[#5F544B] hover:border-[#C9B59C] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}

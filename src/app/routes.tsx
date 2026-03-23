import { createHashRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Inspiration } from "./pages/Inspiration";
import { GetEstimate } from "./pages/GetEstimate";
import { TrackProject } from "./pages/TrackProject";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { AuthCallback } from "./pages/AuthCallback";
import { AdminPanel } from "./pages/AdminPanel";
import { RouteError } from "./pages/RouteError";

export const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    errorElement: <RouteError />,
    children: [
      { index: true, Component: Home },
      { path: "ideas", Component: Inspiration },
      { path: "estimate", Component: GetEstimate },
      { path: "track", Component: TrackProject },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "reset-password", Component: ResetPassword },
      { path: "auth/callback", Component: AuthCallback },
      { path: "admin", Component: AdminPanel },
    ],
  },
]);

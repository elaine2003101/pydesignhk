import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { GetEstimate } from "./pages/GetEstimate";
import { TrackProject } from "./pages/TrackProject";
import { Login } from "./pages/Login";
import { AdminPanel } from "./pages/AdminPanel";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "estimate", Component: GetEstimate },
      { path: "track", Component: TrackProject },
      { path: "login", Component: Login },
      { path: "admin", Component: AdminPanel },
    ],
  },
]);

import { createHashRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Inspiration } from "./pages/Inspiration";
import { GetEstimate } from "./pages/GetEstimate";
import { TrackProject } from "./pages/TrackProject";
import { Login } from "./pages/Login";
import { AdminPanel } from "./pages/AdminPanel";

export const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "ideas", Component: Inspiration },
      { path: "estimate", Component: GetEstimate },
      { path: "track", Component: TrackProject },
      { path: "login", Component: Login },
      { path: "admin", Component: AdminPanel },
    ],
  },
]);

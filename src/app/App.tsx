import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { CharacterListPage } from "./pages/CharacterListPage";
import { CharacterSheetPage } from "./pages/CharacterSheetPage";
import { CombatPage } from "./pages/CombatPage";
import { RewardsPage } from "./pages/RewardsPage";
import { ConfigPage } from "./pages/ConfigPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "character", element: <CharacterListPage /> },
      { path: "character/:id", element: <CharacterSheetPage /> },
      { path: "combat", element: <CombatPage /> },
      { path: "rewards", element: <RewardsPage /> },
      { path: "config", element: <ConfigPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

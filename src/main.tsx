import { RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { VintedShopProvider } from "@/contexts/VintedShopContext";
import { getRouter } from "./router";
import "./styles.css";

const router = getRouter();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <VintedShopProvider>
      <RouterProvider router={router} />
    </VintedShopProvider>
  </React.StrictMode>,
);

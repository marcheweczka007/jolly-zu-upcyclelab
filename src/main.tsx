import { RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { BasketProvider } from "@/contexts/BasketContext";
import { VintedShopProvider } from "@/contexts/VintedShopContext";
import { Toaster } from "@/components/ui/sonner";
import { getRouter } from "./router";
import "./styles.css";

const router = getRouter();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BasketProvider>
      <VintedShopProvider>
        <RouterProvider router={router} />
        <Toaster position="bottom-center" richColors />
      </VintedShopProvider>
    </BasketProvider>
  </React.StrictMode>,
);

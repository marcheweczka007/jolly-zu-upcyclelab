import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { BasketProvider } from "@/contexts/BasketContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { VintedShopProvider } from "@/contexts/VintedShopContext";
import { Toaster } from "@/components/ui/sonner";
import { getRouter } from "./router";
import "./styles.css";

const router = getRouter();
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ProductsProvider>
        <BasketProvider>
          <VintedShopProvider>
            <RouterProvider router={router} />
            <Toaster position="bottom-center" richColors />
          </VintedShopProvider>
        </BasketProvider>
      </ProductsProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

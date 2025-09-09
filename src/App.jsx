import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import AppRoutes from "@/routes/routes";
import store from "@/store/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import queryClient from "./react-query/lib/queryClient";
import { PageErrorBoundary } from "@/components/common/ErrorBoundary";
import { setupGlobalErrorHandling } from "@/utils/monitoring";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Initialize global error handling
    setupGlobalErrorHandling();
  }, []);

  return (
    <PageErrorBoundary pageName="Application">
      <ThemeProvider defaultTheme="light" storageKey="compliance-ui-theme">
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter
              future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            >
              <AppRoutes />
            </BrowserRouter>
            <Toaster richColors />
          </QueryClientProvider>
        </Provider>
      </ThemeProvider>
    </PageErrorBoundary>
  );
}

export default App;

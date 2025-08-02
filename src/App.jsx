import { Toaster } from "@/components/ui/sonner";
import AppRoutes from "@/routes/routes";
import store from "@/store/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import queryClient from "./react-query/lib/queryClient";

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <AppRoutes />
        </BrowserRouter>
        <Toaster richColors   />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;

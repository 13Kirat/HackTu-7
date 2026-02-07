import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import ProductTracking from "./pages/ProductTracking";
import StockInsights from "./pages/StockInsights";
import Forecasting from "./pages/Forecasting";
import Replenishment from "./pages/Replenishment";
import Analytics from "./pages/Analytics";
import UsersPage from "./pages/Users";
import RolesPage from "./pages/Roles";
import ProductsPage from "./pages/Products";
import CouponsPage from "./pages/Coupons";
import SettingsPage from "./pages/Settings";
import AuthPage from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/tracking" element={<ProductTracking />} />
                <Route path="/insights" element={<StockInsights />} />
                <Route path="/forecasting" element={<Forecasting />} />
                <Route path="/replenishment" element={<Replenishment />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/roles" element={<RolesPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/coupons" element={<CouponsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

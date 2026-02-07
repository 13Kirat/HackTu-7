import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NotificationProvider } from "@/components/NotificationProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import FulfillmentOrders from "./pages/FulfillmentOrders";
import DealerOrders from "./pages/DealerOrders";
import OrderTracking from "./pages/OrderTracking";
import SalesHistory from "./pages/SalesHistory";
import Coupons from "./pages/Coupons";
import AlertsPage from "./pages/AlertsPage";
import Profile from "./pages/Profile";
import NotificationsPage from "./pages/NotificationsPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <NotificationProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/fulfillment-orders" element={<FulfillmentOrders />} />
                  <Route path="/dealer-orders" element={<DealerOrders />} />
                  <Route path="/order-tracking" element={<OrderTracking />} />
                  <Route path="/sales-history" element={<SalesHistory />} />
                  <Route path="/coupons" element={<Coupons />} />
                  <Route path="/alerts" element={<AlertsPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </NotificationProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

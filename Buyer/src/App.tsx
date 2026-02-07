import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import TopNav from "@/components/TopNav";
import CatalogPage from "@/pages/CatalogPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrdersPage from "@/pages/OrdersPage";
import ProfilePage from "@/pages/ProfilePage";
import AvailabilityPage from "@/pages/AvailabilityPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      {children}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><AppLayout><CatalogPage /></AppLayout></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProtectedRoute><AppLayout><ProductDetailPage /></AppLayout></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><AppLayout><CartPage /></AppLayout></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><AppLayout><CheckoutPage /></AppLayout></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><AppLayout><OrdersPage /></AppLayout></ProtectedRoute>} />
            <Route path="/availability" element={<ProtectedRoute><AppLayout><AvailabilityPage /></AppLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

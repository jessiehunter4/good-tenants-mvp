
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { RoleBasedRoute } from "./components/access";
import LandingPage from "./pages/LandingPage";
import SummerLandingPage from "./pages/SummerLandingPage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Onboarding pages
import OnboardTenant from "./pages/onboarding/OnboardTenant";
import OnboardAgent from "./pages/onboarding/OnboardAgent";
import OnboardLandlord from "./pages/onboarding/OnboardLandlord";

// Role-specific dashboards
import TenantDashboard from "./pages/dashboards/TenantDashboard";
import AgentDashboard from "./pages/dashboards/AgentDashboard";
import LandlordDashboard from "./pages/dashboards/LandlordDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/summer" element={<SummerLandingPage />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Onboarding Routes */}
            <Route path="/onboard-tenant" element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["tenant"]}>
                  <OnboardTenant />
                </RoleBasedRoute>
              </ProtectedRoute>
            } />
            <Route path="/onboard-agent" element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["agent"]}>
                  <OnboardAgent />
                </RoleBasedRoute>
              </ProtectedRoute>
            } />
            <Route path="/onboard-landlord" element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["landlord"]}>
                  <OnboardLandlord />
                </RoleBasedRoute>
              </ProtectedRoute>
            } />
            
            {/* Role-specific Dashboard Routes */}
            <Route path="/dashboard-tenant" element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["tenant"]}>
                  <TenantDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            } />
            <Route path="/dashboard-agent" element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["agent"]}>
                  <AgentDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            } />
            <Route path="/dashboard-landlord" element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["landlord"]}>
                  <LandlordDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin-dashboard" element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            } />
            
            {/* Fallback Routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

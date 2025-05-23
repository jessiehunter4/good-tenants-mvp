
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";

import LandingPage from "./pages/LandingPage";
import SummerLandingPage from "./pages/SummerLandingPage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";
import { RoleBasedRoute } from "./components/access";

import OnboardTenant from "./pages/onboarding/OnboardTenant";
import OnboardAgent from "./pages/onboarding/OnboardAgent";
import OnboardLandlord from "./pages/onboarding/OnboardLandlord";
import CreateProperty from "./pages/CreateProperty";
import MessagingCenter from "./pages/messaging/MessagingCenter";
import Index from "./pages/Index";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/summer" element={<SummerLandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/index" element={<Index />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Role-Based Routes */}
          <Route
            path="/onboarding/tenant"
            element={
              <RoleBasedRoute allowedRoles={["tenant"]}>
                <OnboardTenant />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/onboarding/agent"
            element={
              <RoleBasedRoute allowedRoles={["agent"]}>
                <OnboardAgent />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/onboarding/landlord"
            element={
              <RoleBasedRoute allowedRoles={["landlord"]}>
                <OnboardLandlord />
              </RoleBasedRoute>
            }
          />

          {/* Property Routes */}
          <Route
            path="/properties/create"
            element={
              <RoleBasedRoute allowedRoles={["agent", "landlord", "admin"]}>
                <CreateProperty />
              </RoleBasedRoute>
            }
          />

          {/* Messaging Routes */}
          <Route
            path="/messages"
            element={
              <RoleBasedRoute allowedRoles={["tenant", "agent", "landlord", "admin"]}>
                <MessagingCenter />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/messages/:threadId"
            element={
              <RoleBasedRoute allowedRoles={["tenant", "agent", "landlord", "admin"]}>
                <MessagingCenter />
              </RoleBasedRoute>
            }
          />

          {/* 404 - Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;

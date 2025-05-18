import { Toaster } from "./components/ui/toaster.jsx";
import { Toaster as Sonner } from "./components/ui/sonner.jsx";
import { TooltipProvider } from "./components/ui/tooltip.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext.jsx";
import { VisitorProvider } from "./contexts/VisitorContext.jsx";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import { ActivityLogProvider } from "./contexts/ActivityLogContext.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ResidentDashboard from "./pages/ResidentDashboard.jsx";
import WatchmanDashboard from "./pages/WatchmanDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import NotFound from "./pages/NotFound.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <VisitorProvider>
        <NotificationProvider>
          <ActivityLogProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner richColors closeButton position="top-right" />
              <BrowserRouter>
                <div className="min-h-screen bg-slate-50">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route 
                      path="/resident" 
                      element={
                        <ProtectedRoute allowedRoles={["resident"]}>
                          <ResidentDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route 
                      path="/watchman" 
                      element={
                        <ProtectedRoute allowedRoles={["watchman"]}>
                          <WatchmanDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route 
                      path="/notifications" 
                      element={
                        <ProtectedRoute>
                          <NotificationsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </ActivityLogProvider>
        </NotificationProvider>
      </VisitorProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

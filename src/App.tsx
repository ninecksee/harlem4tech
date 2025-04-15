
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CreateListing from "./pages/CreateListing";
import ListingDetails from "./pages/ListingDetails";
import NotFound from "./pages/NotFound";
import Messages from "./pages/Messages";
import Categories from "./pages/Categories";
import HowItWorksPage from "./pages/HowItWorksPage";
import About from "./pages/About";
import { useAuth } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" replace />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/about" element={<About />} />
      <Route 
        path="/create-listing" 
        element={
          <ProtectedRoute>
            <CreateListing />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/messages" 
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } 
      />
      <Route path="/listing/:id" element={<ListingDetails />} />
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Create a wrapper component that provides the AuthContext
const AuthProviderWithRouter = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProviderWithRouter>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </AuthProviderWithRouter>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;


import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar/sidebar-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SidebarMenu from "@/components/SidebarMenu";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import Events from "@/pages/Events";
import PDFs from "@/pages/PDFs";
import Auth from "@/pages/Auth";
import MeetingBooking from "@/pages/MeetingBooking";
import CodePage from "@/pages/downloads/Code";
import ResourcesPage from "@/pages/downloads/Resources";

// New page imports
import NewspaperPage from "@/pages/publications/Newspaper";
import ResearchPage from "@/pages/publications/Research";
import IndustrialPage from "@/pages/projects/Industrial";
import AcademicPage from "@/pages/projects/Academic";
import ArticleDetail from "@/pages/ArticleDetail";

// Admin page imports
import AdminDashboard from "@/pages/admin/AdminDashboard";
import PageManager from "@/pages/admin/PageManager";
import UserApprovals from "@/pages/admin/UserApprovals";
import AdminSettings from "@/pages/admin/AdminSettings";

import { supabase } from "@/integrations/supabase/client";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Router>
          <div className="flex min-h-screen flex-col">
            <div className="flex-none">
              <Navbar session={session} />
            </div>
            <div className="flex-1 flex flex-row pt-16 md:pt-0">
              <SidebarMenu />
              <main className="flex-1 overflow-x-hidden">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/pdfs" element={<PDFs />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/meeting-booking" element={<MeetingBooking />} />
                  <Route path="/downloads/code" element={<CodePage />} />
                  <Route path="/downloads/resources" element={<ResourcesPage />} />
                  
                  {/* New routes for publications and projects */}
                  <Route path="/publications/newspaper" element={<NewspaperPage />} />
                  <Route path="/publications/research" element={<ResearchPage />} />
                  <Route path="/projects/industrial" element={<IndustrialPage />} />
                  <Route path="/projects/academic" element={<AcademicPage />} />
                  
                  {/* Article detail route */}
                  <Route path="/:category/:slug" element={<ArticleDetail />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/pages" element={<PageManager />} />
                  <Route path="/admin/users" element={<UserApprovals />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </Router>
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;

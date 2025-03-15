
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SidebarMenu from "./components/SidebarMenu";
import Index from "./pages/Index";
import About from "./pages/About";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import PDFs from "./pages/PDFs";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import MeetingBooking from "./pages/MeetingBooking";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <SidebarMenu />
            <SidebarInset>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/pdfs" element={<PDFs />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/book-meeting" element={<MeetingBooking />} />
                    {/* Add placeholder routes for new sidebar menu items */}
                    <Route path="/projects/industrial" element={<NotFound />} />
                    <Route path="/projects/academic" element={<NotFound />} />
                    <Route path="/downloads/code" element={<NotFound />} />
                    <Route path="/downloads/resources" element={<NotFound />} />
                    <Route path="/publications/newspaper" element={<NotFound />} />
                    <Route path="/publications/research" element={<NotFound />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

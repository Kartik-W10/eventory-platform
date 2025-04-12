
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Session } from "@supabase/supabase-js";
import { useSidebar } from "@/components/ui/sidebar/sidebar-context";

interface NavbarProps {
  session: Session | null;
}

const Navbar = ({ session }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();

  useEffect(() => {
    setUser(session?.user ?? null);
  }, [session]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Events", path: "/events" },
    { name: "PDFs", path: "/pdfs" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={`sticky top-0 z-40 bg-white transition-all duration-300 ${scrolled ? "shadow-md" : "shadow-sm"}`}
      style={{
        width: "100%",
        marginLeft: 0
      }}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-2 md:ml-0">
            <SidebarTrigger className="md:hidden" />
            <Link to="/" className="text-xl font-bold text-primary flex items-center">
              YourBrand
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`py-2 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-secondary border-b-2 border-secondary"
                    : "text-primary hover:text-secondary"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 ml-4"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="flex items-center gap-2 ml-4">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary hover:text-secondary p-1 rounded-md focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute left-0 right-0 bg-white border-b shadow-lg z-20">
            <div className="pt-2 pb-3 space-y-1 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block py-3 px-3 rounded-md text-base font-medium ${
                    isActive(item.path)
                      ? "bg-primary/5 text-secondary"
                      : "text-primary hover:bg-primary/5 hover:text-secondary"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <Button
                  variant="outline"
                  className="w-full mt-2 flex items-center justify-center gap-2"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Link
                  to="/auth"
                  className="block"
                  onClick={() => setIsOpen(false)}
                >
                  <Button
                    variant="outline"
                    className="w-full mt-2 flex items-center justify-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

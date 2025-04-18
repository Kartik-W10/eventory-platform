
import { Menu } from "lucide-react";
import { SidebarHeader } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar/sidebar-context";

export const Header = () => {
  const { toggleSidebar, state } = useSidebar();

  return (
    <SidebarHeader className="px-4 py-4 border-b border-sidebar-border">
      <div className="flex items-center">
        <Menu 
          className={`h-6 w-6 text-secondary cursor-pointer transition-transform duration-300 ${state === "expanded" ? "rotate-90" : ""}`} 
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        />
        <span className={`ml-2 text-xl font-bold text-white transition-opacity duration-300 ${state === "collapsed" ? "opacity-0" : "opacity-100"}`}>
          YourBrand
        </span>
      </div>
    </SidebarHeader>
  );
};

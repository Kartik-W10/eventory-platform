
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  GraduationCap,
  Download,
  Code,
  FileStack,
  Newspaper,
  FileText,
  ChevronDown,
  ChevronRight,
  Menu,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar/sidebar-context";

const SidebarMenuComponent = () => {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [downloadsOpen, setDownloadsOpen] = useState(true); // Open by default on downloads page
  const [publicationsOpen, setPublicationsOpen] = useState(false);
  const { toggleSidebar, state } = useSidebar();

  // Update sidebar menu order - put Menu above Projects
  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarRail />
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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Menu first */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Downloads"
                  onClick={() => setDownloadsOpen(!downloadsOpen)}
                  className="text-white hover:bg-white/10"
                >
                  <Download className="h-4 w-4" />
                  <span>Downloads</span>
                  {downloadsOpen ? (
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200" />
                  )}
                </SidebarMenuButton>
                {downloadsOpen && (
                  <SidebarMenuSub className="animate-accordion-down">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild className="hover:bg-white/10">
                        <Link to="/downloads/code" className="text-white/90 hover:text-white">
                          <Code className="h-4 w-4" />
                          <span>Code</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild className="hover:bg-white/10">
                        <Link to="/downloads/resources" className="text-white/90 hover:text-white">
                          <FileStack className="h-4 w-4" />
                          <span>Resources</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Projects second */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Projects"
                  onClick={() => setProjectsOpen(!projectsOpen)}
                  className="text-white hover:bg-white/10"
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Projects</span>
                  {projectsOpen ? (
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200" />
                  )}
                </SidebarMenuButton>
                {projectsOpen && (
                  <SidebarMenuSub className="animate-accordion-down">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild className="hover:bg-white/10">
                        <Link to="/projects/industrial" className="text-white/90 hover:text-white">
                          <Briefcase className="h-4 w-4" />
                          <span>Industrial</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild className="hover:bg-white/10">
                        <Link to="/projects/academic" className="text-white/90 hover:text-white">
                          <GraduationCap className="h-4 w-4" />
                          <span>Academic</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Publications"
                  onClick={() => setPublicationsOpen(!publicationsOpen)}
                  className="text-white hover:bg-white/10"
                >
                  <FileText className="h-4 w-4" />
                  <span>Publications</span>
                  {publicationsOpen ? (
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200" />
                  )}
                </SidebarMenuButton>
                {publicationsOpen && (
                  <SidebarMenuSub className="animate-accordion-down">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild className="hover:bg-white/10">
                        <Link to="/publications/newspaper" className="text-white/90 hover:text-white">
                          <Newspaper className="h-4 w-4" />
                          <span>Newspaper/Magazine</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild className="hover:bg-white/10">
                        <Link to="/publications/research" className="text-white/90 hover:text-white">
                          <FileText className="h-4 w-4" />
                          <span>Research Articles</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarMenuComponent;

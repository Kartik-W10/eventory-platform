
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

const SidebarMenuComponent = () => {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [downloadsOpen, setDownloadsOpen] = useState(false);
  const [publicationsOpen, setPublicationsOpen] = useState(false);

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarRail />
      <SidebarHeader className="px-4 py-2">
        <Link to="/" className="text-xl font-bold text-sidebar-foreground">
          YourBrand
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Projects"
                  onClick={() => setProjectsOpen(!projectsOpen)}
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Projects</span>
                  {projectsOpen ? (
                    <ChevronDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </SidebarMenuButton>
                {projectsOpen && (
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link to="/projects/industrial">
                          <Briefcase className="h-4 w-4" />
                          <span>Industrial</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link to="/projects/academic">
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
                  tooltip="Downloads"
                  onClick={() => setDownloadsOpen(!downloadsOpen)}
                >
                  <Download className="h-4 w-4" />
                  <span>Downloads</span>
                  {downloadsOpen ? (
                    <ChevronDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </SidebarMenuButton>
                {downloadsOpen && (
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link to="/downloads/code">
                          <Code className="h-4 w-4" />
                          <span>Code</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link to="/downloads/resources">
                          <FileStack className="h-4 w-4" />
                          <span>Resources</span>
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
                >
                  <FileText className="h-4 w-4" />
                  <span>Publications</span>
                  {publicationsOpen ? (
                    <ChevronDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </SidebarMenuButton>
                {publicationsOpen && (
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link to="/publications/newspaper">
                          <Newspaper className="h-4 w-4" />
                          <span>Newspaper/Magazine</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link to="/publications/research">
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

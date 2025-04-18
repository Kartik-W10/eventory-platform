
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Download,
  Briefcase,
  FileText,
  Video,
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
  SidebarRail,
} from "@/components/ui/sidebar";

import { Header } from "./sidebar/Header";
import { MenuItem, SubMenu, downloadItems, projectItems, publicationItems } from "./sidebar/MenuItems";

const SidebarMenuComponent = () => {
  const location = useLocation();
  const [downloadsOpen, setDownloadsOpen] = useState(
    location.pathname.includes('/downloads')
  );
  const [projectsOpen, setProjectsOpen] = useState(
    location.pathname.includes('/projects')
  );
  const [publicationsOpen, setPublicationsOpen] = useState(
    location.pathname.includes('/publications')
  );

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarRail />
      <Header />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <MenuItem
                  isOpen={downloadsOpen}
                  onToggle={() => setDownloadsOpen(!downloadsOpen)}
                  icon={Download}
                  title="Downloads"
                  isActive={location.pathname.includes('/downloads')}
                  items={downloadItems}
                />
                <SubMenu 
                  isOpen={downloadsOpen}
                  items={downloadItems}
                  currentPath={location.pathname}
                />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <MenuItem
                  isOpen={projectsOpen}
                  onToggle={() => setProjectsOpen(!projectsOpen)}
                  icon={Briefcase}
                  title="Projects"
                  isActive={location.pathname.includes('/projects')}
                  items={projectItems}
                />
                <SubMenu 
                  isOpen={projectsOpen}
                  items={projectItems}
                  currentPath={location.pathname}
                />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <MenuItem
                  isOpen={publicationsOpen}
                  onToggle={() => setPublicationsOpen(!publicationsOpen)}
                  icon={FileText}
                  title="Publications"
                  isActive={location.pathname.includes('/publications')}
                  items={publicationItems}
                />
                <SubMenu 
                  isOpen={publicationsOpen}
                  items={publicationItems}
                  currentPath={location.pathname}
                />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Book a Meeting"
                  className="text-white hover:bg-white/10"
                  isActive={location.pathname === "/meeting-booking"}
                  asChild
                >
                  <Link to="/meeting-booking">
                    <Video className="h-4 w-4" />
                    <span>Book a Meeting</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarMenuComponent;

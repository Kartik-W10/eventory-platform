
import { Link } from "react-router-dom";
import {
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  ChevronDown,
  ChevronRight,
  Code,
  FileStack,
  Briefcase,
  GraduationCap,
  Newspaper,
  FileText,
  Download,
} from "lucide-react";

interface MenuItemProps {
  isOpen: boolean;
  onToggle: () => void;
  icon: React.ElementType;
  title: string;
  isActive: boolean;
  items: Array<{
    path: string;
    icon: React.ElementType;
    label: string;
  }>;
}

export const MenuItem = ({ isOpen, onToggle, icon: Icon, title, isActive, items }: MenuItemProps) => {
  return (
    <SidebarMenuButton
      tooltip={title}
      onClick={onToggle}
      className="text-white hover:bg-white/10"
      isActive={isActive}
    >
      <Icon className="h-4 w-4" />
      <span>{title}</span>
      {isOpen ? (
        <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200" />
      ) : (
        <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200" />
      )}
    </SidebarMenuButton>
  );
};

export const SubMenu = ({ isOpen, items, currentPath }: { 
  isOpen: boolean;
  items: Array<{ path: string; icon: React.ElementType; label: string }>;
  currentPath: string;
}) => {
  if (!isOpen) return null;

  return (
    <SidebarMenuSub className="animate-accordion-down">
      {items.map((item) => (
        <SidebarMenuSubItem key={item.path}>
          <SidebarMenuSubButton 
            asChild 
            className="hover:bg-white/10"
            isActive={currentPath === item.path}
          >
            <Link to={item.path} className="text-white/90 hover:text-white">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  );
};

export const downloadItems = [
  { path: "/downloads/code", icon: Code, label: "Code" },
  { path: "/downloads/resources", icon: FileStack, label: "Resources" },
];

export const projectItems = [
  { path: "/projects/industrial", icon: Briefcase, label: "Industrial" },
  { path: "/projects/academic", icon: GraduationCap, label: "Academic" },
];

export const publicationItems = [
  { path: "/publications/newspaper", icon: Newspaper, label: "Newspaper/Magazine" },
  { path: "/publications/research", icon: FileText, label: "Research Articles" },
];

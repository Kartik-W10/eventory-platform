
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, UserCheck, Settings } from "lucide-react";

const AdminNav = () => {
  const location = useLocation();
  const [activeTab] = useState(location.pathname);
  
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Content Manager", path: "/admin/pages", icon: FileText },
    { name: "User Approvals", path: "/admin/users", icon: UserCheck },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <nav className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminNav;

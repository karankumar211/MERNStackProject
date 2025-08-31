import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  List,
  BarChart2,
  Target,
  Settings,
  LogOut,
  Calculator,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: List },
  { href: "/reports", label: "Reports", icon: BarChart2 },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/planner", label: "Planner", icon: Calculator },
  { href: "/settings", label: "Settings", icon: Settings },
];

// The component now accepts language and setLanguage as props
const Navbar = ({ language, setLanguage }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-blue-600">FinVoice</h1>
        <div className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors ${
                  isActive ? "text-blue-600 font-semibold" : ""
                }`
              }>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          {/* NEW: Language Selector Dropdown */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="en-US">English (US)</option>
            <option value="hi-IN">हिन्दी (Hindi)</option>
            <option value="es-ES">Español (Spanish)</option>
            <option value="fr-FR">Français (French)</option>
          </select>

          {user && (
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

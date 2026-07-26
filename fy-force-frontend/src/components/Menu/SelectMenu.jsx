import { useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  Backpack, 
  BookOpen, 
  Swords, 
  Brain 
} from "lucide-react";

// Correction : déstructuration { onClose } avec casse respectée
export default function SelectMenu({ onClose = () => {} }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuOptions = [
    { id: "profile", label: "Profil", Icon: User, path: "/profile" },
    { id: "inventory", label: "Inventaire", Icon: Backpack, path: "/inventory" },
    { id: "lessons", label: "Leçons", Icon: BookOpen, path: "/path" },
    { id: "fight", label: "Combattre", Icon: Swords, path: "/fight" },
    { id: "learn", label: "Apprendre", Icon: Brain, path: "/genPath" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // Appel de la fonction pour fermer le menu dans le Header
  };

  return (
    <div className="w-64 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 backdrop-blur-xl shadow-xl font-sans">
      <nav className="flex flex-col gap-1.5">
        {menuOptions.map((option) => {
          const Icon = option.Icon;
          const isActive = location.pathname === option.path;

          return (
            <button
              key={option.id}
              onClick={() => handleNavigation(option.path)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-md shadow-indigo-500/10"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent"
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? "text-indigo-400" : "text-slate-400"
                }`}
              />
              <span>{option.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
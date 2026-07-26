import { useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  Backpack, 
  BookOpen, 
  Swords, 
  Brain,
  LogOut 
} from "lucide-react";
import { logout } from "../../services/auth"
export default function SelectMenu({ onClose = () => {} }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuOptions = [
    // { id: "profile", label: "Profil", Icon: User, path: "/profile" },
    { id: "inventory", label: "Inventaire", Icon: Backpack, path: "/inventory" },
    { id: "lessons", label: "Leçons", Icon: BookOpen, path: "/path" },
    { id: "fight", label: "Combattre", Icon: Swords, path: "/fight" },
    { id: "learn", label: "Apprendre", Icon: Brain, path: "/genPath" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  // Gestion de la déconnexion
  const handleLogout = () => {
    if (typeof logout === "function") {
      logout(); // Exécute le nettoyage de session/token
    } else {
      localStorage.clear(); // Sécurité au cas où la fonction logout différerait
    }
    
    onClose();
    navigate("/login"); // Redirige vers la page de connexion
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

        {/* Séparateur */}
        <div className="my-1 border-t border-slate-800/80" />

        {/* Bouton Se déconnecter */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Déconnexion</span>
        </button>
      </nav>
    </div>
  );
}
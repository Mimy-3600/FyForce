import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, X } from 'lucide-react';
import SelectBoxMenu from '../Menu/SelectMenu';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Ferme le menu si l'utilisateur clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* Logo / Nom du site */}
        <Link 
          to="/" 
          className="text-xl font-bold text-secondary transition-colors hover:text-secondary/80"
        >
          Lamposcha
        </Link>

        {/* Section droite avec bouton et Menu relatif */}
        <div className="relative" ref={menuRef}>
          {/* Bouton Toggle Menu */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex p-2 px-3 gap-2 items-center justify-center rounded-full transition-all cursor-pointer bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-md shadow-indigo-500/10 hover:bg-indigo-600/30"
            aria-label="Toggle user menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <User className="h-5 w-5" />}
            <span className="text-sm font-medium">Menu</span>
          </button>

          {/* Menu déroulant/Box affiché sous le bouton quand isOpen est true */}
          {isOpen && (
            <div className="absolute right-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <SelectBoxMenu onClose={() => setIsOpen(false)} />
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
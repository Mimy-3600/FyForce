// components/Header.jsx
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

const Header = () => {



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

        {/* Section droite */}
        <div className="flex items-center gap-4">

          {/* Icône utilisateur */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-secondary transition-colors hover:bg-primary/20"
            aria-label="User menu"
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
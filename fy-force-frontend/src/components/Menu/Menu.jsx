import { useNavigate } from 'react-router-dom';
import InfiniteMenu from '../InfiniteMenu';


export default function Menu() {
  const navigate = useNavigate();

  const items = [
    {
      id: "inventory",
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      link: 'http://localhost:5173/inventory',
      title: 'Inventaire',
      description: 'Consulte tes objets et artefacts débloqués.'
    },
    {
      id: "lessons",
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
      link: 'http://localhost:5173/path',
      title: 'Leçons',
      description: 'Explore tes parcours d\'apprentissage et tes leçons.'
    },
    {
      id: "fight",
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
      link: 'http://localhost:5173/leaderBoard',
      title: 'Combattre',
      description: 'Affronte des défis et progresse dans l\'arène.'
    },
    {
      id: "learn",
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      link: 'http://localhost:5173/genPath',
      title: 'Apprendre',
      description: 'Génère un nouveau parcours personnalisé avec l\'IA.'
    }
  ];

  // Capture des clics globaux sur le menu pour intercepter les routes React Router
  const handleContainerClick = (e) => {
    // Si InfiniteMenu génère des balises <a> ou des éléments cliquables
    const target = e.target.closest('[data-link]') || e.target.closest('a');
    
    if (target) {
      const href = target.getAttribute('href') || target.getAttribute('data-link');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        e.stopPropagation();
        navigate(href);
      }
    }
  };

  return (
    <div 
      style={{ height: '600px', position: 'relative' }} 
      onClickCapture={handleContainerClick}
    >
      <InfiniteMenu items={items} scale={1.2} />
    </div>
  );
}
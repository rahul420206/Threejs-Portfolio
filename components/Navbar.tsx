import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useSound } from '../utils/sound';
import { useWarp } from './WarpContext'; // Import the hook

const NAV_ITEMS = ['Home', 'Skills', 'Experience', 'Projects', 'Contact'];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { playClick, playHover } = useSound();
  const { triggerWarp } = useWarp(); // Use the hook

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    playClick();
    setIsOpen(false);
    triggerWarp(); // <--- TRIGGER THE WARP HERE
    
    const element = document.getElementById(id.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    // ... (rest of your existing code remains exactly the same)
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-dark/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div 
            className="text-2xl font-bold font-mono tracking-tighter cursor-pointer text-white"
            onClick={() => handleNavClick('home')}
            onMouseEnter={playHover}
        >
          RM<span className="text-primary">.</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              onMouseEnter={playHover}
              className="text-sm uppercase tracking-widest text-gray-400 hover:text-primary transition-colors duration-300 font-medium"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Mobile Nav Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 md:hidden flex flex-col items-center py-10 space-y-6 animate-in slide-in-from-top-5">
           {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className="text-xl font-light text-white hover:text-primary transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
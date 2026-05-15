import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navClass = clsx(
    'w-full z-50 transition-all duration-300 py-6',
    {
      'bg-garet-cream/90 backdrop-blur-md shadow-sm fixed top-0 left-0 border-b border-garet-border': isScrolled,
      'bg-transparent': !isScrolled,
    }
  );

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-end">
        <Link to="/" className="flex flex-col">
          <span className="text-4xl font-serif font-bold tracking-tight text-garet-wood leading-none">GARET</span>
          <span className="text-xs uppercase tracking-widest text-garet-gold font-semibold mt-1">Furniture & Interiors</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 pb-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={clsx('text-[11px] uppercase tracking-widest font-medium opacity-70 hover:opacity-100 hover:text-garet-gold transition-colors', {
                'text-garet-gold opacity-100': location.pathname === link.path,
              })}
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://wa.me/2349069779077?text=Hello%20Garet%20Furniture,%20I%E2%80%99m%20interested%20in%20your%20furniture%20and%20interior%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 border border-garet-wood rounded-full text-[11px] uppercase tracking-widest font-medium transition-all duration-300 hover:bg-garet-gold hover:text-white hover:border-garet-gold text-garet-wood"
          >
            Chat With Us
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-garet-cream w-full text-garet-black overflow-hidden shadow-lg absolute top-full left-0 origin-top"
          >
            <div className="flex flex-col px-6 py-6 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-lg uppercase tracking-widest font-medium hover:text-garet-gold transition-colors block"
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="https://wa.me/2349069779077?text=Hello%20Garet%20Furniture,%20I%E2%80%99m%20interested%20in%20your%20furniture%20and%20interior%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-center px-6 py-3 border border-garet-black rounded-full text-sm uppercase tracking-widest hover:bg-garet-gold hover:text-white hover:border-garet-gold transition-all duration-300"
              >
                Chat With Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

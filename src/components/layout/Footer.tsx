import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-garet-cream py-6 px-6 md:px-12">
      <div className="max-w-7xl mx-auto rounded-[2rem] bg-garet-black text-garet-cream p-10 lg:p-16 shadow-sm border border-garet-border/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="md:col-span-1 border-r border-white/10 pr-6">
            <Link to="/" className="text-3xl font-serif font-bold tracking-tight mb-4 inline-block text-white">
              GARET<span className="text-garet-gold rounded">.</span>
            </Link>
            <p className="text-sm opacity-80 mb-6 font-poppins leading-relaxed">
              Transforming homes and offices with stylish, functional, and affordable designs. Where luxury meets affordability.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/garetfurnitures" target="_blank" rel="noopener noreferrer" className="hover:text-garet-gold transition-colors">
                <Instagram size={20} />
              </a>
              {/* TikTok Icon placeholder (Lucide doesn't have official Tiktok icon by default so we can use a text or generic icon, we'll just link it) */}
              <a href="https://tiktok.com/@garetfurnitures" target="_blank" rel="noopener noreferrer" className="hover:text-garet-gold transition-colors text-sm font-bold pt-0.5">
                TikTok
              </a>
            </div>
          </div>

        {/* Links */}
        <div>
          <h4 className="text-sm font-serif uppercase tracking-widest mb-6 opacity-60">Company</h4>
          <ul className="space-y-4 text-sm font-poppins">
            <li><Link to="/" className="hover:text-garet-gold transition-colors block">Home</Link></li>
            <li><Link to="/#about" className="hover:text-garet-gold transition-colors block">About Us</Link></li>
            <li><Link to="/shop" className="hover:text-garet-gold transition-colors block">Collections</Link></li>
            <li><Link to="/contact" className="hover:text-garet-gold transition-colors block">Contact</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-sm font-serif uppercase tracking-widest mb-6 opacity-60">Services</h4>
          <ul className="space-y-4 text-sm font-poppins">
            <li className="opacity-80">Custom Furniture Design</li>
            <li className="opacity-80">Interior Space Planning</li>
            <li className="opacity-80">Residential & Commercial Supply</li>
            <li className="opacity-80">Furniture Restoration</li>
            <li className="opacity-80">Bespoke Upholstery</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-serif uppercase tracking-widest mb-6 opacity-60">Contact</h4>
          <ul className="space-y-4 text-sm font-poppins">
            <li className="flex items-start">
              <MapPin size={18} className="mr-3 text-garet-gold shrink-0 mt-0.5" />
              <span className="opacity-80 leading-relaxed">
                Ocean Mall, Third Floor Km 33, Plot 50, Lekki Epe Expressway, Olokonla Bus Stop, Beside Road Safety Office, Ajah.
              </span>
            </li>
            <li className="flex items-center">
              <Phone size={18} className="mr-3 text-garet-gold shrink-0" />
              <div className="flex flex-col space-y-1 opacity-80">
                <a href="tel:09069779077" className="hover:text-white transition-colors">09069779077</a>
                <a href="tel:07047240068" className="hover:text-white transition-colors">07047240068</a>
                <a href="tel:07015945209" className="hover:text-white transition-colors">07015945209</a>
              </div>
            </li>
            <li className="flex items-center mt-2">
              <Mail size={18} className="mr-3 text-garet-gold shrink-0" />
              <a href="mailto:garetfurniture@gmail.com" className="opacity-80 hover:text-white transition-colors">garetfurniture@gmail.com</a>
            </li>
          </ul>
        </div>

      </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-xs opacity-50 font-poppins tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Garet Furniture & Interiors. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

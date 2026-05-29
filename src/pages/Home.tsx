import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight, Droplet, LayoutDashboard, Truck, Armchair, Hammer, Paintbrush, Home as HomeIcon } from 'lucide-react';
import clsx from 'clsx';
import { db } from '../lib/firebase';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';

// Example image placeholders (Source: Unsplash API)
const defaultHeroImage = "https://images.unsplash.com/photo-1618220179428-22790b46a0eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
const aboutImage = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
const categoryPlaceholderImg = "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80";

const services = [
  { icon: <Hammer />, title: "Custom Furniture Design & Manufacturing", desc: "Bespoke pieces crafted to fit your exact vision and space." },
  { icon: <LayoutDashboard />, title: "Interior Space Planning & Design Consultation", desc: "Optimizing layouts for functionality, flow, and aesthetics." },
  { icon: <HomeIcon />, title: "Residential & Commercial Furniture Supply", desc: "Supplying premium furniture for homes and office spaces." },
  { icon: <Armchair />, title: "Office Interior Design & Furnishing Solutions", desc: "Professional environments designed for productivity and style." },
  { icon: <Paintbrush />, title: "Furniture Repair, Refurbishment & Restoration", desc: "Breathing new life into your cherished furniture pieces." },
  { icon: <Droplet />, title: "Project Management for Interior Fit-outs & Renovations", desc: "Seamless end-to-end management for fit-outs and renovations." },
  { icon: <Armchair />, title: "Bespoke Upholstery", desc: "Expert upholstery with a curated selection of premium fabrics." }
];

const whyUs = [
  "Premium Craftsmanship", "Affordable Luxury", "Custom Designs", "Fast Delivery", "Professional Interior Solutions", "Trusted Customer Experience"
];

export default function Home() {
  const [siteSettings, setSiteSettings] = useState({ 
    heroTitle: 'Elegant Furniture & Interior Solutions', 
    heroSubtitle: 'Transforming homes and offices with stylish, functional, and affordable designs.', 
    heroImage: defaultHeroImage 
  });
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [gallery, setGallery] = useState<{id: string, image: string, title: string}[]>([]);
  const [testimonials, setTestimonials] = useState<{id: string, text: string, author: string}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cSnap, gSnap, tSnap, sSnap] = await Promise.all([
          getDocs(collection(db, "categories")),
          getDocs(collection(db, "gallery")),
          getDocs(collection(db, "testimonials")),
          getDoc(doc(db, "settings", "global"))
        ]);

        if (sSnap.exists()) {
          const sData = sSnap.data();
          setSiteSettings({
            heroTitle: sData.heroTitle || 'Elegant Furniture & Interior Solutions',
            heroSubtitle: sData.heroSubtitle || 'Transforming homes and offices with stylish, functional, and affordable designs.',
            heroImage: sData.heroImage || defaultHeroImage
          });
        }

        setCategories(cSnap.docs.map(d => ({ id: d.id, name: d.data().name })));
        setGallery(gSnap.docs.map(d => ({ id: d.id, image: d.data().image, title: d.data().title })));
        setTestimonials(tSnap.docs.map(d => ({ id: d.id, text: d.data().text, author: d.data().author })));
      } catch (error) {
        console.error("Error fetching homepage data", error);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2 } 
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="bg-garet-cream font-sans">
      
      {/* Hero Section - Bento Grid */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pt-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-6 gap-4 min-h-[700px]">
          
          {/* Main Hero Tile */}
          <div className="lg:col-span-8 lg:row-span-4 bg-garet-wood rounded-[2rem] relative overflow-hidden flex flex-col justify-end p-8 md:p-12 group shadow-sm border border-garet-border/20 text-white">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-garet-gold via-garet-wood to-garet-black"></div>
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-garet-wood/60 z-10 transition-opacity duration-700 group-hover:opacity-80"></div>
              <img src={siteSettings.heroImage} alt="Luxury Interior" className="w-full h-full object-cover scale-105 transform group-hover:scale-110 transition-transform duration-1000" />
            </div>
            <div className="relative z-20">
              <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <motion.h1 variants={itemVariants} className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4 leading-tight whitespace-pre-line">
                  {siteSettings.heroTitle}
                </motion.h1>
                <motion.p variants={itemVariants} className="font-poppins text-sm md:text-base font-light opacity-90 mb-8 max-w-md leading-relaxed">
                  {siteSettings.heroSubtitle}
                </motion.p>
                <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
                  <Link to="/shop" className="px-6 py-3 bg-garet-gold text-white rounded-full font-medium text-xs md:text-sm hover:scale-105 transition-transform shadow-lg shadow-garet-gold/20">
                    Shop Furniture
                  </Link>
                  <a href="https://wa.me/2349069779077?text=Hello%20Garet%20Furniture,%20I%E2%80%99m%20interested%20in%20your%20furniture%20and%20interior%20services." target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#25D366] text-white rounded-full font-medium text-xs md:text-sm hover:scale-105 transition-transform shadow-lg shadow-[#25D366]/20">
                    Chat on WhatsApp
                  </a>
                  <a href="https://wa.me/2349069779077?text=I%20want%20to%20book%20a%20consultation" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium text-xs md:text-sm hover:bg-white/20 transition-colors">
                    Book Consultation
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Categories Grid (Sidebar) */}
          <div className="lg:col-span-4 lg:row-span-3 bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-garet-border flex flex-col justify-between hover:border-garet-gold transition-colors">
            <h3 className="text-xs uppercase tracking-widest font-bold mb-6 flex justify-between text-garet-black">
              Collections
              <span className="text-garet-gold">{categories.length > 0 ? `01/0${categories.length}` : '00/00'}</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {categories.slice(0, 4).map((cat, i) => (
                <Link key={i} to={`/shop?category=${encodeURIComponent(cat.name)}`} className="bg-garet-cream rounded-2xl p-4 flex flex-col justify-between border border-transparent hover:border-garet-gold hover:shadow-sm transition-all group overflow-hidden relative">
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity">
                    <img src={categoryPlaceholderImg} alt={cat.name} className="w-full h-full object-cover grayscale" />
                  </div>
                  <span className="text-[10px] uppercase font-bold opacity-40 relative z-10 text-garet-black">0{i + 1}</span>
                  <span className="text-xs font-semibold relative z-10 group-hover:text-garet-gold text-garet-black transition-colors">{cat.name}</span>
                </Link>
              ))}
              {categories.length === 0 && <div className="col-span-2 text-xs opacity-50 font-poppins text-center py-8">No collections available yet.</div>}
            </div>
          </div>

          {/* About / USP Tile */}
          <div className="lg:col-span-4 lg:row-span-1 bg-garet-gold rounded-[2rem] p-6 lg:p-8 flex items-center justify-between text-white shadow-sm hover:scale-[1.02] transition-transform">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-1">Quality Check</p>
              <p className="text-xl font-serif italic">Premium Craftsmanship</p>
            </div>
            <div className="h-12 w-12 rounded-full border border-white/30 flex items-center justify-center text-xl shrink-0 bg-white/10 backdrop-blur-sm">
              ✓
            </div>
          </div>

          {/* Services Tile */}
          <div className="lg:col-span-6 lg:row-span-2 bg-white rounded-[2rem] p-6 lg:p-8 border border-garet-border shadow-sm flex flex-col justify-between hover:border-garet-gold transition-colors">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-serif font-bold text-garet-wood">Our Services</h3>
              <div className="text-right">
                <p className="text-[10px] opacity-50 uppercase tracking-widest text-garet-black font-bold">Expertise</p>
                <p className="text-3xl font-bold text-garet-gold">12+</p>
                <p className="text-[9px] uppercase tracking-widest font-bold text-garet-black">Years of Design</p>
              </div>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
              <li className="text-xs flex items-center gap-3 text-garet-black font-medium"><span className="w-1.5 h-1.5 bg-garet-gold rounded-full"></span> Interior Space Planning</li>
              <li className="text-xs flex items-center gap-3 text-garet-black font-medium"><span className="w-1.5 h-1.5 bg-garet-gold rounded-full"></span> Bespoke Upholstery</li>
              <li className="text-xs flex items-center gap-3 text-garet-black font-medium"><span className="w-1.5 h-1.5 bg-garet-gold rounded-full"></span> Furniture Restoration</li>
              <li className="text-xs flex items-center gap-3 text-garet-black font-medium"><span className="w-1.5 h-1.5 bg-garet-gold rounded-full"></span> Project Management</li>
            </ul>
          </div>

          {/* Contact & WhatsApp Tile */}
          <div className="lg:col-span-6 lg:row-span-2 bg-garet-black rounded-[2rem] p-6 lg:p-8 text-white flex flex-col justify-between shadow-sm relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-garet-gold blur-[80px] opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-700"></div>
            <div className="flex justify-between relative z-10">
              <div>
                <p className="text-garet-gold text-[10px] uppercase font-bold tracking-widest mb-3">Visit Us</p>
                <p className="text-xs md:text-sm opacity-80 max-w-[200px] leading-relaxed font-poppins">
                  Ocean Mall, 3rd Floor, Lekki Epe Exp, Ajah, Lagos.
                </p>
              </div>
              <div className="text-right">
                <p className="text-garet-gold text-[10px] uppercase font-bold tracking-widest mb-3">Socials</p>
                <a href="https://instagram.com/garetfurnitures" target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm font-poppins hover:text-white opacity-80 block mb-1">@garetfurnitures</a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 bg-white/5 border border-white/10 rounded-[1.5rem] p-5 relative z-10 gap-4 sm:gap-0">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase opacity-60 tracking-widest mb-1 font-bold">Instant Inquiry</span>
                <span className="text-sm font-medium font-poppins tracking-wider">0906 977 9077</span>
              </div>
              <a href="https://wa.me/2349069779077?text=Hello%20Garet%20Furniture,%20I%E2%80%99m%20interested%20in%20your%20furniture%20and%20interior%20services." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#128C7E] transition-colors shadow-lg shadow-[#25D366]/20">
                Chat on WhatsApp
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center bg-white rounded-[2rem] p-10 lg:p-16 border border-garet-border shadow-sm">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
            <h2 className="font-serif text-4xl mb-6 text-garet-wood font-bold">About Garet Furniture & Interiors</h2>
            <div className="font-poppins text-lg opacity-80 leading-relaxed space-y-6">
              <p>
                Garet Furniture and Interiors brings your vision to life with stylish and functional designs tailored for every space. We specialize in creating elegant furniture and interior solutions that transform homes and offices.
              </p>
              <p>
                Our commitment is to blend quality craftsmanship with budget-friendly options because at Garet, we believe beautiful design should be accessible to everyone.
              </p>
              <p className="font-serif font-bold text-garet-gold text-xl">
                Where Elegance Meets Affordability.
              </p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative h-[500px] rounded-[2rem] overflow-hidden">
            <img src={aboutImage} alt="About Us" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-garet-wood rounded-[2rem] p-10 lg:p-16 text-white shadow-sm border border-garet-border/20">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4 font-bold">Our Services</h2>
            <div className="w-24 h-1 bg-garet-gold mx-auto rounded-full"></div>
          </div>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
             initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={containerVariants}>
            {services.map((s, i) => (
              <motion.div key={i} variants={itemVariants} className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-garet-gold transition-colors duration-300 group backdrop-blur-sm">
                <div className="text-garet-gold mb-6 shrink-0 transform group-hover:scale-110 transition-transform">{s.icon}</div>
                <h3 className="font-serif text-2xl mb-3 text-white">{s.title}</h3>
                <p className="font-poppins text-sm opacity-70 mb-6 leading-relaxed text-garet-cream">{s.desc}</p>
                <a href="https://wa.me/2349069779077?text=Hello%20Garet%20Furniture,%20I'd%20like%20to%20learn%20more%20about%20your%20services" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs uppercase tracking-widest font-bold text-garet-gold hover:text-white transition-colors">
                  WhatsApp CTA <ChevronRight size={14} className="ml-1" />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories / Featured Furniture */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-white rounded-[2rem] p-10 lg:p-16 border border-garet-border shadow-sm">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-4xl text-garet-wood font-bold mb-4">Featured Collections</h2>
              <div className="w-24 h-1 bg-garet-gold rounded-full"></div>
            </div>
            <Link to="/shop" className="hidden sm:inline-flex items-center text-sm uppercase tracking-widest font-bold text-garet-wood hover:text-garet-gold transition-colors">
              View All <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((cat, i) => (
              <Link key={i} to={`/shop?category=${encodeURIComponent(cat.name)}`} className="group block relative h-96 overflow-hidden rounded-[1.5rem]">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10"></div>
                <img src={categoryPlaceholderImg} alt={cat.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="text-white font-serif text-2xl drop-shadow-md font-bold">{cat.name}</h3>
                </div>
              </Link>
            ))}
            {categories.length === 0 && <p className="text-gray-400 font-poppins text-center col-span-4 py-12">No collections available yet.</p>}
          </div>
          <div className="mt-8 sm:hidden text-center">
              <Link to="/shop" className="inline-flex items-center justify-center w-full px-6 py-4 border border-garet-wood text-sm uppercase tracking-widest font-bold text-garet-wood hover:bg-garet-gold hover:text-white hover:border-garet-gold transition-colors rounded-full">
                View All Collections
              </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-garet-black text-white rounded-[2rem] border border-garet-border/20 shadow-sm relative overflow-hidden p-10 lg:p-16">
          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="font-serif text-4xl mb-6 font-bold">Why Choose Us</h2>
              <p className="font-poppins opacity-80 mb-10 leading-relaxed text-lg">
                We don't just build furniture; we create experiences. Every piece is crafted with meticulous attention to detail and your comfort in mind.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                {whyUs.map((reason, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-garet-gold rounded-full"></div>
                    <span className="font-poppins text-sm uppercase tracking-wider font-bold">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 text-[200px] leading-none font-serif opacity-[0.03] select-none pointer-events-none text-garet-gold font-bold">
            GARET.
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-white rounded-[2rem] p-10 lg:p-16 border border-garet-border shadow-sm">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-garet-wood font-bold mb-4">Our Portfolio</h2>
            <div className="w-24 h-1 bg-garet-gold mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {gallery.length > 0 ? gallery.map((g, i) => (
              <div key={g.id} className={clsx(
                "bg-gray-200 group overflow-hidden relative rounded-[1.5rem]",
                // Make the first image span 2x2, the last image span full width (just to mimic the old masonry effect)
                i === 0 ? "md:col-span-2 md:row-span-2" : i === 3 ? "md:col-span-3" : ""
              )}>
                <img src={g.image} alt={g.title || 'Gallery'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                {g.title && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                     <span className="text-white font-serif text-xl border border-white px-6 py-2 rounded-full backdrop-blur-sm bg-black/20">{g.title}</span>
                  </div>
                )}
              </div>
            )) : (
              <div className="col-span-3 text-center py-12 text-gray-400 font-poppins">No gallery images added yet. Add some in the Admin Dashboard!</div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-[#EBE7E0] rounded-[2rem] p-10 lg:p-16 border border-garet-border shadow-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl text-garet-wood font-bold mb-12">What Our Clients Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.length > 0 ? testimonials.map((t) => (
                <div key={t.id} className="bg-white rounded-[1.5rem] p-8 shadow-sm flex flex-col justify-between border border-garet-border/50">
                  <div className="text-garet-gold mb-4 text-4xl font-serif">"</div>
                  <p className="font-poppins text-sm opacity-80 italic mb-6 leading-relaxed flex-1">
                    {t.text}
                  </p>
                  <div className="font-sans font-bold tracking-widest text-[10px] uppercase text-garet-wood">{t.author}</div>
                </div>
              )) : (
                <div className="col-span-3 text-center text-gray-500 font-poppins">No testimonials available yet.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Social Feed */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-white rounded-[2rem] p-10 lg:p-16 border border-garet-border shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div>
              <h2 className="font-serif text-4xl text-garet-wood font-bold mb-4 text-center md:text-left">Join Our Community</h2>
              <p className="font-poppins opacity-70">Follow us on Instagram & TikTok for daily inspiration</p>
            </div>
            <div className="flex gap-4">
              <a href="https://instagram.com/garetfurnitures" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform shadow-lg">
                Instagram
              </a>
              <a href="https://tiktok.com/@garetfurnitures" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-black text-white rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform shadow-lg">
                TikTok
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="https://instagram.com/garetfurnitures" target="_blank" rel="noopener noreferrer" className="group block aspect-square bg-gray-200 relative overflow-hidden rounded-[1.5rem]">
              <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80" alt="Instagram post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-poppins font-bold text-sm">@garetfurnitures</span>
              </div>
            </a>
            <a href="https://tiktok.com/@garetfurnitures" target="_blank" rel="noopener noreferrer" className="group block aspect-square bg-gray-200 relative overflow-hidden rounded-[1.5rem]">
              <img src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=600&q=80" alt="TikTok post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-poppins font-bold text-sm">@garetfurnitures</span>
              </div>
            </a>
            <a href="https://instagram.com/garetfurnitures" target="_blank" rel="noopener noreferrer" className="group block aspect-square bg-gray-200 relative overflow-hidden rounded-[1.5rem]">
              <img src="https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&w=600&q=80" alt="Instagram post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-poppins font-bold text-sm">@garetfurnitures</span>
              </div>
            </a>
            <a href="https://tiktok.com/@garetfurnitures" target="_blank" rel="noopener noreferrer" className="group block aspect-square bg-gray-200 relative overflow-hidden rounded-[1.5rem]">
              <img src="https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=600&q=80" alt="TikTok post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-poppins font-bold text-sm">@garetfurnitures</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-garet-gold rounded-[2rem] p-12 md:p-20 text-white shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="relative z-10">
            <h2 className="font-serif text-4xl md:text-5xl mb-6 font-bold">Need Custom Furniture or Interior Design Solutions?</h2>
            <p className="font-poppins opacity-90 mb-10 max-w-xl mx-auto text-lg">Let us help you bring your dream space to life with our premium, affordable solutions.</p>
            <a href="https://wa.me/2349069779077?text=Hello%20Garet%20Furniture,%20I%E2%80%99m%20interested%20in%20your%20furniture%20and%20interior%20services." target="_blank" rel="noopener noreferrer" className="inline-block px-10 py-5 bg-white text-garet-wood text-sm font-bold uppercase tracking-widest hover:bg-garet-black hover:text-white transition-colors rounded-full shadow-lg">
              Chat With Us on WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

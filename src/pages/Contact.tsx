import { MapPin, Phone, Mail, Instagram } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  return (
    <div className="bg-garet-cream min-h-screen pt-32 pb-24 font-sans flex flex-col">
      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 flex-grow">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl text-garet-black mb-6">Contact Us</h1>
          <p className="font-poppins opacity-70 max-w-2xl mx-auto">We would love to hear from you. Reach out for custom furniture requests, interior design consultations, or any inquiries.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          
          {/* Contact Details */}
          <div className="order-2 md:order-1 flex flex-col gap-12">
            <div>
              <h3 className="font-serif text-2xl mb-8 flex items-center">
                <MapPin className="text-garet-gold mr-3" /> Visit Our Showroom
              </h3>
              <p className="font-poppins opacity-80 leading-relaxed text-lg">
                Ocean Mall, Third Floor Km 33, Plot 50, Lekki Epe Expressway, Olokonla Bus Stop, Beside Road Safety Office, Ajah.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl mb-8 flex items-center">
                <Phone className="text-garet-gold mr-3" /> Call Us
              </h3>
              <div className="flex flex-col space-y-4 font-poppins text-lg opacity-80">
                <a href="tel:09069779077" className="hover:text-garet-gold transition-colors inline-block w-fit">09069779077</a>
                <a href="tel:07047240068" className="hover:text-garet-gold transition-colors inline-block w-fit">07047240068</a>
                <a href="tel:07015945209" className="hover:text-garet-gold transition-colors inline-block w-fit">07015945209</a>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-2xl mb-8 flex items-center">
                <Mail className="text-garet-gold mr-3" /> Email
              </h3>
              <a href="mailto:garetfurniture@gmail.com" className="font-poppins text-lg opacity-80 hover:text-garet-gold transition-colors inline-block w-fit">
                garetfurniture@gmail.com
              </a>
            </div>

            <div>
              <h3 className="font-serif text-2xl mb-8 flex items-center">
                <Instagram className="text-garet-gold mr-3" /> Social
              </h3>
              <div className="flex space-x-6 font-poppins text-lg opacity-80 uppercase tracking-widest font-medium">
                <a href="https://instagram.com/garetfurnitures" target="_blank" rel="noopener noreferrer" className="hover:text-garet-gold transition-colors block">Instagram</a>
                <a href="https://tiktok.com/@garetfurnitures" target="_blank" rel="noopener noreferrer" className="hover:text-garet-gold transition-colors block">TikTok</a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="order-1 md:order-2 bg-white p-8 md:p-12 shadow-sm border border-black/5">
            <h3 className="font-serif text-3xl mb-8">Send a Message</h3>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully! (This is a mockup)'); }}>
              <div>
                <label className="block font-poppins text-xs uppercase tracking-widest opacity-60 mb-2">Name</label>
                <input required type="text" className="w-full border-b border-garet-black/20 pb-2 bg-transparent focus:outline-none focus:border-garet-gold transition-colors font-poppins" />
              </div>
              <div>
                <label className="block font-poppins text-xs uppercase tracking-widest opacity-60 mb-2">Email</label>
                <input required type="email" className="w-full border-b border-garet-black/20 pb-2 bg-transparent focus:outline-none focus:border-garet-gold transition-colors font-poppins" />
              </div>
              <div>
                <label className="block font-poppins text-xs uppercase tracking-widest opacity-60 mb-2">Service Required</label>
                <select className="w-full border-b border-garet-black/20 pb-2 bg-transparent focus:outline-none focus:border-garet-gold transition-colors font-poppins opacity-80">
                  <option>General Inquiry</option>
                  <option>Custom Furniture</option>
                  <option>Interior Space Planning</option>
                  <option>Furniture Repair</option>
                </select>
              </div>
              <div>
                <label className="block font-poppins text-xs uppercase tracking-widest opacity-60 mb-2">Message</label>
                <textarea required rows={4} className="w-full border-b border-garet-black/20 bg-transparent focus:outline-none focus:border-garet-gold transition-colors font-poppins resize-none"></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-garet-black text-white text-sm font-poppins uppercase tracking-widest hover:bg-garet-gold transition-colors mt-8">
                Send Inquiry
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Map */}
      <div className="w-full h-96 mt-24 filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15858.490585644155!2d3.5937409569724036!3d6.442385172478564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf90e66d488ab%3A0x647eacc59f518e3c!2sOcean%20Mall!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          aria-hidden="false"
          tabIndex={0}
        ></iframe>
      </div>
    </div>
  );
}

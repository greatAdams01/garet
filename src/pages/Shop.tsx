import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, MessageCircle } from 'lucide-react';
import { Product } from '../data/products';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import clsx from 'clsx';

export default function Shop() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [pSnap, cSnap] = await Promise.all([
          getDocs(collection(db, "products")),
          getDocs(collection(db, "categories"))
        ]);
        setProducts(pSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
        
        // Populate categories, always keeping "All" at the start
        const fetchedCategories = cSnap.docs.map(doc => doc.data().name);
        setCategories(['All', ...fetchedCategories]);
        
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Scroll to top when modal opens
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedProduct]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery, products]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  const getWhatsAppLink = (product: Product, isQuote: boolean = false) => {
    const text = isQuote 
      ? `Hello Garet Furniture, I would like to request a quote for the "${product.name}".`
      : `Hello Garet Furniture, I would like to order the "${product.name}" (${formatPrice(product.price)}).`;
    return `https://wa.me/2349069779077?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-garet-cream min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center mb-16 bg-white rounded-[2rem] p-12 border border-garet-border shadow-sm">
          <h1 className="font-serif text-5xl text-garet-wood mb-6 font-bold">Our Collections</h1>
          <p className="font-poppins opacity-70 max-w-2xl mx-auto">Explore our curated selection of premium furniture designed to elevate your living spaces.</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white rounded-[2rem] p-4 border border-garet-border shadow-sm">
          {/* Categories */}
          <div className="flex overflow-x-auto w-full md:w-auto pb-4 md:pb-0 hide-scrollbar space-x-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={clsx(
                  'whitespace-nowrap px-6 py-2 rounded-full text-xs font-poppins uppercase tracking-widest transition-colors font-bold',
                  activeCategory === cat ? 'bg-garet-wood text-white shadow-md' : 'border border-garet-border text-garet-black hover:border-garet-gold hover:text-garet-gold'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-garet-cream rounded-full border border-garet-border placeholder-garet-black/50 text-garet-black py-2 pl-10 pr-4 focus:outline-none focus:border-garet-gold transition-colors font-poppins text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-garet-black" size={18} />
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-garet-gold"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
          >
            <AnimatePresence>
              {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group cursor-pointer bg-white rounded-[2rem] p-4 border border-garet-border shadow-sm hover:border-garet-gold transition-colors flex flex-col"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="overflow-hidden mb-6 relative aspect-[4/3] bg-gray-100 rounded-[1.5rem]">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {!product.inStock && (
                      <div className="absolute top-4 right-4 bg-garet-wood text-white text-[10px] uppercase font-bold px-3 py-1 tracking-widest rounded-full">
                        Out of stock
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start px-2 pb-2">
                    <div>
                      <h3 className="font-serif text-xl mb-1 group-hover:text-garet-gold transition-colors font-bold text-garet-wood">{product.name}</h3>
                      <p className="font-poppins text-[10px] font-bold uppercase tracking-widest opacity-50">{product.category}</p>
                    </div>
                    <div className="font-poppins font-bold text-garet-gold text-sm mt-1">{formatPrice(product.price)}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-24 opacity-60">
            <p className="font-serif text-2xl">No products found.</p>
            <p className="font-poppins mt-2">Try adjusting your search or category filter.</p>
          </div>
        )}

      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/60 backdrop-blur-sm"
          >
              <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-white w-full max-w-5xl max-h-full overflow-y-auto flex flex-col md:flex-row relative shadow-[0_0_40px_rgba(0,0,0,0.1)] rounded-[2rem] border border-garet-border overflow-hidden"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 bg-garet-cream/50 hover:bg-garet-cream hover:text-garet-wood text-garet-black p-2 rounded-full backdrop-blur-md transition-colors shadow-sm"
              >
                <X size={24} />
              </button>

              <div className="w-full md:w-1/2 aspect-square md:aspect-auto border-b md:border-b-0 md:border-r border-garet-border">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <p className="font-poppins text-[10px] uppercase font-bold tracking-widest opacity-50 mb-4">{selectedProduct.category}</p>
                <h2 className="font-serif text-3xl md:text-4xl mb-4 text-garet-wood font-bold">{selectedProduct.name}</h2>
                <div className="font-poppins text-2xl mb-8 flex items-center font-medium text-garet-gold">
                  {formatPrice(selectedProduct.price)}
                  {!selectedProduct.inStock && <span className="ml-4 text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-full">Sold Out</span>}
                </div>
                <div className="w-12 h-1 bg-garet-gold mb-8 rounded-full"></div>
                <p className="font-poppins leading-relaxed opacity-80 mb-12 text-sm">
                  {selectedProduct.description}
                </p>

                <div className="flex flex-col space-y-4">
                  <a 
                    href={getWhatsAppLink(selectedProduct, false)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#25D366] text-white text-center text-xs font-poppins font-bold uppercase tracking-widest hover:bg-[#128C7E] transition-colors flex justify-center items-center rounded-xl shadow-lg shadow-[#25D366]/20"
                  >
                    <MessageCircle size={18} className="mr-2" />
                    Order on WhatsApp
                  </a>
                  <a 
                    href={getWhatsAppLink(selectedProduct, true)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 border border-garet-border text-garet-wood text-center text-xs font-poppins font-bold uppercase tracking-widest hover:border-garet-gold hover:text-garet-gold transition-colors rounded-xl"
                  >
                    Request Quote
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

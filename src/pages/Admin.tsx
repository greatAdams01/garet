import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { products as initialProducts, categories, Product } from '../data/products';
import { Edit, Trash2, Plus, Image as ImageIcon, CheckCircle, XCircle, LogOut, Menu, X, LayoutDashboard, Package, Tag, Users, Settings } from 'lucide-react';
import clsx from 'clsx';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mock state since we don't have a backend
  const [productList, setProductList] = useState<Product[]>(initialProducts);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  const toggleStock = (id: string) => {
    setProductList(productList.map(p => 
      p.id === id ? { ...p, inStock: !p.inStock } : p
    ));
  };

  const deleteProduct = (id: string) => {
    setProductList(productList.filter(p => p.id !== id));
  };

  const navItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'products', icon: <Package size={20} />, label: 'Products' },
    { id: 'categories', icon: <Tag size={20} />, label: 'Categories' },
    { id: 'testimonials', icon: <Users size={20} />, label: 'Testimonials' },
    { id: 'gallery', icon: <ImageIcon size={20} />, label: 'Gallery' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Site Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row pt-20 md:pt-0">
      
      {/* Mobile Admin Header */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-garet-black text-white p-4 flex justify-between items-center z-40">
        <div className="font-serif text-xl tracking-widest font-bold">GARET ADMIN</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={clsx(
        "fixed md:sticky top-0 left-0 h-screen bg-garet-black text-garet-cream w-64 p-6 flex flex-col z-30 transition-transform duration-300 md:translate-x-0 pt-24 md:pt-6",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="hidden md:block font-serif text-2xl tracking-widest font-bold mb-12 border-b border-garet-cream/20 pb-6">
          GARET<span className="text-garet-gold rounded">.</span> ADMIN
        </div>

        <nav className="flex-grow space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              className={clsx(
                "w-full flex items-center space-x-3 px-4 py-3 rounded text-sm uppercase tracking-widest transition-colors text-left",
                activeTab === item.id ? "bg-garet-gold text-white" : "hover:bg-garet-cream/10"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="flex items-center space-x-3 px-4 py-3 mt-auto text-sm uppercase tracking-widest hover:text-red-400 transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 md:p-12 overflow-x-hidden md:h-screen overflow-y-auto">
        <h1 className="font-serif text-3xl mb-2 text-garet-black capitalize">{activeTab}</h1>
        <p className="font-poppins opacity-60 text-sm mb-12">Mock admin panel area (Data is not persistent).</p>

        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-2xl">Manage Products</h2>
              <button 
                onClick={() => alert("Mock: Open add product modal")}
                className="bg-garet-black text-white px-4 py-2 text-sm font-poppins uppercase tracking-widest flex items-center hover:bg-garet-gold transition-colors"
              >
                <Plus size={16} className="mr-2" /> Add Product
              </button>
            </div>

            <div className="bg-white rounded shadow-sm border border-black/5 overflow-x-auto">
              <table className="w-full text-left font-poppins text-sm whitespace-nowrap">
                <thead className="bg-gray-100 uppercase text-xs tracking-widest opacity-60">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {productList.map((product) => (
                      <motion.tr 
                        key={product.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                        </td>
                        <td className="p-4 font-medium">{product.name}</td>
                        <td className="p-4 opacity-70">{product.category}</td>
                        <td className="p-4">{formatPrice(product.price)}</td>
                        <td className="p-4">
                          <button 
                            onClick={() => toggleStock(product.id)}
                            className={clsx(
                              "px-3 py-1 text-xs uppercase tracking-widest rounded-full border flex items-center w-max",
                              product.inStock ? "text-green-600 border-green-600 bg-green-50" : "text-gray-500 border-gray-500 bg-gray-100"
                            )}
                          >
                            {product.inStock ? <><CheckCircle size={12} className="mr-1"/> In Stock</> : <><XCircle size={12} className="mr-1"/> Sold Out</>}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => alert('Mock: Edit product')} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors inline-block text-center"><Edit size={16} /></button>
                          <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors inline-block text-center"><Trash2 size={16} /></button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'products' && (
          <div className="flex items-center justify-center h-64 bg-white border border-dashed border-gray-300 rounded font-poppins text-gray-500">
            {activeTab} management panel (Mock UI)
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { products as initialProducts, categories, Product } from '../data/products';
import { Edit, Trash2, Plus, Image as ImageIcon, CheckCircle, XCircle, LogOut, Menu, X, LayoutDashboard, Package, Tag, Users, Settings } from 'lucide-react';
import clsx from 'clsx';
import { auth, db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Products State
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Add Product State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: categories.filter(c => c !== 'All')[0], price: '', image: '', description: '', inStock: true });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchProducts();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setAuthError('');
    } catch (error: any) {
      setAuthError('Invalid credentials. Please ensure you have created this user in Firebase Auth.');
    }
    setIsSubmitting(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      if (productsData.length > 0) setProductList(productsData);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  const toggleStock = async (id: string, currentStock: boolean) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, { inStock: !currentStock });
      setProductList(productList.map(p => p.id === id ? { ...p, inStock: !currentStock } : p));
    } catch (error) {
      alert("Error updating stock. (Mock products from the initial array cannot be updated in the DB)");
    }
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        setProductList(productList.filter(p => p.id !== id));
      } catch (error) {
        alert("Error deleting product. (Mock products cannot be deleted from the DB)");
      }
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const productData = {
        ...newProduct,
        price: Number(newProduct.price)
      };
      const docRef = await addDoc(collection(db, "products"), productData);
      setProductList([...productList, { id: docRef.id, ...productData } as Product]);
      setIsAddModalOpen(false);
      setNewProduct({ name: '', category: categories.filter(c => c !== 'All')[0], price: '', image: '', description: '', inStock: true });
    } catch (error) {
      console.error("Error adding product", error);
      alert("Error adding product. Ensure Firebase Firestore rules allow writes.");
    }
    setIsSubmitting(false);
  };

  const navItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'products', icon: <Package size={20} />, label: 'Products' },
    { id: 'categories', icon: <Tag size={20} />, label: 'Categories' },
    { id: 'testimonials', icon: <Users size={20} />, label: 'Testimonials' },
    { id: 'gallery', icon: <ImageIcon size={20} />, label: 'Gallery' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Site Settings' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-garet-cream flex items-center justify-center font-sans p-6">
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm max-w-md w-full border border-garet-border">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-garet-black">GARET<span className="text-garet-gold rounded">.</span> ADMIN</h1>
            <p className="font-poppins text-xs uppercase tracking-widest opacity-60 mt-2">Sign in to continue</p>
          </div>
          {authError && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4 font-poppins">{authError}</div>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Email</label>
              <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full border-b border-garet-black/20 pb-2 bg-transparent focus:outline-none focus:border-garet-gold transition-colors font-poppins text-sm" />
            </div>
            <div>
              <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Password</label>
              <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full border-b border-garet-black/20 pb-2 bg-transparent focus:outline-none focus:border-garet-gold transition-colors font-poppins text-sm" />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-garet-black text-white text-sm font-poppins uppercase tracking-widest hover:bg-garet-gold transition-colors mt-8 disabled:opacity-50">
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

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

        <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 mt-auto text-sm uppercase tracking-widest hover:text-red-400 transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 md:p-12 overflow-x-hidden md:h-screen overflow-y-auto">
        <h1 className="font-serif text-3xl mb-2 text-garet-black capitalize">{activeTab}</h1>
        <p className="font-poppins opacity-60 text-sm mb-12">Firebase connected admin panel. Logged in as {user.email}</p>

        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-2xl">Manage Products</h2>
              <button 
                onClick={() => setIsAddModalOpen(true)}
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
                            onClick={() => toggleStock(product.id, product.inStock)}
                            className={clsx(
                              "px-3 py-1 text-xs uppercase tracking-widest rounded-full border flex items-center w-max transition-colors hover:opacity-80",
                              product.inStock ? "text-green-600 border-green-600 bg-green-50" : "text-gray-500 border-gray-500 bg-gray-100"
                            )}
                          >
                            {product.inStock ? <><CheckCircle size={12} className="mr-1"/> In Stock</> : <><XCircle size={12} className="mr-1"/> Sold Out</>}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => alert('Mock: Edit product UI not implemented yet.')} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors inline-block text-center"><Edit size={16} /></button>
                          <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors inline-block text-center"><Trash2 size={16} /></button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            
            {/* Add Product Modal */}
            {isAddModalOpen && (
              <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
                <div className="bg-white rounded-[2rem] p-8 md:p-12 max-w-xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="font-serif text-2xl text-garet-wood font-bold">Add New Product</h2>
                    <button onClick={() => setIsAddModalOpen(false)} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleAddProduct} className="space-y-6">
                    <div>
                      <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Product Name</label>
                      <input required type="text" className="w-full border-b border-garet-black/20 pb-2 bg-transparent focus:outline-none focus:border-garet-gold font-poppins text-sm transition-colors" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. Milano Velvet Sofa" />
                    </div>
                    <div>
                      <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Category</label>
                      <select className="w-full border-b border-garet-black/20 pb-2 bg-transparent focus:outline-none focus:border-garet-gold font-poppins text-sm transition-colors" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                        {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Price (NGN)</label>
                      <input required type="number" className="w-full border-b border-garet-black/20 pb-2 bg-transparent focus:outline-none focus:border-garet-gold font-poppins text-sm transition-colors" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} placeholder="e.g. 450000" />
                    </div>
                    <div>
                      <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Image URL</label>
                      <input required type="url" className="w-full border-b border-garet-black/20 pb-2 bg-transparent focus:outline-none focus:border-garet-gold font-poppins text-sm transition-colors" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} placeholder="https://..." />
                    </div>
                    <div>
                      <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Description</label>
                      <textarea required className="w-full border border-garet-black/20 rounded p-3 bg-transparent focus:outline-none focus:border-garet-gold font-poppins text-sm transition-colors resize-none" rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder="Detailed product description..." />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-garet-black text-white text-sm font-poppins uppercase tracking-widest hover:bg-garet-gold transition-colors mt-4 disabled:opacity-50">
                      {isSubmitting ? 'Saving...' : 'Save Product'}
                    </button>
                  </form>
                </div>
              </div>
            )}
            
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


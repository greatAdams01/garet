import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../data/products';
import { Edit, Trash2, Plus, Image as ImageIcon, CheckCircle, XCircle, LogOut, Menu, X, Package, Tag, Users, Settings } from 'lucide-react';
import clsx from 'clsx';
import { auth, db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, setDoc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // States
  const [productList, setProductList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<{id: string, name: string}[]>([]);
  const [galleryList, setGalleryList] = useState<{id: string, image: string, title: string}[]>([]);
  const [testimonialList, setTestimonialList] = useState<{id: string, text: string, author: string}[]>([]);
  const [siteSettings, setSiteSettings] = useState({ heroTitle: '', heroSubtitle: '', heroImage: '' });

  // Modals & Forms
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ name: '', category: '', price: '', description: '', inStock: true });

  // Category
  const [newCategoryName, setNewCategoryName] = useState('');

  // Gallery
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({ title: '' });

  // Testimonials
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<{id: string, text: string, author: string} | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({ text: '', author: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchAllData();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [pSnap, cSnap, gSnap, tSnap, sSnap] = await Promise.all([
        getDocs(collection(db, "products")),
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "gallery")),
        getDocs(collection(db, "testimonials")),
        getDoc(doc(db, "settings", "global"))
      ]);

      setProductList(pSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      setCategoriesList(cSnap.docs.map(d => ({ id: d.id, name: d.data().name })));
      setGalleryList(gSnap.docs.map(d => ({ id: d.id, image: d.data().image, title: d.data().title })));
      setTestimonialList(tSnap.docs.map(d => ({ id: d.id, text: d.data().text, author: d.data().author })));
      
      if (sSnap.exists()) {
        setSiteSettings(sSnap.data() as any);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
    setIsLoading(false);
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'hmintonx');
    const res = await fetch('https://api.cloudinary.com/v1_1/dwm0mh9di/image/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Cloudinary upload failed');
    const data = await res.json();
    return data.secure_url;
  };

  const transformUrl = (url: string, cropStr: string = 'c_fill,w_800,h_600') => {
    const parts = url.split('/upload/');
    return `${parts[0]}/upload/${cropStr}/${parts[1]}`;
  };

  // --- Auth ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setAuthError('');
    } catch (error: any) {
      setAuthError('Invalid credentials.');
    }
    setIsSubmitting(false);
  };

  const handleLogout = async () => signOut(auth);

  // --- Products ---
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct && !imageFile) return alert('Please select an image file to upload.');
    setIsSubmitting(true);
    try {
      let imageUrl = editingProduct ? editingProduct.image : '';
      if (imageFile) {
        const rawUrl = await uploadToCloudinary(imageFile);
        imageUrl = transformUrl(rawUrl, 'c_fill,w_800,h_600');
      }

      const pData = {
        ...productForm,
        price: Number(productForm.price),
        image: imageUrl
      };

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), pData);
        setProductList(productList.map(p => p.id === editingProduct.id ? { ...p, ...pData } : p));
      } else {
        const docRef = await addDoc(collection(db, "products"), pData);
        setProductList([...productList, { id: docRef.id, ...pData } as Product]);
      }
      closeProductModal();
    } catch (err) {
      alert("Error saving product.");
    }
    setIsSubmitting(false);
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm("Delete this product?")) {
      await deleteDoc(doc(db, "products", id));
      setProductList(productList.filter(p => p.id !== id));
    }
  };

  const toggleStock = async (id: string, currentStock: boolean) => {
    await updateDoc(doc(db, "products", id), { inStock: !currentStock });
    setProductList(productList.map(p => p.id === id ? { ...p, inStock: !currentStock } : p));
  };

  const openProductModal = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setProductForm({ name: p.name, category: p.category, price: String(p.price), description: p.description, inStock: p.inStock });
    } else {
      setEditingProduct(null);
      setProductForm({ name: '', category: categoriesList[0]?.name || '', price: '', description: '', inStock: true });
    }
    setImageFile(null);
    setIsProductModalOpen(true);
  };
  const closeProductModal = () => setIsProductModalOpen(false);

  // --- Categories ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, "categories"), { name: newCategoryName });
      setCategoriesList([...categoriesList, { id: docRef.id, name: newCategoryName }]);
      setNewCategoryName('');
    } catch(err) { alert("Error adding category"); }
    setIsSubmitting(false);
  };
  const deleteCategory = async (id: string) => {
    if (window.confirm("Delete this category?")) {
      await deleteDoc(doc(db, "categories", id));
      setCategoriesList(categoriesList.filter(c => c.id !== id));
    }
  };

  // --- Settings ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl = siteSettings.heroImage;
      if (imageFile) {
        const rawUrl = await uploadToCloudinary(imageFile);
        imageUrl = transformUrl(rawUrl, 'q_auto,f_auto'); 
      }
      const data = { ...siteSettings, heroImage: imageUrl };
      await setDoc(doc(db, "settings", "global"), data);
      setSiteSettings(data);
      setImageFile(null);
      alert('Settings saved!');
    } catch(err) { alert("Error saving settings"); }
    setIsSubmitting(false);
  };

  // --- Gallery ---
  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert("Select an image");
    setIsSubmitting(true);
    try {
      const rawUrl = await uploadToCloudinary(imageFile);
      const imageUrl = transformUrl(rawUrl, 'c_fill,w_800,h_800'); 
      const data = { image: imageUrl, title: galleryForm.title };
      const docRef = await addDoc(collection(db, "gallery"), data);
      setGalleryList([...galleryList, { id: docRef.id, ...data }]);
      setIsGalleryModalOpen(false);
      setGalleryForm({ title: '' });
      setImageFile(null);
    } catch(err) { alert("Error adding gallery image"); }
    setIsSubmitting(false);
  };
  const deleteGallery = async (id: string) => {
    if (window.confirm("Delete this image?")) {
      await deleteDoc(doc(db, "gallery", id));
      setGalleryList(galleryList.filter(g => g.id !== id));
    }
  };

  // --- Testimonials ---
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingTestimonial) {
        await updateDoc(doc(db, "testimonials", editingTestimonial.id), testimonialForm);
        setTestimonialList(testimonialList.map(t => t.id === editingTestimonial.id ? { ...t, ...testimonialForm } : t));
      } else {
        const docRef = await addDoc(collection(db, "testimonials"), testimonialForm);
        setTestimonialList([...testimonialList, { id: docRef.id, ...testimonialForm }]);
      }
      setIsTestimonialModalOpen(false);
    } catch(err) { alert("Error saving testimonial"); }
    setIsSubmitting(false);
  };
  const deleteTestimonial = async (id: string) => {
    if (window.confirm("Delete this testimonial?")) {
      await deleteDoc(doc(db, "testimonials", id));
      setTestimonialList(testimonialList.filter(t => t.id !== id));
    }
  };
  const openTestimonialModal = (t?: any) => {
    if (t) {
      setEditingTestimonial(t);
      setTestimonialForm({ text: t.text, author: t.author });
    } else {
      setEditingTestimonial(null);
      setTestimonialForm({ text: '', author: '' });
    }
    setIsTestimonialModalOpen(true);
  };

  const navItems = [
    { id: 'products', icon: <Package size={20} />, label: 'Products' },
    { id: 'categories', icon: <Tag size={20} />, label: 'Categories' },
    { id: 'gallery', icon: <ImageIcon size={20} />, label: 'Gallery' },
    { id: 'testimonials', icon: <Users size={20} />, label: 'Testimonials' },
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

  const formatPrice = (price: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row pt-20 md:pt-0">
      <div className="md:hidden fixed top-0 left-0 w-full bg-garet-black text-white p-4 flex justify-between items-center z-40">
        <div className="font-serif text-xl tracking-widest font-bold">GARET ADMIN</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X /> : <Menu />}</button>
      </div>

      <div className={clsx("fixed md:sticky top-0 left-0 h-screen bg-garet-black text-garet-cream w-64 p-6 flex flex-col z-30 transition-transform duration-300 md:translate-x-0 pt-24 md:pt-6", isMobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="hidden md:block font-serif text-2xl tracking-widest font-bold mb-12 border-b border-garet-cream/20 pb-6">
          GARET<span className="text-garet-gold rounded">.</span> ADMIN
        </div>
        <nav className="flex-grow space-y-2">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} className={clsx("w-full flex items-center space-x-3 px-4 py-3 rounded text-sm uppercase tracking-widest transition-colors text-left", activeTab === item.id ? "bg-garet-gold text-white" : "hover:bg-garet-cream/10")}>
              {item.icon}<span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 mt-auto text-sm uppercase tracking-widest hover:text-red-400 transition-colors">
          <LogOut size={20} /><span>Logout</span>
        </button>
      </div>

      <div className="flex-grow p-6 md:p-12 overflow-x-hidden md:h-screen overflow-y-auto">
        <h1 className="font-serif text-3xl mb-2 text-garet-black capitalize">{activeTab}</h1>
        <p className="font-poppins opacity-60 text-sm mb-12">Firebase connected admin panel. Logged in as {user.email}</p>

        {isLoading ? (
           <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-garet-gold"></div></div>
        ) : (
          <>
            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-serif text-2xl">Manage Products</h2>
                  <button onClick={() => openProductModal()} className="bg-garet-black text-white px-4 py-2 text-sm font-poppins uppercase tracking-widest flex items-center hover:bg-garet-gold transition-colors">
                    <Plus size={16} className="mr-2" /> Add Product
                  </button>
                </div>
                <div className="bg-white rounded shadow-sm border border-black/5 overflow-x-auto min-h-[300px]">
                  <table className="w-full text-left font-poppins text-sm whitespace-nowrap">
                    <thead className="bg-gray-100 uppercase text-xs tracking-widest opacity-60">
                      <tr>
                        <th className="p-4">Image</th><th className="p-4">Name</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Stock Status</th><th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {productList.length === 0 ? (
                          <tr><td colSpan={6} className="p-8 text-center text-gray-500">No products found. Add your first product!</td></tr>
                        ) : productList.map((product) => (
                          <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="p-4"><img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded bg-gray-200" /></td>
                            <td className="p-4 font-medium">{product.name}</td>
                            <td className="p-4 opacity-70">{product.category}</td>
                            <td className="p-4">{formatPrice(product.price)}</td>
                            <td className="p-4">
                              <button onClick={() => toggleStock(product.id, product.inStock)} className={clsx("px-3 py-1 text-xs uppercase tracking-widest rounded-full border flex items-center w-max transition-colors hover:opacity-80", product.inStock ? "text-green-600 border-green-600 bg-green-50" : "text-gray-500 border-gray-500 bg-gray-100")}>
                                {product.inStock ? <><CheckCircle size={12} className="mr-1"/> In Stock</> : <><XCircle size={12} className="mr-1"/> Sold Out</>}
                              </button>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button onClick={() => openProductModal(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors inline-block"><Edit size={16} /></button>
                              <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors inline-block"><Trash2 size={16} /></button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* CATEGORIES TAB */}
            {activeTab === 'categories' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-serif text-2xl">Manage Categories</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white rounded p-6 shadow-sm border border-garet-border">
                    <h3 className="font-serif text-lg mb-4">Add New Category</h3>
                    <form onSubmit={handleAddCategory} className="flex gap-4">
                      <input required type="text" value={newCategoryName} onChange={e=>setNewCategoryName(e.target.value)} placeholder="e.g. Living Room" className="flex-1 border-b border-garet-black/20 pb-2 focus:outline-none focus:border-garet-gold font-poppins text-sm" />
                      <button disabled={isSubmitting} type="submit" className="bg-garet-black text-white px-4 py-2 text-xs font-poppins uppercase tracking-widest disabled:opacity-50 hover:bg-garet-gold transition-colors">Add</button>
                    </form>
                  </div>
                  <div className="bg-white rounded p-6 shadow-sm border border-garet-border">
                    <h3 className="font-serif text-lg mb-4">Existing Categories</h3>
                    <ul className="space-y-3">
                      {categoriesList.map(c => (
                        <li key={c.id} className="flex justify-between items-center font-poppins text-sm border-b pb-2">
                          {c.name}
                          <button onClick={() => deleteCategory(c.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16}/></button>
                        </li>
                      ))}
                      {categoriesList.length === 0 && <li className="text-gray-400 text-sm italic">No categories yet.</li>}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* GALLERY TAB */}
            {activeTab === 'gallery' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-serif text-2xl">Manage Gallery</h2>
                  <button onClick={() => setIsGalleryModalOpen(true)} className="bg-garet-black text-white px-4 py-2 text-sm font-poppins uppercase tracking-widest flex items-center hover:bg-garet-gold transition-colors">
                    <Plus size={16} className="mr-2" /> Add Image
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {galleryList.map(g => (
                    <div key={g.id} className="relative group rounded overflow-hidden shadow-sm aspect-square">
                      <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-white p-4 text-center">
                        <span className="font-serif mb-3">{g.title}</span>
                        <button onClick={() => deleteGallery(g.id)} className="bg-red-500 hover:bg-red-600 p-2 rounded-full"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                  {galleryList.length === 0 && <p className="text-gray-400 text-sm col-span-4">No gallery images added yet.</p>}
                </div>
              </motion.div>
            )}

            {/* TESTIMONIALS TAB */}
            {activeTab === 'testimonials' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-serif text-2xl">Manage Testimonials</h2>
                  <button onClick={() => openTestimonialModal()} className="bg-garet-black text-white px-4 py-2 text-sm font-poppins uppercase tracking-widest flex items-center hover:bg-garet-gold transition-colors">
                    <Plus size={16} className="mr-2" /> Add Review
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {testimonialList.map(t => (
                    <div key={t.id} className="bg-white p-6 rounded shadow-sm border border-garet-border relative">
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={() => openTestimonialModal(t)} className="text-blue-500"><Edit size={16}/></button>
                        <button onClick={() => deleteTestimonial(t.id)} className="text-red-500"><Trash2 size={16}/></button>
                      </div>
                      <p className="font-poppins text-sm italic mb-4 mt-6">"{t.text}"</p>
                      <p className="font-sans font-bold text-xs uppercase text-garet-gold">- {t.author}</p>
                    </div>
                  ))}
                  {testimonialList.length === 0 && <p className="text-gray-400 text-sm col-span-3">No testimonials added yet.</p>}
                </div>
              </motion.div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl bg-white rounded p-8 border border-garet-border shadow-sm">
                <h2 className="font-serif text-2xl mb-8">Homepage Settings</h2>
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div>
                    <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Hero Title</label>
                    <input type="text" value={siteSettings.heroTitle} onChange={e=>setSiteSettings({...siteSettings, heroTitle: e.target.value})} className="w-full border-b border-garet-black/20 pb-2 bg-transparent focus:outline-none focus:border-garet-gold font-poppins text-sm" placeholder="e.g. Elegant Furniture..." />
                  </div>
                  <div>
                    <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Hero Subtitle</label>
                    <input type="text" value={siteSettings.heroSubtitle} onChange={e=>setSiteSettings({...siteSettings, heroSubtitle: e.target.value})} className="w-full border-b border-garet-black/20 pb-2 bg-transparent focus:outline-none focus:border-garet-gold font-poppins text-sm" placeholder="e.g. Designed For Your Space." />
                  </div>
                  <div>
                    <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Hero Background Image</label>
                    {siteSettings.heroImage && <img src={siteSettings.heroImage} alt="Current hero" className="h-24 w-48 object-cover rounded mb-4" />}
                    <input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files?.[0]||null)} className="font-poppins text-sm" />
                    <p className="text-[10px] uppercase mt-2 opacity-50">Upload a high-res image (1920x1080 recommended).</p>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="py-3 px-8 bg-garet-black text-white text-sm font-poppins uppercase tracking-widest hover:bg-garet-gold transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Save Settings'}
                  </button>
                </form>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* MODALS */}
      {/* Product Modal */}
      <AnimatePresence>
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-2xl text-garet-wood font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={closeProductModal} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div>
                <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Product Name</label>
                <input required type="text" className="w-full border-b border-garet-black/20 pb-2 bg-transparent focus:outline-none focus:border-garet-gold font-poppins text-sm" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Category</label>
                <select required className="w-full border-b border-garet-black/20 pb-2 bg-transparent focus:outline-none focus:border-garet-gold font-poppins text-sm" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                  <option value="" disabled>Select a category</option>
                  {categoriesList.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Price (NGN)</label>
                <input required type="number" className="w-full border-b border-garet-black/20 pb-2 bg-transparent focus:outline-none focus:border-garet-gold font-poppins text-sm" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Product Image {editingProduct && '(Leave blank to keep current)'}</label>
                <input type="file" accept="image/*" required={!editingProduct} className="w-full border-b border-garet-black/20 pb-2 bg-transparent focus:outline-none focus:border-garet-gold font-poppins text-sm" onChange={e => setImageFile(e.target.files?.[0] || null)} />
              </div>
              <div>
                <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Description</label>
                <textarea required className="w-full border border-garet-black/20 rounded p-3 bg-transparent focus:outline-none focus:border-garet-gold font-poppins text-sm resize-none" rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-garet-black text-white text-sm font-poppins uppercase tracking-widest hover:bg-garet-gold transition-colors mt-4 disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
      </AnimatePresence>

      {/* Gallery Modal */}
      <AnimatePresence>
      {isGalleryModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-2xl font-bold">Add Gallery Image</h2>
              <button onClick={()=>setIsGalleryModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddGallery} className="space-y-6">
              <div>
                <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Image File</label>
                <input required type="file" accept="image/*" onChange={e=>setImageFile(e.target.files?.[0]||null)} className="font-poppins text-sm" />
              </div>
              <div>
                <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Title (Optional)</label>
                <input type="text" value={galleryForm.title} onChange={e=>setGalleryForm({title: e.target.value})} className="w-full border-b border-black/20 pb-2 focus:outline-none focus:border-garet-gold font-poppins text-sm" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-garet-black text-white uppercase tracking-widest text-sm hover:bg-garet-gold transition-colors disabled:opacity-50">
                {isSubmitting ? 'Uploading...' : 'Save Image'}
              </button>
            </form>
          </div>
        </div>
      )}
      </AnimatePresence>

      {/* Testimonial Modal */}
      <AnimatePresence>
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-2xl font-bold">{editingTestimonial ? 'Edit Review' : 'Add Review'}</h2>
              <button onClick={()=>setIsTestimonialModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveTestimonial} className="space-y-6">
              <div>
                <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Review Text</label>
                <textarea required rows={4} value={testimonialForm.text} onChange={e=>setTestimonialForm({...testimonialForm, text: e.target.value})} className="w-full border border-black/20 rounded p-2 focus:outline-none focus:border-garet-gold font-poppins text-sm resize-none" />
              </div>
              <div>
                <label className="block text-xs font-poppins uppercase tracking-widest opacity-60 mb-2">Author Name</label>
                <input required type="text" value={testimonialForm.author} onChange={e=>setTestimonialForm({...testimonialForm, author: e.target.value})} className="w-full border-b border-black/20 pb-2 focus:outline-none focus:border-garet-gold font-poppins text-sm" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-garet-black text-white uppercase tracking-widest text-sm hover:bg-garet-gold transition-colors disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save Review'}
              </button>
            </form>
          </div>
        </div>
      )}
      </AnimatePresence>

    </div>
  );
}

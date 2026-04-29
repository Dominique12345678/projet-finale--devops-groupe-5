import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Package, Tag, Image as ImageIcon, Edit2, X, CheckCircle } from 'lucide-react';
import API_URL from '../../apiConfig';
import { useTheme } from '../../context/ThemeContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: '', image_url: '', stock: '0'
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const { theme } = useTheme();

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => { 
    fetchProducts(); 
    fetchCategories();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL.replace('/api', '')}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm({ ...form, image_url: response.data.url });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erreur lors du téléchargement de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (parseInt(form.stock) < 0) {
        showToast("Le stock doit être supérieur ou égal à zéro", 'error');
        return;
      }
      
      const productData = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock)
      };

      if (editingId) {
        await axios.put(`${API_URL}/products/${editingId}`, productData);
        showToast("Produit mis à jour avec succès !");
      } else {
        await axios.post(`${API_URL}/products`, productData);
        showToast("Produit ajouté avec succès !");
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ name: '', description: '', price: '', category: '', image_url: '', stock: '0' });
      fetchProducts();
    } catch (error) {
      showToast("Erreur lors de l'enregistrement du produit", 'error');
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image_url: product.image_url,
      stock: product.stock.toString()
    });
    setEditingId(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      setProductToDelete(null);
      fetchProducts();
      showToast("Produit supprimé avec succès !");
    } catch (error) {
      showToast("Erreur lors de la suppression", 'error');
    }
  };

  return (
    <div className={`space-y-8 transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`${notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border-2 border-white/20 backdrop-blur-md`}>
            <CheckCircle size={20} />
            {notification.message}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Gestion des <span className="text-blue-500">Produits</span>
        </h1>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              setEditingId(null);
              setForm({ name: '', description: '', price: '', category: '', image_url: '', stock: '0' });
            }
          }}
          className={`${showForm ? 'bg-gray-100 text-gray-600' : 'bg-blue-600 text-white'} px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-100`}
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Annuler' : 'Nouveau Produit'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`backdrop-blur-md p-8 rounded-[32px] border grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 shadow-2xl transition-colors duration-500 ${
          theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
        }`}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-1">Nom du produit</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
                }`} placeholder="ex: MacBook Pro" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-1">Description</label>
              <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] text-white placeholder:text-gray-600" placeholder="Description détaillée..." />
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">Prix (F CFA)</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs uppercase">FCFA</div>
                  <input type="number" step="1" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full pl-14 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">Stock</label>
                <input type="number" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-1">Catégorie</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <select 
                  required 
                  value={form.category} 
                  onChange={e => setForm({...form, category: e.target.value})} 
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none cursor-pointer [&>option]:bg-[#030303] [&>option]:text-white"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Image du produit (Upload local ou Drag & Drop)</label>
              <div 
                className={`relative border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center gap-2 ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                } ${form.image_url ? 'bg-gray-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-xs text-gray-500">Téléchargement...</p>
                  </div>
                ) : form.image_url ? (
                  <div className="relative w-full h-32 flex items-center justify-center">
                    <img src={form.image_url} alt="Preview" className="h-full object-contain rounded-lg" />
                    <button 
                      type="button" 
                      onClick={() => setForm({...form, image_url: ''})}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="text-gray-400" size={30} />
                    <p className="text-xs text-gray-500 text-center">
                      Glissez une image ici ou <label className="text-blue-600 cursor-pointer font-bold hover:underline">cliquez pour parcourir
                        <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files && handleFileUpload(e.target.files[0])} />
                      </label>
                    </p>
                  </>
                )}
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              Enregistrer le produit
            </button>
          </div>
        </form>
      )}

      {/* Table Section */}
      <div className={`backdrop-blur-md rounded-[32px] border overflow-hidden shadow-2xl transition-colors duration-500 ${
        theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
      }`}>
        <table className="w-full text-left">
          <thead className={`border-b transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
            <tr>
              <th className="p-5 font-black text-gray-400 uppercase text-xs tracking-widest">Produit</th>
              <th className="p-5 font-black text-gray-400 uppercase text-xs tracking-widest">Catégorie</th>
              <th className="p-5 font-black text-gray-400 uppercase text-xs tracking-widest">Prix</th>
              <th className="p-5 font-black text-gray-400 uppercase text-xs tracking-widest">Stock</th>
              <th className="p-5 font-black text-gray-400 uppercase text-xs tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y transition-colors ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
            {products.map(product => (
              <tr key={product.id} className={`transition-colors group ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                <td className="p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl overflow-hidden border transition-all group-hover:scale-110 ${
                    theme === 'dark' ? 'bg-white/10 border-white/10' : 'bg-gray-100 border-gray-200'
                  }`}>
                    <img src={product.image_url || 'https://via.placeholder.com/40'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className={`font-black transition-colors ${theme === 'dark' ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'}`}>{product.name}</span>
                </td>
                <td className="p-5">
                  <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black border border-blue-500/20 uppercase tracking-tighter">{product.category}</span>
                </td>
                <td className={`p-5 font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{product.price.toLocaleString()} FCFA</td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${product.stock > 0 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {product.stock} DISPO
                  </span>
                </td>
                <td className="p-5 text-right space-x-2">
                  <button onClick={() => handleEdit(product)} className={`p-2.5 rounded-xl transition-all ${theme === 'dark' ? 'text-blue-400 hover:bg-blue-500/20' : 'text-blue-600 hover:bg-blue-50'}`}>
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => setProductToDelete(product.id)} className={`p-2.5 rounded-xl transition-all ${theme === 'dark' ? 'text-red-400 hover:bg-red-500/20' : 'text-red-600 hover:bg-red-50'}`}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className={`p-8 rounded-[40px] shadow-2xl max-w-sm w-full text-center border animate-in zoom-in-95 duration-200 ${
            theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-200'
          }`}>
            <div className="bg-red-500/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <Trash2 size={48} className="text-red-500" />
            </div>
            <h3 className={`text-2xl font-black mb-4 tracking-tight uppercase ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Supprimer ?</h3>
            <p className={`mb-8 leading-relaxed font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.</p>
            <div className="flex gap-4">
              <button onClick={() => setProductToDelete(null)} className={`flex-1 px-6 py-4 rounded-2xl font-black transition-all ${
                theme === 'dark' ? 'bg-white/5 text-gray-500 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>Annuler</button>
              <button onClick={() => handleDelete(productToDelete)} className="flex-1 px-6 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Package, Tag, Image as ImageIcon, Edit2, X, CheckCircle } from 'lucide-react';

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

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/categories`);
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
      const response = await axios.post(`${apiUrl.replace('/api', '')}/api/upload`, formData, {
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
        await axios.put(`${apiUrl}/products/${editingId}`, productData);
        showToast("Produit mis à jour avec succès !");
      } else {
        await axios.post(`${apiUrl}/products`, productData);
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
      await axios.delete(`${apiUrl}/products/${id}`);
      setProductToDelete(null);
      fetchProducts();
      showToast("Produit supprimé avec succès !");
    } catch (error) {
      showToast("Erreur lors de la suppression", 'error');
    }
  };

  return (
    <div className="space-y-8 text-gray-900">
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
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
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
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nom du produit</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="ex: MacBook Pro" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
              <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] text-gray-900" placeholder="Description détaillée..." />
            </div>
          </div>
          <div className="space-y-4 text-gray-900">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Prix (F CFA)</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">FCFA</div>
                  <input type="number" step="1" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full pl-14 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Stock</label>
                <input type="number" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Catégorie</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  required 
                  value={form.category} 
                  onChange={e => setForm({...form, category: e.target.value})} 
                  className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none text-gray-900"
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
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
              Enregistrer le produit
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-bold text-gray-600">Produit</th>
              <th className="p-4 font-bold text-gray-600">Catégorie</th>
              <th className="p-4 font-bold text-gray-600">Prix</th>
              <th className="p-4 font-bold text-gray-600">Stock</th>
              <th className="p-4 font-bold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={product.image_url || 'https://via.placeholder.com/40'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-bold text-gray-900">{product.name}</span>
                </td>
                <td className="p-4 text-gray-600 text-sm">{product.category}</td>
                <td className="p-4 font-bold">{product.price.toLocaleString()} F CFA</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.stock} en stock
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleEdit(product)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                    <Edit2 size={20} />
                  </button>
                  <button onClick={() => setProductToDelete(product.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white p-8 rounded-[32px] shadow-2xl max-w-sm w-full text-center border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="bg-red-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Trash2 size={40} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Supprimer ?</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.</p>
            <div className="flex gap-4">
              <button onClick={() => setProductToDelete(null)} className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">Annuler</button>
              <button onClick={() => handleDelete(productToDelete)} className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;

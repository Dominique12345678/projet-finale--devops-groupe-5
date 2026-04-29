import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, Tag, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import API_URL from '../../apiConfig';

interface Category { id: number; name: string; description: string; }

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<number | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const { theme } = useTheme();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchCategories = () => {
    axios.get(`${API_URL}/categories`).then(res => setCategories(res.data));
  };

  useEffect(fetchCategories, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      axios.put(`${API_URL}/categories/${editingId}`, { name: newName }).then(() => {
        setNewName('');
        setEditingId(null);
        fetchCategories();
        showToast("Catégorie modifiée avec succès !");
      }).catch(() => showToast("Erreur lors de la modification", 'error'));
    } else {
      axios.post(`${API_URL}/categories`, { name: newName }).then(() => {
        setNewName('');
        fetchCategories();
        showToast("Catégorie ajoutée avec succès !");
      }).catch(() => showToast("Erreur lors de l'ajout", 'error'));
    }
  };

  const handleEdit = (cat: Category) => {
    setNewName(cat.name);
    setEditingId(cat.id);
  };

  const handleDelete = (id: number) => {
    axios.delete(`${API_URL}/categories/${id}`).then(() => {
      setShowConfirm(null);
      fetchCategories();
      showToast("Catégorie supprimée !");
    }).catch(() => showToast("Erreur lors de la suppression", 'error'));
  };

  return (
    <div className={`backdrop-blur-md p-8 rounded-[40px] border shadow-2xl relative overflow-hidden transition-colors duration-500 ${
      theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
    }`}>
      {/* Background Glow (Dark mode only) */}
      {theme === 'dark' && <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px] -z-10 rounded-full"></div>}
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`${notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-black border-2 border-white/20 backdrop-blur-md`}>
            <CheckCircle size={20} />
            {notification.message}
          </div>
        </div>
      )}

      <h2 className={`text-3xl font-black mb-8 tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20 text-white">
          <Tag size={24} />
        </div>
        Gestion des <span className="text-blue-500">Catégories</span>
      </h2>
      
      <form onSubmit={handleSubmit} className="flex gap-4 mb-10">
        <div className="relative flex-1">
          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nom de la catégorie..."
            className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-colors ${
              theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
            }`}
            required
          />
        </div>
        <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
          {editingId ? 'Modifier' : 'Ajouter'}
        </button>
        {editingId && (
          <button 
            type="button" 
            onClick={() => { setEditingId(null); setNewName(''); }}
            className={`px-8 py-4 rounded-2xl font-black border transition-all ${
              theme === 'dark' ? 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
            }`}
          >
            Annuler
          </button>
        )}
      </form>

      <div className={`rounded-[32px] border overflow-hidden transition-colors duration-500 ${
        theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
      }`}>
        <table className="w-full">
          <thead>
            <tr className={`text-left transition-colors ${theme === 'dark' ? 'bg-white/5' : 'bg-white border-b border-gray-100'}`}>
              <th className="p-5 text-gray-400 font-black uppercase text-xs tracking-widest">Nom de la Catégorie</th>
              <th className="p-5 text-gray-400 font-black uppercase text-xs tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y transition-colors ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-5 font-black text-white group-hover:text-blue-400 transition-colors">{cat.name}</td>
                <td className="p-5 text-right space-x-2">
                  <button 
                    onClick={() => handleEdit(cat)}
                    className="text-blue-400 hover:bg-blue-500/20 p-2.5 rounded-xl transition-all inline-flex items-center gap-2 group/btn"
                  >
                    <Edit2 size={18} />
                    <span className="text-xs font-black uppercase tracking-tighter">Modifier</span>
                  </button>
                  <button 
                    onClick={() => setShowConfirm(cat.id)}
                    className="text-red-400 hover:bg-red-500/20 p-2.5 rounded-xl transition-all inline-flex items-center gap-2 group/btn"
                  >
                    <Trash2 size={18} />
                    <span className="text-xs font-black uppercase tracking-tighter">Supprimer</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className={`p-8 rounded-[40px] shadow-2xl max-w-sm w-full text-center border animate-in zoom-in-95 duration-200 ${
            theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-200'
          }`}>
            <div className="bg-red-500/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <AlertCircle size={48} className="text-red-500" />
            </div>
            <h3 className={`text-2xl font-black mb-4 tracking-tight uppercase ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Supprimer ?</h3>
            <p className={`mb-8 leading-relaxed font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Voulez-vous vraiment supprimer cette catégorie ? Cette action est irréversible.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowConfirm(null)} className={`flex-1 px-6 py-4 rounded-2xl font-black transition-all ${
                theme === 'dark' ? 'bg-white/5 text-gray-500 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>Annuler</button>
              <button onClick={() => handleDelete(showConfirm)} className="flex-1 px-6 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;

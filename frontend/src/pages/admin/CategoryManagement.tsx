import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, Tag, Trash2, Edit2, AlertCircle } from 'lucide-react';

interface Category { id: number; name: string; description: string; }

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<number | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchCategories = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    axios.get(`${apiUrl}/categories`).then(res => setCategories(res.data));
  };

  useEffect(fetchCategories, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    
    if (editingId) {
      axios.put(`${apiUrl}/categories/${editingId}`, { name: newName }).then(() => {
        setNewName('');
        setEditingId(null);
        fetchCategories();
        showToast("Catégorie modifiée avec succès !");
      }).catch(() => showToast("Erreur lors de la modification", 'error'));
    } else {
      axios.post(`${apiUrl}/categories`, { name: newName }).then(() => {
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
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    axios.delete(`${apiUrl}/categories/${id}`).then(() => {
      setShowConfirm(null);
      fetchCategories();
      showToast("Catégorie supprimée !");
    }).catch(() => showToast("Erreur lors de la suppression", 'error'));
  };

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 text-gray-900">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`${notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border-2 border-white/20 backdrop-blur-md`}>
            <CheckCircle size={20} />
            {notification.message}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-black mb-6 text-gray-900">Gestion des Catégories</h2>
      
      <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nom de la catégorie..."
            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            required
          />
        </div>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
          {editingId ? 'Modifier' : 'Ajouter'}
        </button>
        {editingId && (
          <button 
            type="button" 
            onClick={() => { setEditingId(null); setNewName(''); }}
            className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-200"
          >
            Annuler
          </button>
        )}
      </form>

      <table className="w-full">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-4 text-gray-600">Nom</th>
            <th className="p-4 text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id} className="border-t hover:bg-gray-50/50 transition-colors">
              <td className="p-4 font-bold text-gray-900">{cat.name}</td>
              <td className="p-4 text-right space-x-2">
                <button 
                  onClick={() => handleEdit(cat)}
                  className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex items-center gap-1"
                >
                  <Edit2 size={18} />
                  <span className="text-sm">Modifier</span>
                </button>
                <button 
                  onClick={() => setShowConfirm(cat.id)}
                  className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex items-center gap-1"
                >
                  <Trash2 size={18} />
                  <span className="text-sm">Supprimer</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white p-8 rounded-[32px] shadow-2xl max-w-sm w-full text-center border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="bg-red-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Supprimer ?</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">Voulez-vous vraiment supprimer cette catégorie ? Cette action est irréversible.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowConfirm(null)} className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">Annuler</button>
              <button onClick={() => handleDelete(showConfirm)} className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;

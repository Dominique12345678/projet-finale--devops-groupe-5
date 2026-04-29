import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Save, Trash2, AlertCircle } from 'lucide-react';
import API_URL from '../apiConfig';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const [user, setUser] = useState({ email: '', full_name: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme();
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${userId}`);
        setUser({ email: response.data.email, full_name: response.data.full_name || '' });
      } catch (err) {
        setError('Impossible de charger le profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.put(`${API_URL}/users/${userId}`, user);
      setSuccess('Profil mis à jour avec succès !');
      localStorage.setItem('user_email', user.email);
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/users/${userId}`);
      localStorage.clear();
      navigate('/login', { state: { message: 'Votre compte a été supprimé.' } });
    } catch (err) {
      setError('Erreur lors de la suppression du compte');
    }
  };

  if (loading) return <div className="text-center py-20 font-bold">Chargement...</div>;

  return (
    <div className={`max-w-2xl mx-auto py-10 transition-colors duration-500`}>
      <div className={`rounded-[40px] shadow-2xl overflow-hidden border transition-all duration-500 ${
        theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-xl'
      }`}>
        <div className="bg-blue-600 p-10 text-white relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full"></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="bg-white/20 p-5 rounded-[24px] backdrop-blur-md shadow-xl border border-white/10">
              <User size={48} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Mon <span className="text-blue-100 opacity-80 font-medium">Compte</span></h1>
              <p className="text-blue-100/60 font-medium mt-1">Gérez vos informations personnelles</p>
            </div>
          </div>
        </div>

        <div className="p-10">
          {error && (
            <div className={`p-4 rounded-2xl mb-8 flex items-center gap-3 border animate-in slide-in-from-top-2 ${
              theme === 'dark' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-100'
            }`}>
              <AlertCircle size={20} />
              <span className="font-bold">{error}</span>
            </div>
          )}
          {success && (
            <div className={`p-4 rounded-2xl mb-8 flex items-center gap-3 border animate-in slide-in-from-top-2 ${
              theme === 'dark' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-100'
            }`}>
              <AlertCircle size={20} />
              <span className="font-bold">{success}</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-8">
            <div className="space-y-2">
              <label className={`block text-xs font-black uppercase tracking-widest ml-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Nom Complet</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="text"
                  value={user.full_name}
                  onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                  className={`w-full pl-14 pr-6 py-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium ${
                    theme === 'dark' ? 'bg-white/5 border border-white/10 text-white placeholder:text-gray-600' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400'
                  }`}
                  placeholder="Votre nom"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`block text-xs font-black uppercase tracking-widest ml-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Adresse Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className={`w-full pl-14 pr-6 py-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium ${
                    theme === 'dark' ? 'bg-white/5 border border-white/10 text-white placeholder:text-gray-600' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400'
                  }`}
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-95"
              >
                <Save size={20} />
                Enregistrer
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className={`py-4 px-8 rounded-2xl font-black transition-all border flex items-center justify-center gap-3 active:scale-95 ${
                  theme === 'dark' ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                }`}
              >
                <Trash2 size={20} />
                Supprimer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

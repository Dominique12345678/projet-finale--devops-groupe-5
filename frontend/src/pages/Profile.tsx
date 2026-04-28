import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Save, Trash2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState({ email: '', full_name: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        const response = await axios.get(`${apiUrl}/users/${userId}`);
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      await axios.put(`${apiUrl}/users/${userId}`, user);
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      await axios.delete(`${apiUrl}/users/${userId}`);
      localStorage.clear();
      navigate('/login', { state: { message: 'Votre compte a été supprimé.' } });
    } catch (err) {
      setError('Erreur lors de la suppression du compte');
    }
  };

  if (loading) return <div className="text-center py-20 font-bold">Chargement...</div>;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
              <User size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-black">Mon Compte</h1>
              <p className="text-blue-100 opacity-80">Gérez vos informations personnelles</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 border border-red-100">
              <AlertCircle size={20} />
              <span className="font-semibold">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 flex items-center gap-3 border border-green-100">
              <AlertCircle size={20} />
              <span className="font-semibold">{success}</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nom Complet</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={user.full_name}
                  onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Sauvegarder les modifications
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-50 text-red-600 py-3 px-6 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-100 flex items-center justify-center gap-2"
              >
                <Trash2 size={20} />
                Supprimer le compte
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

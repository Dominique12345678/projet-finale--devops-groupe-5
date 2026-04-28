import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { User as UserIcon, Shield, Mail } from 'lucide-react';

interface User { 
  id: number; 
  email: string; 
  full_name: string; 
  is_active: number; 
  is_admin: number; 
  google_id?: string; 
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { theme } = useTheme();

  const fetchUsers = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    axios.get(`${apiUrl}/admin/users`).then(res => setUsers(res.data));
  };

  useEffect(fetchUsers, []);

  const toggleStatus = (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    axios.put(`${apiUrl}/admin/users/${id}/status?is_active=${newStatus}`).then(fetchUsers);
  };

  return (
    <div className={`backdrop-blur-md p-8 rounded-[32px] border shadow-2xl transition-all duration-500 ${
      theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <h2 className={`text-3xl font-black mb-8 tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20 text-white">
          <Shield size={24} />
        </div>
        Gestion des <span className="text-blue-500">Utilisateurs</span>
      </h2>
      <div className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
        <table className="w-full">
          <thead className={`text-left ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
            <tr>
              <th className="p-5 font-black text-gray-400 uppercase text-xs tracking-widest">Utilisateur</th>
              <th className="p-5 font-black text-gray-400 uppercase text-xs tracking-widest">Statut</th>
              <th className="p-5 font-black text-gray-400 uppercase text-xs tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
            {users.map(user => (
              <tr key={user.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <p className={`font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.full_name || 'Sans nom'}</p>
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="text-gray-500" />
                        <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                        {user.google_id && (
                          <span className="bg-blue-500/10 text-blue-400 text-[10px] px-1.5 py-0.5 rounded border border-blue-500/20 font-black uppercase tracking-tighter">Google</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${user.is_active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {user.is_active ? 'Actif' : 'Désactivé'}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <button 
                    onClick={() => toggleStatus(user.id, user.is_active)}
                    className={`font-black text-sm hover:underline ${user.is_active ? 'text-red-500' : 'text-blue-500'}`}
                  >
                    {user.is_active ? 'Désactiver' : 'Activer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;

import { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6">Gestion des Utilisateurs</h2>
      <table className="w-full">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-4 text-gray-600">Utilisateur</th>
            <th className="p-4 text-gray-600">Statut</th>
            <th className="p-4 text-gray-600 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="p-4">
                <p className="font-bold">{user.full_name || 'Sans nom'}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">{user.email}</p>
                  {user.google_id && (
                    <span className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded border border-blue-100 font-bold uppercase">Google</span>
                  )}
                </div>
              </td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {user.is_active ? 'Actif' : 'Désactivé'}
                </span>
              </td>
              <td className="p-4 text-right">
                <button 
                  onClick={() => toggleStatus(user.id, user.is_active)}
                  className={`font-bold hover:underline ${user.is_active ? 'text-red-600' : 'text-blue-600'}`}
                >
                  {user.is_active ? 'Désactiver' : 'Activer'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;

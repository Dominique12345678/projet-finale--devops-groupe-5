import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Users, Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import API_URL from '../../apiConfig';
import { useTheme } from '../../context/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Stats {
  kpis: { sales: number; revenue: number; users: number; products: number };
  charts: { sales_history: any[] };
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const location = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    if (location.state?.message) {
      setNotification(location.state.message);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    axios.get(`${API_URL}/admin/stats`)
      .then(res => setStats(res.data))
      .catch(err => {
        console.error(err);
        setError("Erreur lors du chargement des statistiques. Vérifiez la connexion au backend.");
      });
  }, []);

  if (error) return <div className="p-8 text-red-600 font-bold bg-red-50 rounded-xl m-8">{error}</div>;
  if (!stats) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border-2 border-white/20 backdrop-blur-md">
            <CheckCircle size={20} />
            {notification}
          </div>
        </div>
      )}
      <h1 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Dashboard <span className="text-blue-500">Analytique</span>
      </h1>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Ventes', value: stats.kpis.sales, icon: '📈', color: 'bg-blue-500' },
          { label: 'Revenus', value: `${stats.kpis.revenue.toLocaleString()} F CFA`, icon: '💰', color: 'bg-green-500' },
          { label: 'Clients', value: stats.kpis.users, icon: '👤', color: 'bg-purple-500' },
          { label: 'Produits', value: stats.kpis.products, icon: '📦', color: 'bg-orange-500' },
        ].map((kpi, i) => (
          <div key={i} className={`backdrop-blur-md p-6 rounded-3xl border transition-all group ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10 hover:border-blue-500/30 shadow-2xl' 
              : 'bg-white border-gray-200 hover:border-blue-500 shadow-sm'
          }`}>
            <div className={`${kpi.color} text-white p-4 rounded-2xl text-2xl shadow-lg shadow-${kpi.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>{kpi.icon}</div>
            <div>
              <p className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{kpi.label}</p>
              <p className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`backdrop-blur-md p-8 rounded-[32px] border shadow-2xl transition-colors duration-500 ${
          theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-xl font-black mb-8 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            Évolution des Ventes
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.charts.sales_history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className={`backdrop-blur-md p-8 rounded-[32px] border shadow-2xl transition-colors duration-500 ${
          theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-xl font-black mb-8 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <div className="w-2 h-8 bg-purple-600 rounded-full"></div>
            Répartition par Catégorie
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.charts.sales_history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

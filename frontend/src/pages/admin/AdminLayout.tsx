import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  FileText, 
  Users, 
  Home, 
  LogOut, 
  Menu, 
  X,
  UserCircle,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { label: 'Produits', path: '/admin/products', icon: <Package size={20} /> },
    { label: 'Catégories', path: '/admin/categories', icon: <FolderTree size={20} /> },
    { label: 'Factures', path: '/admin/invoices', icon: <FileText size={20} /> },
    { label: 'Utilisateurs', path: '/admin/users', icon: <Users size={20} /> },
    { label: 'Mon Compte', path: '/profile', icon: <UserCircle size={20} /> },
    { label: 'Boutique', path: '/', icon: <Home size={20} /> },
  ];

  return (
    <div className={`flex min-h-screen flex-col md:flex-row transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#030303] text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Mobile Toggle */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <h2 className="text-xl font-black text-blue-400">TECHSHOP</h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isMobileMenuOpen ? 'flex' : 'hidden'} 
        md:flex flex-col w-full md:w-64 bg-gray-900 text-white p-6 space-y-8 sticky top-0 h-screen z-40
      `}>
        <h2 className="hidden md:block text-2xl font-black text-blue-400 tracking-tighter text-center">TECHSHOP <span className="text-white">ADMIN</span></h2>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-3 opacity-50">Navigation</div>
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 p-3.5 rounded-2xl transition-all duration-300 group ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:bg-white/5 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className={`${location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110 transition-transform'}`}>
                {item.icon}
              </div>
              <span className="text-sm tracking-tight">{item.label}</span>
            </button>
          ))}

          <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-8 mb-4 ml-3 opacity-50">Paramètres</div>
          
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center space-x-3 p-3.5 rounded-2xl transition-all duration-300 group border-2 ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white' 
                : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-white hover:shadow-md'
            }`}
          >
            <div className="group-hover:rotate-12 transition-transform">
              {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
            </div>
            <span className="font-black text-sm tracking-tight">Mode {theme === 'dark' ? 'Clair' : 'Sombre'}</span>
          </button>

          <button 
            onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
            className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all duration-200 mt-2 group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-bold text-sm">Déconnexion</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 p-4 md:p-10 overflow-y-auto relative transition-colors duration-500 ${
        theme === 'dark' ? 'bg-[#030303]' : 'bg-gray-100'
      }`}>
        {/* Glow effect background (only in dark mode) */}
        {theme === 'dark' && (
          <>
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] -z-10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 blur-[120px] -z-10 rounded-full"></div>
          </>
        )}
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

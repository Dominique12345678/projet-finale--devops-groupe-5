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
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center sticky top-0 z-[100] border-b border-white/5 backdrop-blur-lg bg-gray-900/90">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <LayoutDashboard size={18} />
          </div>
          <span className="text-lg font-black tracking-tighter">TECHSHOP <span className="text-blue-500">ADMIN</span></span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-white/5 rounded-xl transition-all"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen z-[90]
        transition-all duration-300 ease-out
        ${isMobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0 w-64'} 
        flex flex-col bg-gray-900 text-white p-6 space-y-8 border-r border-white/5
      `}>
        <div className="hidden md:flex items-center gap-2 px-4">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-600/30">
            <LayoutDashboard size={24} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Admin</h2>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-4 opacity-40">Main Menu</div>
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 p-3.5 rounded-2xl transition-all duration-300 group ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 font-black'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`${location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110 transition-transform'}`}>
                {item.icon}
              </div>
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
            </button>
          ))}

          <div className="pt-8 space-y-2">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-4 opacity-40">System</div>
            
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center space-x-3 p-3.5 rounded-2xl transition-all duration-300 bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            >
              <div className="transition-transform group-hover:rotate-12">
                {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-400" />}
              </div>
              <span className="font-bold text-sm tracking-tight">Mode {theme === 'dark' ? 'Clair' : 'Sombre'}</span>
            </button>

            <button 
              onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
              className="w-full flex items-center space-x-3 p-3.5 rounded-2xl hover:bg-red-500/10 text-red-400 transition-all duration-200 mt-2 group border border-transparent hover:border-red-500/10"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-sm">Déconnexion</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 min-w-0 transition-colors duration-500 ${
        theme === 'dark' ? 'bg-[#030303]' : 'bg-gray-50'
      }`}>
        <div className="p-4 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

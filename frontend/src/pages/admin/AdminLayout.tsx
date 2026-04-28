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
  UserCircle
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    <div className="flex min-h-screen bg-[#030303] flex-col md:flex-row text-gray-100">
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
        <nav className="space-y-1 flex-1">
          {menuItems.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={i} 
                to={item.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group border-2 ${
                  isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 border-blue-400' : 'hover:bg-white/10 text-gray-300 border-transparent'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-400'} transition-colors`}>{item.icon}</span>
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            );
          })}
          
          <button 
            onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
            className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all duration-200 mt-10 group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-bold text-sm">Déconnexion</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto bg-[#030303] relative">
        {/* Glow effect background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] -z-10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 blur-[120px] -z-10 rounded-full"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

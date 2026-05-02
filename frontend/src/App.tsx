import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';
import Profile from './pages/Profile';
import { CartProvider, useCart } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { ShoppingCart, User, LayoutDashboard, LogOut, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from './context/ThemeContext';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import CategoryManagement from './pages/admin/CategoryManagement';
import UserManagement from './pages/admin/UserManagement';
import InvoiceManagement from './pages/admin/InvoiceManagement';
import ProductManagement from './pages/admin/ProductManagement';

// Composant Navbar séparé pour accéder au contexte du panier
const Navbar = () => {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Produits', path: '/products' },
    ...(token ? [{ label: 'Mon Compte', path: '/profile' }] : []),
  ];

  return (
    <nav className="bg-[#030303]/80 backdrop-blur-2xl sticky top-0 z-[100] border-b border-white/5 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-black text-white tracking-tighter flex items-center gap-2 group">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <LayoutDashboard size={20} />
          </div>
          TECH<span className="text-blue-500">SHOP</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="text-sm font-bold text-gray-400 hover:text-white transition-all hover:scale-105"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link to="/cart" className="relative p-2 text-gray-400 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#030303] shadow-[0_0_10px_rgba(37,99,235,0.5)]">
                {itemCount}
              </span>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-3 ml-2">
            {!token ? (
              <>
                <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white px-2">Connexion</Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-black transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                  S'inscrire
                </Link>
              </>
            ) : (
              <button 
                onClick={handleLogout}
                className="bg-red-500/10 text-red-500 px-5 py-2 rounded-xl text-sm font-black hover:bg-red-500/20 transition-all border border-red-500/20 flex items-center gap-2"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:bg-white/5 rounded-xl transition-all"
          >
            {isMenuOpen ? <LogOut className="rotate-90" size={24} /> : <Settings size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}></div>
      
      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-[#080808] border-l border-white/5 z-[100] md:hidden transform transition-transform duration-300 ease-out p-6 flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-10">
          <div className="text-xl font-black text-white">MENU</div>
          <button onClick={() => setIsMenuOpen(false)} className="text-gray-500"><LogOut size={24} /></button>
        </div>

        <div className="flex flex-col space-y-4 flex-1">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-bold text-gray-300 hover:text-blue-500 py-3 border-b border-white/5"
            >
              {link.label}
            </Link>
          ))}
          {!token && (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-gray-300 py-3 border-b border-white/5">Connexion</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="bg-blue-600 text-white p-4 rounded-2xl text-center font-black mt-4">S'inscrire</Link>
            </>
          )}
        </div>

        {token && (
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500/10 text-red-500 p-4 rounded-2xl font-black flex items-center justify-center gap-2 mt-auto"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        )}
      </div>
    </nav>
  );
};

const AppLayout = () => {
  const { theme } = useTheme();
  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#030303] text-gray-100' : 'bg-white text-gray-900'
    }`}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className={`border-t py-20 mt-20 transition-colors duration-500 ${
        theme === 'dark' ? 'bg-black/50 border-white/5' : 'bg-gray-50 border-gray-100'
      }`}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className={`text-2xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            TECH<span className="text-blue-500">SHOP</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">© 2026 TechShop Premium. Expérience Tech Ultime.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Client Routes */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="invoice" element={<Invoice />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="invoices" element={<InvoiceManagement />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;

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
import { ShoppingCart, User, LayoutDashboard, LogOut, Settings } from 'lucide-react';

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-[#030303]/60 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-black text-white tracking-tighter flex items-center gap-2 group">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <LayoutDashboard size={20} />
          </div>
          TECH<span className="text-blue-500">SHOP</span>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded ml-2 uppercase font-black border border-blue-500/20">v2.0</span>
        </Link>
        
        <div className="flex items-center space-x-2 md:space-x-6">
          <div className="hidden md:flex items-center space-x-6 mr-4">
            <Link to="/" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Accueil</Link>
            <Link to="/products" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Produits</Link>
            {token && <Link to="/profile" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Compte</Link>}
          </div>
 
          <div className="flex items-center space-x-3">
            <Link to="/cart" className="relative p-2.5 text-gray-400 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10">
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#030303] shadow-[0_0_10px_rgba(37,99,235,0.5)]">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {!token ? (
              <>
                <Link to="/login" className="p-2.5 text-gray-400 hover:bg-white/5 rounded-2xl transition-all md:hidden border border-transparent hover:border-white/10">
                  <User size={22} />
                </Link>
                <div className="hidden md:flex items-center space-x-3">
                  <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white px-4 py-2 transition-colors">Connexion</Link>
                  <Link to="/register" className="btn-primary py-2 px-6 text-sm">
                    S'inscrire
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/profile" className="p-2.5 text-gray-400 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10" title="Mon Compte">
                  <Settings size={22} />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500/10 text-red-500 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-all border border-red-500/20 flex items-center gap-2"
                >
                  <LogOut size={18} />
                  <span className="hidden md:inline">Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={
            <div className="min-h-screen bg-[#030303]">
              <Navbar />
              <main>
                <Outlet />
              </main>
              <footer className="bg-black/50 border-t border-white/5 py-20 mt-20">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-2xl font-black text-white tracking-tighter">
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
          }>
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
  );
}

export default App;

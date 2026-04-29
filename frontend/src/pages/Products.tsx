import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Search, ShoppingCart, Loader2, CheckCircle, Package } from 'lucide-react';
import API_URL from '../apiConfig';
import { useTheme } from '../context/ThemeContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  
  const { addToCart, cart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
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
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (cart.some(item => item.id === product.id)) {
      setNotification(`Le produit ${product.name} est déjà ajouté au panier !`);
      setNotificationType('error');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    addToCart(product);
    setNotification(`${product.name} ajouté au panier !`);
    setNotificationType('success');
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen tech-gradient">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
      <p className="text-gray-400 font-bold animate-pulse">Initialisation de l'inventaire...</p>
    </div>
  );

  return (
    <div className={`min-h-screen pb-20 pt-10 px-6 transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#030303]' : 'bg-gray-50'
    }`}>
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`glass text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border-2 ${notificationType === 'error' ? 'border-red-500/30' : 'border-green-500/30'} backdrop-blur-md`}>
            {notificationType === 'error' ? <ShoppingCart size={20} className="text-red-400" /> : <CheckCircle size={20} className="text-green-400" />}
            {notification}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-4 transition-colors ${
              theme === 'dark' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'
            }`}>
              <Package size={14} />
              <span>Catalogue Tech</span>
            </div>
            <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Explorez nos <span className="text-blue-500">Produits</span>
            </h1>
            <p className={`mt-4 max-w-lg font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Le meilleur de la technologie sélectionné pour vous avec rigueur et passion.
            </p>
          </div>
          
          {/* Barre de Recherche Tech */}
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Rechercher une innovation..."
              className="input-tech pl-12 py-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className={`rounded-[32px] overflow-hidden border transition-all duration-500 group flex flex-col shadow-2xl ${
              theme === 'dark' ? 'bg-white/5 border-white/5 hover:border-blue-500/30' : 'bg-white border-gray-100 hover:border-blue-500 hover:shadow-blue-500/10'
            }`}>
              <div className="h-64 bg-black/40 flex items-center justify-center relative overflow-hidden">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                ) : (
                  <Package className="w-16 h-16 text-white/10" />
                )}
                <div className="absolute top-4 left-4">
                  <span className="glass text-white text-[10px] font-black px-3 py-1 rounded-lg border-white/10 uppercase tracking-widest">
                    {product.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <h2 className={`text-xl font-black group-hover:text-blue-400 transition-colors mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{product.name}</h2>
                <p className={`text-sm line-clamp-2 mb-8 flex-1 leading-relaxed font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{product.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-tighter mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Investissement</p>
                    <p className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{product.price.toLocaleString()} <span className="text-blue-500 text-sm">FCFA</span></p>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      cart.some(item => item.id === product.id) 
                        ? 'bg-red-500/20 text-red-500 border border-red-500/30' 
                        : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 hover:scale-105 active:scale-95'
                    }`}
                  >
                    <ShoppingCart size={24} fill={cart.some(item => item.id === product.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-40 glass rounded-[40px] border-dashed border-white/10">
            <Search className="w-20 h-20 text-white/5 mx-auto mb-6" />
            <p className="text-gray-400 text-2xl font-black">Aucune innovation trouvée</p>
            <button 
              onClick={() => setSearchTerm('')} 
              className="mt-6 text-blue-400 font-bold hover:text-blue-300 transition-colors underline underline-offset-8"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

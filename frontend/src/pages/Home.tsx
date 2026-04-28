import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, Zap, ShieldCheck, Gem, Cpu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
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

  return (
    <div className={`relative min-h-screen overflow-hidden pt-20 transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#030303]' : 'bg-gray-50'
    }`}>
      {/* Animated Background elements (Only in dark mode for better look) */}
      {theme === 'dark' && (
        <>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse-slow"></div>
        </>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="glass text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border-2 border-blue-500/30 backdrop-blur-md">
            <CheckCircle size={20} className="text-green-400" />
            {notification}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-32 flex flex-col items-center text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all animate-float ${
          theme === 'dark' ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'
        }`}>
          <Cpu size={16} />
          <span className="font-bold text-xs uppercase tracking-widest">L'avenir de la Tech est ici</span>
        </div>

        <h1 className={`text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          VOTRE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-glow">UNIVERS</span> <br />
          TECH PREMIUM
        </h1>

        <p className={`max-w-2xl text-lg md:text-xl mb-12 leading-relaxed font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Découvrez une sélection exclusive des dernières innovations technologiques. 
          Performance, Design et Sécurité réunis sur une plateforme unique.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mb-24">
          <Link to="/products" className="btn-primary px-10 py-4 text-lg">
            Explorer la boutique
            <ArrowRight size={20} />
          </Link>
          <Link to="/register" className={`px-10 py-4 rounded-xl font-black transition-all border shadow-xl ${
            theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-white border-white/10' : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-200'
          }`}>
            Créer un compte
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {[
            { icon: <Zap className="text-yellow-400" />, title: "Ultra Rapide", desc: "Expérience fluide et livraisons express en 24h." },
            { icon: <ShieldCheck className="text-blue-400" />, title: "Sécurisé", desc: "Transactions protégées par cryptage de pointe." },
            { icon: <Gem className="text-purple-400" />, title: "Premium", desc: "Produits authentiques et support client VIP." },
          ].map((item, i) => (
            <div key={i} className={`p-8 rounded-[40px] text-left border transition-all group shadow-2xl ${
              theme === 'dark' ? 'bg-white/5 border-white/5 hover:border-blue-500/30' : 'bg-white border-gray-100 hover:border-blue-500 hover:shadow-blue-500/10'
            }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                theme === 'dark' ? 'bg-white/5' : 'bg-blue-50'
              }`}>
                {item.icon}
              </div>
              <h3 className={`text-xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
              <p className={`text-sm leading-relaxed font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative lines */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      <div className="absolute top-1/2 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"></div>
    </div>
  );
};

export default Home;

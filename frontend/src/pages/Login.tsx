import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';
import API_URL from '../apiConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const response = await axios.post(`${API_URL}/auth/google`, {
        email: decoded.email,
        full_name: decoded.name,
        google_id: decoded.sub
      });

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user_id', response.data.user_id.toString());
      localStorage.setItem('user_email', decoded.email);
      
      if (response.data.is_admin === 1) {
        navigate('/admin');
      } else {
        navigate('/products', { state: { message: "Connexion Google réussie !" } });
      }
    } catch (err: any) {
      setError("Erreur lors de l'enregistrement de votre compte Google");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user_id', response.data.user_id.toString());
      localStorage.setItem('user_email', email);
      if (response.data.is_admin === 1) {
        navigate('/admin');
      } else {
        navigate('/products', { state: { message: "Connexion réussie ! Heureux de vous revoir." } });
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors de la connexion');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 tech-gradient relative">
      {/* Decorative Glows */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-xl relative">
        <div className="glass-dark p-10 md:p-16 rounded-[40px] border-white/10 shadow-2xl relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 mb-6 border border-blue-500/20">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-4xl font-black text-white mb-3">Ravi de vous revoir</h2>
            <p className="text-gray-400">Accédez à votre espace Tech Shop</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1">Email professionnel</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-tech pl-12"
                  placeholder="nom@exemple.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-tech pl-12"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-4 text-lg">
              Se connecter
              <ArrowRight size={20} />
            </button>
          </form>

          {/* Google Login Disabled as per user request
          <div className="relative flex py-8 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-xs font-black uppercase tracking-widest">Ou continuer avec</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <div className="flex justify-center mb-10">
            <div className="p-1 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Erreur d'authentification Google")}
                theme="filled_black"
                shape="pill"
              />
            </div>
          </div>
          */}

          <p className="text-center text-gray-400 text-sm">
            Nouveau sur la plateforme ? <Link to="/register" className="text-blue-400 font-bold hover:text-blue-300 transition-colors underline underline-offset-4">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

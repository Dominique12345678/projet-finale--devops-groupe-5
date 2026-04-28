import { Link, useNavigate } from 'react-router-dom';
import { useCart, CartItem } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Votre panier est vide</h2>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition">
          Découvrir nos produits
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Votre Panier ({itemCount} articles)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item: CartItem) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                <p className="text-blue-600 font-semibold">{item.price.toLocaleString()} F CFA</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600"><Minus size={16} /></button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600"><Plus size={16} /></button>
                </div>
                <div className="w-24 text-right font-bold text-gray-900">
                  {(item.price * item.quantity).toLocaleString()} F CFA
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-6">Récapitulatif</h2>
          <div className="space-y-4 mb-6 text-gray-600">
            <div className="flex justify-between"><span>Sous-total</span><span>{total.toLocaleString()} F CFA</span></div>
            <div className="flex justify-between"><span>Frais de port</span><span className="text-green-600">Gratuit</span></div>
            <div className="border-t pt-4 flex justify-between font-bold text-xl text-gray-900">
              <span>Total</span><span>{total.toLocaleString()} F CFA</span>
            </div>
          </div>
          <button onClick={() => navigate('/checkout')} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
            Procéder au paiement
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

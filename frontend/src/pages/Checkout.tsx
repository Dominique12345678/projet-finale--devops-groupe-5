import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { CreditCard, Lock } from 'lucide-react';

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cardNumber: '', expiry: '', cvv: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 1500));
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const userId = localStorage.getItem('user_id');
      const userEmail = localStorage.getItem('user_email') || 'client@email.com';
      
      if (!userId) {
        throw new Error("Utilisateur non identifié");
      }

      // Enregistrer la facture en base de données
      const response = await axios.post(`${apiUrl}/invoices`, {
        user_id: parseInt(userId),
        total_amount: total
      });

      const invoiceData = response.data;
      
      const invoice = {
        id: `INV-${invoiceData.id}`,
        date: new Date(invoiceData.created_at).toLocaleDateString('fr-FR'),
        customer: { 
          name: localStorage.getItem('full_name') || 'Client TechShop', 
          email: userEmail, 
          address: 'Vente en ligne' 
        },
        items: cart,
        total: total.toLocaleString()
      };
      
      clearCart();
      navigate('/invoice', { state: { invoice } });
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      alert("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Paiement</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Info */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Lock size={18} className="text-green-600" /> Paiement sécurisé (simulation)
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de carte</label>
                <input type="text" name="cardNumber" placeholder="1234 5678 9012 3456"
                  value={form.cardNumber} onChange={handleChange} required maxLength={19}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
                  <input type="text" name="expiry" placeholder="MM/AA"
                    value={form.expiry} onChange={handleChange} required maxLength={5}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input type="text" name="cvv" placeholder="123"
                    value={form.cvv} onChange={handleChange} required maxLength={3}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
            {loading ? 'Traitement en cours...' : <><CreditCard size={20} /> Payer {total.toLocaleString()} F CFA</>}
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-bold mb-4">Résumé de la commande</h2>
          <div className="space-y-3 mb-6">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.name} × {item.quantity}</span>
                <span className="font-medium">{(item.price * item.quantity).toLocaleString()} F CFA</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span><span>{total.toLocaleString()} F CFA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

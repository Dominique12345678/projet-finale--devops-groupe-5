import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { FileText, Calendar, CreditCard, Hash } from 'lucide-react';

interface Invoice { id: number; user_id: number; total_amount: number; status: string; created_at: string; }

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    axios.get(`${apiUrl}/admin/invoices`).then(res => setInvoices(res.data));
  }, []);

  return (
    <div className={`backdrop-blur-md p-8 rounded-[32px] border shadow-2xl transition-all duration-500 ${
      theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <h2 className={`text-3xl font-black mb-8 tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20 text-white">
          <FileText size={24} />
        </div>
        Historique des <span className="text-blue-500">Factures</span>
      </h2>
      <div className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
        <table className="w-full">
          <thead className={`text-left ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
            <tr>
              <th className="p-5 font-black text-gray-400 uppercase text-xs tracking-widest">Référence</th>
              <th className="p-5 font-black text-gray-400 uppercase text-xs tracking-widest">Montant</th>
              <th className="p-5 font-black text-gray-400 uppercase text-xs tracking-widest">Statut</th>
              <th className="p-5 font-black text-gray-400 uppercase text-xs tracking-widest">Date</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
            {invoices.map(inv => (
              <tr key={inv.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-blue-500" />
                    <span className={`font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>#INV-{inv.id}</span>
                  </div>
                </td>
                <td className={`p-5 font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{inv.total_amount.toLocaleString()} FCFA</td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                    inv.status === 'Paid' 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                    <Calendar size={14} />
                    {new Date(inv.created_at).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceManagement;

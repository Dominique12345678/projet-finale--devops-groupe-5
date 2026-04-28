import { useEffect, useState } from 'react';
import axios from 'axios';

interface Invoice { id: number; user_id: number; total_amount: number; status: string; created_at: string; }

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    axios.get(`${apiUrl}/admin/invoices`).then(res => setInvoices(res.data));
  }, []);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6">Historique des Factures</h2>
      <table className="w-full">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-4 text-gray-600">ID Facture</th>
            <th className="p-4 text-gray-600">Client ID</th>
            <th className="p-4 text-gray-600">Montant</th>
            <th className="p-4 text-gray-600">Statut</th>
            <th className="p-4 text-gray-600">Date</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id} className="border-t">
              <td className="p-4 font-bold">#INV-{inv.id}</td>
              <td className="p-4">User {inv.user_id}</td>
              <td className="p-4 font-bold">{inv.total_amount.toLocaleString()} F CFA</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {inv.status}
                </span>
              </td>
              <td className="p-4 text-gray-500 text-sm">{new Date(inv.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceManagement;

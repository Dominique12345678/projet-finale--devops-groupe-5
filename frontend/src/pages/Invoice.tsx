import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Download, Home } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Invoice = () => {
  const location = useLocation();
  const { invoice } = location.state || {};

  if (!invoice) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Aucune facture à afficher.</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Retour à l'accueil</Link>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF() as any;

    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('TECHSHOP', 14, 18);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Votre boutique tech de confiance', 14, 28);
    doc.text(`Facture N° ${invoice.id}`, 140, 18);
    doc.text(`Date : ${invoice.date}`, 140, 28);

    // Customer Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Informations client', 14, 55);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Nom : ${invoice.customer.name}`, 14, 65);
    doc.text(`Email : ${invoice.customer.email}`, 14, 73);
    doc.text(`Adresse : ${invoice.customer.address}`, 14, 81);

    // Table
    doc.autoTable({
      startY: 95,
      head: [['Produit', 'Qté', 'Prix unitaire', 'Total']],
      body: invoice.items.map((item: any) => [
        item.name,
        item.quantity,
        `${item.price.toLocaleString()} F CFA`,
        `${(item.price * item.quantity).toLocaleString()} F CFA`
      ]),
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [239, 246, 255] },
      foot: [['', '', 'TOTAL TTC', `${invoice.total.toLocaleString()} F CFA`]],
      footStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: 'bold', fontSize: 12 },
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('Merci pour votre confiance ! - TechShop', 14, 285);
    doc.text(`Page 1/${pageCount}`, 180, 285);

    doc.save(`Facture-${invoice.id}.pdf`);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Success Banner */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Commande confirmée !</h1>
        <p className="text-gray-500 mt-2">Votre paiement a été traité avec succès.</p>
      </div>

      {/* Invoice Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" id="invoice-content">
        {/* Invoice Header */}
        <div className="bg-blue-600 p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black">TECHSHOP</h2>
            <p className="text-blue-200 text-sm">Votre boutique tech de confiance</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">Facture N° {invoice.id}</p>
            <p className="text-blue-200 text-sm">Date : {invoice.date}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-600 text-xs uppercase tracking-wider mb-3">Informations client</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-gray-900">{invoice.customer.name}</p>
              <p className="text-gray-500 text-sm">{invoice.customer.email}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-700 text-sm">{invoice.customer.address}</p>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 text-xs uppercase tracking-wider text-gray-500">Produit</th>
                <th className="text-center py-2 text-xs uppercase tracking-wider text-gray-500">Qté</th>
                <th className="text-right py-2 text-xs uppercase tracking-wider text-gray-500">Prix Unit.</th>
                <th className="text-right py-2 text-xs uppercase tracking-wider text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item: any, i: number) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-3 font-medium text-gray-900">{item.name}</td>
                  <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                  <td className="py-3 text-right text-gray-600">{item.price.toLocaleString()} F CFA</td>
                  <td className="py-3 text-right font-bold text-gray-900">{(item.price * item.quantity).toLocaleString()} F CFA</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-blue-600 text-white">
                <td colSpan={3} className="py-3 px-4 font-bold text-right rounded-bl-lg">TOTAL TTC</td>
                <td className="py-3 px-4 font-black text-xl text-right rounded-br-lg">{invoice.total.toLocaleString()} F CFA</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-8">
        <button onClick={handleDownloadPDF}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
          <Download size={20} /> Télécharger la facture PDF
        </button>
        <Link to="/"
          className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-bold hover:bg-gray-200 transition-all">
          <Home size={20} />
        </Link>
      </div>
    </div>
  );
};

export default Invoice;

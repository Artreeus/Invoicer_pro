import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Image, FileDown, Pencil, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useInvoiceStore } from '../store/invoiceStore';
import type { Invoice } from '../types';
import { getTemplate } from '../templates';
import { exportToPDF, exportToImage, printInvoice } from '../lib/exportUtils';

export default function InvoicePreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchInvoiceById } = useInvoiceStore();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchInvoiceById(id).then(data => {
        setInvoice(data);
        setLoading(false);
      });
    }
  }, [id, fetchInvoiceById]);

  const handleExportPDF = async () => {
    if (!invoiceRef.current || !invoice) return;
    setExporting(true);
    try {
      await exportToPDF(invoiceRef.current, `${invoice.invoice_number}`);
      toast.success('PDF downloaded');
    } catch { toast.error('Export failed'); }
    setExporting(false);
    setExportMenuOpen(false);
  };

  const handleExportPNG = async () => {
    if (!invoiceRef.current || !invoice) return;
    setExporting(true);
    try {
      await exportToImage(invoiceRef.current, `${invoice.invoice_number}`, 'png');
      toast.success('PNG downloaded');
    } catch { toast.error('Export failed'); }
    setExporting(false);
    setExportMenuOpen(false);
  };

  const handleExportJPG = async () => {
    if (!invoiceRef.current || !invoice) return;
    setExporting(true);
    try {
      await exportToImage(invoiceRef.current, `${invoice.invoice_number}`, 'jpeg');
      toast.success('JPG downloaded');
    } catch { toast.error('Export failed'); }
    setExporting(false);
    setExportMenuOpen(false);
  };

  const handlePrint = () => {
    if (!invoiceRef.current) return;
    printInvoice(invoiceRef.current);
    setExportMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-8 text-center text-gray-500">Invoice not found.</div>
    );
  }

  const TemplateComponent = getTemplate(invoice.template_id);

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 no-print">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/invoices')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Invoice Preview</h1>
              <p className="text-sm text-gray-500">{invoice.invoice_number}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/invoices/${id}/edit`)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Pencil size={16} /> Edit
            </button>
            <div className="relative">
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                <Download size={16} />
                {exporting ? 'Exporting...' : 'Export'}
                <ChevronDown size={14} />
              </button>
              {exportMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <button onClick={handleExportPDF} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <FileDown size={16} className="text-red-500" /> Download PDF
                  </button>
                  <button onClick={handleExportPNG} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Image size={16} className="text-blue-500" /> Download PNG
                  </button>
                  <button onClick={handleExportJPG} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Image size={16} className="text-green-500" /> Download JPG
                  </button>
                  <div className="h-px bg-gray-100 my-1" />
                  <button onClick={handlePrint} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Printer size={16} className="text-gray-500" /> Print
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="shadow-2xl rounded-lg overflow-hidden" style={{ maxWidth: '794px' }}>
            <div ref={invoiceRef}>
              <TemplateComponent
                invoice={invoice}
                company={invoice.company!}
                client={invoice.client ?? null}
                items={invoice.items ?? []}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

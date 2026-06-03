import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useSeo } from '../../lib/useSeo';
import { CONTACT_EMAIL } from '../../lib/site';

export default function ContactPage() {
  useSeo(
    'Contact InvoiceBD',
    'Get in touch with the InvoiceBD team — questions, feedback and support.'
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Open the visitor's email client with the message pre-filled.
    const subject = encodeURIComponent(`InvoiceBD enquiry from ${name || 'a visitor'}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}${email ? ` (${email})` : ''}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    toast.success('Opening your email app…');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">Contact us</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-300">
        Questions, feedback, or need a hand? We’d love to hear from you.
      </p>

      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="mt-6 inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium hover:underline"
      >
        <Mail size={18} /> {CONTACT_EMAIL}
      </a>

      <form onSubmit={handleSubmit} className="mt-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Your name</label>
            <input className={inputClass} value={name} onChange={e => setName(e.target.value)} required placeholder="Jane Doe" />
          </div>
          <div>
            <label className={labelClass}>Your email</label>
            <input className={inputClass} type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Message</label>
          <textarea className={inputClass} rows={5} value={message} onChange={e => setMessage(e.target.value)} required placeholder="How can we help?" />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Send size={16} /> Send message
        </button>
      </form>
    </div>
  );
}

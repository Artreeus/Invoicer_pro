import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

const STORAGE_KEY = 'cookie_consent';

// Lightweight consent notice. AdSense and other third parties set cookies; this
// records the visitor's choice and links to the full privacy policy.
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const decide = (value: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // storage unavailable — still dismiss
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] p-3 sm:p-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-300 flex items-center justify-center flex-shrink-0">
            <Cookie size={18} />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            We use cookies to keep you signed in and, with your consent, to show personalised ads
            via Google AdSense and measure traffic. See our{' '}
            <Link to="/privacy" className="font-medium text-teal-600 dark:text-teal-400 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center gap-2 sm:flex-shrink-0">
          <button
            onClick={() => decide('declined')}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Decline
          </button>
          <button
            onClick={() => decide('accepted')}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { ADSENSE_CLIENT, ADSENSE_DEFAULT_SLOT, adsenseEnabled } from '../../lib/adsense';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdUnitProps {
  /** AdSense ad-unit slot id. Falls back to VITE_ADSENSE_SLOT. */
  slot?: string;
  format?: string;
  className?: string;
  /** Optional label shown above the ad (AdSense requires ads be distinguishable). */
  label?: boolean;
}

// A single responsive AdSense display unit. Renders nothing in production until a
// publisher id is configured; shows a labelled placeholder during development so
// ad slots are visible while building.
export default function AdUnit({ slot, format = 'auto', className = '', label = true }: AdUnitProps) {
  const adSlot = slot || ADSENSE_DEFAULT_SLOT;

  useEffect(() => {
    if (!adsenseEnabled) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle not ready yet — ignored
    }
  }, []);

  if (!adsenseEnabled) {
    if (import.meta.env.DEV) {
      return (
        <div className={`flex items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-600 py-12 ${className}`}>
          Advertisement placeholder
        </div>
      );
    }
    return null;
  }

  return (
    <div className={className}>
      {label && (
        <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-600 text-center mb-1">
          Advertisement
        </p>
      )}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

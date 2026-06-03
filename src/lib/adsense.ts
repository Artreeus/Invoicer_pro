// Google AdSense configuration, sourced from build-time env vars. When the
// publisher id is empty (before approval) ad units render nothing in production.
export const ADSENSE_CLIENT = (import.meta.env.VITE_ADSENSE_CLIENT as string | undefined) || '';
export const ADSENSE_DEFAULT_SLOT = (import.meta.env.VITE_ADSENSE_SLOT as string | undefined) || '';
export const adsenseEnabled = Boolean(ADSENSE_CLIENT);

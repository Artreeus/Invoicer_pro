// Public site metadata used across the marketing/content pages and legal docs.
export const SITE_NAME = 'InvoiceBD';
export const CONTACT_EMAIL = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) || 'work.ratulhasan048@gmail.com';
export const SITE_URL = ((import.meta.env.VITE_SITE_URL as string | undefined) || 'https://invoicer-pro-ten.vercel.app').replace(/\/+$/, '');

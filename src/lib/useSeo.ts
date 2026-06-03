import { useEffect } from 'react';

// Set the document title and meta description for a page (basic per-route SEO for
// the public, crawlable pages). Restores the previous values on unmount.
export function useSeo(title: string, description?: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const prevDesc = meta?.getAttribute('content') ?? null;
    if (description) {
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }

    return () => {
      document.title = prevTitle;
      if (description && meta && prevDesc !== null) meta.setAttribute('content', prevDesc);
    };
  }, [title, description]);
}

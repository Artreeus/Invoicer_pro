import { useEffect } from 'react';

interface SeoOpts {
  canonical?: string;
  schema?: Record<string, unknown>;
  ogTitle?: string;
  ogDescription?: string;
}

function setMeta(selector: string, attr: string, value: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    const [attrName, attrVal] = selector.match(/\[(.+?)="(.+?)"\]/)?.slice(1) ?? [];
    if (attrName) el.setAttribute(attrName, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
  return el;
}

export function useSeo(title: string, description?: string, opts?: SeoOpts) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    // Meta description
    const descEl = description
      ? setMeta('meta[name="description"]', 'content', description)
      : null;
    const prevDesc = descEl?.getAttribute('content') ?? null;

    // OG title
    const ogTitleEl = setMeta('meta[property="og:title"]', 'content', opts?.ogTitle ?? title);
    const prevOgTitle = ogTitleEl.getAttribute('content');

    // OG description
    const ogDescEl = description
      ? setMeta('meta[property="og:description"]', 'content', opts?.ogDescription ?? description)
      : null;
    const prevOgDesc = ogDescEl?.getAttribute('content') ?? null;

    // Canonical link
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const prevCanonical = canonicalEl?.getAttribute('href') ?? null;
    if (opts?.canonical) {
      if (!canonicalEl) {
        canonicalEl = document.createElement('link');
        canonicalEl.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.setAttribute('href', opts.canonical);
    }

    // Page-level JSON-LD schema
    let schemaEl = document.getElementById('__page-schema__') as HTMLScriptElement | null;
    const prevSchema = schemaEl?.textContent ?? null;
    if (opts?.schema) {
      if (!schemaEl) {
        schemaEl = document.createElement('script');
        schemaEl.id = '__page-schema__';
        schemaEl.type = 'application/ld+json';
        document.head.appendChild(schemaEl);
      }
      schemaEl.textContent = JSON.stringify(opts.schema);
    }

    return () => {
      document.title = prevTitle;
      if (descEl && prevDesc !== null) descEl.setAttribute('content', prevDesc);
      if (ogTitleEl && prevOgTitle) ogTitleEl.setAttribute('content', prevOgTitle);
      if (ogDescEl && prevOgDesc !== null) ogDescEl.setAttribute('content', prevOgDesc);
      if (canonicalEl && prevCanonical !== null) canonicalEl.setAttribute('href', prevCanonical);
      if (schemaEl && prevSchema !== null) schemaEl.textContent = prevSchema;
    };
  }, [title, description, opts?.canonical, opts?.ogTitle, opts?.ogDescription,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      opts?.schema ? JSON.stringify(opts.schema) : undefined]);
}

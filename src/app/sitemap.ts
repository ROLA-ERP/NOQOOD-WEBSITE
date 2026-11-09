import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/settings';
import { MODULES } from '@/content/modules';
import { INDUSTRIES_CONTENT } from '@/content/industries';
import { publishedPosts } from '@/lib/content';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const STATIC = ['', '/about', '/vision-mission', '/values', '/modules', '/industries', '/product', '/pricing', '/blog', '/faq', '/contact', '/demo', '/customers', '/privacy', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const paths = [...STATIC, ...MODULES.map(m => `/modules/${m.slug}`), ...INDUSTRIES_CONTENT.map(i => `/industries/${i.slug}`)];
  let posts: string[] = [];
  try { db(); posts = publishedPosts('en').map(p => `/blog/${p.slug}`); } catch { posts = []; }
  return [...paths, ...posts].flatMap(p => (['ar', 'en'] as const).map(lang => ({
    url: `${base}/${lang}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7,
    alternates: { languages: { ar: `${base}/ar${p}`, en: `${base}/en${p}` } },
  })));
}

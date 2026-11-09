// Reads of the editable content (articles, FAQs, pricing plans) for the public pages and the sitemap. Only published rows are ever returned here.
import { db } from './db';
import type { Lang } from './i18n';

export const BLOG_CATEGORIES: Record<string, { ar: string; en: string }> = {
  'accounting-insights': { ar: 'رؤى محاسبية', en: 'Accounting insights' },
  'business-management': { ar: 'إدارة الأعمال', en: 'Business management' },
  'inventory-optimization': { ar: 'تحسين المخزون', en: 'Inventory optimization' },
  'hr-management': { ar: 'إدارة الموارد البشرية', en: 'HR management' },
  'multi-branch-management': { ar: 'إدارة الفروع', en: 'Multi-branch management' },
  'digital-transformation': { ar: 'التحول الرقمي', en: 'Digital transformation' },
  'erp-best-practices': { ar: 'أفضل ممارسات ERP', en: 'ERP best practices' },
  'product-updates': { ar: 'تحديثات المنتج', en: 'Product updates' },
};

export interface PostRow { id: number; slug: string; category: string; author_name: string | null; status: string; title_ar: string; title_en: string; excerpt_ar: string | null; excerpt_en: string | null; body_ar: string; body_en: string; published_at: string | null; updated_at: string }
export interface Post { id: number; slug: string; category: string; author: string; title: string; excerpt: string; body: string; publishedAt: string | null; updatedAt: string; minutes: number }

/** Reading time at ~200 words (Latin) or ~180 words (Arabic) per minute. */
export const readingMinutes = (text: string): number => Math.max(1, Math.round(text.trim().split(/\s+/).length / 190));

export const toPost = (r: PostRow, lang: Lang): Post => {
  const body = lang === 'ar' ? r.body_ar : r.body_en;
  return { id: r.id, slug: r.slug, category: r.category, author: r.author_name || 'NOQOOD Team', title: lang === 'ar' ? r.title_ar : r.title_en, excerpt: (lang === 'ar' ? r.excerpt_ar : r.excerpt_en) || '', body, publishedAt: r.published_at, updatedAt: r.updated_at, minutes: readingMinutes(body) };
};

export function publishedPosts(lang: Lang, opts: { category?: string; q?: string } = {}): Post[] {
  const rows = db().prepare("SELECT * FROM posts WHERE status = 'published' ORDER BY COALESCE(published_at, created_at) DESC").all() as unknown as PostRow[];
  let posts = rows.map(r => toPost(r, lang));
  if (opts.category) posts = posts.filter(p => p.category === opts.category);
  if (opts.q) { const q = opts.q.toLowerCase().slice(0, 80); posts = posts.filter(p => (p.title + ' ' + p.excerpt + ' ' + p.body).toLowerCase().includes(q)); }
  return posts;
}

export function publishedPost(slug: string, lang: Lang): Post | null {
  const r = db().prepare("SELECT * FROM posts WHERE slug = ? AND status = 'published'").get(slug) as unknown as PostRow | undefined;
  return r ? toPost(r, lang) : null;
}

export function publishedFaqs(lang: Lang): { q: string; a: string }[] {
  const rows = db().prepare('SELECT * FROM faqs WHERE published = 1 ORDER BY sort, id').all() as unknown as { q_ar: string; q_en: string; a_ar: string; a_en: string }[];
  return rows.map(r => ({ q: lang === 'ar' ? r.q_ar : r.q_en, a: lang === 'ar' ? r.a_ar : r.a_en }));
}

export interface Plan { id: number; name: string; monthly: number | null; annual: number | null; currency: string; users: number | null; branches: number | null; features: string[]; cta: string | null }
export function publishedPlans(lang: Lang): Plan[] {
  const rows = db().prepare('SELECT * FROM pricing_plans WHERE published = 1 ORDER BY sort, id').all() as unknown as { id: number; name_ar: string; name_en: string; monthly_price: number | null; annual_price: number | null; currency: string; users: number | null; branches: number | null; features_ar: string | null; features_en: string | null; cta: string | null }[];
  return rows.map(r => ({ id: r.id, name: lang === 'ar' ? r.name_ar : r.name_en, monthly: r.monthly_price, annual: r.annual_price, currency: r.currency, users: r.users, branches: r.branches, features: ((lang === 'ar' ? r.features_ar : r.features_en) || '').split('\n').map(s => s.trim()).filter(Boolean), cta: r.cta }));
}

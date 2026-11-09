'use server';
// Every action re-checks the session, the role's permission and the page's CSRF token on the server. Nothing is trusted from the browser.
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { audit, COOKIE, cookieOptions, createUser, login, logout, requireUser, type Role } from '@/lib/auth';
import { db } from '@/lib/db';
import { ipHash } from '@/lib/security';
import { addNote, assign, setFollowUp, setStatus, updateDetails } from '@/lib/leads';
import { saveSiteSettings, setOverride, socialUrl, SOCIAL_KEYS, type SocialKey } from '@/lib/settings';
import { slugify } from '@/lib/validate';
import { num, str } from '@/lib/admin';

const clientIp = () => headers().get('x-forwarded-for')?.split(',')[0].trim() || headers().get('x-real-ip') || 'unknown';
function back(to: string, msg?: string): never { return redirect(msg ? `${to}${to.includes('?') ? '&' : '?'}msg=${encodeURIComponent(msg)}` : to); }

// ── sign in / out ──
export async function loginAction(fd: FormData) {
  const ip = clientIp();
  const recent = db().prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action = 'login_failed' AND ip_hash = ? AND created_at >= datetime('now', '-15 minutes')").get(ipHash(ip)) as { n: number };
  if (recent.n >= 10) back('/admin/login', 'Too many attempts from this device. Try again in 15 minutes.');
  const r = login(str(fd, 'email', 160), String(fd.get('password') ?? '').slice(0, 200), ip);
  if (!r.ok) back('/admin/login', r.reason === 'locked' ? 'This account is locked for a while after repeated failures.' : 'Wrong email or password.');
  else cookies().set(COOKIE, r.token, cookieOptions());
  redirect('/admin');
}

export async function logoutAction() {
  logout(cookies().get(COOKIE)?.value);
  cookies().set(COOKIE, '', { ...cookieOptions(0), maxAge: 0 });
  redirect('/admin/login');
}

// ── leads ──
export async function leadAction(fd: FormData) {
  const u = requireUser('leads', str(fd, 'csrf', 100));
  const id = Number(str(fd, 'id', 12)); const op = str(fd, 'op', 20);
  try {
    if (op === 'status') setStatus(id, str(fd, 'status', 30), u.id);
    else if (op === 'assign') { const o = str(fd, 'owner', 12); assign(id, o ? Number(o) : null, u.id); }
    else if (op === 'note') addNote(id, str(fd, 'note', 2000), u.id);
    else if (op === 'follow') setFollowUp(id, str(fd, 'date', 10) || null, u.id);
    else if (op === 'details') updateDetails(id, { name: str(fd, 'name', 120), company: str(fd, 'company', 150) || null, email: str(fd, 'email', 160).toLowerCase(), phone: str(fd, 'phone', 30) || null, country: str(fd, 'country', 80) || null, notes: str(fd, 'notes', 3000) || null }, u.id);
    else throw new Error('Unknown operation');
    audit(u, `lead_${op}`, 'lead', id);
  } catch (e) { back(`/admin/leads/${id}`, (e as Error).message); }
  revalidatePath('/admin/leads'); revalidatePath(`/admin/leads/${id}`);
  back(str(fd, 'return', 200).startsWith('/admin') ? str(fd, 'return', 200) : `/admin/leads/${id}`, 'Saved');
}

// ── blog ──
export async function postAction(fd: FormData) {
  const u = requireUser('blog', str(fd, 'csrf', 100));
  const id = Number(str(fd, 'id', 12)) || 0;
  if (str(fd, 'op', 10) === 'delete') { db().prepare('DELETE FROM posts WHERE id = ?').run(id); audit(u, 'post_delete', 'post', id); back('/admin/blog', 'Deleted'); }
  const title_en = str(fd, 'title_en', 200); const title_ar = str(fd, 'title_ar', 200);
  const body_en = str(fd, 'body_en', 30000); const body_ar = str(fd, 'body_ar', 30000);
  if (!title_en || !title_ar || !body_en || !body_ar) back(id ? `/admin/blog/${id}` : '/admin/blog/new', 'Title and body are needed in both languages.');
  const slug = slugify(str(fd, 'slug', 80) || title_en);
  if (!slug) back(id ? `/admin/blog/${id}` : '/admin/blog/new', 'The address (slug) is not valid.');
  const status = str(fd, 'status', 10) === 'published' ? 'published' : 'draft';
  const category = str(fd, 'category', 60) || 'erp-best-practices';
  try {
    if (id) {
      const prev = db().prepare('SELECT status FROM posts WHERE id = ?').get(id) as { status: string } | undefined;
      db().prepare(`UPDATE posts SET slug=?, category=?, status=?, title_ar=?, title_en=?, excerpt_ar=?, excerpt_en=?, body_ar=?, body_en=?, updated_at=datetime('now'),
        published_at = CASE WHEN ? = 'published' AND (published_at IS NULL OR ? <> 'published') THEN datetime('now') ELSE published_at END WHERE id=?`)
        .run(slug, category, status, title_ar, title_en, str(fd, 'excerpt_ar', 400), str(fd, 'excerpt_en', 400), body_ar, body_en, status, prev?.status ?? 'draft', id);
    } else {
      db().prepare(`INSERT INTO posts (slug, category, author_id, author_name, status, title_ar, title_en, excerpt_ar, excerpt_en, body_ar, body_en, published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?, CASE WHEN ?='published' THEN datetime('now') END)`)
        .run(slug, category, u.id, u.name, status, title_ar, title_en, str(fd, 'excerpt_ar', 400), str(fd, 'excerpt_en', 400), body_ar, body_en, status);
    }
  } catch (e) { back(id ? `/admin/blog/${id}` : '/admin/blog/new', /UNIQUE/.test((e as Error).message) ? 'Another article already uses this address.' : 'Could not save the article.'); }
  audit(u, 'post_save', 'post', id || slug, status);
  revalidatePath('/[lang]/blog', 'page');
  back('/admin/blog', status === 'published' ? 'Published' : 'Saved as draft');
}

// ── FAQ ──
export async function faqAction(fd: FormData) {
  const u = requireUser('faq', str(fd, 'csrf', 100));
  const id = Number(str(fd, 'id', 12)) || 0;
  if (str(fd, 'op', 10) === 'delete') { db().prepare('DELETE FROM faqs WHERE id = ?').run(id); audit(u, 'faq_delete', 'faq', id); back('/admin/faq', 'Deleted'); }
  const f = { q_ar: str(fd, 'q_ar', 300), q_en: str(fd, 'q_en', 300), a_ar: str(fd, 'a_ar', 3000), a_en: str(fd, 'a_en', 3000), sort: num(fd, 'sort') ?? 0, published: fd.get('published') ? 1 : 0 };
  if (!f.q_ar || !f.q_en || !f.a_ar || !f.a_en) back('/admin/faq', 'Question and answer are needed in both languages.');
  if (id) db().prepare('UPDATE faqs SET q_ar=?, q_en=?, a_ar=?, a_en=?, sort=?, published=? WHERE id=?').run(f.q_ar, f.q_en, f.a_ar, f.a_en, f.sort, f.published, id);
  else db().prepare('INSERT INTO faqs (q_ar, q_en, a_ar, a_en, sort, published) VALUES (?,?,?,?,?,?)').run(f.q_ar, f.q_en, f.a_ar, f.a_en, f.sort, f.published);
  audit(u, 'faq_save', 'faq', id || 'new');
  back('/admin/faq', 'Saved');
}

// ── texts (any interface text can be overridden per language; clearing a field restores the built-in text) ──
export async function textAction(fd: FormData) {
  const u = requireUser('content', str(fd, 'csrf', 100));
  const key = str(fd, 'key', 80);
  setOverride(key, 'ar', str(fd, 'ar', 4000)); setOverride(key, 'en', str(fd, 'en', 4000));
  audit(u, 'text_save', 'text', key);
  back('/admin/texts', 'Saved');
}

// ── settings ──
export async function settingsAction(fd: FormData) {
  const u = requireUser('content', str(fd, 'csrf', 100));
  const email = str(fd, 'email', 160); const notify = str(fd, 'notify_to', 160);
  const bad = [email, notify].find(v => v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v));
  if (bad) back('/admin/settings', 'An email address is not valid.');
  const whatsapp = str(fd, 'whatsapp', 20).replace(/\D/g, ''); const phone = str(fd, 'phone', 25).replace(/[^\d+]/g, '');
  const ga = str(fd, 'ga_id', 30);
  if (ga && !/^G-[A-Z0-9]+$/.test(ga)) back('/admin/settings', 'The Google Analytics id must look like G-XXXXXXXXXX.');
  const socials = {} as Record<SocialKey, string>;
  for (const k of SOCIAL_KEYS) {
    const v = str(fd, `social_${k}`, 300);
    if (v && !socialUrl(v)) back('/admin/settings', `The ${k} link must be a full https:// address.`);
    socials[k] = v;
  }
  saveSiteSettings({
    ...(email ? { email } : {}), ...(notify ? { notify_to: notify } : {}), ...(whatsapp ? { whatsapp } : {}), ...(phone ? { phone } : {}),
    ga_id: ga, socials, pricing_mode: str(fd, 'pricing_mode', 10) === 'plans' ? 'plans' : 'quote',
    announcement_ar: str(fd, 'announcement_ar', 300), announcement_en: str(fd, 'announcement_en', 300), show_testimonials: false,
  });
  audit(u, 'settings_save', 'settings');
  back('/admin/settings', 'Saved');
}

// ── pricing plans ──
export async function planAction(fd: FormData) {
  const u = requireUser('pricing', str(fd, 'csrf', 100));
  const id = Number(str(fd, 'id', 12)) || 0;
  if (str(fd, 'op', 10) === 'delete') { db().prepare('DELETE FROM pricing_plans WHERE id = ?').run(id); audit(u, 'plan_delete', 'plan', id); back('/admin/plans', 'Deleted'); }
  const p = { name_ar: str(fd, 'name_ar', 100), name_en: str(fd, 'name_en', 100), monthly: num(fd, 'monthly'), annual: num(fd, 'annual'), currency: str(fd, 'currency', 5).toUpperCase() || 'KWD', users: num(fd, 'users'), branches: num(fd, 'branches'), fa: str(fd, 'features_ar', 2000), fe: str(fd, 'features_en', 2000), cta: str(fd, 'cta', 60) || null, sort: num(fd, 'sort') ?? 0, published: fd.get('published') ? 1 : 0 };
  if (!p.name_ar || !p.name_en) back('/admin/plans', 'The plan needs a name in both languages.');
  if (id) db().prepare('UPDATE pricing_plans SET name_ar=?, name_en=?, monthly_price=?, annual_price=?, currency=?, users=?, branches=?, features_ar=?, features_en=?, cta=?, sort=?, published=? WHERE id=?').run(p.name_ar, p.name_en, p.monthly, p.annual, p.currency, p.users, p.branches, p.fa, p.fe, p.cta, p.sort, p.published, id);
  else db().prepare('INSERT INTO pricing_plans (name_ar, name_en, monthly_price, annual_price, currency, users, branches, features_ar, features_en, cta, sort, published) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').run(p.name_ar, p.name_en, p.monthly, p.annual, p.currency, p.users, p.branches, p.fa, p.fe, p.cta, p.sort, p.published);
  audit(u, 'plan_save', 'plan', id || 'new');
  back('/admin/plans', 'Saved');
}

// ── users (administrators only) ──
export async function userAction(fd: FormData) {
  const u = requireUser('users', str(fd, 'csrf', 100));
  const op = str(fd, 'op', 12);
  try {
    if (op === 'create') {
      const role = str(fd, 'role', 10) as Role;
      if (!['admin', 'sales', 'editor'].includes(role)) throw new Error('Unknown role');
      const id = createUser(str(fd, 'email', 160), str(fd, 'name', 100), role, String(fd.get('password') ?? ''));
      audit(u, 'user_create', 'user', id, role);
    } else if (op === 'toggle') {
      const id = Number(str(fd, 'id', 12));
      if (id === u.id) throw new Error('You cannot deactivate your own account.');
      db().prepare('UPDATE users SET active = 1 - active WHERE id = ?').run(id);
      db().prepare('DELETE FROM sessions WHERE user_id = ? AND (SELECT active FROM users WHERE id = ?) = 0').run(id, id);
      audit(u, 'user_toggle', 'user', id);
    } else throw new Error('Unknown operation');
  } catch (e) { back('/admin/users', (e as Error).message); }
  back('/admin/users', 'Saved');
}

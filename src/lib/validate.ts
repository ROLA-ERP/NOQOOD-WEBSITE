// Server-side validation of the public forms. The same rules run no matter what the browser sent.
import { z } from 'zod';

export const MODULES = ['finance', 'sales', 'purchasing', 'inventory', 'hr', 'bi', 'multi', 'automation'] as const;
export const INDUSTRIES = ['wholesale', 'retail', 'multi-branch', 'trading', 'services', 'contracting', 'food', 'other'] as const;
export const SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'] as const;
export const INQUIRY_TYPES = ['general', 'sales', 'support', 'partnership', 'pricing'] as const;
export const CONTACT_METHODS = ['email', 'phone', 'whatsapp'] as const;

const clean = (max: number) => z.string().trim().max(max).transform(s => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ''));
const phone = z.string().trim().max(30).regex(/^[+0-9()\-\s]{6,30}$/, 'phone').optional().or(z.literal('').transform(() => undefined));

export const contactSchema = z.object({
  name: clean(120).pipe(z.string().min(2)),
  company: clean(150).optional(),
  email: z.string().trim().toLowerCase().max(160).email(),
  phone,
  country: clean(80).optional(),
  industry: z.enum(INDUSTRIES).optional(),
  company_size: z.enum(SIZES).optional(),
  branches: clean(20).optional(),
  interest: z.array(z.enum(MODULES)).max(8).optional(),
  inquiry_type: z.enum(INQUIRY_TYPES).default('general'),
  message: clean(3000).pipe(z.string().min(5)),
  consent: z.literal(true, { errorMap: () => ({ message: 'consent' }) }),
  website: z.string().max(0).optional(), // honeypot: real visitors never fill it
  form_token: z.string().optional(),
  captcha: z.string().max(4000).optional(),
});

export const demoSchema = z.object({
  name: clean(120).pipe(z.string().min(2)),
  company: clean(150).pipe(z.string().min(2)),
  email: z.string().trim().toLowerCase().max(160).email(),
  phone: z.string().trim().max(30).regex(/^[+0-9()\-\s]{6,30}$/, 'phone'),
  country: clean(80).pipe(z.string().min(2)),
  industry: z.enum(INDUSTRIES),
  employees: z.enum(SIZES),
  branches: clean(20).optional(),
  interest: z.array(z.enum(MODULES)).min(1).max(8),
  requirements: clean(3000).optional(),
  contact_method: z.enum(CONTACT_METHODS).default('email'),
  preferred_at: clean(60).optional(),
  notes: clean(2000).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'consent' }) }),
  website: z.string().max(0).optional(),
  form_token: z.string().optional(),
  captcha: z.string().max(4000).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type DemoInput = z.infer<typeof demoSchema>;

/** A flat map { field: code } of what is wrong, so the form can show a localized message next to each field. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) { const k = String(issue.path[0] ?? 'form'); if (!out[k]) out[k] = issue.message === 'phone' || issue.message === 'consent' ? issue.message : issue.code; }
  return out;
}

/** CSV cells that start with = + - @ can run as formulas in Excel: prefix them, and quote everything. */
export function csvCell(v: unknown): string {
  let s = v === null || v === undefined ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export const slugify = (s: string): string => s.toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

import { handleSubmission } from '@/lib/submit';
import { clientIp, json, sameOrigin } from '@/lib/request';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false, error: 'origin' }, 403);
  let body: unknown;
  try { body = await req.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }
  const lang = new URL(req.url).searchParams.get('lang') === 'en' ? 'en' : 'ar';
  const r = await handleSubmission('contact', body, { ip: clientIp(req), userAgent: req.headers.get('user-agent') || '', lang });
  return json(r.body, r.status);
}

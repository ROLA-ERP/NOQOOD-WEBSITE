import { db } from '@/lib/db';
import { json } from '@/lib/request';

export const dynamic = 'force-dynamic';

export async function GET() {
  try { db().prepare('SELECT 1').get(); return json({ status: 'ok', db: 'ok', app: 'noqood-website' }); }
  catch { return json({ status: 'unavailable', db: 'error' }, 503); }
}

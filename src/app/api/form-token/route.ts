import { formToken } from '@/lib/security';
import { json } from '@/lib/request';

export const dynamic = 'force-dynamic';

/** A signed, time-stamped token the forms send back. Pages stay cacheable; the token is fetched when the form mounts. */
export async function GET() {
  return json({ token: formToken() });
}

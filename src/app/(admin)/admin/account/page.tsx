import { guard } from '@/lib/admin';
import { Flash, H1, Panel } from '@/components/AdminBits';
import { passwordAction } from '../actions';

export const dynamic = 'force-dynamic';

export default function Account({ searchParams }: { searchParams: { msg?: string } }) {
  const u = guard('dashboard');
  return (
    <>
      <H1>My account</H1><Flash msg={searchParams.msg} />
      <Panel title="Change my password">
        <p className="mb-3 text-sm text-ink-700">{u.name} · {u.email}</p>
        <form action={passwordAction} className="grid max-w-md gap-3">
          <input type="hidden" name="csrf" value={u.csrf} />
          <input name="current" type="password" required autoComplete="current-password" placeholder="Current password" className="field" aria-label="Current password" />
          <input name="new" type="password" required minLength={12} autoComplete="new-password" placeholder="New password (12+ characters, letters and digits)" className="field" aria-label="New password" />
          <input name="again" type="password" required minLength={12} autoComplete="new-password" placeholder="New password again" className="field" aria-label="New password again" />
          <button className="btn btn-primary !py-2 w-40" type="submit">Change password</button>
        </form>
      </Panel>
    </>
  );
}

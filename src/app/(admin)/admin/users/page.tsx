import { guard } from '@/lib/admin';
import { db } from '@/lib/db';
import { Flash, H1, Panel } from '@/components/AdminBits';
import { userAction } from '../actions';

export const dynamic = 'force-dynamic';

export default function Users({ searchParams }: { searchParams: { msg?: string } }) {
  const u = guard('users');
  const rows = db().prepare("SELECT id, email, name, role, active, last_login_at, (locked_until IS NOT NULL AND locked_until > datetime('now')) AS locked FROM users ORDER BY id").all() as unknown as { id: number; email: string; name: string; role: string; active: number; last_login_at: string | null; locked: number }[];
  return (
    <>
      <H1>Users and roles</H1><Flash msg={searchParams.msg} />
      <p className="mb-4 text-sm text-ink-700">Admin: everything. Sales: leads and CSV export. Editor: blog, FAQ, texts and pricing content.</p>
      <Panel title="Add a user">
        <form action={userAction} className="grid gap-3 sm:grid-cols-4">
          <input type="hidden" name="csrf" value={u.csrf} /><input type="hidden" name="op" value="create" />
          <input name="name" required placeholder="Full name" className="field" aria-label="Full name" />
          <input name="email" type="email" required placeholder="Email" className="field" aria-label="Email" />
          <select name="role" className="field" aria-label="Role"><option value="sales">Sales</option><option value="editor">Editor</option><option value="admin">Admin</option></select>
          <input name="password" type="password" required minLength={12} autoComplete="new-password" placeholder="Password (12+ characters)" className="field" aria-label="Password" />
          <button className="btn btn-primary !py-2 sm:col-span-4 sm:w-40" type="submit">Create user</button>
        </form>
      </Panel>
      <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white"><table className="w-full min-w-[560px] text-sm">
        <thead className="bg-ink-50 text-xs text-ink-500"><tr>{['Name', 'Email', 'Role', 'Last sign-in', 'Active', 'Recovery'].map(h => <th key={h} className="p-3 text-start">{h}</th>)}</tr></thead>
        <tbody>{rows.map(r => <tr key={r.id} className="border-t border-ink-100"><td className="p-3">{r.name}</td><td className="p-3" dir="ltr">{r.email}</td><td className="p-3"><form action={userAction} className="flex gap-1"><input type="hidden" name="csrf" value={u.csrf} /><input type="hidden" name="op" value="role" /><input type="hidden" name="id" value={r.id} /><select name="role" defaultValue={r.role} className="field !py-1 text-xs" aria-label="Role"><option value="sales">sales</option><option value="editor">editor</option><option value="admin">admin</option></select><button className="rounded-lg border border-ink-300 px-2 text-xs" type="submit">Set</button></form></td><td className="p-3 text-xs text-ink-500">{r.last_login_at || '—'}</td>
          <td className="p-3"><form action={userAction}><input type="hidden" name="csrf" value={u.csrf} /><input type="hidden" name="op" value="toggle" /><input type="hidden" name="id" value={r.id} /><button className="rounded-lg border border-ink-300 px-3 py-1 text-xs font-semibold" type="submit" disabled={r.id === u.id}>{r.active ? 'Active — deactivate' : 'Inactive — activate'}</button></form></td>
          <td className="p-3"><form action={userAction} className="flex flex-wrap gap-1"><input type="hidden" name="csrf" value={u.csrf} /><input type="hidden" name="id" value={r.id} />
            <input name="password" type="password" minLength={12} autoComplete="new-password" placeholder="New password" className="field !py-1 text-xs" aria-label={`New password for ${r.name}`} />
            <button className="rounded-lg border border-ink-300 px-2 text-xs font-semibold" type="submit" name="op" value="reset">Reset password</button>
            {r.locked ? <button className="rounded-lg border border-ink-300 px-2 text-xs font-semibold" type="submit" name="op" value="unlock" formNoValidate>Unlock</button> : null}</form></td></tr>)}</tbody>
      </table></div>
    </>
  );
}

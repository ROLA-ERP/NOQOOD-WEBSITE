import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { loginAction } from '../actions';

export const dynamic = 'force-dynamic';

export default function Login({ searchParams }: { searchParams: { msg?: string } }) {
  if (currentUser()) redirect('/admin');
  return (
    <div className="mx-auto mt-16 max-w-sm rounded-2xl border border-ink-100 bg-white p-8 shadow-soft">
      <h1 className="text-2xl font-extrabold text-navy-900">Admin sign in</h1>
      {searchParams.msg && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{searchParams.msg}</p>}
      <form action={loginAction} className="mt-6 space-y-4">
        <div><label htmlFor="email" className="label">Email</label><input id="email" name="email" type="email" required autoComplete="username" className="field" /></div>
        <div><label htmlFor="password" className="label">Password</label><input id="password" name="password" type="password" required autoComplete="current-password" className="field" /></div>
        <button type="submit" className="btn btn-primary w-full">Sign in</button>
      </form>
    </div>
  );
}

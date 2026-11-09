'use client';
import { useEffect, useState, type FormEvent } from 'react';

export interface Opt { value: string; label: string }
export interface FormLabels {
  name: string; company: string; email: string; phone: string; country: string; industry: string; size: string; branches: string; interest: string; inquiry: string; message: string;
  requirements: string; method: string; when: string; notes: string; consent: string; send: string; sending: string; select: string; required: string;
  okTitle: string; okBody: string; okNext: string; errNetwork: string; errors: Record<string, string>; privacyHref: string; privacyLabel: string;
}

type Kind = 'contact' | 'demo';
type Values = Record<string, string | string[] | boolean>;

export default function LeadForm({ kind, lang, labels, industries, sizes, modules, inquiries, methods }: {
  kind: Kind; lang: 'ar' | 'en'; labels: FormLabels; industries: Opt[]; sizes: Opt[]; modules: Opt[]; inquiries: Opt[]; methods: Opt[];
}) {
  const [token, setToken] = useState('');
  const [vals, setVals] = useState<Values>({ interest: [], consent: false, website: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState('');
  const [leadCode, setLeadCode] = useState('');

  useEffect(() => { fetch('/api/form-token', { cache: 'no-store' }).then(r => r.json()).then(d => setToken(d.token || '')).catch(() => setToken('')); }, []);

  const set = (k: string, v: string | string[] | boolean) => setVals(p => ({ ...p, [k]: v }));
  const toggleModule = (m: string) => { const cur = (vals.interest as string[]) || []; set('interest', cur.includes(m) ? cur.filter(x => x !== m) : [...cur, m]); };
  const msg = (code: string) => labels.errors[code] || labels.errors.invalid_string;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBanner(''); setErrors({});
    const local: Record<string, string> = {};
    const need = kind === 'demo' ? ['name', 'company', 'email', 'phone', 'country', 'industry', 'employees'] : ['name', 'email', 'message'];
    for (const k of need) if (!String(vals[k] || '').trim()) local[k] = 'required';
    if (kind === 'demo' && !((vals.interest as string[]) || []).length) local.interest = 'required';
    if (!vals.consent) local.consent = 'consent';
    if (Object.keys(local).length) { setErrors(local); return; }
    setState('sending');
    try {
      const body: Record<string, unknown> = { ...vals, form_token: token };
      for (const k of Object.keys(body)) if (body[k] === '') delete body[k];
      const res = await fetch(`/api/${kind}?lang=${lang}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok === true) { setLeadCode(data.leadCode); setState('done'); return; } // success only after the server stored the request
      setState('idle');
      if (data?.fields) { setErrors(data.fields); return; }
      setBanner(data?.error ? (labels.errors[data.error] || labels.errNetwork) : labels.errNetwork);
      if (data?.error === 'expired_form' || data?.error === 'too_fast') fetch('/api/form-token', { cache: 'no-store' }).then(r => r.json()).then(d => setToken(d.token || '')).catch(() => undefined);
    } catch { setState('idle'); setBanner(labels.errNetwork); }
  }

  if (state === 'done') {
    return (
      <div role="status" className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
        <h2 className="text-2xl font-extrabold text-navy-900">{labels.okTitle}</h2>
        <p className="mt-3 text-ink-700">{labels.okBody} <strong dir="ltr" className="font-mono">{leadCode}</strong></p>
        <p className="mt-2 text-sm text-ink-700">{labels.okNext}</p>
      </div>
    );
  }

  // plain render functions (not components) so inputs keep focus while typing
  const Field = ({ k, label, type = 'text', req = false, auto }: { k: string; label: string; type?: string; req?: boolean; auto?: string }) => (
    <div key={k}>
      <label htmlFor={`${kind}-${k}`} className="label">{label}{req && <span className="text-red-600"> *</span>}</label>
      <input id={`${kind}-${k}`} name={k} type={type} autoComplete={auto} dir={type === 'email' || type === 'tel' ? 'ltr' : undefined} className="field" value={String(vals[k] || '')} onChange={e => set(k, e.target.value)} aria-invalid={Boolean(errors[k])} aria-describedby={errors[k] ? `${kind}-${k}-e` : undefined} required={req} />
      {errors[k] && <p id={`${kind}-${k}-e`} className="err">{msg(errors[k])}</p>}
    </div>
  );
  const Select = ({ k, label, options, req = false }: { k: string; label: string; options: Opt[]; req?: boolean }) => (
    <div key={k}>
      <label htmlFor={`${kind}-${k}`} className="label">{label}{req && <span className="text-red-600"> *</span>}</label>
      <select id={`${kind}-${k}`} name={k} className="field" value={String(vals[k] || '')} onChange={e => set(k, e.target.value)} aria-invalid={Boolean(errors[k])} aria-describedby={errors[k] ? `${kind}-${k}-e` : undefined} required={req}>
        <option value="">{labels.select}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {errors[k] && <p id={`${kind}-${k}-e`} className="err">{msg(errors[k])}</p>}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="space-y-5" aria-describedby={banner ? `${kind}-banner` : undefined}>
      {banner && <p id={`${kind}-banner`} role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-semibold text-red-700">{banner}</p>}
      {/* honeypot: hidden from people and assistive tech, bots fill it */}
      <div aria-hidden="true" style={{ position: 'absolute', insetInlineStart: '-9999px', height: 0, overflow: 'hidden' }}>
        <label>Website<input tabIndex={-1} autoComplete="off" name="website" value={String(vals.website || '')} onChange={e => set('website', e.target.value)} /></label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {Field({ k: "name", label: labels.name, req: true, auto: "name" })}
        {Field({ k: "company", label: labels.company, req: kind === 'demo', auto: "organization" })}
        {Field({ k: "email", label: labels.email, type: "email", req: true, auto: "email" })}
        {Field({ k: "phone", label: labels.phone, type: "tel", req: kind === 'demo', auto: "tel" })}
        {Field({ k: "country", label: labels.country, req: kind === 'demo', auto: "country-name" })}
        {Select({ k: "industry", label: labels.industry, options: industries, req: kind === 'demo' })}
        {Select({ k: kind === 'demo' ? 'employees' : 'company_size', label: labels.size, options: sizes, req: kind === 'demo' })}
        {Field({ k: "branches", label: labels.branches })}
        {kind === 'contact' && Select({ k: 'inquiry_type', label: labels.inquiry, options: inquiries })}
        {kind === 'demo' && Select({ k: 'contact_method', label: labels.method, options: methods })}
      </div>
      <fieldset>
        <legend className="label">{labels.interest}{kind === 'demo' && <span className="text-red-600"> *</span>}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {modules.map(m => (
            <label key={m.value} className="flex items-center gap-2 rounded-lg border border-ink-100 px-3 py-2 text-sm">
              <input type="checkbox" checked={((vals.interest as string[]) || []).includes(m.value)} onChange={() => toggleModule(m.value)} className="h-4 w-4 accent-teal-600" />{m.label}
            </label>
          ))}
        </div>
        {errors.interest && <p className="err">{msg(errors.interest)}</p>}
      </fieldset>
      {kind === 'contact' ? (
        <div>
          <label htmlFor="contact-message" className="label">{labels.message} <span className="text-red-600">*</span></label>
          <textarea id="contact-message" name="message" rows={5} className="field" maxLength={3000} value={String(vals.message || '')} onChange={e => set('message', e.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-e' : undefined} />
          {errors.message && <p id="contact-message-e" className="err">{msg(errors.message)}</p>}
        </div>
      ) : (
        <>
          <div>
            <label htmlFor="demo-requirements" className="label">{labels.requirements}</label>
            <textarea id="demo-requirements" name="requirements" rows={4} className="field" maxLength={3000} value={String(vals.requirements || '')} onChange={e => set('requirements', e.target.value)} />
          </div>
          {Field({ k: "preferred_at", label: labels.when })}
          <div>
            <label htmlFor="demo-notes" className="label">{labels.notes}</label>
            <textarea id="demo-notes" name="notes" rows={3} className="field" maxLength={2000} value={String(vals.notes || '')} onChange={e => set('notes', e.target.value)} />
          </div>
        </>
      )}
      <div>
        <label className="flex items-start gap-3 text-sm text-ink-700">
          <input type="checkbox" checked={Boolean(vals.consent)} onChange={e => set('consent', e.target.checked)} className="mt-1 h-4 w-4 accent-teal-600" aria-invalid={Boolean(errors.consent)} />
          <span>{labels.consent} <a href={labels.privacyHref} className="font-semibold text-teal-700 underline">{labels.privacyLabel}</a></span>
        </label>
        {errors.consent && <p className="err">{msg('consent')}</p>}
      </div>
      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={state === 'sending' || !token}>{state === 'sending' ? labels.sending : labels.send}</button>
    </form>
  );
}

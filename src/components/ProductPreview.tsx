import type { Lang } from '@/lib/i18n';

// Illustrative interface previews drawn for the website. They contain NO real company data and are labelled as illustrations.
type Kind = 'ledger' | 'sales' | 'purchases' | 'stock' | 'hr' | 'reports' | 'branches' | 'assistant';

const TITLES: Record<Kind, { ar: string; en: string }> = {
  ledger: { ar: 'ميزان المراجعة', en: 'Trial balance' }, sales: { ar: 'فواتير المبيعات', en: 'Sales invoices' }, purchases: { ar: 'أوامر الشراء', en: 'Purchase orders' },
  stock: { ar: 'أرصدة المخزون', en: 'Stock balances' }, hr: { ar: 'الحضور والرواتب', en: 'Attendance & payroll' }, reports: { ar: 'لوحة القيادة', en: 'Dashboard' },
  branches: { ar: 'مقارنة الفروع', en: 'Branch comparison' }, assistant: { ar: 'المساعد', en: 'Assistant' },
};
const ROWS: Record<Kind, string[][]> = {
  ledger: [['1100', 'Cash', '— — —', '— — —'], ['1200', 'Receivables', '— — —', '— — —'], ['2100', 'Payables', '— — —', '— — —'], ['4100', 'Revenue', '— — —', '— — —']],
  sales: [['INV-0001', 'Customer A', 'Draft', '— — —'], ['INV-0002', 'Customer B', 'Posted', '— — —'], ['INV-0003', 'Customer C', 'Paid', '— — —']],
  purchases: [['PO-0001', 'Supplier A', 'Open', '— — —'], ['PO-0002', 'Supplier B', 'Received', '— — —'], ['PO-0003', 'Supplier C', 'Open', '— — —']],
  stock: [['SKU-01', 'Item one', 'WH-1', '— —'], ['SKU-02', 'Item two', 'WH-2', '— —'], ['SKU-03', 'Item three', 'WH-1', '— —']],
  hr: [['EMP-01', 'Employee A', 'Present', '— —'], ['EMP-02', 'Employee B', 'Leave', '— —'], ['EMP-03', 'Employee C', 'Present', '— —']],
  reports: [], branches: [], assistant: [],
};

export default function ProductPreview({ kind, lang }: { kind: Kind; lang: Lang }) {
  const title = TITLES[kind][lang];
  const note = lang === 'ar' ? 'معاينة توضيحية — لا تحتوي بيانات حقيقية' : 'Illustrative preview — contains no real data';
  const bars = [38, 62, 48, 80, 56, 90, 70];
  return (
    <figure className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-lift" aria-label={`${title} — ${note}`}>
      <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-50 px-4 py-2.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" /><span className="h-2.5 w-2.5 rounded-full bg-gold-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ms-3 text-xs font-bold text-navy-800">{title}</span>
      </div>
      <div className="p-4" aria-hidden="true" dir="ltr">
        {ROWS[kind].length > 0 && (
          <table className="w-full text-xs"><tbody>
            {ROWS[kind].map((r, i) => <tr key={i} className="border-b border-ink-100 last:border-0">{r.map((c, j) => <td key={j} className={`py-2 ${j === 0 ? 'font-mono text-ink-500' : 'text-ink-700'} ${j === r.length - 1 ? 'text-right font-semibold text-navy-800' : ''}`}>{c}</td>)}</tr>)}
          </tbody></table>
        )}
        {kind === 'reports' && (
          <div className="flex h-36 items-end gap-2">{bars.map((h, i) => <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-teal-600 to-emerald-400" style={{ height: `${h}%` }} />)}</div>
        )}
        {kind === 'branches' && (
          <div className="space-y-3">{[['Branch A', 82], ['Branch B', 61], ['Branch C', 44]].map(([n, w]) => <div key={String(n)}><p className="mb-1 text-xs text-ink-700">{n}</p><div className="h-2.5 rounded-full bg-ink-100"><div className="h-2.5 rounded-full bg-teal-500" style={{ width: `${w}%` }} /></div></div>)}</div>
        )}
        {kind === 'assistant' && (
          <div className="space-y-2 text-xs"><p className="ms-auto w-4/5 rounded-xl bg-navy-800 p-3 text-white">{lang === 'ar' ? 'سؤال عن بيانات الشركة' : 'A question about company data'}</p><p className="w-4/5 rounded-xl bg-ink-100 p-3 text-ink-700">{lang === 'ar' ? 'إجابة من بيانات الشركة' : 'An answer drawn from company data'}</p></div>
        )}
      </div>
      <figcaption className="border-t border-ink-100 bg-ink-50 px-4 py-2 text-center text-[11px] font-semibold text-ink-500">{note}</figcaption>
    </figure>
  );
}

// First-run content: frequently asked questions (published) and sample articles (DRAFTS: an editor reviews and publishes them).
import { db } from '@/lib/db';

const FAQS: [string, string, string, string][] = [
  ['ما هو نظام نقود؟', 'What is NOQOOD ERP?', 'نقود نظام متكامل لإدارة الحسابات والمبيعات والمشتريات والمخزون والموارد البشرية، مع مركز تقارير ولوحات قيادة.', 'NOQOOD is an integrated system for accounting, sales, purchasing, inventory and human resources, with a reporting center and dashboards.'],
  ['هل النظام متاح بالعربية والإنجليزية؟', 'Is the system available in Arabic and English?', 'نعم. الواجهة بالعربية والإنجليزية، مع دعم كامل للتخطيط من اليمين لليسار.', 'Yes. The interface is in Arabic and English, with full right-to-left support.'],
  ['هل يدعم عدة شركات وفروع؟', 'Does it support several companies and branches?', 'نعم. يمكن إدارة أكثر من شركة وفرع بحساب واحد، مع عزل البيانات بين الشركات وصلاحيات على مستوى الفرع.', 'Yes. You can manage more than one company and branch with one login, with data isolated between companies and permissions at branch level.'],
  ['كيف أحصل على عرض تجريبي؟', 'How do I get a demo?', 'املأ نموذج طلب العرض وسيتواصل معك فريق المبيعات لترتيب الوقت المناسب. تقديم الطلب لا يعني حجز موعد قبل أن نؤكده معك.', 'Fill in the demo request form and our sales team will contact you to arrange a suitable time. Submitting a request is not a booking until we confirm it with you.'],
  ['كم تبلغ الأسعار؟', 'How much does it cost?', 'تعتمد التكلفة على عدد المستخدمين والفروع والوحدات المطلوبة، لذلك نعد لك عرض سعر مخصصًا بعد فهم احتياجاتك.', 'The cost depends on the number of users, branches and modules you need, so we prepare a tailored quote after understanding your needs.'],
  ['هل بياناتي محمية؟', 'Is my data protected?', 'يعتمد النظام على صلاحيات دقيقة وعزل بين الشركات وحماية لبيانات الموظفين الحساسة وسجل تدقيق ونسخ احتياطي يومي.', 'The system uses precise permissions, isolation between companies, protection of sensitive employee data, an audit trail and a daily backup.'],
  ['هل يوجد ذكاء اصطناعي في النظام؟', 'Does the system include AI?', 'يتضمن النظام مساعدًا للموارد البشرية يجيب عن الأسئلة من بيانات شركتك اعتمادًا على قواعد، ولا يستخدم نموذجًا توليديًا خارجيًا. لا نعد بقدرات ذكاء اصطناعي غير موجودة.', 'The system includes an HR assistant that answers questions from your company’s data using rules, and does not use an external generative model. We do not promise AI capabilities that do not exist.'],
  ['هل ينتقل بياناتي من نظامي الحالي؟', 'Can you migrate data from my current system?', 'نساعد في نقل الأرصدة والبيانات الأساسية. يتحدد نطاق النقل بعد دراسة بياناتك الحالية.', 'We help move balances and master data. The scope is set after studying your current data.'],
];

const POSTS: { slug: string; cat: string; ar: [string, string, string]; en: [string, string, string] }[] = [
  {
    slug: 'month-end-close-checklist', cat: 'accounting-insights',
    ar: ['قائمة تدقيق لإقفال نهاية الشهر', 'خطوات عملية لتسريع الإقفال المحاسبي وتقليل الأخطاء.', 'الإقفال السريع يبدأ من أول الشهر لا من آخره.\n\nراجع الحسابات الفرعية مقابل الدفتر، وطابق البنوك، وتأكد من ترحيل الرواتب والمخصصات، وراجع الفواتير المعلقة. كلما كانت البيانات تتدفق تلقائيًا من المبيعات والمشتريات إلى الدفاتر، قل ما تحتاج مراجعته يدويًا.'],
    en: ['A month-end close checklist', 'Practical steps to speed up the accounting close and reduce errors.', 'A fast close starts at the beginning of the month, not the end.\n\nCompare sub-ledgers with the ledger, reconcile the banks, make sure payroll and provisions are posted, and review pending invoices. The more data flows automatically from sales and purchasing into the books, the less you have to review by hand.'],
  },
  {
    slug: 'managing-multiple-branches', cat: 'multi-branch-management',
    ar: ['كيف تدير عدة فروع بوضوح', 'مبادئ لمقارنة الفروع ومنح الصلاحيات المناسبة.', 'عند تعدد الفروع يلزم تعريف واحد للأرقام. قارن الفروع بالمؤشرات نفسها، وامنح كل مستخدم صلاحية على فرعه، وراجع تقارير الفروع بانتظام.'],
    en: ['How to manage several branches with clarity', 'Principles for comparing branches and granting the right permissions.', 'With several branches you need one definition of the numbers. Compare branches on the same indicators, give each user access to their own branch, and review branch reports regularly.'],
  },
  {
    slug: 'payroll-accuracy-basics', cat: 'hr-management',
    ar: ['أساسيات دقة الرواتب', 'كيف تتجنب أخطاء الرواتب الشائعة قبل الاعتماد.', 'راجع الحضور والإجازات والسلف قبل اعتماد المسير، وقارن الصافي مع الشهر السابق، وتحقق من بيانات البنك. فحوص آلية تكشف القفزات غير المبررة تساعد كثيرًا.'],
    en: ['Payroll accuracy basics', 'How to avoid common payroll errors before approval.', 'Review attendance, leave and loans before approving the run, compare net pay with the previous month, and check bank details. Automatic checks that flag unexplained jumps help a great deal.'],
  },
  {
    slug: 'inventory-accuracy', cat: 'inventory-optimization',
    ar: ['خطوات لرفع دقة المخزون', 'ربط الشراء والبيع والتحويل لتكون الأرصدة موثوقة.', 'تأتي دقة المخزون من تسجيل كل حركة. اربط استلام البضاعة بالمشتريات، وسجّل التحويلات بين المستودعات، وطابق الأرصدة بتقارير التقييم دوريًا.'],
    en: ['Steps to raise inventory accuracy', 'Connect buying, selling and transfers so balances can be trusted.', 'Inventory accuracy comes from recording every movement. Tie goods receipt to purchasing, record transfers between warehouses, and compare balances with valuation reports regularly.'],
  },
];

let done = false;
/**
 * Inserts the starter content once (a marker in settings records it), inside one write transaction so parallel workers cannot both insert.
 * Deleting every article or question later does not bring the starter content back.
 */
export function ensureSeed(): void {
  if (done) return;
  const d = db();
  try {
    d.exec('BEGIN IMMEDIATE');
    const marker = d.prepare("SELECT 1 AS x FROM settings WHERE key = 'seeded'").get();
    if (!marker) {
      const fi = d.prepare('INSERT INTO faqs (sort, published, q_ar, q_en, a_ar, a_en) VALUES (?, 1, ?, ?, ?, ?)');
      FAQS.forEach((f, i) => fi.run(i, f[0], f[1], f[2], f[3]));
      const pi = d.prepare("INSERT OR IGNORE INTO posts (slug, category, author_name, status, title_ar, title_en, excerpt_ar, excerpt_en, body_ar, body_en) VALUES (?, ?, 'NOQOOD Team', 'draft', ?, ?, ?, ?, ?, ?)");
      for (const p of POSTS) pi.run(p.slug, p.cat, p.ar[0], p.en[0], p.ar[1], p.en[1], p.ar[2], p.en[2]);
      d.prepare("INSERT INTO settings (key, value) VALUES ('seeded', '1')").run();
    }
    d.exec('COMMIT');
    done = true;
  } catch (e) {
    try { d.exec('ROLLBACK'); } catch { /* nothing open */ }
    console.error('[seed]', (e as Error).message);
  }
}

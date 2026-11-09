import type { L } from '@/lib/i18n';

// Every feature listed here was confirmed in the ERP source code and its automated tests (see docs/ERP_FEATURE_DISCOVERY.md).
// status "partial" means the capability exists with a narrower scope than the name suggests; it is shown with a note, never as a headline.
export type Status = 'implemented' | 'partial';
export interface Feature { title: L; text: L; status?: Status }
export interface ModuleDef {
  slug: string; key: string; icon: string; name: L; tagline: L; value: L; features: Feature[]; benefits: L[]; related: string[]; preview: 'ledger' | 'sales' | 'purchases' | 'stock' | 'hr' | 'reports' | 'branches' | 'assistant';
}

export const MODULES: ModuleDef[] = [
  {
    slug: 'financial-accounting', key: 'finance', icon: 'ledger', preview: 'ledger',
    name: { ar: 'المحاسبة المالية', en: 'Financial Accounting' },
    tagline: { ar: 'دفاتر دقيقة وقوائم مالية جاهزة في أي وقت', en: 'Accurate books and financial statements, any time' },
    value: { ar: 'كل قيد محاسبي في مكانه الصحيح. تنتقل العمليات من المبيعات والمشتريات والرواتب إلى الدفاتر تلقائيًا، فتبقى الأرصدة والقوائم المالية متسقة وقابلة للتتبع حتى أصل القيد.', en: 'Every entry lands in the right place. Sales, purchasing and payroll flow into the ledger automatically, so balances and statements stay consistent and traceable back to the source entry.' },
    features: [
      { title: { ar: 'دليل الحسابات', en: 'Chart of accounts' }, text: { ar: 'شجرة حسابات متعددة المستويات مع قوالب جاهزة لبدء شركة جديدة.', en: 'A multi-level chart with ready templates to start a new company.' } },
      { title: { ar: 'القيود اليومية', en: 'Journal entries' }, text: { ar: 'قيود مسودة ثم اعتماد وترحيل، مع عكس القيد عند الحاجة وأثر واضح لكل تغيير.', en: 'Draft, approve and post, with reversal when needed and a clear trail for every change.' } },
      { title: { ar: 'ميزان المراجعة والقوائم المالية', en: 'Trial balance & statements' }, text: { ar: 'ميزان المراجعة وقائمة الدخل والمركز المالي والتدفقات النقدية بفلاتر للفترة والفرع.', en: 'Trial balance, income statement, balance sheet and cash flow, filtered by period and branch.' } },
      { title: { ar: 'كشوف حساب العملاء والموردين', en: 'Customer & supplier statements' }, text: { ar: 'كشف حساب تفصيلي لأي عميل أو مورد أو حساب في الدفتر، مع أعمار الديون.', en: 'Detailed statements for any customer, supplier or ledger account, with ageing.' } },
      { title: { ar: 'سندات القبض والصرف', en: 'Payment & receipt vouchers' }, text: { ar: 'سندات مع تخصيص على الفواتير ومرفقات خاصة محمية.', en: 'Vouchers allocated to invoices with protected private attachments.' } },
      { title: { ar: 'المطابقة البنكية', en: 'Bank reconciliation' }, text: { ar: 'مطابقة كشف البنك مع الدفاتر ومطابقة تلقائية للمبالغ المتساوية.', en: 'Match bank statements to the books, with automatic matching of equal amounts.' } },
      { title: { ar: 'مراكز التكلفة', en: 'Cost centers' }, text: { ar: 'توزيع المصروفات على مراكز التكلفة وتقارير حسب المركز.', en: 'Allocate expenses to cost centers and report by center.' } },
      { title: { ar: 'الضريبة والعملات', en: 'Tax & currencies' }, text: { ar: 'إعداد الضريبة وتقارير ضريبة القيمة المضافة، وسندات بعملات متعددة.', en: 'Tax setup and VAT reports, plus multi-currency vouchers.' } },
      { title: { ar: 'الموازنات', en: 'Budgeting' }, text: { ar: 'تقارير مقارنة الموازنة بالفعلي. أدوات إدخال الموازنات بنطاق محدود.', en: 'Budget-versus-actual reports. Budget entry tools have a limited scope.' }, status: 'partial' },
    ],
    benefits: [
      { ar: 'قوائم مالية دقيقة بلا إعادة إدخال', en: 'Accurate statements without re-entry' }, { ar: 'تتبع كل رقم إلى مصدره', en: 'Trace every figure to its source' }, { ar: 'إقفال أسرع وأخطاء أقل', en: 'Faster closing, fewer errors' },
    ],
    related: ['sales-management', 'purchasing', 'business-intelligence'],
  },
  {
    slug: 'sales-management', key: 'sales', icon: 'sales', preview: 'sales',
    name: { ar: 'إدارة المبيعات', en: 'Sales Management' },
    tagline: { ar: 'من عرض السعر إلى التحصيل في مسار واحد', en: 'From quotation to collection in one flow' },
    value: { ar: 'تابع دورة البيع كاملة: عروض الأسعار وأوامر البيع والفواتير والتحصيل وحسابات العملاء، مع تحليلات تظهر أداء الفروع والمنتجات.', en: 'Follow the whole selling cycle: quotations, orders, invoices, collections and customer accounts, with analytics on branch and product performance.' },
    features: [
      { title: { ar: 'عروض الأسعار وأوامر البيع', en: 'Quotations & sales orders' }, text: { ar: 'عروض أسعار تتحول إلى أوامر وفواتير دون إعادة إدخال.', en: 'Quotations that convert into orders and invoices without re-entry.' } },
      { title: { ar: 'فواتير المبيعات', en: 'Sales invoices' }, text: { ar: 'فواتير بضريبة وتسعير وخصومات، واعتماد قبل الترحيل عند الحاجة.', en: 'Invoices with tax, pricing and discounts, with optional approval before posting.' } },
      { title: { ar: 'إشعارات دائنة ومرتجعات', en: 'Credit notes & returns' }, text: { ar: 'إشعارات دائنة مرتبطة بالفاتورة الأصلية وتؤثر على رصيد العميل.', en: 'Credit notes linked to the original invoice that adjust the customer balance.' } },
      { title: { ar: 'حسابات العملاء والتحصيل', en: 'Customer accounts & collections' }, text: { ar: 'أرصدة وأعمار ديون وسندات قبض مخصصة على الفواتير.', en: 'Balances, ageing and receipts allocated to invoices.' } },
      { title: { ar: 'صفحة الطلبات الأونلاين للعملاء', en: 'Customer online ordering page' }, text: { ar: 'صفحة طلب عامة للعملاء مع كتالوج ومتابعة الطلبات، تتحول طلباتها إلى فواتير.', en: 'A public ordering page for customers with a catalogue and order tracking; orders become invoices.' } },
      { title: { ar: 'تقارير المبيعات وأداء الفروع', en: 'Sales reports & branch performance' }, text: { ar: 'تقارير حسب الفرع والعميل والمنتج والمندوب والفترة.', en: 'Reports by branch, customer, product, salesperson and period.' } },
    ],
    benefits: [{ ar: 'تحصيل أسرع', en: 'Faster collection' }, { ar: 'رؤية واضحة لأداء كل فرع', en: 'Clear view of each branch' }, { ar: 'تقليل الأخطاء بين البيع والمحاسبة', en: 'Fewer errors between sales and accounting' }],
    related: ['financial-accounting', 'inventory', 'business-intelligence'],
  },
  {
    slug: 'purchasing', key: 'purchasing', icon: 'purchases', preview: 'purchases',
    name: { ar: 'المشتريات', en: 'Purchasing' },
    tagline: { ar: 'تحكم في الشراء من الطلب حتى السداد', en: 'Control buying from order to payment' },
    value: { ar: 'نظّم الشراء من الموردين: أوامر الشراء واستلام البضاعة وفواتير الموردين والسداد، مع كشوف حساب وتقارير تكشف الالتزامات.', en: 'Organise supplier buying: purchase orders, goods receipt, supplier invoices and payment, with statements and reports that expose your obligations.' },
    features: [
      { title: { ar: 'أوامر الشراء', en: 'Purchase orders' }, text: { ar: 'أوامر شراء مرتبطة بالموردين والمستودعات.', en: 'Purchase orders tied to suppliers and warehouses.' } },
      { title: { ar: 'استلام البضاعة', en: 'Goods receipt' }, text: { ar: 'استلام جزئي أو كامل يحدّث المخزون والالتزامات.', en: 'Partial or full receipt that updates stock and obligations.' } },
      { title: { ar: 'فواتير الموردين', en: 'Supplier invoices' }, text: { ar: 'فواتير موردين بضريبة، مع اعتماد قبل التأثير على الدفاتر.', en: 'Supplier invoices with tax and approval before they hit the books.' } },
      { title: { ar: 'حسابات الموردين والسداد', en: 'Supplier accounts & payments' }, text: { ar: 'أرصدة وأعمار ديون وسندات صرف مخصصة على الفواتير.', en: 'Balances, ageing and payment vouchers allocated to invoices.' } },
      { title: { ar: 'تقارير المشتريات', en: 'Purchasing reports' }, text: { ar: 'تحليلات حسب المورد والصنف والفترة والالتزامات المستحقة.', en: 'Analytics by supplier, item, period and outstanding obligations.' } },
    ],
    benefits: [{ ar: 'وضوح الالتزامات تجاه الموردين', en: 'Clear supplier obligations' }, { ar: 'ربط الشراء بالمخزون والدفاتر', en: 'Purchasing tied to stock and books' }, { ar: 'تقليل الشراء المكرر', en: 'Less duplicated buying' }],
    related: ['inventory', 'financial-accounting', 'business-intelligence'],
  },
  {
    slug: 'inventory', key: 'inventory', icon: 'stock', preview: 'stock',
    name: { ar: 'المخزون', en: 'Inventory' },
    tagline: { ar: 'رؤية دقيقة لكل صنف في كل مستودع', en: 'Exact visibility of every item in every warehouse' },
    value: { ar: 'تابع الأصناف والمستودعات والحركات والتحويلات، مع تقارير تقييم المخزون التي تربط الكميات بالقيمة المحاسبية.', en: 'Track items, warehouses, movements and transfers, with valuation reports that tie quantities to accounting value.' },
    features: [
      { title: { ar: 'الأصناف والمستودعات', en: 'Items & warehouses' }, text: { ar: 'بيانات أصناف ومستودعات متعددة وأرصدة لكل مستودع.', en: 'Item master data, multiple warehouses and per-warehouse balances.' } },
      { title: { ar: 'تحويلات المخزون', en: 'Stock transfers' }, text: { ar: 'تحويل بين المستودعات بنفس التكلفة، مع رفض التحويل عند نقص الرصيد.', en: 'Transfers between warehouses at the same cost, refused when stock is insufficient.' } },
      { title: { ar: 'حركات المخزون', en: 'Stock movements' }, text: { ar: 'كل حركة من شراء أو بيع أو تحويل مسجلة ويمكن تتبعها.', en: 'Every purchase, sale and transfer movement is recorded and traceable.' } },
      { title: { ar: 'تقييم المخزون وتقاريره', en: 'Valuation & inventory reports' }, text: { ar: 'تقارير الأرصدة والتقييم والحركة وأعمار الأصناف.', en: 'Balance, valuation, movement and ageing reports.' } },
      { title: { ar: 'تتبع الأصناف', en: 'Item tracking' }, text: { ar: 'أدوات تتبع إضافية للأصناف بنطاق محدد.', en: 'Additional item-tracking tools with a defined scope.' }, status: 'partial' },
    ],
    benefits: [{ ar: 'أرصدة موثوقة', en: 'Trustworthy balances' }, { ar: 'تقليل نقص وتكدس المخزون', en: 'Less shortage and overstock' }, { ar: 'تقييم متسق مع الدفاتر', en: 'Valuation consistent with the books' }],
    related: ['purchasing', 'sales-management', 'multi-company'],
  },
  {
    slug: 'human-resources', key: 'hr', icon: 'hr', preview: 'hr',
    name: { ar: 'الموارد البشرية', en: 'Human Resources' },
    tagline: { ar: 'من التوظيف إلى الرواتب في منصة واحدة متصلة بالدفاتر', en: 'From hiring to payroll on one platform connected to the books' },
    value: { ar: 'ملف موظف شامل، حضور وانصراف، إجازات، رواتب تُقيَّد محاسبيًا، وخدمة ذاتية للموظف والمدير، مع تقارير وتحليلات للقوى العاملة.', en: 'A complete employee file, attendance, leave, payroll posted to the ledger, and self-service for employees and managers, with workforce reports and analytics.' },
    features: [
      { title: { ar: 'ملف الموظف 360', en: 'Employee 360' }, text: { ar: 'بيانات وعقد وراتب وسجل وظيفي ومستندات وأرصدة في صفحة واحدة، مع خصوصية على مستوى الحقول.', en: 'Data, contract, pay, history, documents and balances on one page, with field-level privacy.' } },
      { title: { ar: 'الحضور والانصراف', en: 'Attendance' }, text: { ar: 'أجهزة بصمة، استيراد من Excel، تسجيل من الجوال بنطاق جغرافي، وورديات وجداول.', en: 'Fingerprint devices, Excel import, geofenced mobile check-in, shifts and rosters.' } },
      { title: { ar: 'الإجازات', en: 'Leave management' }, text: { ar: 'أنواع وأرصدة وطلبات وموافقات وتقويم للفريق.', en: 'Types, balances, requests, approvals and a team calendar.' } },
      { title: { ar: 'الرواتب', en: 'Payroll' }, text: { ar: 'مسير شهري بالاستقطاعات والتأمينات والسلف، مراجعة ثم اعتماد وقيد محاسبي تلقائي وصرف.', en: 'Monthly payroll with deductions, social security and loans, review, approval, automatic ledger posting and payment.' } },
      { title: { ar: 'الخدمة الذاتية', en: 'Self-service' }, text: { ar: 'يرى الموظف رصيده وقسائمه ويقدم طلباته، ويوافق المدير على طلبات فريقه.', en: 'Employees see balances and payslips and submit requests; managers approve their team’s.' } },
      { title: { ar: 'الأداء والتدريب والتوظيف', en: 'Performance, training, recruitment' }, text: { ar: 'دورات تقييم وأهداف، دورات تدريب، طلبات توظيف ومرشحون وتهيئة وإخلاء طرف.', en: 'Review cycles and goals, training, requisitions, candidates, onboarding and offboarding.' } },
      { title: { ar: 'تحليلات الموارد البشرية', en: 'HR analytics' }, text: { ar: 'أكثر من 40 تقريرًا ولوحة قيادة يومية للقوى العاملة والتكلفة.', en: 'More than 40 reports and a daily command center for workforce and cost.' } },
    ],
    benefits: [{ ar: 'رواتب دقيقة ومقيدة تلقائيًا', en: 'Accurate payroll posted automatically' }, { ar: 'وقت أقل في المهام الإدارية', en: 'Less administrative time' }, { ar: 'بيانات موظفين محمية بصلاحيات', en: 'Employee data protected by permissions' }],
    related: ['financial-accounting', 'business-intelligence', 'multi-company'],
  },
  {
    slug: 'business-intelligence', key: 'bi', icon: 'reports', preview: 'reports',
    name: { ar: 'ذكاء الأعمال والتقارير', en: 'Business Intelligence' },
    tagline: { ar: 'مركز تقارير يجيب عن أسئلة الإدارة', en: 'A reporting center that answers management’s questions' },
    value: { ar: 'مركز تقارير يضم أكثر من 300 تقرير موزعة على 22 فئة، ولوحات قيادة وكشوف حساب شاملة، ومراقب سلامة يتحقق من اتساق الدفاتر مع الحسابات الفرعية.', en: 'A reporting center with more than 300 reports in 22 categories, dashboards, statement tools, and an integrity monitor that checks the ledger against the sub-ledgers.' },
    features: [
      { title: { ar: 'مركز التقارير', en: 'Reporting center' }, text: { ar: 'تقارير الدفاتر والمبيعات والمشتريات والمخزون والبنوك والموارد البشرية والضرائب وغيرها، بفلاتر ومقارنات.', en: 'Ledger, sales, purchasing, inventory, bank, HR, tax and more reports, with filters and comparisons.' } },
      { title: { ar: 'لوحات القيادة', en: 'Dashboards' }, text: { ar: 'لوحة تنفيذية بمؤشرات المبيعات والتحصيل والمخزون ولوحة للموارد البشرية.', en: 'An executive dashboard of sales, collection and stock indicators, and an HR command center.' } },
      { title: { ar: 'التصدير والطباعة', en: 'Export & print' }, text: { ar: 'تصدير التقارير إلى Excel وCSV وPDF وطباعتها.', en: 'Export reports to Excel, CSV and PDF, or print them.' } },
      { title: { ar: 'مراقب سلامة التقارير', en: 'Integrity monitor' }, text: { ar: 'فحوص تقارن الحسابات الفرعية بالدفتر وتنبه إلى أي فرق.', en: 'Checks that compare sub-ledgers with the ledger and flag any difference.' } },
      { title: { ar: 'كشوف حساب شاملة', en: 'Statement hub' }, text: { ar: 'كشف حساب لأي عميل أو مورد أو حساب أو صنف.', en: 'A statement for any customer, supplier, account or item.' } },
    ],
    benefits: [{ ar: 'قرارات مبنية على أرقام موثوقة', en: 'Decisions on reliable figures' }, { ar: 'اطلاع فوري بدل انتظار التقارير', en: 'Instant insight instead of waiting' }, { ar: 'رقابة على سلامة البيانات', en: 'Control over data integrity' }],
    related: ['financial-accounting', 'sales-management', 'human-resources'],
  },
  {
    slug: 'multi-company', key: 'multi', icon: 'branches', preview: 'branches',
    name: { ar: 'تعدد الشركات والفروع', en: 'Multi-Company Management' },
    tagline: { ar: 'عدة شركات وفروع في نظام واحد بصلاحيات منفصلة', en: 'Several companies and branches in one system with separate permissions' },
    value: { ar: 'أدر أكثر من شركة وفرع من حساب واحد، مع فصل كامل للبيانات بين الشركات وصلاحيات لكل مستخدم على مستوى الشركة والفرع.', en: 'Run more than one company and branch from one account, with complete data separation between companies and per-user permissions at company and branch level.' },
    features: [
      { title: { ar: 'عدة شركات', en: 'Multiple companies' }, text: { ar: 'إنشاء شركة جديدة بمعالج، ونسخ دليل الحسابات، والتبديل بين الشركات بحساب واحد.', en: 'Create a company with a wizard, copy a chart of accounts, switch between companies with one login.' } },
      { title: { ar: 'عدة فروع', en: 'Multiple branches' }, text: { ar: 'فروع بتقارير وأرقام مستقلة وصلاحيات تقتصر على فروع محددة.', en: 'Branches with separate reports and numbers and access limited to chosen branches.' } },
      { title: { ar: 'المستخدمون والأدوار والصلاحيات', en: 'Users, roles & permissions' }, text: { ar: 'أدوار مرنة بصلاحيات لكل وحدة وإجراء، وسجل تدقيق للتغييرات.', en: 'Flexible roles with permissions per module and action, and an audit log of changes.' } },
      { title: { ar: 'عزل بيانات الشركات', en: 'Company data isolation' }, text: { ar: 'بيانات كل شركة معزولة عن غيرها، وتغطيها اختبارات آلية.', en: 'Each company’s data is separated from the others, covered by automated tests.' } },
      { title: { ar: 'تقارير المجموعات', en: 'Group reporting' }, text: { ar: 'تقارير على مستوى مجموعة الشركات.', en: 'Reports across a group of companies.' }, status: 'partial' },
    ],
    benefits: [{ ar: 'إدارة مركزية بخصوصية كاملة', en: 'Central management with full privacy' }, { ar: 'توسع دون نظام جديد', en: 'Grow without a new system' }, { ar: 'تحكم دقيق بمن يرى ماذا', en: 'Precise control of who sees what' }],
    related: ['financial-accounting', 'human-resources', 'business-intelligence'],
  },
  {
    slug: 'automation-assistant', key: 'automation', icon: 'assistant', preview: 'assistant',
    name: { ar: 'الأتمتة والمساعد الذكي', en: 'Automation & Assistant' },
    tagline: { ar: 'أتمتة حقيقية ومساعد يجيب من بياناتك أنت', en: 'Real automation and an assistant that answers from your own data' },
    value: { ar: 'يخفض النظام العمل اليدوي بالقيود التلقائية ومسارات الموافقات والتنبيهات، ويتيح مساعدًا للموارد البشرية يجيب عن الأسئلة من سجلات الشركة نفسها. هذا المساعد يعتمد على قواعد وبيانات النظام وليس على نموذج توليدي خارجي.', en: 'The system reduces manual work with automatic postings, approval workflows and checks, and offers an HR assistant that answers questions from the company’s own records. It is rule-based on the system’s data, not an external generative model.' },
    features: [
      { title: { ar: 'قيود محاسبية تلقائية', en: 'Automatic postings' }, text: { ar: 'تنتقل الفواتير والرواتب والمخصصات والتسويات إلى الدفاتر دون إعادة إدخال.', en: 'Invoices, payroll, provisions and settlements post to the ledger without re-entry.' } },
      { title: { ar: 'مسارات الموافقات', en: 'Approval workflows' }, text: { ar: 'مسارات موافقة قابلة للضبط بخطوات وشروط وتفويض وتصعيد.', en: 'Configurable approval flows with steps, conditions, delegation and escalation.' } },
      { title: { ar: 'مساعد الموارد البشرية', en: 'HR assistant' }, text: { ar: 'يجيب بالعربية والإنجليزية من سجلات الشركة، ويرفض القرارات الوظيفية ولا يخمّن الأرقام.', en: 'Answers in Arabic and English from company records, declines employment decisions and never guesses figures.' } },
      { title: { ar: 'فحوص آلية للرواتب', en: 'Automatic payroll checks' }, text: { ar: 'يكشف آيبان مكرر وقفزات الصافي وغيرها قبل الاعتماد، مع توقع رواتب الشهر التالي.', en: 'Flags duplicate IBANs, net-pay jumps and more before approval, with a forecast of next month.' } },
      { title: { ar: 'نسخ احتياطي مجدول', en: 'Scheduled backups' }, text: { ar: 'نسخ احتياطي يومي للقاعدة مع الاحتفاظ بآخر النسخ.', en: 'A daily database backup with the latest copies kept.' } },
    ],
    benefits: [{ ar: 'وقت أقل في الإدخال اليدوي', en: 'Less manual entry' }, { ar: 'إجابات فورية من بياناتك', en: 'Instant answers from your data' }, { ar: 'أخطاء مكتشفة مبكرًا', en: 'Errors caught early' }],
    related: ['human-resources', 'business-intelligence', 'financial-accounting'],
  },
];

export const moduleBySlug = (slug: string): ModuleDef | undefined => MODULES.find(m => m.slug === slug);

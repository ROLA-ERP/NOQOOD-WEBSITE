import type { L } from '@/lib/i18n';

// Industry pages only combine capabilities that the ERP really has (see modules.ts). No industry-specific feature is promised.
export interface IndustryDef { slug: string; key: string; name: L; intro: L; challenges: L[]; capabilities: { module: string; text: L }[]; benefits: L[] }

export const INDUSTRIES_CONTENT: IndustryDef[] = [
  {
    slug: 'wholesale-distribution', key: 'wholesale', name: { ar: 'الجملة والتوزيع', en: 'Wholesale & Distribution' },
    intro: { ar: 'شركات الجملة تتعامل مع عملاء كثيرين وأرصدة ديون كبيرة وأصناف ومستودعات متعددة.', en: 'Wholesalers deal with many customers, large receivables and many items and warehouses.' },
    challenges: [{ ar: 'ديون عملاء متفرقة يصعب تتبعها', en: 'Scattered customer debt that is hard to track' }, { ar: 'اختلاف أرصدة المخزون بين المستودعات', en: 'Stock balances that differ between warehouses' }, { ar: 'تأخر معرفة الربحية', en: 'Late visibility of profitability' }],
    capabilities: [{ module: 'sales-management', text: { ar: 'فواتير وتحصيل وكشوف حساب وأعمار ديون لكل عميل.', en: 'Invoices, collection, statements and ageing for every customer.' } }, { module: 'inventory', text: { ar: 'مستودعات متعددة وتحويلات وتقارير تقييم.', en: 'Multiple warehouses, transfers and valuation reports.' } }, { module: 'purchasing', text: { ar: 'أوامر شراء واستلام وحسابات موردين.', en: 'Purchase orders, receipts and supplier accounts.' } }],
    benefits: [{ ar: 'تحصيل أسرع', en: 'Faster collection' }, { ar: 'مخزون أدق', en: 'More accurate stock' }],
  },
  {
    slug: 'retail', key: 'retail', name: { ar: 'التجزئة', en: 'Retail' },
    intro: { ar: 'التجزئة تحتاج متابعة يومية للمبيعات والمخزون وأداء الفروع والعاملين.', en: 'Retail needs daily tracking of sales, stock and the performance of branches and staff.' },
    challenges: [{ ar: 'فروع متعددة بأرقام منفصلة', en: 'Several branches with separate numbers' }, { ar: 'ورديات وحضور عاملين', en: 'Shifts and staff attendance' }, { ar: 'متابعة المخزون لكل فرع', en: 'Stock tracking per branch' }],
    capabilities: [{ module: 'sales-management', text: { ar: 'مبيعات يومية وتقارير حسب الفرع والمنتج، وصفحة طلبات أونلاين.', en: 'Daily sales and reports by branch and product, plus an online ordering page.' } }, { module: 'human-resources', text: { ar: 'ورديات وجداول وحضور بالبصمة أو من الجوال.', en: 'Shifts, rosters and attendance by fingerprint or mobile.' } }, { module: 'inventory', text: { ar: 'أرصدة لكل مستودع وتحويلات بين الفروع.', en: 'Per-warehouse balances and transfers between branches.' } }],
    benefits: [{ ar: 'رؤية يومية لكل فرع', en: 'Daily view of every branch' }, { ar: 'جداول عمل أوضح', en: 'Clearer work schedules' }],
  },
  {
    slug: 'multi-branch-businesses', key: 'multi-branch', name: { ar: 'الشركات متعددة الفروع', en: 'Multi-Branch Businesses' },
    intro: { ar: 'عند تعدد الفروع تصعب المقارنة والرقابة بين أرقام متفرقة.', en: 'With many branches, comparison and control across scattered numbers become hard.' },
    challenges: [{ ar: 'صعوبة مقارنة الفروع', en: 'Hard to compare branches' }, { ar: 'صلاحيات تختلف من فرع لآخر', en: 'Permissions that differ by branch' }, { ar: 'توحيد القوائم المالية', en: 'Consolidating financial statements' }],
    capabilities: [{ module: 'multi-company', text: { ar: 'فروع وشركات متعددة وصلاحيات على مستوى الفرع.', en: 'Multiple branches and companies with branch-level permissions.' } }, { module: 'business-intelligence', text: { ar: 'تقارير ولوحات تقارن الفروع.', en: 'Reports and dashboards that compare branches.' } }, { module: 'financial-accounting', text: { ar: 'قوائم مالية بفلتر الفرع.', en: 'Financial statements filtered by branch.' } }],
    benefits: [{ ar: 'مقارنة عادلة بين الفروع', en: 'Fair comparison between branches' }, { ar: 'رقابة مركزية', en: 'Central control' }],
  },
  {
    slug: 'trading-companies', key: 'trading', name: { ar: 'الشركات التجارية', en: 'Trading Companies' },
    intro: { ar: 'الشركات التجارية تعتمد على دورة شراء وبيع سريعة وسيولة منضبطة.', en: 'Trading companies depend on a fast buy-and-sell cycle and disciplined cash.' },
    challenges: [{ ar: 'ربط الشراء بالبيع بالمخزون', en: 'Connecting buying, selling and stock' }, { ar: 'متابعة التدفقات النقدية', en: 'Following cash flow' }, { ar: 'مطابقة البنوك', en: 'Bank reconciliation' }],
    capabilities: [{ module: 'purchasing', text: { ar: 'دورة الشراء كاملة مع حسابات الموردين.', en: 'The full purchasing cycle with supplier accounts.' } }, { module: 'financial-accounting', text: { ar: 'مطابقة بنكية وقائمة تدفقات نقدية وسندات.', en: 'Bank reconciliation, cash-flow statement and vouchers.' } }, { module: 'sales-management', text: { ar: 'عروض أسعار وفواتير وتحصيل.', en: 'Quotations, invoices and collection.' } }],
    benefits: [{ ar: 'سيولة أوضح', en: 'Clearer liquidity' }, { ar: 'دورة تجارية متصلة', en: 'A connected trade cycle' }],
  },
  {
    slug: 'professional-services', key: 'services', name: { ar: 'الخدمات المهنية', en: 'Professional Services' },
    intro: { ar: 'شركات الخدمات تهتم بالفوترة والتحصيل وتكلفة فرق العمل.', en: 'Service firms care about billing, collection and the cost of their teams.' },
    challenges: [{ ar: 'فوترة منتظمة وتحصيل', en: 'Regular billing and collection' }, { ar: 'تكلفة الموظفين والرواتب', en: 'Staff cost and payroll' }, { ar: 'توزيع المصروفات على مراكز', en: 'Allocating expenses to centers' }],
    capabilities: [{ module: 'sales-management', text: { ar: 'فواتير وحسابات عملاء وتحصيل.', en: 'Invoices, customer accounts and collection.' } }, { module: 'human-resources', text: { ar: 'رواتب وحضور وإجازات وتكلفة حقيقية للموظف.', en: 'Payroll, attendance, leave and true employee cost.' } }, { module: 'financial-accounting', text: { ar: 'مراكز تكلفة وقوائم مالية.', en: 'Cost centers and financial statements.' } }],
    benefits: [{ ar: 'فهم تكلفة الفريق', en: 'Understand team cost' }, { ar: 'تحصيل منضبط', en: 'Disciplined collection' }],
  },
  {
    slug: 'contracting', key: 'contracting', name: { ar: 'المقاولات', en: 'Contracting' },
    intro: { ar: 'شركات المقاولات تحتاج متابعة مصروفاتها وعمالتها وموردينها بدقة.', en: 'Contractors need precise tracking of expenses, labour and suppliers.' },
    challenges: [{ ar: 'عمالة كبيرة ورواتب', en: 'Large workforce and payroll' }, { ar: 'موردون ومشتريات متعددة', en: 'Many suppliers and purchases' }, { ar: 'توزيع التكاليف', en: 'Cost allocation' }],
    capabilities: [{ module: 'human-resources', text: { ar: 'رواتب وحضور وإقامات ومستندات منتهية التنبيه.', en: 'Payroll, attendance and expiry tracking of residency and documents.' } }, { module: 'purchasing', text: { ar: 'مشتريات وموردون وسندات صرف.', en: 'Purchasing, suppliers and payment vouchers.' } }, { module: 'financial-accounting', text: { ar: 'مراكز تكلفة وتقارير مصروفات.', en: 'Cost centers and expense reports.' } }],
    benefits: [{ ar: 'ضبط تكلفة العمالة', en: 'Control labour cost' }, { ar: 'التزام بالمستندات', en: 'Document compliance' }],
  },
  {
    slug: 'food-beverage', key: 'food', name: { ar: 'الأغذية والمشروبات', en: 'Food & Beverage' },
    intro: { ar: 'أنشطة الأغذية تتطلب متابعة مشتريات ومخزون ومبيعات يومية وعمالة بورديات.', en: 'Food businesses need to follow purchasing, stock, daily sales and shift workers.' },
    challenges: [{ ar: 'مشتريات متكررة', en: 'Frequent purchasing' }, { ar: 'ورديات متعددة', en: 'Multiple shifts' }, { ar: 'مبيعات يومية متعددة الفروع', en: 'Daily multi-branch sales' }],
    capabilities: [{ module: 'inventory', text: { ar: 'أرصدة وحركات وتحويلات ومستودعات.', en: 'Balances, movements, transfers and warehouses.' } }, { module: 'human-resources', text: { ar: 'ورديات وجداول وحضور.', en: 'Shifts, rosters and attendance.' } }, { module: 'sales-management', text: { ar: 'مبيعات وتقارير حسب الفرع، وطلبات أونلاين.', en: 'Sales and reports by branch, plus online orders.' } }],
    benefits: [{ ar: 'تحكم أفضل في الشراء والمخزون', en: 'Better control of buying and stock' }, { ar: 'جداول عمل منظمة', en: 'Organised work schedules' }],
  },
  {
    slug: 'general-commercial', key: 'other', name: { ar: 'المنشآت التجارية العامة', en: 'General Commercial Enterprises' },
    intro: { ar: 'أي منشأة تجارية تحتاج دفاتر دقيقة وفواتير ومخزونًا وموظفين تحت مظلة واحدة.', en: 'Any commercial business needs accurate books, invoices, stock and staff under one roof.' },
    challenges: [{ ar: 'برامج متفرقة لا تتصل ببعضها', en: 'Disconnected programs' }, { ar: 'إدخال مكرر', en: 'Duplicate entry' }, { ar: 'قوائم مالية متأخرة', en: 'Late financial statements' }],
    capabilities: [{ module: 'financial-accounting', text: { ar: 'محاسبة كاملة وقوائم مالية.', en: 'Full accounting and financial statements.' } }, { module: 'sales-management', text: { ar: 'مبيعات وتحصيل.', en: 'Sales and collection.' } }, { module: 'human-resources', text: { ar: 'موظفون ورواتب.', en: 'Employees and payroll.' } }],
    benefits: [{ ar: 'نظام واحد متصل', en: 'One connected system' }, { ar: 'أقل إدخالًا يدويًا', en: 'Less manual entry' }],
  },
];

export const industryBySlug = (slug: string) => INDUSTRIES_CONTENT.find(i => i.slug === slug);

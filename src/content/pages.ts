import type { L } from '@/lib/i18n';

export const HERO = {
  eyebrow: { ar: 'نقود ERP — منصة متكاملة لإدارة أعمالك بذكاء', en: 'NOQOOD ERP — an integrated platform to run your business smartly' } as L,
  title: { ar: 'أعمالك تحت السيطرة. قراراتك بثقة. ومستقبلك بلا حدود.', en: 'Your business under control. Your decisions with confidence. Your future without limits.' } as L,
  text: { ar: 'من المحاسبة والمالية إلى المبيعات والمشتريات والمخزون والموارد البشرية، يجمع نقود ERP عمليات شركتك في منظومة واحدة مترابطة، تمنحك رؤية شاملة لأداء أعمالك، وتحكّمًا أكبر في مواردك، ومعلومات دقيقة تدعم قراراتك في الوقت المناسب.', en: 'From accounting and finance to sales, purchasing, inventory and human resources, NOQOOD ERP brings your company’s operations into one connected system, giving you a complete view of performance, tighter control of your resources, and accurate information to support your decisions at the right time.' } as L,
  closing: { ar: 'بسّط عملياتك، عزّز كفاءتك، وانطلق بأعمالك نحو مستوى جديد من النمو.', en: 'Simplify your operations, strengthen your efficiency, and take your business to a new level of growth.' } as L,
  cta1: { ar: 'اطلب عرضًا توضيحيًا', en: 'Request a demo' } as L,
  cta2: { ar: 'اكتشف إمكانيات نقود', en: 'Discover NOQOOD’s capabilities' } as L,
};

export const STATS: { value: string; label: L }[] = [
  { value: '8', label: { ar: 'وحدات متصلة بنظام واحد', en: 'connected modules, one system' } },
  { value: '300+', label: { ar: 'تقرير ولوحة قيادة', en: 'reports and dashboards' } },
  { value: '2', label: { ar: 'لغتان بتخطيط كامل (عربي / إنجليزي)', en: 'full languages (Arabic / English)' } },
  { value: '1', label: { ar: 'مصدر واحد للحقيقة لكل رقم', en: 'source of truth for every figure' } },
];

export const PILLARS: { icon: string; title: L; text: L }[] = [
  { icon: 'layers', title: { ar: 'ترابط', en: 'Connection' }, text: { ar: 'نكسر الجدران بين الأقسام: ما يُسجَّل في المبيعات يصل إلى المخزون والدفاتر دون إعادة إدخال.', en: 'We break the walls between departments: what is recorded in sales reaches stock and the ledger with no re-entry.' } },
  { icon: 'star', title: { ar: 'وضوح', en: 'Clarity' }, text: { ar: 'نحوّل آلاف القيود إلى صورة واحدة تفهمها الإدارة في دقائق، ولكل رقم أصل يمكن تتبعه.', en: 'We turn thousands of entries into one picture management understands in minutes, and every figure traces back to its source.' } },
  { icon: 'shield', title: { ar: 'ثقة', en: 'Trust' }, text: { ar: 'صلاحيات دقيقة وعزل بين الشركات وسجل تدقيق، لأن بيانات عملك أمانة.', en: 'Precise permissions, isolation between companies and an audit trail, because your business data is a trust.' } },
  { icon: 'bolt', title: { ar: 'نمو', en: 'Growth' }, text: { ar: 'نظام ينمو معك من فرع واحد إلى عدة فروع وشركات دون أن تبدأ من جديد.', en: 'A system that grows with you from one branch to many branches and companies without starting over.' } },
];

export const WHY: { title: L; text: L }[] = [
  { title: { ar: 'نظام واحد متصل', en: 'One connected system' }, text: { ar: 'المبيعات والمشتريات والمخزون والرواتب تغذي الدفاتر تلقائيًا، فلا إدخال مكرر ولا فروقات بين البرامج.', en: 'Sales, purchasing, stock and payroll feed the ledger automatically: no duplicate entry, no gaps between programs.' } },
  { title: { ar: 'عربي أولًا', en: 'Arabic first' }, text: { ar: 'واجهة عربية كاملة بتخطيط من اليمين لليسار، وتقارير وطباعة بالعربية والإنجليزية.', en: 'A complete Arabic interface laid out right-to-left, with Arabic and English reports and printing.' } },
  { title: { ar: 'رقابة حقيقية', en: 'Real control' }, text: { ar: 'صلاحيات على مستوى الوحدة والفرع وحماية للبيانات الحساسة وسجل تدقيق وعزل بين الشركات.', en: 'Permissions per module and branch, protection of sensitive data, an audit trail and isolation between companies.' } },
  { title: { ar: 'تقارير تقود القرار', en: 'Reports that drive decisions' }, text: { ar: 'أكثر من 300 تقرير ولوحات قيادة تحوّل الأرقام إلى قرارات.', en: 'More than 300 reports and dashboards that turn numbers into decisions.' } },
];

export const CHALLENGES: { title: L; text: L }[] = [
  { title: { ar: 'برامج متفرقة', en: 'Disconnected tools' }, text: { ar: 'جداول Excel وبرامج منفصلة تُنتج أرقامًا متعارضة.', en: 'Spreadsheets and separate programs produce conflicting numbers.' } },
  { title: { ar: 'قوائم مالية متأخرة', en: 'Late financial statements' }, text: { ar: 'إقفال بطيء بسبب إعادة الإدخال والمطابقات اليدوية.', en: 'Slow closing because of re-entry and manual reconciliation.' } },
  { title: { ar: 'غموض في الفروع', en: 'Branch blind spots' }, text: { ar: 'صعوبة معرفة أداء كل فرع ومقارنته.', en: 'Hard to see and compare how each branch performs.' } },
  { title: { ar: 'رواتب وحضور يدوي', en: 'Manual payroll and attendance' }, text: { ar: 'حسابات رواتب مرهقة وعرضة للخطأ.', en: 'Payroll sums that are tiring and error-prone.' } },
];

export const STEPS: { title: L; text: L }[] = [
  { title: { ar: 'نفهم عملك', en: 'We understand your business' }, text: { ar: 'جلسة قصيرة لفهم هيكل شركتك وفروعك وما تحتاجه.', en: 'A short session to understand your structure, branches and needs.' } },
  { title: { ar: 'نجهّز البيئة', en: 'We prepare the environment' }, text: { ar: 'إعداد الشركة ودليل الحسابات والمستخدمين والصلاحيات.', en: 'Set up the company, chart of accounts, users and permissions.' } },
  { title: { ar: 'ننقل البيانات ونتدرّب', en: 'We migrate data and train' }, text: { ar: 'نقل الأرصدة والبيانات الأساسية وتدريب فريقك.', en: 'Move balances and master data, and train your team.' } },
  { title: { ar: 'تعمل بثقة', en: 'You run with confidence' }, text: { ar: 'تابع أعمالك بتقارير ولوحات قيادة تعتمد على بياناتك.', en: 'Run your business with reports and dashboards built on your data.' } },
];

export const BENEFITS: { title: L; text: L }[] = [
  { title: { ar: 'وقت أقل في الإدخال', en: 'Less time on entry' }, text: { ar: 'تدفق البيانات بين الوحدات يلغي التكرار.', en: 'Data flowing between modules removes duplication.' } },
  { title: { ar: 'أرقام يمكن الوثوق بها', en: 'Numbers you can trust' }, text: { ar: 'كل رقم يمكن تتبعه إلى أصل القيد، ومراقب السلامة يكشف الفروقات.', en: 'Every figure traces to its source entry, and the integrity monitor exposes differences.' } },
  { title: { ar: 'رؤية للفروع والشركات', en: 'Visibility across branches and companies' }, text: { ar: 'قارن الفروع وأدر عدة شركات بحساب واحد.', en: 'Compare branches and run several companies with one login.' } },
  { title: { ar: 'حماية للبيانات', en: 'Data protection' }, text: { ar: 'صلاحيات دقيقة وحماية خصوصية بيانات الموظفين.', en: 'Precise permissions and privacy for employee data.' } },
];

export const ABOUT = {
  who: { ar: 'نقود منصة لإدارة موارد المؤسسات صُممت لتجمع الحسابات والمبيعات والمشتريات والمخزون والموارد البشرية في نظام واحد. نبدأ من السوق الكويتي، ونبني للشركات في الخليج والمنطقة وما بعدها.', en: 'NOQOOD is an enterprise resource planning platform designed to bring accounting, sales, purchasing, inventory and human resources into one system. We start from the Kuwaiti market and build for businesses across the Gulf, the region and beyond.' } as L,
  purpose: { ar: 'غايتنا أن نجعل إدارة الأعمال أوضح وأسهل، بتحويل تعقيد التشغيل اليومي إلى معلومات يمكن الاعتماد عليها في اتخاذ القرار.', en: 'Our purpose is to make running a business clearer and simpler, turning the complexity of daily operations into information you can rely on to decide.' } as L,
  philosophy: { ar: 'نؤمن بأن النظام الجيد يخدم الناس لا العكس: واجهة بسيطة، وبيانات واحدة متصلة، ورقابة لا تُثقل العمل. ولا نعد بما لم يُنجز بعد.', en: 'We believe good software serves people, not the other way round: a simple interface, one connected set of data, and control that does not weigh work down. And we do not promise what is not built yet.' } as L,
  innovation: { ar: 'نطوّر النظام باستمرار، ونختبر كل تغيير باختبارات آلية قبل وصوله إلى العملاء، ونضيف القدرات تدريجيًا بحسب احتياج السوق.', en: 'We improve the system continuously, test every change with automated tests before it reaches customers, and add capabilities step by step as the market needs them.' } as L,
  transformation: { ar: 'التحول الرقمي عندنا رحلة تدريجية: نبدأ بما يخفف العبء فورًا ثم نتوسع. نعمل مع فريقك على إعداد النظام ونقل البيانات والتدريب.', en: 'Digital transformation with us is a gradual journey: start with what relieves the burden immediately, then expand. We work with your team on setup, data migration and training.' } as L,
  why: [
    { ar: 'نظام متكامل بدل برامج متفرقة', en: 'An integrated system instead of scattered programs' },
    { ar: 'واجهة عربية كاملة وتقارير بلغتين', en: 'A full Arabic interface and bilingual reports' },
    { ar: 'صلاحيات وعزل وخصوصية في الأساس', en: 'Permissions, isolation and privacy built in' },
    { ar: 'فريق قريب يستجيب بسرعة', en: 'A close team that responds quickly' },
  ] as L[],
};

export const VISION: L = { ar: 'أن نمكّن الشركات من إدارة أعمالها بذكاء وترابط ووضوح، من خلال حلول تقنية متطورة تحوّل تعقيدات التشغيل إلى قرارات واثقة ونمو مستدام.', en: 'To empower businesses with intelligent, connected, and accessible technology that transforms operational complexity into clarity, confidence, and sustainable growth.' };
export const MISSION: L = { ar: 'تقديم منصة متكاملة وموثوقة وسهلة الاستخدام لإدارة موارد المؤسسات، تعمل على تبسيط العمليات المالية والتشغيلية، وتمكين فرق العمل، ودعم اتخاذ قرارات أكثر ذكاءً وكفاءة.', en: 'To deliver an integrated, intuitive, and reliable enterprise management platform that simplifies financial and operational processes, empowers teams, and enables smarter business decisions.' };

export const VALUES: { key: string; title: L; text: L }[] = [
  { key: 'innovation', title: { ar: 'الابتكار', en: 'Innovation' }, text: { ar: 'نبحث عن طرق أبسط وأذكى لحل مشكلات التشغيل الحقيقية.', en: 'We look for simpler, smarter ways to solve real operating problems.' } },
  { key: 'integrity', title: { ar: 'النزاهة', en: 'Integrity' }, text: { ar: 'نقول ما نستطيع تقديمه فقط، ونحافظ على بيانات عملائنا كأمانة.', en: 'We say only what we can deliver, and treat customer data as a trust.' } },
  { key: 'success', title: { ar: 'نجاح العميل', en: 'Customer success' }, text: { ar: 'نجاحنا هو أن تعمل شركتك بكفاءة أعلى.', en: 'We succeed when your company runs more efficiently.' } },
  { key: 'reliability', title: { ar: 'الموثوقية', en: 'Reliability' }, text: { ar: 'نختبر ونراجع وننسخ احتياطيًا، لأن المحاسبة لا تحتمل الخطأ.', en: 'We test, review and back up, because accounting cannot afford mistakes.' } },
  { key: 'simplicity', title: { ar: 'البساطة', en: 'Simplicity' }, text: { ar: 'نخفي التعقيد خلف واجهة واضحة.', en: 'We hide complexity behind a clear interface.' } },
  { key: 'transparency', title: { ar: 'الشفافية', en: 'Transparency' }, text: { ar: 'تعرف ما يفعله النظام ولماذا، وما لم يُنجز بعد.', en: 'You know what the system does and why, and what is not built yet.' } },
  { key: 'improvement', title: { ar: 'التحسين المستمر', en: 'Continuous improvement' }, text: { ar: 'نتعلم من كل ملاحظة ونطوّر بخطوات منتظمة.', en: 'We learn from every piece of feedback and improve in regular steps.' } },
  { key: 'excellence', title: { ar: 'التميّز في العمل', en: 'Business excellence' }, text: { ar: 'نهتم بالتفاصيل لأن التفاصيل هي ما يصنع الثقة.', en: 'We care about details, because details build trust.' } },
];

export const PRICING_NOTE: { title: L; text: L } = {
  title: { ar: 'عرض سعر مخصص لشركتك', en: 'A tailored quote for your company' },
  text: { ar: 'تختلف احتياجات الشركات في عدد المستخدمين والفروع والوحدات المطلوبة. أخبرنا بمتطلباتك ونعد لك عرضًا مناسبًا. لا نعرض أسعارًا قبل الاتفاق.', en: 'Companies differ in users, branches and modules. Tell us your requirements and we will prepare a suitable proposal. We do not publish prices before they are agreed.' },
};

export const TESTIMONIALS_NOTE: L = { ar: 'سنعرض هنا قصص نجاح العملاء وآراءهم بعد الحصول على موافقتهم الرسمية.', en: 'Customer stories and testimonials will appear here once we have their approval.' };

// Legal drafts: written as a starting point. They MUST be reviewed and approved by a qualified lawyer before the site is published.
export const PRIVACY: { title: L; sections: { h: L; p: L }[] } = {
  title: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
  sections: [
    { h: { ar: 'مقدمة', en: 'Introduction' }, p: { ar: 'توضح هذه السياسة كيف يتعامل موقع نقود (www.noqoodapp.com) مع البيانات التي تقدمها لنا. [يلزم إدراج الاسم القانوني للجهة المشغّلة وعنوانها بعد اعتمادهما.]', en: 'This policy explains how the NOQOOD website (www.noqoodapp.com) handles the data you give us. [The legal name and address of the operating entity must be inserted once approved.]' } },
    { h: { ar: 'البيانات التي نجمعها', en: 'Data we collect' }, p: { ar: 'عند تعبئة نموذج التواصل أو طلب العرض: الاسم والشركة والبريد والهاتف والدولة والقطاع وحجم الشركة ورسالتك. ونسجّل عنوانًا مجهّلًا (مُشفّرًا) للجهاز لمنع إساءة الاستخدام. لا نجمع بيانات حساسة.', en: 'When you fill in the contact or demo form: name, company, email, phone, country, industry, company size and your message. We also store a hashed (non-readable) device address to prevent abuse. We do not collect sensitive data.' } },
    { h: { ar: 'كيف نستخدمها', en: 'How we use it' }, p: { ar: 'للرد على طلبك وترتيب التواصل معك وتحسين خدماتنا. لا نبيع بياناتك.', en: 'To answer your request, arrange contact with you and improve our services. We do not sell your data.' } },
    { h: { ar: 'ملفات التعريف والتحليلات', en: 'Cookies and analytics' }, p: { ar: 'لا نحمّل أدوات التحليل غير الأساسية إلا بعد موافقتك، ويمكنك الرفض دون أن يتأثر استخدام الموقع.', en: 'We load non-essential analytics only after your consent, and you may decline without affecting your use of the site.' } },
    { h: { ar: 'الاحتفاظ والأمان', en: 'Retention and security' }, p: { ar: 'نحتفظ بالطلبات للمدة اللازمة للمتابعة التجارية [المدة تحتاج اعتمادًا]. نحمي البيانات بتشفير النقل وضوابط وصول.', en: 'We keep requests for as long as needed for business follow-up [period to be approved]. We protect data with transport encryption and access controls.' } },
    { h: { ar: 'حقوقك', en: 'Your rights' }, p: { ar: 'يمكنك طلب الاطلاع على بياناتك أو تصحيحها أو حذفها بمراسلتنا على noqooderp@gmail.com.', en: 'You may ask to see, correct or delete your data by writing to noqooderp@gmail.com.' } },
    { h: { ar: 'التواصل', en: 'Contact' }, p: { ar: 'noqooderp@gmail.com — +965 9964 3739', en: 'noqooderp@gmail.com — +965 9964 3739' } },
  ],
};
export const TERMS: { title: L; sections: { h: L; p: L }[] } = {
  title: { ar: 'شروط الخدمة', en: 'Terms of Service' },
  sections: [
    { h: { ar: 'استخدام الموقع', en: 'Use of the website' }, p: { ar: 'يُقدَّم هذا الموقع للتعريف بنظام نقود وتلقي طلبات التواصل. باستخدامه فإنك توافق على هذه الشروط. [يلزم إدراج بيانات الجهة المشغّلة.]', en: 'This website introduces the NOQOOD system and receives contact requests. By using it you accept these terms. [The operating entity’s details must be inserted.]' } },
    { h: { ar: 'المعلومات', en: 'Information' }, p: { ar: 'نبذل جهدنا لتكون المعلومات دقيقة، وقد تتغير قدرات المنتج. لا يُعد المحتوى عرضًا ملزمًا ولا التزامًا تعاقديًا إلا باتفاق مكتوب.', en: 'We make an effort for information to be accurate, and product capabilities may change. Content is not a binding offer or contractual commitment unless agreed in writing.' } },
    { h: { ar: 'الملكية الفكرية', en: 'Intellectual property' }, p: { ar: 'الاسم والشعار والمحتوى مملوكة لأصحابها ولا يجوز استخدامها دون إذن.', en: 'The name, logo and content belong to their owners and may not be used without permission.' } },
    { h: { ar: 'حدود المسؤولية', en: 'Limits of liability' }, p: { ar: '[يحتاج هذا البند صياغة قانونية معتمدة وفق القانون المعمول به.]', en: '[This clause needs approved legal wording under the applicable law.]' } },
    { h: { ar: 'القانون المطبق', en: 'Governing law' }, p: { ar: '[يحدد بعد اعتماد الجهة المشغّلة والاختصاص القضائي.]', en: '[To be set after the operating entity and jurisdiction are approved.]' } },
  ],
};

import LeadForm, { type FormLabels } from './LeadForm';
import { translator } from '@/lib/text';
import { href, type Lang } from '@/lib/i18n';
import { INDUSTRY_LABELS, INQUIRY_LABELS, METHOD_LABELS, MODULE_LABELS, SIZE_LABELS } from '@/content/ui';
import { CONTACT_METHODS, INDUSTRIES, INQUIRY_TYPES, MODULES, SIZES } from '@/lib/validate';

const opts = (keys: readonly string[], map: Record<string, { ar: string; en: string }>, lang: Lang) => keys.map(k => ({ value: k, label: map[k][lang] }));

export default function LeadFormServer({ kind, lang }: { kind: 'contact' | 'demo'; lang: Lang }) {
  const t = translator(lang);
  const labels: FormLabels = {
    name: t('form.name'), company: t('form.company'), email: t('form.email'), phone: t('form.phone'), country: t('form.country'), industry: t('form.industry'),
    size: kind === 'demo' ? t('form.employees') : t('form.size'), branches: t('form.branches'), interest: t('form.interest'), inquiry: t('form.inquiry'), message: t('form.message'),
    requirements: t('form.requirements'), method: t('form.method'), when: t('form.when'), notes: t('form.notes'), consent: t('form.consent'), send: t('form.send'), sending: t('form.sending'),
    select: t('form.select'), required: t('form.required'), okTitle: t('ok.title'), okBody: t('ok.body'), okNext: t('ok.next'), errNetwork: t('err.network'),
    privacyHref: href(lang, '/privacy'), privacyLabel: t('footer.privacy'),
    errors: {
      required: t('err.required'), invalid_string: t('err.invalid_string'), too_small: t('err.too_small'), invalid_enum_value: t('err.invalid_enum_value'), invalid_type: t('err.required'),
      phone: t('err.phone'), consent: t('err.consent'), rate_limited: t('err.rate_limited'), too_fast: t('err.too_fast'), expired_form: t('err.expired_form'), captcha: t('err.captcha'),
      storage: t('err.storage'), rejected: t('err.invalid_string'), validation: t('err.invalid_string'), origin: t('err.network'),
    },
  };
  return <LeadForm kind={kind} lang={lang} labels={labels} industries={opts(INDUSTRIES, INDUSTRY_LABELS, lang)} sizes={opts(SIZES, SIZE_LABELS, lang)} modules={opts(MODULES, MODULE_LABELS, lang)} inquiries={opts(INQUIRY_TYPES, INQUIRY_LABELS, lang)} methods={opts(CONTACT_METHODS, METHOD_LABELS, lang)} />;
}

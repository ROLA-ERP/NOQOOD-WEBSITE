import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { href, type Lang } from '@/lib/i18n';
import type { T } from '@/lib/text';
import VideoPlayer from './VideoPlayer';
import { Section } from './Sections';

const SRC = '/video/noqood-promo.mp4';
const CAPTIONS = '/video/noqood-promo.ar.vtt';
const exists = (p: string) => { try { return fs.existsSync(path.join(process.cwd(), 'public', p)); } catch { return false; } };

/** Home-page video section. The play button appears only when the real video file has been added to public/video/. */
export default function VideoSection({ lang, t }: { lang: Lang; t: T }) {
  const ar = lang === 'ar';
  const available = exists(SRC) && exists(CAPTIONS);
  return (
    <Section tone="soft" eyebrow={ar ? 'شاهد نقود' : 'Watch NOQOOD'} title={ar ? 'ثلاثون ثانية تختصر الفكرة' : 'Thirty seconds that sum it up'} text={ar ? 'نظرة سريعة على كيف تجمع نقود ERP أعمالك في منصة واحدة.' : 'A quick look at how NOQOOD ERP brings your business together in one platform (narrated in Arabic, with Arabic captions).'}>
      <div className="mx-auto max-w-4xl">
        <VideoPlayer src={SRC} captions={CAPTIONS} available={available} labels={{ play: ar ? 'تشغيل الفيديو التعريفي' : 'Play the promo video', close: ar ? 'إغلاق' : 'Close', soon: ar ? 'الفيديو التعريفي قيد الإنتاج' : 'Promo video in production', title: ar ? 'أعمالك تحت السيطرة. قراراتك بثقة. ومستقبلك بلا حدود.' : 'Your business under control. Your decisions with confidence.' }} />
        <div className="mt-8 text-center"><Link href={href(lang, '/demo')} className="btn btn-primary !px-8 !py-4 text-base">{ar ? 'اطلب عرضًا توضيحيًا' : t('cta.demo')}</Link></div>
      </div>
    </Section>
  );
}

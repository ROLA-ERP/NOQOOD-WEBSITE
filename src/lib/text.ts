// Text lookup: the administrator's override first, then the built-in text.
import { UI } from '@/content/ui';
import { overrides } from './settings';
import type { Lang } from './i18n';

export function translator(lang: Lang) {
  let ov: Record<string, string> = {};
  try { ov = overrides(lang); } catch { ov = {}; }
  return (key: string): string => ov[key] || UI[key]?.[lang] || key;
}
export type T = ReturnType<typeof translator>;

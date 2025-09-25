
import type { Locale } from '@/i18n-config';

// We enumerate all dictionaries here for better linting and typescript support
const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  ar: () => import('@/dictionaries/ar.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return locale in dictionaries ? dictionaries[locale]() : dictionaries.en();
};

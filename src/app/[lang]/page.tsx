
import { redirect } from 'next/navigation';
import type { Locale } from '@/i18n-config';

export default async function Home({
    params: { lang },
  }: {
    params: { lang: Locale };
  }) {
    redirect(`/${lang}/pharmacy`)
  }

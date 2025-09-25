
import React from 'react';
import type { Locale } from '@/i18n-config';
import { getDictionary } from '@/lib/dictionary';
import { ThemeProvider } from '@/components/shared/theme-provider';
import LangLayoutClient from './layout-client';


export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(params.lang);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LangLayoutClient lang={params.lang} dictionary={dictionary}>
        {children}
      </LangLayoutClient>
    </ThemeProvider>
  );
}

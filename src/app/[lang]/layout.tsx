
'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import type { Locale } from '@/i18n-config';
import MainLayout from '@/components/shared/main-layout';
import { getDictionary } from '@/lib/dictionary';
import { ThemeProvider } from '@/components/shared/theme-provider';

const authRoutes = ['/login', '/signup'];

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [lang, setLang] = useState(params.lang);

  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    setLang(params.lang);
    getDictionary(params.lang).then(setDictionary);
  }, [params.lang]);


  useEffect(() => {
    if (isLoading) return;

    const isAuthRoute = authRoutes.some(route => pathname.endsWith(route));

    if (!user && !isAuthRoute) {
      router.push(`/${lang}/login`);
    }
  }, [user, isLoading, pathname, router, lang]);

  const isAuthRoute = authRoutes.some(route => pathname.endsWith(route));
  
  const content = () => {
    if (isAuthRoute) {
      return children;
    }

    if (isLoading || (!user && !isAuthRoute) || !dictionary) {
      return (
        <div className="flex h-screen items-center justify-center">
            Loading...
        </div>
      );
    }

    return (
        <MainLayout lang={lang} dictionary={dictionary}>
            {children}
        </MainLayout>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {content()}
    </ThemeProvider>
  );
}

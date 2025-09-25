
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
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  useEffect(() => {
    if (isLoading) return;

    const currentPath = pathname.substring(pathname.indexOf('/', 1));
    const isAuthRoute = authRoutes.some(route => currentPath === route);

    if (user && isAuthRoute) {
      router.push(`/${lang}/pharmacy`);
    }

    if (!user && !isAuthRoute) {
      router.push(`/${lang}/login`);
    }
  }, [user, isLoading, pathname, router, lang]);
  
  const currentPath = pathname.substring(pathname.indexOf('/', 1));
  const isAuthRoute = authRoutes.some(route => currentPath === route);

  const content = () => {
    if (isAuthRoute) {
      if (isLoading || (user && isAuthRoute)) {
        return (
          <div className="flex h-screen items-center justify-center">
            Loading...
          </div>
        );
      }
      return children;
    }

    if (isLoading || !user || !dictionary) {
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


'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import type { Locale } from '@/i18n-config';
import MainLayout from '@/components/shared/main-layout';

const authRoutes = ['/login', '/signup'];

export default function LangLayoutClient({
  children,
  lang,
  dictionary,
}: {
  children: React.ReactNode;
  lang: Locale;
  dictionary: any;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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
      // While loading or if user is logged in on an auth route, show loading
      if (isLoading || (user && isAuthRoute)) {
        return (
          <div className="flex h-screen items-center justify-center">
            Loading...
          </div>
        );
      }
      // Otherwise, show the auth page (login/signup)
      return children;
    }

    // For protected routes, show loading until user is verified
    if (isLoading || !user) {
      return (
        <div className="flex h-screen items-center justify-center">
            Loading...
        </div>
      );
    }

    // Once user is loaded, show the main layout
    return (
        <MainLayout lang={lang} dictionary={dictionary}>
            {children}
        </MainLayout>
    );
  }

  return content();
}

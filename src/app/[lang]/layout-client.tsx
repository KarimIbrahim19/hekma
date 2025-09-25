
'use client';

import React, { useEffect } from 'react';
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user && isAuthRoute) {
    return <>{children}</>;
  }

  if (user && !isAuthRoute) {
    return (
        <MainLayout lang={lang} dictionary={dictionary}>
            {children}
        </MainLayout>
    );
  }

  // Covers the case where user is logged in on an auth route (while redirecting)
  // or user is not logged in on a protected route (while redirecting)
  return (
    <div className="flex h-screen items-center justify-center">
        Loading...
    </div>
  );
}

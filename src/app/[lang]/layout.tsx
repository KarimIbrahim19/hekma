'use client';

import { useEffect } from 'react';
import { headers } from 'next/headers';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import type { Locale } from '@/i18n-config';
import MainLayout from '@/components/shared/main-layout';
import { getDictionary } from '@/lib/dictionary';

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

  // Dictionaries are now fetched inside the component when needed
  const [dictionary, setDictionary] = React.useState<any>(null);

  useEffect(() => {
    getDictionary(params.lang).then(setDictionary);
  }, [params.lang]);


  useEffect(() => {
    if (isLoading) return; // Wait until auth state is confirmed

    const isAuthRoute = authRoutes.some(route => pathname.endsWith(route));

    if (!user && !isAuthRoute) {
      router.push(`/${params.lang}/login`);
    }
  }, [user, isLoading, pathname, router, params.lang]);

  const isAuthRoute = authRoutes.some(route => pathname.endsWith(route));

  if (isLoading || (!user && !isAuthRoute)) {
    // Show a loading screen or a blank page while checking auth
    // Or while redirecting to login
    return (
        <html lang={params.lang} dir={params.lang === 'ar' ? 'rtl' : 'ltr'}>
            <body>
              <div className="flex h-screen items-center justify-center">
                Loading...
              </div>
            </body>
        </html>
    );
  }

  if (isAuthRoute) {
    return (
      <html lang={params.lang} dir={params.lang === 'ar' ? 'rtl' : 'ltr'}>
        <body>
          {children}
        </body>
      </html>
    );
  }

  if (!dictionary) {
     return (
        <html lang={params.lang} dir={params.lang === 'ar' ? 'rtl' : 'ltr'}>
            <body>
              <div className="flex h-screen items-center justify-center">
                Loading...
              </div>
            </body>
        </html>
    );
  }

  return (
    <html lang={params.lang} dir={params.lang === 'ar' ? 'rtl' : 'ltr'}>
        <body>
            <MainLayout lang={params.lang} dictionary={dictionary}>
                {children}
            </MainLayout>
        </body>
    </html>
  );
}

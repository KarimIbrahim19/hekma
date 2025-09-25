import type { Metadata } from 'next';
import { i18n, type Locale } from '@/i18n-config';
import { getDictionary } from '@/lib/dictionary';
import { headers } from 'next/headers';

import MainLayout from '@/components/shared/main-layout';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang);
  return {
    title: {
      default: dictionary.appName,
      template: `%s | ${dictionary.appName}`,
    },
    description: 'Pharmacy Management App',
  };
}

const authRoutes = ['/login', '/signup'];

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(params.lang);
  const headersList = headers();
  const pathname = headersList.get('x-next-pathname') || '';
  
  const isAuthRoute = authRoutes.some(route => pathname.endsWith(route));

  if (isAuthRoute) {
    return (
      <html lang={params.lang} dir={params.lang === 'ar' ? 'rtl' : 'ltr'}>
        <body>
          {children}
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

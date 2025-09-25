import AppSidebar from '@/components/shared/app-sidebar';
import Header from '@/components/shared/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import type { Locale } from '@/i18n-config';

type MainLayoutProps = {
  children: React.ReactNode;
  lang: Locale;
  dictionary: any;
};

export default function MainLayout({ children, lang, dictionary }: MainLayoutProps) {
  return (
    <SidebarProvider>
        <AppSidebar lang={lang} dictionary={dictionary} />
        <SidebarInset>
            <div className="flex flex-col">
                <Header lang={lang} dictionary={dictionary} />
                <main className="flex-1 p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}

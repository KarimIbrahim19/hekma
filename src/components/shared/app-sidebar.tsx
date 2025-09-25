'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, Package, FileText, User, FilePlus } from 'lucide-react';
import { AppLogo } from './app-logo';
import type { Locale } from '@/i18n-config';

type AppSidebarProps = {
  lang: Locale;
  dictionary: any;
};

export default function AppSidebar({ lang, dictionary }: AppSidebarProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === `/${lang}${path}`;

  const navItems = [
    { href: '/', icon: Home, label: dictionary.nav.selectPharmacy },
    { href: '/products', icon: Package, label: dictionary.nav.products },
    { href: '/invoices', icon: FileText, label: dictionary.nav.invoices },
    { href: '/invoices/new', icon: FilePlus, label: dictionary.nav.newInvoice },
    { href: '/profile', icon: User, label: dictionary.nav.profile },
  ];

  return (
    <Sidebar collapsible="icon" side={lang === 'ar' ? 'right' : 'left'}>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={`/${lang}${item.href}`} passHref>
                <SidebarMenuButton
                  isActive={isActive(item.href)}
                  icon={<item.icon />}
                  tooltip={{
                    children: item.label,
                    side: lang === 'ar' ? 'left' : 'right'
                  }}
                >
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

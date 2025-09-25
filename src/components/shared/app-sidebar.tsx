'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Home, Package, FileText, User, FilePlus, LogOut } from 'lucide-react';
import { AppLogo } from './app-logo';
import type { Locale } from '@/i18n-config';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { useAuth } from '@/hooks/use-auth';
import { ThemeSwitcher } from './theme-switcher';

type AppSidebarProps = {
  lang: Locale;
  dictionary: any;
};

export default function AppSidebar({ lang, dictionary }: AppSidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === `/${lang}${path}`;

  const navItems = [
    { href: '/', icon: Home, label: dictionary.nav.selectPharmacy },
    { href: '/products', icon: Package, label: dictionary.nav.products },
    { href: '/invoices', icon: FileText, label: dictionary.nav.invoices },
    { href: '/invoices/new', icon: FilePlus, label: dictionary.nav.newInvoice },
    { href: '/profile', icon: User, label: dictionary.nav.profile },
  ];

  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <Sidebar collapsible="icon" side={lang === 'ar' ? 'right' : 'left'}>
      <SidebarHeader className="text-center">
        <AppLogo />
        {user && (
            <div className="mt-4 group-data-[collapsible=icon]:hidden">
            <Avatar className="h-20 w-20 mx-auto">
                <AvatarImage src={user.avatarUrl} alt={`@${user.name}`} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold mt-2">{user.name}</h3>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
        )}
      </SidebarHeader>
      <Separator />
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
                    side: lang === 'ar' ? 'left' : 'right',
                  }}
                >
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <div className='flex flex-col gap-2'>
            <ThemeSwitcher dictionary={dictionary}/>
            <Button variant="ghost" className="w-full justify-start" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">{dictionary.nav.logout}</span>
            </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

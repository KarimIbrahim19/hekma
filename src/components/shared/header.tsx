import { SidebarTrigger } from "@/components/ui/sidebar";
import type { Locale } from "@/i18n-config";

type HeaderProps = {
  lang: Locale;
  dictionary: any;
}

export default function Header({ lang, dictionary }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <div className="flex items-center gap-2">
         {/* This can be a breadcrumb in the future */}
      </div>
      <div className="relative ml-auto flex-1 md:grow-0">
        {/* Search can be added here if needed */}
      </div>
    </header>
  );
}

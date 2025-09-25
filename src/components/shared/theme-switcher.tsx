'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function ThemeSwitcher({ dictionary }: { dictionary: any }) {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    
    return (
        <Button variant="ghost" className="w-full justify-start" onClick={toggleTheme}>
            {theme === 'light' ? (
                <Sun className="mr-2 h-4 w-4" />
            ) : (
                <Moon className="mr-2 h-4 w-4" />
            )}
            <span className="group-data-[collapsible=icon]:hidden">
                {theme === 'light' ? dictionary.nav.lightMode : dictionary.nav.darkMode}
            </span>
        </Button>
    );
}

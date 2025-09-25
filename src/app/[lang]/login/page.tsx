'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { type Locale } from '@/i18n-config';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppLogo } from '@/components/shared/app-logo';
import { useAuth } from '@/hooks/use-auth';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const dict = {
    en: {
        welcomeBack: "Welcome Back",
        loginPrompt: "Enter your credentials to access your account",
        email: "Email",
        password: "Password",
        login: "Login",
        dontHaveAccount: "Don't have an account?",
        signup: "Sign Up",
        rememberMe: "Remember me",
        loginError: "Login Failed",
    },
    ar: {
        welcomeBack: "مرحباً بعودتك",
        loginPrompt: "أدخل بياناتك للوصول إلى حسابك",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        login: "تسجيل الدخول",
        dontHaveAccount: "ليس لديك حساب؟",
        signup: "إنشاء حساب",
        rememberMe: "تذكرنى",
        loginError: "فشل تسجيل الدخول",
    }
}


export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const lang = (pathname.split('/')[1] || 'en') as Locale;
  const dictionary = dict[lang];
  const { login } = useAuth();
  const { theme, setTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password, rememberMe);
      // The login function will handle redirection
    } catch (err: any) {
      setError(err.message || dictionary.loginError);
    } finally {
      setIsLoading(false);
    }
  };
  
  const redirectedPathName = (locale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  const targetLang = lang === 'en' ? 'ar' : 'en';

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center mb-4">
              <AppLogo />
              <div className="flex items-center gap-2">
                  <Button
                      variant="outline"
                      size="icon"
                      className='h-8 w-8'
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >
                      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                  </Button>
                  <Link href={redirectedPathName(targetLang)}>
                      <Button variant='outline' size="sm">{targetLang === 'ar' ? 'ع' : 'en'}</Button>
                  </Link>
              </div>
          </div>
          <div className='text-center'>
            <CardTitle className="text-2xl font-bold">{dictionary.welcomeBack}</CardTitle>
            <CardDescription>{dictionary.loginPrompt}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{dictionary.loginError}</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{dictionary.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{dictionary.password}</Label>
                <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember-me" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {dictionary.rememberMe}
                </label>
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? 'Logging in...' : dictionary.login}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            {dictionary.dontHaveAccount}{' '}
            <Link href={`/${lang}/signup`} className="underline">
              {dictionary.signup}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

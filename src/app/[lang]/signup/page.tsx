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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';

const dict = {
  en: {
    createAccount: 'Create an account',
    createAccountPrompt: 'Enter your details below to create a new account',
    name: 'Full Name',
    email: 'Email',
    password: 'Password',
    phone: 'Phone Number',
    haveAccount: 'Already have an account?',
    login: 'Login',
    signupError: 'Signup Failed',
    signupSuccessTitle: 'Account Created!',
    signupSuccessDescription: 'You can now log in with your credentials.',
  },
  ar: {
    createAccount: 'إنشاء حساب',
    createAccountPrompt: 'أدخل بياناتك أدناه لإنشاء حساب جديد',
    name: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    phone: 'رقم الهاتف',
    haveAccount: 'لديك حساب بالفعل؟',
    login: 'تسجيل الدخول',
    signupError: 'فشل إنشاء الحساب',
    signupSuccessTitle: 'تم إنشاء الحساب!',
    signupSuccessDescription: 'يمكنك الآن تسجيل الدخول باستخدام بياناتك.',
  },
};

export default function SignupPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = dict[lang];
  const router = useRouter();
  const pathname = usePathname();
  const { signup } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signup(fullName, email, password, phone);
      toast({
        title: dictionary.signupSuccessTitle,
        description: dictionary.signupSuccessDescription,
      });
      router.push(`/${lang}/login`);
    } catch (err: any) {
      setError(err.message || dictionary.signupError);
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
            <CardTitle className="text-2xl font-bold">{dictionary.createAccount}</CardTitle>
            <CardDescription>{dictionary.createAccountPrompt}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{dictionary.signupError}</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">{dictionary.name}</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
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
                <Label htmlFor="phone">{dictionary.phone}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+201234567890"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : dictionary.createAccount}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            {dictionary.haveAccount}{' '}
            <Link href={`/${lang}/login`} className="underline">
              {dictionary.login}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import Link from 'next/link';
import { getDictionary } from '@/lib/dictionary';
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

export default async function LoginPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm shadow-2xl">
        <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
                <AppLogo />
            </div>
          <CardTitle className="text-2xl font-bold">{dictionary.auth.welcomeBack}</CardTitle>
          <CardDescription>{dictionary.auth.loginPrompt}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{dictionary.auth.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{dictionary.auth.password}</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {dictionary.auth.login}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            {dictionary.auth.dontHaveAccount}{' '}
            <Link href={`/${lang}/signup`} className="underline">
              {dictionary.auth.signup}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

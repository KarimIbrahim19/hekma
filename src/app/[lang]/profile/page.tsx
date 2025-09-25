import { getDictionary } from '@/lib/dictionary';
import { type Locale } from '@/i18n-config';
import { user } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function ProfilePage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto max-w-2xl">
       <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.profile.title}</h1>
        <p className="text-muted-foreground">{dictionary.profile.description}</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{dictionary.profile.name}</Label>
              <Input id="name" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{dictionary.profile.email}</Label>
              <Input id="email" type="email" defaultValue={user.email} />
            </div>
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {dictionary.profile.updateProfile}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

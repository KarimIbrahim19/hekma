import Link from 'next/link';
import Image from 'next/image';
import { getDictionary } from '@/lib/dictionary';
import { type Locale } from '@/i18n-config';
import { pharmacies } from '@/lib/placeholder-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Building } from 'lucide-react';

export default async function SelectPharmacyPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.selectPharmacy.title}</h1>
        <p className="text-muted-foreground">{dictionary.selectPharmacy.description}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pharmacies.map((pharmacy) => (
          <Link href={`/${lang}/pharmacy/${pharmacy.id}`} key={pharmacy.id}>
            <Card className="h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardHeader className="flex flex-row items-center gap-4">
                <Image
                  src={pharmacy.logoUrl}
                  alt={`${pharmacy.name} logo`}
                  width={64}
                  height={64}
                  className="rounded-lg"
                  data-ai-hint="pharmacy logo"
                />
                <div>
                  <CardTitle>{lang === 'ar' ? pharmacy.nameAr : pharmacy.name}</CardTitle>
                  <CardDescription>{lang === 'ar' ? pharmacy.addressAr : pharmacy.address}</CardDescription>
                </div>
              </CardHeader>
              <CardFooter>
                 <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Building className="h-4 w-4" /> 
                    <span>{dictionary.pharmacy.licenseNumber}: {pharmacy.licenseNumber}</span>
                 </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/dictionary';
import { type Locale } from '@/i18n-config';
import { pharmacies } from '@/lib/placeholder-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, MapPin, Phone, ShieldCheck } from 'lucide-react';

// NOTE: This page currently uses placeholder data.
// It should be updated to fetch dynamic data for the selected pharmacy ID.

export default async function PharmacyDetailPage({
  params: { lang, id },
}: {
  params: { lang: Locale; id: string };
}) {
  const dictionary = await getDictionary(lang);
  const pharmacy = pharmacies.find((p) => p.id === id);

  if (!pharmacy) {
    notFound();
  }

  return (
    <div className="container mx-auto">
       <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{lang === 'ar' ? pharmacy.nameAr : pharmacy.name}</h1>
        <p className="text-muted-foreground">{dictionary.pharmacy.details}</p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col items-center justify-center p-8 bg-muted/50">
          <Image
            src={pharmacy.logoUrl}
            alt={`${pharmacy.name} logo`}
            width={128}
            height={128}
            className="rounded-full border-4 border-background shadow-lg"
            data-ai-hint="pharmacy logo"
          />
          <CardTitle className="mt-4 text-2xl">{lang === 'ar' ? pharmacy.nameAr : pharmacy.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid gap-4">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-muted-foreground mt-1" />
            <div>
              <h3 className="font-semibold">{dictionary.pharmacy.licenseNumber}</h3>
              <p className="text-muted-foreground">{pharmacy.licenseNumber}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="h-6 w-6 text-muted-foreground mt-1" />
            <div>
              <h3 className="font-semibold">{dictionary.pharmacy.address}</h3>
              <p className="text-muted-foreground">{lang === 'ar' ? pharmacy.addressAr : pharmacy.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="h-6 w-6 text-muted-foreground mt-1" />
            <div>
              <h3 className="font-semibold">{dictionary.pharmacy.contactInfo}</h3>
              <p className="text-muted-foreground">{pharmacy.contact}</p>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <Link href={`/${lang}/pharmacy/${id}/statement`}>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <FileText className="me-2 h-4 w-4" />
                    {dictionary.pharmacy.viewStatement}
                </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

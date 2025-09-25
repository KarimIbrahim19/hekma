'use client';

import { useEffect, useState } from 'react';
import { type Locale } from '@/i18n-config';
import { useAuth } from '@/hooks/use-auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, Landmark, MapPin } from 'lucide-react';
import { getDictionary } from '@/lib/dictionary';
import { useRouter } from 'next/navigation';

interface PharmacyData {
  id: number;
  name: string;
  address: string;
  balanceLimit: number;
  balance: number;
}

export default function PharmacyPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { api } = useAuth();
  const router = useRouter();
  const [pharmacy, setPharmacy] = useState<PharmacyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  useEffect(() => {
    const fetchPharmacy = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/pharmacies/current');
        if (response.data.data === null) {
          router.push(`/${lang}/pharmacy/select`);
        } else {
          setPharmacy(response.data.data);
        }
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch pharmacy data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPharmacy();
  }, [api, lang, router]);

  if (isLoading || !dictionary) {
    return (
      <div className="container mx-auto">
        <div className="mb-8">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-1/3 mt-1" />
            </CardHeader>
            <CardContent className="grid gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive text-center">{error}</div>;
  }

  if (!pharmacy) {
    // This state is briefly visible while redirecting
    return <div className='text-center'>{dictionary.pharmacy.noPharmacyFound || 'No pharmacy found, redirecting...'}</div>;
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
        style: 'currency',
        currency: 'SAR'
    }).format(amount);
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{pharmacy.name}</h1>
        <p className="text-muted-foreground">{dictionary.pharmacy.title}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{dictionary.pharmacy.details}</CardTitle>
          <CardDescription>{dictionary.pharmacy.subtext}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-start gap-4">
            <MapPin className="h-8 w-8 text-muted-foreground mt-1" />
            <div>
              <h3 className="font-semibold">{dictionary.pharmacy.address}</h3>
              <p className="text-muted-foreground">{pharmacy.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Landmark className="h-8 w-8 text-muted-foreground mt-1" />
            <div>
              <h3 className="font-semibold">{dictionary.pharmacy.balance}</h3>
              <p className={`font-bold text-lg ${pharmacy.balance < 0 ? 'text-green-600' : 'text-destructive'}`}>
                {formatCurrency(pharmacy.balance)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CreditCard className="h-8 w-8 text-muted-foreground mt-1" />
            <div>
              <h3 className="font-semibold">{dictionary.pharmacy.creditLimit}</h3>
              <p className="text-muted-foreground font-bold text-lg">{formatCurrency(pharmacy.balanceLimit)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

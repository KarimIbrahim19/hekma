
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
import { ChevronRight } from 'lucide-react';
import { getDictionary } from '@/lib/dictionary';

interface AvailablePharmacy {
  id: number;
  name: string;
  address: string;
}

export default function SelectPharmacyPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { api } = useAuth();
  const [pharmacies, setPharmacies] = useState<AvailablePharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  useEffect(() => {
    const fetchAvailablePharmacies = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/pharmacies/available');
        setPharmacies(response.data.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch pharmacies.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailablePharmacies();
  }, [api]);

  if (isLoading || !dictionary) {
    return (
      <div className="container mx-auto">
        <div className="mb-8">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return <div className="text-destructive text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.selectPharmacy.title}</h1>
        <p className="text-muted-foreground">{dictionary.selectPharmacy.description}</p>
      </div>

      <div className="space-y-4">
        {pharmacies.map((pharmacy) => (
          <Link href={`/${lang}/pharmacy/${pharmacy.id}`} key={pharmacy.id} passHref>
             <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
               <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg">{pharmacy.name}</h3>
                    <p className="text-sm text-muted-foreground">{pharmacy.address || 'No address provided'}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
               </CardContent>
             </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

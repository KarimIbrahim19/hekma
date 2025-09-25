
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Locale } from '@/i18n-config';
import { useAuth } from '@/hooks/use-auth';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, Loader2 } from 'lucide-react';
import { getDictionary } from '@/lib/dictionary';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const router = useRouter();
  const { toast } = useToast();
  const [pharmacies, setPharmacies] = useState<AvailablePharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState<number | null>(null);
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

  const handleSelectPharmacy = async (pharmacyId: number) => {
    setIsSelecting(pharmacyId);
    try {
      await api.post('/pharmacies/select', { pharmacyId });
      toast({
        title: "Pharmacy Selected",
        description: "You will now be redirected to your pharmacy dashboard.",
      });
      // We push to the base pharmacy page, which will then re-fetch the current pharmacy
      router.push(`/${lang}/pharmacy`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to select pharmacy.');
      console.error(err);
    } finally {
      setIsSelecting(null);
    }
  };

  if (isLoading || !dictionary) {
    return (
      <div className="container mx-auto max-w-2xl">
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
    return (
      <div className="container mx-auto max-w-2xl">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.selectPharmacy.title}</h1>
        <p className="text-muted-foreground">{dictionary.selectPharmacy.description}</p>
      </div>

      <div className="space-y-4">
        {pharmacies.map((pharmacy) => (
         <Card 
            key={pharmacy.id}
            className="hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => isSelecting !== pharmacy.id && handleSelectPharmacy(pharmacy.id)}
         >
           <CardContent className="p-4 flex items-center justify-between">
            <div>
                <h3 className="font-semibold text-lg">{pharmacy.name}</h3>
                <p className="text-sm text-muted-foreground">{pharmacy.address || 'No address provided'}</p>
            </div>
            {isSelecting === pharmacy.id ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
           </CardContent>
         </Card>
        ))}
        {pharmacies.length === 0 && !isLoading && (
          <p className='text-center text-muted-foreground'>No available pharmacies to select.</p>
        )}
      </div>
    </div>
  );
}

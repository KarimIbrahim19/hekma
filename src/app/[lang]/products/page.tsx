import Image from 'next/image';
import { getDictionary } from '@/lib/dictionary';
import { type Locale } from '@/i18n-config';
import { products } from '@/lib/placeholder-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default async function ProductsPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.products.title}</h1>
        <p className="text-muted-foreground">{dictionary.products.description}</p>
      </div>

      <div className="mb-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder={dictionary.products.search}
          className="w-full rounded-lg bg-background pl-10"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden flex flex-col">
            <CardHeader className="p-0">
              <div className="relative aspect-video">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  data-ai-hint={product.imageHint}
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.scientificName}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <p className="text-lg font-bold text-primary">
                {product.price.toFixed(2)} SAR
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import { type Locale } from '@/i18n-config';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Loader2 } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getDictionary } from '@/lib/dictionary';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDebounce } from '@/hooks/use-debounce';

type Product = {
  id: number;
  nameAr: string;
  nameEn: string;
  price: number;
  category: string;
  images: { url: string }[];
  store: number;
  storeName: string;
};

type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const stores = [
    { id: 1, name: 'Medicine' },
    { id: 6, name: 'Cosmetics' },
];

export default function ProductsPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const [dictionary, setDictionary] = useState<any>(null);
  const { api } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(`/categories?store=${selectedStore}`);
        setCategories(response.data.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
    // Reset filters when store changes
    setCurrentPage(1);
    setSelectedCategory('all');
  }, [selectedStore, api]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          store: String(selectedStore),
          page: String(currentPage),
          limit: '12',
        });
        if (debouncedSearchTerm) {
          params.append('search', debouncedSearchTerm);
        }
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }

        const response = await api.get(`/products?${params.toString()}`);
        setProducts(response.data.data);
        setMeta(response.data.meta);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch products.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [api, selectedStore, currentPage, debouncedSearchTerm, selectedCategory]);
  
  const handleStoreChange = (storeId: string) => {
    setSelectedStore(Number(storeId));
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on new filter
  };
  
  const handlePageChange = (newPage: number) => {
      if (newPage > 0 && newPage <= (meta?.totalPages || 1)) {
          setCurrentPage(newPage);
      }
  }

  const renderSkeletons = () => (
    Array.from({ length: 8 }).map((_, index) => (
      <Card key={index} className="overflow-hidden flex flex-col">
        <CardHeader className="p-0">
          <Skeleton className="w-full aspect-video" />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Skeleton className="h-6 w-1/4" />
        </CardFooter>
      </Card>
    ))
  );

  if (!dictionary) {
    return (
        <div className="container mx-auto">
            <div className="mb-8"><Skeleton className="h-10 w-1/3" /></div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {renderSkeletons()}
            </div>
        </div>
    );
  }

  const getProductName = (product: Product) => {
    if (lang === 'ar' && product.nameAr) return product.nameAr;
    if (lang === 'en' && product.nameEn) return product.nameEn;
    return product.nameAr || product.nameEn;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.products.title}</h1>
        <p className="text-muted-foreground">{dictionary.products.description}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder={dictionary.products.search}
            className="w-full rounded-lg bg-background pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs value={String(selectedStore)} onValueChange={handleStoreChange} className="w-full md:w-auto">
            <TabsList>
                <TabsTrigger value="1">{dictionary.products.medicine}</TabsTrigger>
                <TabsTrigger value="6">{dictionary.products.cosmetics}</TabsTrigger>
            </TabsList>
        </Tabs>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder={dictionary.products.allCategories} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{dictionary.products.allCategories}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {renderSkeletons()}
        </div>
      ) : error ? (
         <div className="text-destructive text-center col-span-full">{error}</div>
      ) : (
        <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
                <Card key={product.id} className="overflow-hidden flex flex-col">
                <CardHeader className="p-0">
                    <div className="relative aspect-video bg-muted">
                    <Image
                        src={product.images.length > 0 ? product.images[0].url : `https://picsum.photos/seed/${product.id}/400/300`}
                        alt={getProductName(product)}
                        fill
                        className="object-cover"
                        data-ai-hint="medicine product"
                        onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${product.id}/400/300`; }}
                    />
                    </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                    <h3 className="text-lg font-semibold">{getProductName(product)}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <p className="text-lg font-bold text-primary">
                    {product.price.toFixed(2)} {dictionary.products.currency}
                    </p>
                </CardFooter>
                </Card>
            ))}
            </div>

            {products.length === 0 && (
                <div className="text-center col-span-full py-12 text-muted-foreground">
                    {dictionary.products.noProducts}
                </div>
            )}
            
            {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                    <Button 
                        variant="outline" 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        {dictionary.products.previous}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        {dictionary.products.page} {currentPage} {dictionary.products.of} {meta.totalPages}
                    </span>
                    <Button 
                        variant="outline" 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === meta.totalPages}
                    >
                        {dictionary.products.next}
                    </Button>
                </div>
            )}
        </>
      )}
    </div>
  );
}

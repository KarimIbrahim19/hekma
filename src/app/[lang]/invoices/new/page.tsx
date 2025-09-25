
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { type Locale } from '@/i18n-config';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Trash2, CalendarIcon, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { getDictionary } from '@/lib/dictionary';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type Product = {
  id: number;
  nameEn: string;
  nameAr: string;
  price: number;
};

type Pharmacy = {
  id: number;
  name: string;
};

type InvoiceItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
};

export default function NewInvoicePage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const [dictionary, setDictionary] = useState<any>(null);
  const { api } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [pharmaciesRes, productsRes] = await Promise.all([
          api.get('/pharmacies/available'),
          api.get('/products?limit=1000'), // Fetch all products for selection
        ]);
        setPharmacies(pharmaciesRes.data.data);
        setProducts(productsRes.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load required data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [api]);

  const handleAddProduct = () => {
    const newItem: InvoiceItem = {
      productId: '',
      productName: '',
      quantity: 1,
      price: 0,
      total: 0,
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === Number(productId));
    if (product) {
      const newItems = [...invoiceItems];
      newItems[index] = {
        ...newItems[index],
        productId: String(product.id),
        productName: lang === 'ar' ? product.nameAr : product.nameEn,
        price: product.price,
        total: product.price * newItems[index].quantity,
      };
      setInvoiceItems(newItems);
    }
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...invoiceItems];
    if (quantity < 1) quantity = 1;
    newItems[index].quantity = quantity;
    newItems[index].total = newItems[index].price * quantity;
    setInvoiceItems(newItems);
  };
  
  const handleRemoveItem = (index: number) => {
    const newItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(newItems);
  };

  const subtotal = invoiceItems.reduce((acc, item) => acc + item.total, 0);
  const tax = subtotal * 0.15;
  const grandTotal = subtotal + tax;

  const handleCreateInvoice = async () => {
    if (!selectedPharmacy) {
      toast({ variant: 'destructive', title: 'Please select a pharmacy.' });
      return;
    }
    if (invoiceItems.length === 0 || invoiceItems.some(item => !item.productId)) {
        toast({ variant: 'destructive', title: 'Please add at least one product.' });
        return;
    }

    setIsSubmitting(true);
    try {
        const payload = {
            pharmacyId: Number(selectedPharmacy),
            date: date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            items: invoiceItems.map(item => ({
                productId: Number(item.productId),
                quantity: item.quantity,
            })),
        };
        await api.post('/invoices', payload);

        toast({
            title: dictionary.newInvoice.invoiceCreated,
        });
        router.push(`/${lang}/invoices`);
    } catch (err: any) {
        toast({
            variant: 'destructive',
            title: 'Failed to create invoice',
            description: err.response?.data?.message || 'An unexpected error occurred.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading || !dictionary) {
      return (
          <div className='container mx-auto'>
              <div className="mb-8">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </div>
              <Card>
                <CardHeader>
                    <div className='grid grid-cols-2 gap-6'>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-48 w-full" />
                </CardContent>
                <CardFooter className="flex-col items-end">
                    <Skeleton className="h-24 w-64" />
                    <Skeleton className="h-12 w-32 mt-4" />
                </CardFooter>
              </Card>
          </div>
      )
  }

  if (error) {
      return (
        <div className='container mx-auto'>
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error} Please try again later.</AlertDescription>
            </Alert>
        </div>
      )
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.newInvoice.title}</h1>
        <p className="text-muted-foreground">{dictionary.newInvoice.description}</p>
      </div>
      <Card>
        <CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>{dictionary.newInvoice.selectPharmacy}</Label>
              <Select onValueChange={setSelectedPharmacy} value={selectedPharmacy} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder={dictionary.newInvoice.selectPharmacy} />
                </SelectTrigger>
                <SelectContent>
                  {pharmacies.map((pharmacy) => (
                    <SelectItem key={pharmacy.id} value={String(pharmacy.id)}>
                      {pharmacy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{dictionary.newInvoice.invoiceDate}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">{dictionary.newInvoice.product}</TableHead>
                <TableHead>{dictionary.newInvoice.quantity}</TableHead>
                <TableHead>{dictionary.newInvoice.price}</TableHead>
                <TableHead className="text-right">{dictionary.newInvoice.total}</TableHead>
                <TableHead className="w-12">
                    <span className="sr-only">{dictionary.invoices.actions}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Select onValueChange={(value) => handleProductChange(index, value)} defaultValue={item.productId} disabled={isSubmitting}>
                        <SelectTrigger>
                            <SelectValue placeholder={dictionary.newInvoice.selectProduct} />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map(p => (
                                <SelectItem key={p.id} value={String(p.id)}>{lang === 'ar' ? p.nameAr : p.nameEn}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                      className="w-20"
                      disabled={isSubmitting}
                    />
                  </TableCell>
                  <TableCell>{item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{item.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} disabled={isSubmitting}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="outline" size="sm" className="mt-4" onClick={handleAddProduct} disabled={isSubmitting}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {dictionary.newInvoice.addProduct}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-end space-y-2">
            <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between">
                    <span>{dictionary.newInvoice.subtotal}</span>
                    <span>{subtotal.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between">
                    <span>{dictionary.newInvoice.tax}</span>
                    <span>{tax.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                    <span>{dictionary.newInvoice.grandTotal}</span>
                    <span>{grandTotal.toFixed(2)} SAR</span>
                </div>
            </div>
            <Button size="lg" className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleCreateInvoice} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Creating...' : dictionary.newInvoice.createInvoice}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

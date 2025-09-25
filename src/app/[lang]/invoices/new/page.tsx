'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Locale } from '@/i18n-config';
import { pharmacies, products as allProducts } from '@/lib/placeholder-data';
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
import { PlusCircle, Trash2, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Product = {
  id: string;
  name: string;
  price: number;
};

type InvoiceItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
};

// This is a mock dictionary for client component
const dict = {
    en: {
        title: "Create New Invoice",
        description: "Select products to generate a new invoice.",
        selectPharmacy: "Select Pharmacy",
        invoiceDate: "Invoice Date",
        product: "Product",
        quantity: "Quantity",
        price: "Price",
        total: "Total",
        actions: "Actions",
        addProduct: "Add Product",
        subtotal: "Subtotal",
        tax: "Tax (15%)",
        grandTotal: "Grand Total",
        createInvoice: "Create Invoice",
        invoiceCreated: "Invoice created successfully!",
        selectAProduct: "Select a product"
    },
    ar: {
        title: "إنشاء فاتورة جديدة",
        description: "اختر المنتجات لإنشاء فاتورة جديدة.",
        selectPharmacy: "اختر صيدلية",
        invoiceDate: "تاريخ الفاتورة",
        product: "المنتج",
        quantity: "الكمية",
        price: "السعر",
        total: "المجموع",
        actions: "الإجراءات",
        addProduct: "أضف منتج",
        subtotal: "المجموع الفرعي",
        tax: "الضريبة (15%)",
        grandTotal: "المجموع الكلي",
        createInvoice: "إنشاء الفاتورة",
        invoiceCreated: "تم إنشاء الفاتورة بنجاح!",
        selectAProduct: "اختر منتج"
    }
}


export default function NewInvoicePage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = dict[lang];
  const router = useRouter();
  const { toast } = useToast();
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());

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
    const product = allProducts.find((p) => p.id === productId);
    if (product) {
      const newItems = [...invoiceItems];
      newItems[index] = {
        ...newItems[index],
        productId: product.id,
        productName: product.name,
        price: product.price,
        total: product.price * newItems[index].quantity,
      };
      setInvoiceItems(newItems);
    }
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...invoiceItems];
    if(quantity < 1) quantity = 1;
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

  const handleCreateInvoice = () => {
    toast({
      title: dictionary.invoiceCreated,
    });
    router.push(`/${lang}/invoices`);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.title}</h1>
        <p className="text-muted-foreground">{dictionary.description}</p>
      </div>
      <Card>
        <CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>{dictionary.selectPharmacy}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={dictionary.selectPharmacy} />
                </SelectTrigger>
                <SelectContent>
                  {pharmacies.map((pharmacy) => (
                    <SelectItem key={pharmacy.id} value={pharmacy.id}>
                      {lang === 'ar' ? pharmacy.nameAr : pharmacy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{dictionary.invoiceDate}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
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
                <TableHead className="w-[40%]">{dictionary.product}</TableHead>
                <TableHead>{dictionary.quantity}</TableHead>
                <TableHead>{dictionary.price}</TableHead>
                <TableHead className="text-right">{dictionary.total}</TableHead>
                <TableHead className="w-12">
                    <span className="sr-only">{dictionary.actions}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Select onValueChange={(value) => handleProductChange(index, value)} defaultValue={item.productId}>
                        <SelectTrigger>
                            <SelectValue placeholder={dictionary.selectAProduct} />
                        </SelectTrigger>
                        <SelectContent>
                            {allProducts.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
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
                    />
                  </TableCell>
                  <TableCell>{item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{item.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="outline" size="sm" className="mt-4" onClick={handleAddProduct}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {dictionary.addProduct}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-end space-y-2">
            <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between">
                    <span>{dictionary.subtotal}</span>
                    <span>{subtotal.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between">
                    <span>{dictionary.tax}</span>
                    <span>{tax.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                    <span>{dictionary.grandTotal}</span>
                    <span>{grandTotal.toFixed(2)} SAR</span>
                </div>
            </div>
            <Button size="lg" className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleCreateInvoice}>
                {dictionary.createInvoice}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { type Locale } from '@/i18n-config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { getDictionary } from '@/lib/dictionary';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type Invoice = {
  id: string;
  pharmacyName: string;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  amount: number;
};

export default function InvoicesPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const [dictionary, setDictionary] = useState<any>(null);
  const { api } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/invoices');
        setInvoices(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch invoices.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, [api]);
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const renderSkeletons = () => (
    Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
      </TableRow>
    ))
  );

  if (!dictionary) {
      return (
          <div className="container mx-auto">
             <div className="flex items-center justify-between mb-8">
                <div>
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-72 mt-2" />
                </div>
                <Skeleton className="h-10 w-40" />
            </div>
            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                                <TableHead><Skeleton className="h-4 w-32" /></TableHead>
                                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                                <TableHead className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {renderSkeletons()}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
          </div>
      )
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{dictionary.invoices.title}</h1>
            <p className="text-muted-foreground">{dictionary.invoices.description}</p>
        </div>
        <Link href={`/${lang}/invoices/new`}>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <PlusCircle className="h-5 w-5 me-2" />
                {dictionary.invoices.newInvoice}
            </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{dictionary.invoices.invoice}</TableHead>
                <TableHead>{dictionary.invoices.pharmacy}</TableHead>
                <TableHead>{dictionary.invoices.date}</TableHead>
                <TableHead>{dictionary.invoices.status}</TableHead>
                <TableHead className="text-right">{dictionary.invoices.amount}</TableHead>
                <TableHead>
                  <span className="sr-only">{dictionary.invoices.actions}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? renderSkeletons() : error ? (
                <TableRow>
                    <TableCell colSpan={6}>
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    </TableCell>
                </TableRow>
              ) : invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.pharmacyName}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(invoice.status)}>
                        {dictionary.invoices.statuses[invoice.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{invoice.amount.toFixed(2)} SAR</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem>Download PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                        {dictionary.invoices.noInvoices}
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

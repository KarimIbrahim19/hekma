'use client';

import { useEffect, useState } from 'react';
import { type Locale } from '@/i18n-config';
import { useAuth } from '@/hooks/use-auth';
import {
  Card,
  CardContent,
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
import { Skeleton } from '@/components/ui/skeleton';
import { getDictionary } from '@/lib/dictionary';
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TransactionDetail {
    productId: number;
    productName: string;
    quantity: number;
    total: number;
    discount: number;
}

interface Transaction {
    type: 'INVOICE' | 'PAYMENT' | 'RETURN';
    id: number;
    date: string;
    amount: number;
    details?: TransactionDetail[];
    runningBalance: number;
}

interface StatementData {
    pharmacyName: string;
    transactions: Transaction[];
    startingBalance: number;
}

export default function StatementPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { api } = useAuth();
  const [statement, setStatement] = useState<StatementData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dictionary, setDictionary] = useState<any>(null);
  const [openItem, setOpenItem] = useState<number | null>(null);

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  useEffect(() => {
    const fetchStatement = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/pharmacies/statement'); 
        setStatement(response.data.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch statement data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatement();
  }, [api]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
        style: 'currency',
        currency: 'SAR'
    }).format(amount);
  }

  const getTransactionTypeInfo = (type: Transaction['type']) => {
    switch (type) {
      case 'INVOICE':
        return { label: dictionary.statement.types.invoice, variant: 'secondary' as const, amountClass: 'text-red-600' };
      case 'PAYMENT':
        return { label: dictionary.statement.types.payment, variant: 'default' as const, amountClass: 'text-green-600' };
      case 'RETURN':
        return { label: dictionary.statement.types.return, variant: 'outline' as const, amountClass: 'text-green-600' };
      default:
        return { label: type, variant: 'secondary' as const, amountClass: 'text-muted-foreground' };
    }
  };

  if (isLoading || !dictionary) {
    return (
      <div className="container mx-auto">
        <div className="mb-8">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
        </div>
        <Card>
            <CardContent className="pt-6">
                <Skeleton className="h-96 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive text-center">{error}</div>;
  }
  
  return (
    <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{dictionary.statement.title} - {statement?.pharmacyName}</h1>
                <p className="text-muted-foreground">{dictionary.statement.description}</p>
            </div>
            <Link href={`/${lang}/pharmacy`}>
                <Button variant="outline">
                    {lang === 'ar' ? <ArrowLeft className="h-4 w-4 ms-2" /> : <ArrowLeft className="h-4 w-4 me-2" />}
                    {dictionary.statement.backButton}
                </Button>
            </Link>
        </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>{dictionary.statement.date}</TableHead>
                <TableHead>{dictionary.statement.transactionType}</TableHead>
                <TableHead>{dictionary.statement.referenceNo}</TableHead>
                <TableHead className="text-right">{dictionary.statement.amount}</TableHead>
                <TableHead className="text-right">{dictionary.statement.balance}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statement?.transactions?.map((tx) => {
                const typeInfo = getTransactionTypeInfo(tx.type);
                const hasDetails = tx.details && tx.details.length > 0;
                return (
                    <Collapsible asChild key={tx.id} open={openItem === tx.id} onOpenChange={() => setOpenItem(openItem === tx.id ? null : tx.id)}>
                        <>
                        <TableRow className="hover:bg-muted/50 cursor-pointer">
                            <TableCell>
                                {hasDetails && (
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            {openItem === tx.id ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
                                        </Button>
                                    </CollapsibleTrigger>
                                )}
                            </TableCell>
                            <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">{tx.id}</TableCell>
                            <TableCell className={cn("text-right", typeInfo.amountClass)}>
                                {formatCurrency(tx.amount)}
                            </TableCell>
                            <TableCell className="text-right font-bold">{formatCurrency(tx.runningBalance)}</TableCell>
                        </TableRow>
                        {hasDetails && (
                            <CollapsibleContent asChild>
                                <tr className='bg-muted/25'>
                                    <TableCell colSpan={6} className="p-0">
                                        <div className='p-4'>
                                        <h4 className='font-semibold mb-2'>{dictionary.statement.transactionDetails}</h4>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>{dictionary.newInvoice.product}</TableHead>
                                                    <TableHead>{dictionary.newInvoice.quantity}</TableHead>
                                                    <TableHead>{dictionary.statement.discount}</TableHead>
                                                    <TableHead className="text-right">{dictionary.newInvoice.total}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                            {tx.details?.map((detail) => (
                                                <TableRow key={detail.productId}>
                                                    <TableCell>{detail.productName}</TableCell>
                                                    <TableCell>{detail.quantity}</TableCell>
                                                    <TableCell>{detail.discount}%</TableCell>
                                                    <TableCell className="text-right">{formatCurrency(detail.total)}</TableCell>
                                                </TableRow>
                                            ))}
                                            </TableBody>
                                        </Table>
                                        </div>
                                    </TableCell>
                                </tr>
                            </CollapsibleContent>
                        )}
                        </>
                    </Collapsible>
              )})}
               {(!statement || statement.transactions.length === 0) && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                        {dictionary.statement.noTransactions}
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

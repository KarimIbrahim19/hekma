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
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Transaction {
    date: string;
    type: string;
    invoice: string;
    amount: number;
    balance: number;
}

interface StatementData {
    pharmacyName: string;
    transactions: Transaction[];
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

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  useEffect(() => {
    const fetchStatement = async () => {
      setIsLoading(true);
      try {
        // This endpoint should return the statement for the currently authenticated user's pharmacy
        // You might need to create this endpoint in your NestJS backend
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
                    <ArrowLeft className="h-4 w-4 me-2" />
                    Back to Pharmacy
                </Button>
            </Link>
        </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{dictionary.statement.date}</TableHead>
                <TableHead>{dictionary.statement.transactionType}</TableHead>
                <TableHead>{dictionary.statement.invoiceNo}</TableHead>
                <TableHead className="text-right">{dictionary.statement.amount}</TableHead>
                <TableHead className="text-right">{dictionary.statement.balance}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statement?.transactions?.map((tx, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{tx.type}</TableCell>
                  <TableCell>{tx.invoice}</TableCell>
                  <TableCell className={`text-right ${tx.amount < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-bold">{tx.balance.toFixed(2)}</TableCell>
                </TableRow>
              ))}
               {(!statement || statement.transactions.length === 0) && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
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

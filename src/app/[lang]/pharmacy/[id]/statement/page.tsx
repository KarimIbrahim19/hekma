import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/dictionary';
import { type Locale } from '@/i18n-config';
import { pharmacies, transactions } from '@/lib/placeholder-data';
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
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function StatementPage({
  params: { lang, id },
}: {
  params: { lang: Locale; id: string };
}) {
  const dictionary = await getDictionary(lang);
  const pharmacy = pharmacies.find((p) => p.id === id);

  if (!pharmacy) {
    notFound();
  }

  return (
    <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{dictionary.statement.title} - {lang === 'ar' ? pharmacy.nameAr : pharmacy.name}</h1>
                <p className="text-muted-foreground">{dictionary.statement.description}</p>
            </div>
            <Link href={`/${lang}/pharmacy/${id}`}>
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
              {transactions.map((tx, index) => (
                <TableRow key={index}>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell className="font-medium">{tx.type}</TableCell>
                  <TableCell>{tx.invoice}</TableCell>
                  <TableCell className={`text-right ${tx.amount < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-bold">{tx.balance.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

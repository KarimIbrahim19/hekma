import Link from 'next/link';
import { getDictionary } from '@/lib/dictionary';
import { type Locale } from '@/i18n-config';
import { invoices, pharmacies } from '@/lib/placeholder-data';
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
import { cn } from '@/lib/utils';

export default async function InvoicesPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  const getPharmacyName = (id: string) => {
    const pharmacy = pharmacies.find((p) => p.id === id);
    if (!pharmacy) return 'Unknown Pharmacy';
    return lang === 'ar' ? pharmacy.nameAr : pharmacy.name;
  };
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

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
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{getPharmacyName(invoice.pharmacyId)}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

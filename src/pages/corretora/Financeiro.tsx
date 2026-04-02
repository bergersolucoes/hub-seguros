import { useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useInvoices, useInvoiceItems } from '@/hooks/useFinancial';
import { useBrokerProfile } from '@/hooks/useBrokerPanel';
import { DollarSign, FileText, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const invoiceStatusLabels: Record<string, { label: string; className: string }> = {
  open: { label: 'Aberta', className: 'bg-blue-500' },
  sent: { label: 'Enviada', className: 'bg-amber-500' },
  paid: { label: 'Paga', className: 'bg-emerald-500' },
  overdue: { label: 'Vencida', className: 'bg-destructive' },
  cancelled: { label: 'Cancelada', className: 'bg-muted-foreground' },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function CorretoraFinanceiro() {
  const { data: broker } = useBrokerProfile();
  const { data: invoices, isLoading } = useInvoices({ broker_id: broker?.id });
  const [detailInvoiceId, setDetailInvoiceId] = useState<string | null>(null);
  const { data: detailItems } = useInvoiceItems(detailInvoiceId ?? undefined);

  const openInvoices = invoices?.filter((i) => ['open', 'sent'].includes(i.status)) || [];
  const paidInvoices = invoices?.filter((i) => i.status === 'paid') || [];
  const totalAberto = openInvoices.reduce((s, i) => s + i.total, 0);
  const totalPago = paidInvoices.reduce((s, i) => s + i.total, 0);
  const nextDue = openInvoices.length > 0
    ? openInvoices.sort((a, b) => a.due_date.localeCompare(b.due_date))[0]
    : null;

  return (
    <PageShell title="Financeiro" description="Faturas e cobranças da sua corretora.">
      {/* Summary */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Em Aberto</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-xl font-bold">{formatCurrency(totalAberto)}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Pago</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-xl font-bold">{formatCurrency(totalPago)}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Faturas Abertas</CardTitle>
            <DollarSign className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-xl font-bold">{openInvoices.length}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Próximo Vencimento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-20" /> : (
              <div className="text-xl font-bold">{nextDue ? format(new Date(nextDue.due_date), 'dd/MM/yyyy') : '—'}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invoices */}
      <Card>
        <CardHeader><CardTitle>Faturas</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês Ref.</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Desconto</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Vencimento</TableHead>
                  <TableHead className="hidden md:table-cell">Pagamento</TableHead>
                  <TableHead className="text-right">Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>{Array.from({ length: 8 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-16" /></TableCell>)}</TableRow>
                  ))
                ) : !invoices?.length ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Nenhuma fatura encontrada.</TableCell></TableRow>
                ) : (
                  invoices.map((inv) => {
                    const cfg = invoiceStatusLabels[inv.status] || { label: inv.status, className: '' };
                    return (
                      <TableRow key={inv.id}>
                        <TableCell className="font-medium">{inv.reference_month}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{formatCurrency(inv.subtotal)}</TableCell>
                        <TableCell className="text-right text-muted-foreground hidden md:table-cell">{inv.discount ? formatCurrency(inv.discount) : '—'}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(inv.total)}</TableCell>
                        <TableCell><Badge className={cfg.className}>{cfg.label}</Badge></TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{format(new Date(inv.due_date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{inv.paid_at ? format(new Date(inv.paid_at), 'dd/MM/yyyy') : '—'}</TableCell>
                        <TableCell className="text-right">
                          <button className="text-primary text-sm hover:underline" onClick={() => setDetailInvoiceId(inv.id)}>
                            Ver itens
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Invoice items dialog */}
      <Dialog open={!!detailInvoiceId} onOpenChange={() => setDetailInvoiceId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Itens da Fatura</DialogTitle></DialogHeader>
          {detailItems && detailItems.length > 0 ? (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Qtd</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity ?? 1}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum item encontrado.</p>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

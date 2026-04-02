import { useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useFinancialSummary, useInvoices, useBillableEvents, useInvoiceMutations, useGenerateInvoice, useInvoiceItems } from '@/hooks/useFinancial';
import { useBrokers } from '@/hooks/useBrokers';
import { DollarSign, AlertTriangle, Clock, CheckCircle, FileText, Plus } from 'lucide-react';
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

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default function DispatcherFinanceiro() {
  const [monthFilter, setMonthFilter] = useState(getCurrentMonth());
  const [brokerFilter, setBrokerFilter] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('');
  const [showGenerate, setShowGenerate] = useState(false);
  const [genBrokerId, setGenBrokerId] = useState('');
  const [genDueDate, setGenDueDate] = useState('');
  const [genDiscount, setGenDiscount] = useState('0');
  const [detailInvoiceId, setDetailInvoiceId] = useState<string | null>(null);

  const { data: summary, isLoading: loadingSummary } = useFinancialSummary();
  const { data: invoices, isLoading: loadingInvoices } = useInvoices({
    broker_id: brokerFilter || undefined,
    status: invoiceStatusFilter || undefined,
    reference_month: monthFilter || undefined,
  });
  const { data: events } = useBillableEvents({ reference_month: monthFilter || undefined, status: 'pending' });
  const { data: brokers } = useBrokers();
  const { updateStatus } = useInvoiceMutations();
  const generateInvoice = useGenerateInvoice();
  const { data: detailItems } = useInvoiceItems(detailInvoiceId ?? undefined);

  const handleGenerate = async () => {
    if (!genBrokerId || !genDueDate) return;
    await generateInvoice.mutateAsync({
      brokerId: genBrokerId,
      referenceMonth: monthFilter,
      dueDate: genDueDate,
      discount: Number(genDiscount) || 0,
    });
    setShowGenerate(false);
    setGenBrokerId('');
    setGenDueDate('');
    setGenDiscount('0');
  };

  const stats = [
    { title: 'Faturado no Mês', value: summary ? formatCurrency(summary.faturadoMes) : undefined, icon: DollarSign, color: 'text-primary' },
    { title: 'Pendente de Faturar', value: summary ? formatCurrency(summary.totalPendente) : undefined, icon: Clock, color: 'text-amber-600' },
    { title: 'Em Aberto', value: summary ? formatCurrency(summary.totalAberto) : undefined, icon: FileText, color: 'text-blue-600' },
    { title: 'Pago no Mês', value: summary ? formatCurrency(summary.totalPago) : undefined, icon: CheckCircle, color: 'text-emerald-600' },
    { title: 'Inadimplentes', value: summary?.inadimplentes, icon: AlertTriangle, color: 'text-destructive' },
  ];

  return (
    <PageShell
      title="Financeiro"
      description="Visão financeira de fees e faturamento."
      actions={
        <Button onClick={() => setShowGenerate(true)}>
          <Plus className="h-4 w-4 mr-2" /> Gerar Fatura
        </Button>
      }
    >
      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{s.title}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              {loadingSummary ? <Skeleton className="h-8 w-20" /> : <div className="text-xl font-bold text-foreground">{s.value ?? '—'}</div>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="w-full sm:w-[180px]"
        />
        <Select value={brokerFilter} onValueChange={(v) => setBrokerFilter(v === '__all__' ? '' : v)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Corretora" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas</SelectItem>
            {brokers?.map((b) => <SelectItem key={b.id} value={b.id}>{b.company_name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={invoiceStatusFilter} onValueChange={(v) => setInvoiceStatusFilter(v === '__all__' ? '' : v)}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos</SelectItem>
            <SelectItem value="open">Aberta</SelectItem>
            <SelectItem value="sent">Enviada</SelectItem>
            <SelectItem value="paid">Paga</SelectItem>
            <SelectItem value="overdue">Vencida</SelectItem>
            <SelectItem value="cancelled">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoices table */}
      <Card>
        <CardHeader><CardTitle>Faturas</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Corretora</TableHead>
                  <TableHead>Mês Ref.</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Desconto</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Vencimento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingInvoices ? (
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
                        <TableCell className="font-medium">{inv.brokers?.company_name || '—'}</TableCell>
                        <TableCell>{inv.reference_month}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{formatCurrency(inv.subtotal)}</TableCell>
                        <TableCell className="text-right text-muted-foreground hidden md:table-cell">{inv.discount ? formatCurrency(inv.discount) : '—'}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(inv.total)}</TableCell>
                        <TableCell><Badge className={cfg.className}>{cfg.label}</Badge></TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{format(new Date(inv.due_date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button size="sm" variant="ghost" onClick={() => setDetailInvoiceId(inv.id)}>Itens</Button>
                            {inv.status === 'open' && (
                              <Button size="sm" variant="ghost" onClick={() => updateStatus.mutate({ id: inv.id, status: 'sent' })}>Enviar</Button>
                            )}
                            {(inv.status === 'open' || inv.status === 'sent') && (
                              <Button size="sm" variant="ghost" onClick={() => updateStatus.mutate({ id: inv.id, status: 'paid', paid_at: new Date().toISOString() })}>Pagar</Button>
                            )}
                            {inv.status !== 'cancelled' && inv.status !== 'paid' && (
                              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => updateStatus.mutate({ id: inv.id, status: 'cancelled' })}>Cancelar</Button>
                            )}
                          </div>
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

      {/* Pending events */}
      {events && events.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Eventos Pendentes ({events.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Corretora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="hidden md:table-cell">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((ev) => (
                    <TableRow key={ev.id}>
                      <TableCell>{ev.brokers?.company_name || '—'}</TableCell>
                      <TableCell>{ev.fees?.fee_name || ev.event_type || '—'}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(ev.amount)}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{format(new Date(ev.created_at), 'dd/MM/yy HH:mm')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate invoice dialog */}
      <Dialog open={showGenerate} onOpenChange={setShowGenerate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar Fatura</DialogTitle>
            <DialogDescription>Selecione a corretora e o mês de referência para gerar a fatura.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Corretora</label>
              <Select value={genBrokerId} onValueChange={setGenBrokerId}>
                <SelectTrigger><SelectValue placeholder="Selecionar corretora" /></SelectTrigger>
                <SelectContent>
                  {brokers?.map((b) => <SelectItem key={b.id} value={b.id}>{b.company_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Mês de Referência</label>
              <Input type="month" value={monthFilter} readOnly className="bg-muted" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Data de Vencimento</label>
              <Input type="date" value={genDueDate} onChange={(e) => setGenDueDate(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Desconto (R$)</label>
              <Input type="number" value={genDiscount} onChange={(e) => setGenDiscount(e.target.value)} min="0" step="0.01" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowGenerate(false)}>Cancelar</Button>
              <Button onClick={handleGenerate} disabled={!genBrokerId || !genDueDate || generateInvoice.isPending}>
                {generateInvoice.isPending ? 'Gerando...' : 'Gerar Fatura'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice detail dialog */}
      <Dialog open={!!detailInvoiceId} onOpenChange={() => setDetailInvoiceId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Itens da Fatura</DialogTitle>
          </DialogHeader>
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

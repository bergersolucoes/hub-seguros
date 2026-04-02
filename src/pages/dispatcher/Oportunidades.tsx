import { useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OpportunityStatusBadge } from '@/components/leads/OpportunityStatusBadge';
import { useOpportunities, useOpportunityCounts, type OpportunityStatus } from '@/hooks/useOpportunities';
import { useBrokers } from '@/hooks/useBrokers';
import { useProducts } from '@/hooks/useProducts';
import { Send, AlertTriangle, Clock } from 'lucide-react';
import { format, isPast } from 'date-fns';

const statusOptions: { value: OpportunityStatus | ''; label: string }[] = [
  { value: '', label: 'Todos os status' },
  { value: 'enviada', label: 'Enviada' },
  { value: 'aceita', label: 'Aceita' },
  { value: 'recusada', label: 'Recusada' },
  { value: 'expirada', label: 'Expirada' },
  { value: 'em_atendimento', label: 'Em Atendimento' },
  { value: 'contato_realizado', label: 'Contato Realizado' },
  { value: 'proposta_emitida', label: 'Proposta Emitida' },
  { value: 'negociacao', label: 'Negociação' },
  { value: 'fechada', label: 'Fechada' },
  { value: 'perdida', label: 'Perdida' },
];

export default function DispatcherOportunidades() {
  const [statusFilter, setStatusFilter] = useState('');
  const [brokerFilter, setBrokerFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');

  const { data: opportunities, isLoading } = useOpportunities({
    status: statusFilter || undefined,
    broker_id: brokerFilter || undefined,
    product_id: productFilter || undefined,
  });
  const { data: counts } = useOpportunityCounts();
  const { data: brokers } = useBrokers();
  const { data: products } = useProducts();

  return (
    <PageShell title="Oportunidades" description="Oportunidades distribuídas para corretoras.">
      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enviadas</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{counts?.enviadas ?? '—'}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Atraso (SLA)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-destructive">{counts?.atrasadas ?? '—'}</div></CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v === '__all__' ? '' : v)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s.value} value={s.value || '__all__'}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={brokerFilter} onValueChange={(v) => setBrokerFilter(v === '__all__' ? '' : v)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Corretora" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas as corretoras</SelectItem>
            {brokers?.map((b) => (
              <SelectItem key={b.id} value={b.id}>{b.company_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={productFilter} onValueChange={(v) => setProductFilter(v === '__all__' ? '' : v)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Produto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos os produtos</SelectItem>
            {products?.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead</TableHead>
              <TableHead>Corretora</TableHead>
              <TableHead className="hidden md:table-cell">Produto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">SLA</TableHead>
              <TableHead className="hidden lg:table-cell">Atualização</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : !opportunities?.length ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  Nenhuma oportunidade encontrada.
                </TableCell>
              </TableRow>
            ) : (
              opportunities.map((opp) => {
                const slaExpired = opp.sla_accept_until && opp.status === 'enviada' && isPast(new Date(opp.sla_accept_until));
                return (
                  <TableRow key={opp.id}>
                    <TableCell>
                      <div>
                        <span className="font-medium">{opp.leads?.full_name || '—'}</span>
                        <p className="text-xs text-muted-foreground">{opp.leads?.phone || opp.leads?.email || ''}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{opp.brokers?.company_name || '—'}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{opp.products?.name || '—'}</TableCell>
                    <TableCell><OpportunityStatusBadge status={opp.status} /></TableCell>
                    <TableCell className="hidden md:table-cell">
                      {opp.sla_accept_until ? (
                        <span className={`flex items-center gap-1 text-xs ${slaExpired ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                          <Clock className="h-3 w-3" />
                          {format(new Date(opp.sla_accept_until), 'dd/MM HH:mm')}
                          {slaExpired && ' (atrasado)'}
                        </span>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                      {format(new Date(opp.updated_at), 'dd/MM/yy HH:mm')}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </PageShell>
  );
}

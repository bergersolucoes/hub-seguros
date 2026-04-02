import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { OpportunityStatusBadge } from '@/components/leads/OpportunityStatusBadge';
import { useBrokerOpportunities } from '@/hooks/useBrokerPanel';
import { useProducts } from '@/hooks/useProducts';
import type { OpportunityStatus } from '@/hooks/useOpportunities';
import { Eye, Clock } from 'lucide-react';
import { format, isPast } from 'date-fns';

const statusOptions: { value: OpportunityStatus | ''; label: string }[] = [
  { value: '', label: 'Todos os status' },
  { value: 'enviada', label: 'Aguardando aceite' },
  { value: 'aceita', label: 'Aceita' },
  { value: 'em_atendimento', label: 'Em Atendimento' },
  { value: 'contato_realizado', label: 'Contato Realizado' },
  { value: 'proposta_emitida', label: 'Proposta Emitida' },
  { value: 'negociacao', label: 'Negociação' },
  { value: 'fechada', label: 'Fechada' },
  { value: 'perdida', label: 'Perdida' },
  { value: 'recusada', label: 'Recusada' },
  { value: 'expirada', label: 'Expirada' },
];

export default function CorretoraOportunidades() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');

  const { data: opportunities, isLoading } = useBrokerOpportunities({
    status: statusFilter || undefined,
    product_id: productFilter || undefined,
  });
  const { data: products } = useProducts();

  return (
    <PageShell title="Oportunidades" description="Oportunidades recebidas para sua corretora.">
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

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead</TableHead>
              <TableHead className="hidden md:table-cell">Telefone</TableHead>
              <TableHead className="hidden lg:table-cell">Cidade/UF</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">SLA</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : !opportunities?.length ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  Nenhuma oportunidade encontrada.
                </TableCell>
              </TableRow>
            ) : (
              opportunities.map((opp) => {
                const slaExpired = opp.sla_accept_until && opp.status === 'enviada' && isPast(new Date(opp.sla_accept_until));
                return (
                  <TableRow
                    key={opp.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/corretora/oportunidades/${opp.id}`)}
                  >
                    <TableCell className="font-medium">{opp.leads?.full_name || '—'}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{opp.leads?.phone || '—'}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {[opp.leads?.city, opp.leads?.state].filter(Boolean).join('/') || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{opp.products?.name || '—'}</TableCell>
                    <TableCell><OpportunityStatusBadge status={opp.status} /></TableCell>
                    <TableCell className="hidden md:table-cell">
                      {opp.sla_accept_until && opp.status === 'enviada' ? (
                        <span className={`flex items-center gap-1 text-xs ${slaExpired ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                          <Clock className="h-3 w-3" />
                          {format(new Date(opp.sla_accept_until), 'dd/MM HH:mm')}
                        </span>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button size="icon" variant="ghost" onClick={() => navigate(`/corretora/oportunidades/${opp.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
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

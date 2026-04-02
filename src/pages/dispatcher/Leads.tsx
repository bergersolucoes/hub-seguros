import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { LeadStatusBadge } from '@/components/leads/LeadStatusBadge';
import { DispatchModal } from '@/components/leads/DispatchModal';
import { useLeads, type LeadStatus } from '@/hooks/useLeads';
import { useProducts } from '@/hooks/useProducts';
import { Search, Eye, Send } from 'lucide-react';
import { format } from 'date-fns';

const statusOptions: { value: LeadStatus | ''; label: string }[] = [
  { value: '', label: 'Todos os status' },
  { value: 'novo', label: 'Novo' },
  { value: 'em_triagem', label: 'Em Triagem' },
  { value: 'qualificado', label: 'Qualificado' },
  { value: 'aguardando_despacho', label: 'Aguardando Despacho' },
  { value: 'despachado', label: 'Despachado' },
  { value: 'redistribuicao', label: 'Redistribuição' },
  { value: 'descartado', label: 'Descartado' },
  { value: 'encerrado', label: 'Encerrado' },
];

export default function DispatcherLeads() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [dispatchLead, setDispatchLead] = useState<{ id: string; name: string; productId: string | null } | null>(null);

  const { data: leads, isLoading } = useLeads({
    status: statusFilter || undefined,
    product_id: productFilter || undefined,
    search: search || undefined,
  });
  const { data: products } = useProducts();

  return (
    <PageShell title="Leads" description="Leads recebidos aguardando qualificação e despacho.">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s.value} value={s.value || '__all__'}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={productFilter} onValueChange={setProductFilter}>
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
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">Telefone</TableHead>
              <TableHead className="hidden lg:table-cell">Cidade/UF</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Data</TableHead>
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
            ) : !leads?.length ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  Nenhum lead encontrado.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/dispatcher/leads/${lead.id}`)}>
                  <TableCell className="font-medium">{lead.full_name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{lead.phone || '—'}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {[lead.city, lead.state].filter(Boolean).join('/') || '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{lead.products?.name || '—'}</TableCell>
                  <TableCell><LeadStatusBadge status={lead.status} /></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {format(new Date(lead.created_at), 'dd/MM/yy HH:mm')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button size="icon" variant="ghost" onClick={() => navigate(`/dispatcher/leads/${lead.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {(lead.status === 'qualificado' || lead.status === 'aguardando_despacho' || lead.status === 'redistribuicao') && (
                        <Button size="icon" variant="ghost" onClick={() => setDispatchLead({ id: lead.id, name: lead.full_name, productId: lead.product_id })}>
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {dispatchLead && (
        <DispatchModal
          open={!!dispatchLead}
          onOpenChange={() => setDispatchLead(null)}
          leadId={dispatchLead.id}
          leadName={dispatchLead.name}
          productId={dispatchLead.productId}
        />
      )}
    </PageShell>
  );
}

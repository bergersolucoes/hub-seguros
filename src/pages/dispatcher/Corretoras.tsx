import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell, SearchFilter } from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Eye, Building2 } from 'lucide-react';
import { useBrokers, useBrokerMutations } from '@/hooks/useBrokers';
import { BrokerForm } from '@/components/brokers/BrokerForm';
import type { Broker } from '@/hooks/useBrokers';

type BrokerFormData = Omit<Broker, 'id' | 'created_at' | 'updated_at'>;

export default function DispatcherCorretoras() {
  const { data: brokers, isLoading } = useBrokers();
  const { create, update } = useBrokerMutations();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Broker | null>(null);
  const [search, setSearch] = useState('');

  const filtered = brokers?.filter((b) =>
    b.company_name.toLowerCase().includes(search.toLowerCase()) ||
    (b.trade_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.cnpj || '').includes(search)
  );

  const handleSubmit = (data: BrokerFormData) => {
    if (editing) {
      update.mutate({ id: editing.id, ...data }, { onSuccess: () => { setFormOpen(false); setEditing(null); } });
    } else {
      create.mutate(data, { onSuccess: () => setFormOpen(false) });
    }
  };

  return (
    <PageShell
      title="Corretoras"
      description="Corretoras parceiras cadastradas no sistema."
      badge={brokers ? `${brokers.length}` : undefined}
      actions={
        <div className="flex items-center gap-2">
          <div className="relative max-w-sm">
            <input
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm placeholder:text-muted-foreground"
              placeholder="Buscar corretora..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Nova Corretora
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : filtered && filtered.length > 0 ? (
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Razão Social</TableHead>
                <TableHead className="hidden md:table-cell">CNPJ</TableHead>
                <TableHead className="hidden md:table-cell">Cidade/UF</TableHead>
                <TableHead className="hidden lg:table-cell">Capacidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{b.company_name}</div>
                      {b.trade_name && <div className="text-xs text-muted-foreground">{b.trade_name}</div>}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{b.cnpj || '—'}</TableCell>
                  <TableCell className="hidden md:table-cell">{b.city && b.state ? `${b.city}/${b.state}` : '—'}</TableCell>
                  <TableCell className="hidden lg:table-cell">{b.current_capacity_used}/{b.weekly_capacity}</TableCell>
                  <TableCell>
                    <Badge variant={b.is_active ? 'default' : 'secondary'}>{b.is_active ? 'Ativa' : 'Inativa'}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/dispatcher/corretoras/${b.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(b); setFormOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Building2 className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Nenhuma corretora cadastrada.</p>
          <Button size="sm" className="mt-4" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Cadastrar primeira corretora
          </Button>
        </div>
      )}

      <BrokerForm
        open={formOpen}
        onOpenChange={setFormOpen}
        broker={editing}
        onSubmit={handleSubmit}
        isLoading={create.isPending || update.isPending}
      />
    </PageShell>
  );
}

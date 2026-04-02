import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus } from 'lucide-react';
import { useBrokerRegions, useBrokerRegionMutations } from '@/hooks/useBrokers';

const STATES = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'];

export function BrokerRegions({ brokerId }: { brokerId: string }) {
  const { data: regions, isLoading } = useBrokerRegions(brokerId);
  const { create, remove } = useBrokerRegionMutations();
  const [form, setForm] = useState({ state: '', city: '', zip_start: '', zip_end: '' });

  const handleAdd = () => {
    if (!form.state) return;
    create.mutate({ broker_id: brokerId, ...form });
    setForm({ state: '', city: '', zip_start: '', zip_end: '' });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-5 items-end">
        <div className="space-y-1">
          <Label className="text-xs">Estado</Label>
          <select className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm" value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}>
            <option value="">UF</option>
            {STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Cidade</Label>
          <Input className="h-9" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} placeholder="Cidade" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">CEP início</Label>
          <Input className="h-9" value={form.zip_start} onChange={(e) => setForm((p) => ({ ...p, zip_start: e.target.value }))} placeholder="00000" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">CEP fim</Label>
          <Input className="h-9" value={form.zip_end} onChange={(e) => setForm((p) => ({ ...p, zip_end: e.target.value }))} placeholder="99999" />
        </div>
        <Button size="sm" onClick={handleAdd} disabled={create.isPending}><Plus className="h-4 w-4 mr-1" /> Adicionar</Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : regions && regions.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estado</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>CEP Início</TableHead>
              <TableHead>CEP Fim</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regions.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.state}</TableCell>
                <TableCell>{r.city || '—'}</TableCell>
                <TableCell>{r.zip_start || '—'}</TableCell>
                <TableCell>{r.zip_end || '—'}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => remove.mutate(r.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">Nenhuma região cadastrada.</p>
      )}
    </div>
  );
}

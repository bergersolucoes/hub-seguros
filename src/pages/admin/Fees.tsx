import { useState } from 'react';
import { PageShell } from '@/components/PageShell';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFees, useFeeMutations, feeTypeLabels, type FeeType } from '@/hooks/useFinancial';
import { useBrokers } from '@/hooks/useBrokers';
import { useProducts } from '@/hooks/useProducts';
import { Plus, Trash2 } from 'lucide-react';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

const feeTypes: FeeType[] = ['setup', 'monthly', 'qualified_lead', 'accepted_lead', 'proposal', 'closed_sale'];

export default function AdminFees() {
  const [brokerFilter, setBrokerFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    broker_id: '',
    product_id: '',
    fee_name: '',
    fee_type: '' as FeeType | '',
    amount: '',
  });

  const { data: fees, isLoading } = useFees({ broker_id: brokerFilter || undefined });
  const { data: brokers } = useBrokers();
  const { data: products } = useProducts();
  const { create, remove } = useFeeMutations();

  const handleCreate = async () => {
    if (!form.broker_id || !form.fee_name || !form.fee_type || !form.amount) return;
    await create.mutateAsync({
      broker_id: form.broker_id,
      product_id: form.product_id || null,
      fee_name: form.fee_name,
      fee_type: form.fee_type,
      amount: Number(form.amount),
    });
    setShowCreate(false);
    setForm({ broker_id: '', product_id: '', fee_name: '', fee_type: '', amount: '' });
  };

  return (
    <PageShell
      title="Fees"
      description="Gerenciar taxas por corretora e produto."
      actions={
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" /> Nova Fee
        </Button>
      }
    >
      <div className="flex gap-3">
        <Select value={brokerFilter} onValueChange={(v) => setBrokerFilter(v === '__all__' ? '' : v)}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Filtrar por corretora" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas as corretoras</SelectItem>
            {brokers?.map((b) => <SelectItem key={b.id} value={b.id}>{b.company_name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Corretora</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="hidden md:table-cell">Produto</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>{Array.from({ length: 7 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-16" /></TableCell>)}</TableRow>
              ))
            ) : !fees?.length ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhuma fee cadastrada.</TableCell></TableRow>
            ) : (
              fees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.brokers?.company_name || '—'}</TableCell>
                  <TableCell>{fee.fee_name}</TableCell>
                  <TableCell><Badge variant="outline">{feeTypeLabels[fee.fee_type] || fee.fee_type}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{fee.products?.name || 'Todos'}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(fee.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={fee.is_active ? 'default' : 'secondary'} className={fee.is_active ? 'bg-emerald-500' : ''}>
                      {fee.is_active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => remove.mutate(fee.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova Fee</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Corretora *</label>
              <Select value={form.broker_id} onValueChange={(v) => setForm((f) => ({ ...f, broker_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>
                  {brokers?.map((b) => <SelectItem key={b.id} value={b.id}>{b.company_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Produto (opcional)</label>
              <Select value={form.product_id} onValueChange={(v) => setForm((f) => ({ ...f, product_id: v === '__none__' ? '' : v }))}>
                <SelectTrigger><SelectValue placeholder="Todos os produtos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Todos os produtos</SelectItem>
                  {products?.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Tipo de Fee *</label>
              <Select value={form.fee_type} onValueChange={(v) => setForm((f) => ({ ...f, fee_type: v as FeeType, fee_name: f.fee_name || feeTypeLabels[v as FeeType] || '' }))}>
                <SelectTrigger><SelectValue placeholder="Selecionar tipo" /></SelectTrigger>
                <SelectContent>
                  {feeTypes.map((t) => <SelectItem key={t} value={t}>{feeTypeLabels[t]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Nome da Fee *</label>
              <Input value={form.fee_name} onChange={(e) => setForm((f) => ({ ...f, fee_name: e.target.value }))} placeholder="Ex: Fee de Setup Mensal" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Valor (R$) *</label>
              <Input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} min="0" step="0.01" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancelar</Button>
              <Button onClick={handleCreate} disabled={create.isPending}>
                {create.isPending ? 'Criando...' : 'Criar Fee'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

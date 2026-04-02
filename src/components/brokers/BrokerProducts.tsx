import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus } from 'lucide-react';
import { useBrokerProducts, useBrokerProductMutations } from '@/hooks/useBrokers';
import { useProducts } from '@/hooks/useProducts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function BrokerProducts({ brokerId }: { brokerId: string }) {
  const { data: linked, isLoading } = useBrokerProducts(brokerId);
  const { data: allProducts } = useProducts();
  const { create, remove } = useBrokerProductMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [feeType, setFeeType] = useState('');
  const [feeValue, setFeeValue] = useState('');
  const [maxLeads, setMaxLeads] = useState('');

  const linkedIds = linked?.map((l) => l.product_id) || [];
  const available = allProducts?.filter((p) => !linkedIds.includes(p.id)) || [];

  const handleAdd = () => {
    if (!selectedProduct) return;
    create.mutate({
      broker_id: brokerId,
      product_id: selectedProduct,
      custom_fee_type: feeType || undefined,
      custom_fee_value: feeValue ? Number(feeValue) : undefined,
      max_leads_per_week: maxLeads ? Number(maxLeads) : undefined,
    });
    setDialogOpen(false);
    setSelectedProduct('');
    setFeeType('');
    setFeeValue('');
    setMaxLeads('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setDialogOpen(true)} disabled={available.length === 0}>
          <Plus className="h-4 w-4 mr-1" /> Vincular Produto
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : linked && linked.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Fee Customizado</TableHead>
              <TableHead>Max Leads/Semana</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {linked.map((bp) => (
              <TableRow key={bp.id}>
                <TableCell className="font-medium">{(bp as any).products?.name || '—'}</TableCell>
                <TableCell>{bp.custom_fee_type ? `${bp.custom_fee_type}: R$ ${bp.custom_fee_value}` : '—'}</TableCell>
                <TableCell>{bp.max_leads_per_week ?? '—'}</TableCell>
                <TableCell><Badge variant={bp.is_active ? 'default' : 'secondary'}>{bp.is_active ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => remove.mutate(bp.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">Nenhum produto vinculado.</p>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Vincular Produto</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Produto</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                <option value="">Selecione...</option>
                {available.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label>Tipo Fee Customizado</Label>
                <Input value={feeType} onChange={(e) => setFeeType(e.target.value)} placeholder="Ex: fixo" />
              </div>
              <div className="space-y-2">
                <Label>Valor Fee</Label>
                <Input type="number" value={feeValue} onChange={(e) => setFeeValue(e.target.value)} placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Max Leads/Semana</Label>
              <Input type="number" value={maxLeads} onChange={(e) => setMaxLeads(e.target.value)} placeholder="Ilimitado" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAdd} disabled={!selectedProduct}>Vincular</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

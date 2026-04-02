import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { useProductFormFields, useProductFormFieldMutations } from '@/hooks/useProducts';

const FIELD_TYPES = ['text', 'number', 'email', 'tel', 'select', 'textarea', 'checkbox', 'date'];

export function ProductFormFields({ productId }: { productId: string }) {
  const { data: fields, isLoading } = useProductFormFields(productId);
  const { create, remove } = useProductFormFieldMutations();
  const [form, setForm] = useState({
    field_key: '', label: '', field_type: 'text', placeholder: '', is_required: false, sort_order: 0,
  });

  const handleAdd = () => {
    if (!form.field_key || !form.label) return;
    create.mutate({ product_id: productId, ...form });
    setForm({ field_key: '', label: '', field_type: 'text', placeholder: '', is_required: false, sort_order: (fields?.length || 0) + 1 });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-6 items-end">
        <div className="space-y-1">
          <Label className="text-xs">Chave</Label>
          <Input className="h-9" value={form.field_key} onChange={(e) => setForm((p) => ({ ...p, field_key: e.target.value }))} placeholder="campo_x" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Label</Label>
          <Input className="h-9" value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))} placeholder="Nome do campo" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Tipo</Label>
          <select className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm" value={form.field_type} onChange={(e) => setForm((p) => ({ ...p, field_type: e.target.value }))}>
            {FIELD_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Placeholder</Label>
          <Input className="h-9" value={form.placeholder} onChange={(e) => setForm((p) => ({ ...p, placeholder: e.target.value }))} />
        </div>
        <div className="flex items-center gap-2 h-9">
          <Switch checked={form.is_required} onCheckedChange={(v) => setForm((p) => ({ ...p, is_required: v }))} />
          <Label className="text-xs">Obrigatório</Label>
        </div>
        <Button size="sm" onClick={handleAdd} disabled={create.isPending}><Plus className="h-4 w-4 mr-1" /> Adicionar</Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : fields && fields.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordem</TableHead>
              <TableHead>Chave</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Obrigatório</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((f) => (
              <TableRow key={f.id}>
                <TableCell>{f.sort_order}</TableCell>
                <TableCell className="font-mono text-xs">{f.field_key}</TableCell>
                <TableCell>{f.label}</TableCell>
                <TableCell>{f.field_type}</TableCell>
                <TableCell>{f.is_required ? 'Sim' : 'Não'}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => remove.mutate(f.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">Nenhum campo customizado cadastrado.</p>
      )}
    </div>
  );
}

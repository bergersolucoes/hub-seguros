import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import type { Product } from '@/hooks/useProducts';

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function ProductForm({ open, onOpenChange, product, onSubmit, isLoading }: ProductFormProps) {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: '',
    description: '',
    is_active: true,
    is_featured: false,
    public_page_enabled: true,
    default_fee_type: '',
    default_fee_value: '',
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        slug: product.slug || '',
        category: product.category || '',
        description: product.description || '',
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        public_page_enabled: product.public_page_enabled ?? true,
        default_fee_type: product.default_fee_type || '',
        default_fee_value: product.default_fee_value?.toString() || '',
      });
    } else {
      setForm({
        name: '', slug: '', category: '', description: '', is_active: true,
        is_featured: false, public_page_enabled: true, default_fee_type: '', default_fee_value: '',
      });
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      default_fee_value: form.default_fee_value ? Number(form.default_fee_value) : null,
      default_fee_type: form.default_fee_type || null,
    });
  };

  const set = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={(e) => set('slug', e.target.value)} required placeholder="ex: auto" />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Input value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="ex: seguro" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Fee Padrão (tipo)</Label>
              <Input value={form.default_fee_type} onChange={(e) => set('default_fee_type', e.target.value)} placeholder="fixo / percentual" />
            </div>
            <div className="space-y-2">
              <Label>Fee Padrão (valor)</Label>
              <Input type="number" value={form.default_fee_value} onChange={(e) => set('default_fee_value', e.target.value)} placeholder="0.00" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Ativo</Label>
              <Switch checked={form.is_active} onCheckedChange={(v) => set('is_active', v)} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Destaque</Label>
              <Switch checked={form.is_featured} onCheckedChange={(v) => set('is_featured', v)} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Página pública habilitada</Label>
              <Switch checked={form.public_page_enabled} onCheckedChange={(v) => set('public_page_enabled', v)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

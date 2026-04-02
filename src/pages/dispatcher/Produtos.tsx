import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Eye, Package } from 'lucide-react';
import { useProducts, useProductMutations } from '@/hooks/useProducts';
import { ProductForm } from '@/components/products/ProductForm';
import type { Product } from '@/hooks/useProducts';

type ProductFormData = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

export default function DispatcherProdutos() {
  const { data: products, isLoading } = useProducts();
  const { create, update } = useProductMutations();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [search, setSearch] = useState('');

  const filtered = products?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (data: ProductFormData) => {
    if (editing) {
      update.mutate({ id: editing.id, ...data }, { onSuccess: () => { setFormOpen(false); setEditing(null); } });
    } else {
      create.mutate(data, { onSuccess: () => setFormOpen(false) });
    }
  };

  return (
    <PageShell
      title="Produtos"
      description="Produtos de seguros disponíveis para distribuição."
      badge={products ? `${products.length}` : undefined}
      actions={
        <div className="flex items-center gap-2">
          <input
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm placeholder:text-muted-foreground"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Novo Produto
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
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="hidden md:table-cell">Categoria</TableHead>
                <TableHead className="hidden md:table-cell">Fee Padrão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs">{p.slug}</TableCell>
                  <TableCell className="hidden md:table-cell">{p.category || '—'}</TableCell>
                  <TableCell className="hidden md:table-cell">{p.default_fee_type ? `${p.default_fee_type}: R$ ${p.default_fee_value}` : '—'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Badge variant={p.is_active ? 'default' : 'secondary'}>{p.is_active ? 'Ativo' : 'Inativo'}</Badge>
                      {p.is_featured && <Badge variant="outline">Destaque</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/dispatcher/produtos/${p.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setFormOpen(true); }}>
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
          <Package className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Nenhum produto cadastrado.</p>
          <Button size="sm" className="mt-4" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Criar primeiro produto
          </Button>
        </div>
      )}

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
        onSubmit={handleSubmit}
        isLoading={create.isPending || update.isPending}
      />
    </PageShell>
  );
}

import { useParams, useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, Settings } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { ProductFormFields } from '@/components/products/ProductFormFields';

export default function ProdutoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id);

  if (isLoading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  if (!product) return <div className="text-center p-12 text-muted-foreground">Produto não encontrado.</div>;

  return (
    <PageShell
      title={product.name}
      description={product.description || undefined}
      badge={product.is_active ? 'Ativo' : 'Inativo'}
      actions={
        <Button variant="outline" size="sm" onClick={() => navigate('/dispatcher/produtos')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Slug</CardTitle></CardHeader>
          <CardContent><span className="font-mono">{product.slug}</span></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Categoria</CardTitle></CardHeader>
          <CardContent>{product.category || '—'}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Fee Padrão</CardTitle></CardHeader>
          <CardContent>{product.default_fee_type ? `${product.default_fee_type}: R$ ${product.default_fee_value}` : '—'}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Flags</CardTitle></CardHeader>
          <CardContent className="flex gap-1 flex-wrap">
            {product.is_featured && <Badge variant="outline">Destaque</Badge>}
            {product.public_page_enabled && <Badge variant="outline">Página Pública</Badge>}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="fields">
        <TabsList>
          <TabsTrigger value="fields"><Settings className="h-4 w-4 mr-1" /> Campos do Formulário</TabsTrigger>
        </TabsList>
        <TabsContent value="fields" className="mt-4">
          <ProductFormFields productId={product.id} />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

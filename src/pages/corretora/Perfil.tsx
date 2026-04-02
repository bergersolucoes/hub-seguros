import { useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useBrokerProfile } from '@/hooks/useBrokerPanel';
import { useBrokerRegions, useBrokerRegionMutations, useBrokerProducts, useBrokerProductMutations } from '@/hooks/useBrokers';
import { useBrokerMutations } from '@/hooks/useBrokers';
import { useProducts } from '@/hooks/useProducts';
import { useRole } from '@/hooks/useRole';
import { useToast } from '@/hooks/use-toast';
import { Building2, MapPin, Package, Save, Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Broker, BrokerProductLink, BrokerRegion } from '@/hooks/useBrokers';

export default function CorretoraPerfil() {
  const { isDonoCorretora } = useRole();
  const { data: broker, isLoading } = useBrokerProfile();
  const { data: regions } = useBrokerRegions(broker?.id);
  const { data: brokerProducts } = useBrokerProducts(broker?.id);
  const { data: products } = useProducts();
  const { update } = useBrokerMutations();
  const regionMutations = useBrokerRegionMutations();
  const bpMutations = useBrokerProductMutations();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Broker>>({});
  const [newRegion, setNewRegion] = useState({ state: '', city: '' });
  const [newProductId, setNewProductId] = useState('');

  if (isLoading) return <PageShell title="Perfil"><Skeleton className="h-64 w-full" /></PageShell>;
  if (!broker) return <PageShell title="Perfil" description="Nenhuma corretora associada ao seu usuário." />;

  const startEdit = () => {
    setForm({
      company_name: broker.company_name || '',
      trade_name: broker.trade_name || '',
      cnpj: broker.cnpj || '',
      contact_name: broker.contact_name || '',
      email: broker.email || '',
      phone: broker.phone || '',
      whatsapp: broker.whatsapp || '',
      city: broker.city || '',
      state: broker.state || '',
      address: broker.address || '',
      weekly_capacity: broker.weekly_capacity ?? 0,
      notes: broker.notes || '',
    });
    setEditing(true);
  };

  const handleSave = async () => {
    await update.mutateAsync({ id: broker.id, ...form });
    setEditing(false);
    toast({ title: 'Perfil atualizado' });
  };

  const handleAddRegion = async () => {
    if (!newRegion.state) return;
    await regionMutations.create.mutateAsync({ broker_id: broker.id, ...newRegion });
    setNewRegion({ state: '', city: '' });
  };

  const handleAddProduct = async () => {
    if (!newProductId) return;
    await bpMutations.create.mutateAsync({ broker_id: broker.id, product_id: newProductId });
    setNewProductId('');
  };

  const linkedProductIds = brokerProducts?.map((bp: BrokerProductLink) => bp.product_id) || [];
  const availableProducts = products?.filter((p) => !linkedProductIds.includes(p.id)) || [];

  return (
    <PageShell title="Perfil da Corretora" description="Dados cadastrais, regiões e produtos.">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Company info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Building2 className="h-4 w-4" />Dados Cadastrais</CardTitle>
            {isDonoCorretora && !editing && <Button size="sm" variant="outline" onClick={startEdit}>Editar</Button>}
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="space-y-3">
                {(['company_name', 'trade_name', 'cnpj', 'contact_name', 'email', 'phone', 'whatsapp', 'city', 'state', 'address'] as const).map((field) => (
                  <div key={field}>
                    <label className="text-xs text-muted-foreground capitalize">{field.replace('_', ' ')}</label>
                    <Input value={String(form[field] || '')} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-muted-foreground">Capacidade semanal</label>
                  <Input type="number" value={String(form.weekly_capacity || 0)} onChange={(e) => setForm((f) => ({ ...f, weekly_capacity: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Observações</label>
                  <Textarea value={String(form.notes || '')} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={update.isPending}><Save className="h-4 w-4 mr-2" />Salvar</Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div><dt className="text-muted-foreground">Razão Social</dt><dd className="font-medium">{broker.company_name}</dd></div>
                <div><dt className="text-muted-foreground">Nome Fantasia</dt><dd>{broker.trade_name || '—'}</dd></div>
                <div><dt className="text-muted-foreground">CNPJ</dt><dd>{broker.cnpj || '—'}</dd></div>
                <div><dt className="text-muted-foreground">Contato</dt><dd>{broker.contact_name || '—'}</dd></div>
                <div><dt className="text-muted-foreground">Email</dt><dd>{broker.email || '—'}</dd></div>
                <div><dt className="text-muted-foreground">Telefone</dt><dd>{broker.phone || '—'}</dd></div>
                <div><dt className="text-muted-foreground">WhatsApp</dt><dd>{broker.whatsapp || '—'}</dd></div>
                <div><dt className="text-muted-foreground">Cidade/UF</dt><dd>{[broker.city, broker.state].filter(Boolean).join('/') || '—'}</dd></div>
                <div><dt className="text-muted-foreground">Capacidade Semanal</dt><dd>{broker.weekly_capacity ?? '—'}</dd></div>
                <div><dt className="text-muted-foreground">Uso Atual</dt><dd>{broker.current_capacity_used ?? 0}</dd></div>
              </dl>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Regions */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-4 w-4" />Regiões de Atuação</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {regions?.map((r: BrokerRegion) => (
                <div key={r.id} className="flex items-center justify-between">
                  <Badge variant="outline">{[r.state, r.city].filter(Boolean).join(' — ')}</Badge>
                  {isDonoCorretora && (
                    <Button size="icon" variant="ghost" onClick={() => regionMutations.remove.mutate(r.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              {isDonoCorretora && (
                <div className="flex gap-2 pt-2">
                  <Input placeholder="UF" value={newRegion.state} onChange={(e) => setNewRegion((r) => ({ ...r, state: e.target.value }))} className="w-20" />
                  <Input placeholder="Cidade" value={newRegion.city} onChange={(e) => setNewRegion((r) => ({ ...r, city: e.target.value }))} className="flex-1" />
                  <Button size="icon" onClick={handleAddRegion}><Plus className="h-4 w-4" /></Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-4 w-4" />Produtos</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {brokerProducts?.map((bp: BrokerProductLink) => (
                <div key={bp.id} className="flex items-center justify-between">
                  <Badge variant="secondary">{bp.products?.name || bp.product_id}</Badge>
                  {isDonoCorretora && (
                    <Button size="icon" variant="ghost" onClick={() => bpMutations.remove.mutate(bp.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              {isDonoCorretora && availableProducts.length > 0 && (
                <div className="flex gap-2 pt-2">
                  <Select value={newProductId} onValueChange={setNewProductId}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Adicionar produto" /></SelectTrigger>
                    <SelectContent>
                      {availableProducts.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button size="icon" onClick={handleAddProduct}><Plus className="h-4 w-4" /></Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

import { useParams, useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Building2, MapPin, Package } from 'lucide-react';
import { useBroker } from '@/hooks/useBrokers';
import { BrokerRegions } from '@/components/brokers/BrokerRegions';
import { BrokerProducts } from '@/components/brokers/BrokerProducts';

export default function CorretoraDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: broker, isLoading } = useBroker(id);

  if (isLoading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  if (!broker) return <div className="text-center p-12 text-muted-foreground">Corretora não encontrada.</div>;

  return (
    <PageShell
      title={broker.company_name}
      description={broker.trade_name || undefined}
      badge={broker.is_active ? 'Ativa' : 'Inativa'}
      actions={
        <Button variant="outline" size="sm" onClick={() => navigate('/dispatcher/corretoras')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">CNPJ</CardTitle></CardHeader>
          <CardContent><span className="font-medium">{broker.cnpj || '—'}</span></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Contato</CardTitle></CardHeader>
          <CardContent>
            <div className="text-sm">{broker.contact_name || '—'}</div>
            <div className="text-xs text-muted-foreground">{broker.email} · {broker.phone}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Capacidade</CardTitle></CardHeader>
          <CardContent><span className="font-medium">{broker.current_capacity_used}/{broker.weekly_capacity} leads/semana</span></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="regions">
        <TabsList>
          <TabsTrigger value="regions"><MapPin className="h-4 w-4 mr-1" /> Regiões</TabsTrigger>
          <TabsTrigger value="products"><Package className="h-4 w-4 mr-1" /> Produtos</TabsTrigger>
        </TabsList>
        <TabsContent value="regions" className="mt-4">
          <BrokerRegions brokerId={broker.id} />
        </TabsContent>
        <TabsContent value="products" className="mt-4">
          <BrokerProducts brokerId={broker.id} />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

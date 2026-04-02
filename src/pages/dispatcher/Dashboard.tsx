import { PageShell } from '@/components/PageShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLeadCounts } from '@/hooks/useLeads';
import { useOpportunityCounts } from '@/hooks/useOpportunities';
import { ClipboardList, Search, Send, AlertTriangle, Clock } from 'lucide-react';

export default function DispatcherDashboard() {
  const { data: leadCounts, isLoading: loadingLeads } = useLeadCounts();
  const { data: oppCounts, isLoading: loadingOpps } = useOpportunityCounts();

  const stats = [
    { title: 'Leads Novos Hoje', value: leadCounts?.todayLeads, icon: ClipboardList, color: 'text-blue-600' },
    { title: 'Aguardando Triagem', value: leadCounts?.novos, icon: Search, color: 'text-amber-600' },
    { title: 'Aguardando Despacho', value: leadCounts?.aguardandoDespacho, icon: Send, color: 'text-purple-600' },
    { title: 'Oportunidades Enviadas', value: oppCounts?.enviadas, icon: Clock, color: 'text-teal-600' },
    { title: 'Oportunidades em Atraso', value: oppCounts?.atrasadas, icon: AlertTriangle, color: 'text-destructive' },
  ];

  const loading = loadingLeads || loadingOpps;

  return (
    <PageShell title="Dashboard" description="Visão geral das operações.">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{s.title}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-bold text-foreground">{s.value ?? '—'}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

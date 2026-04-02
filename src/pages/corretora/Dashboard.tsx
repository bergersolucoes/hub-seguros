import { PageShell } from '@/components/PageShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useBrokerDashboardCounts } from '@/hooks/useBrokerPanel';
import { Send, CheckCircle, Briefcase, FileText, Trophy, XCircle, TrendingUp, Target } from 'lucide-react';

export default function CorretoraDashboard() {
  const { data: counts, isLoading } = useBrokerDashboardCounts();

  const stats = [
    { title: 'Aguardando Aceite', value: counts?.enviadas, icon: Send, color: 'text-blue-600' },
    { title: 'Aceitas', value: counts?.aceitas, icon: CheckCircle, color: 'text-emerald-600' },
    { title: 'Em Atendimento', value: counts?.emAtendimento, icon: Briefcase, color: 'text-cyan-600' },
    { title: 'Propostas Emitidas', value: counts?.propostas, icon: FileText, color: 'text-violet-600' },
    { title: 'Fechadas (mês)', value: counts?.fechadasMes, icon: Trophy, color: 'text-green-700' },
    { title: 'Perdidas (mês)', value: counts?.perdidasMes, icon: XCircle, color: 'text-destructive' },
    { title: 'Taxa de Aceite', value: counts ? `${counts.taxaAceite}%` : undefined, icon: TrendingUp, color: 'text-amber-600' },
    { title: 'Taxa de Fechamento', value: counts ? `${counts.taxaFechamento}%` : undefined, icon: Target, color: 'text-primary' },
  ];

  return (
    <PageShell title="Dashboard" description="Visão geral da sua corretora.">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{s.title}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
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

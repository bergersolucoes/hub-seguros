import { PageShell } from '@/components/PageShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, DollarSign } from 'lucide-react';

const stats = [
  { title: 'Oportunidades Recebidas', value: '—', icon: FileText },
  { title: 'Taxa de Conversão', value: '—', icon: CheckCircle },
  { title: 'Faturamento', value: '—', icon: DollarSign },
];

export default function CorretoraDashboard() {
  return (
    <PageShell title="Dashboard" description="Visão geral da sua corretora.">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

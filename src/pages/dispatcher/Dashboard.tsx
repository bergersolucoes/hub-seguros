import { PageShell } from '@/components/PageShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, FileText, Building2, DollarSign } from 'lucide-react';

const stats = [
  { title: 'Leads Hoje', value: '—', icon: ClipboardList },
  { title: 'Oportunidades Ativas', value: '—', icon: FileText },
  { title: 'Corretoras Ativas', value: '—', icon: Building2 },
  { title: 'Faturamento Mensal', value: '—', icon: DollarSign },
];

export default function DispatcherDashboard() {
  return (
    <PageShell title="Dashboard" description="Visão geral das operações.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

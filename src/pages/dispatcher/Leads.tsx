import { PageShell, SearchFilter } from '@/components/PageShell';
import { Button } from '@/components/ui/button';

export default function DispatcherLeads() {
  return (
    <PageShell title="Leads" description="Leads recebidos aguardando qualificação." actions={<SearchFilter placeholder="Buscar lead..." />}>
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">Lista de leads será exibida aqui.</p>
      </div>
    </PageShell>
  );
}

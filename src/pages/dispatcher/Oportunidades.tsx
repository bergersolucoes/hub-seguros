import { PageShell, SearchFilter } from '@/components/PageShell';

export default function DispatcherOportunidades() {
  return (
    <PageShell title="Oportunidades" description="Oportunidades distribuídas para corretoras." actions={<SearchFilter placeholder="Buscar oportunidade..." />}>
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">Lista de oportunidades será exibida aqui.</p>
      </div>
    </PageShell>
  );
}

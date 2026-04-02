import { PageShell, SearchFilter } from '@/components/PageShell';

export default function DispatcherCorretoras() {
  return (
    <PageShell title="Corretoras" description="Corretoras parceiras cadastradas." actions={<SearchFilter placeholder="Buscar corretora..." />}>
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">Lista de corretoras será exibida aqui.</p>
      </div>
    </PageShell>
  );
}

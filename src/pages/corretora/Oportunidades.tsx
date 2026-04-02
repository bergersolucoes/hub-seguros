import { PageShell, SearchFilter } from '@/components/PageShell';

export default function CorretoraOportunidades() {
  return (
    <PageShell title="Oportunidades" description="Oportunidades recebidas para sua corretora." actions={<SearchFilter placeholder="Buscar oportunidade..." />}>
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">Lista de oportunidades será exibida aqui.</p>
      </div>
    </PageShell>
  );
}

import { PageShell, SearchFilter } from '@/components/PageShell';

export default function CorretoraClientes() {
  return (
    <PageShell title="Clientes" description="Clientes convertidos a partir das oportunidades." actions={<SearchFilter placeholder="Buscar cliente..." />}>
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">Lista de clientes será exibida aqui.</p>
      </div>
    </PageShell>
  );
}

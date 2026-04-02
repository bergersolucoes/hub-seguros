import { PageShell, SearchFilter } from '@/components/PageShell';

export default function AdminUsuarios() {
  return (
    <PageShell title="Usuários" description="Gerenciamento de usuários e roles." actions={<SearchFilter placeholder="Buscar usuário..." />}>
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">Lista de usuários será exibida aqui.</p>
      </div>
    </PageShell>
  );
}

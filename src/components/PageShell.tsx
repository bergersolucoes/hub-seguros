import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface PageShellProps {
  title: string;
  description?: string;
  badge?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageShell({ title, description, badge, children, actions }: PageShellProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            {badge && <Badge variant="secondary">{badge}</Badge>}
          </div>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children ?? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground text-sm">Conteúdo será implementado nas próximas etapas.</p>
        </div>
      )}
    </div>
  );
}

export function SearchFilter({ placeholder = 'Buscar...' }: { placeholder?: string }) {
  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input placeholder={placeholder} className="pl-9" />
    </div>
  );
}

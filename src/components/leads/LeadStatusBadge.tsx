import { Badge } from '@/components/ui/badge';
import type { LeadStatus } from '@/hooks/useLeads';

const statusConfig: Record<LeadStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
  novo: { label: 'Novo', variant: 'default', className: 'bg-blue-500 hover:bg-blue-600' },
  em_triagem: { label: 'Em Triagem', variant: 'default', className: 'bg-amber-500 hover:bg-amber-600' },
  qualificado: { label: 'Qualificado', variant: 'default', className: 'bg-emerald-500 hover:bg-emerald-600' },
  descartado: { label: 'Descartado', variant: 'destructive' },
  aguardando_despacho: { label: 'Aguardando Despacho', variant: 'default', className: 'bg-purple-500 hover:bg-purple-600' },
  despachado: { label: 'Despachado', variant: 'default', className: 'bg-teal-500 hover:bg-teal-600' },
  redistribuicao: { label: 'Redistribuição', variant: 'default', className: 'bg-orange-500 hover:bg-orange-600' },
  encerrado: { label: 'Encerrado', variant: 'secondary' },
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const config = statusConfig[status] ?? { label: status, variant: 'outline' as const };
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}

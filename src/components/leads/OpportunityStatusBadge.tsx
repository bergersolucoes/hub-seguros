import { Badge } from '@/components/ui/badge';
import type { OpportunityStatus } from '@/hooks/useOpportunities';

const statusConfig: Record<OpportunityStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
  enviada: { label: 'Enviada', variant: 'default', className: 'bg-blue-500 hover:bg-blue-600' },
  aceita: { label: 'Aceita', variant: 'default', className: 'bg-emerald-500 hover:bg-emerald-600' },
  recusada: { label: 'Recusada', variant: 'destructive' },
  expirada: { label: 'Expirada', variant: 'destructive', className: 'bg-orange-600 hover:bg-orange-700' },
  em_atendimento: { label: 'Em Atendimento', variant: 'default', className: 'bg-cyan-500 hover:bg-cyan-600' },
  contato_realizado: { label: 'Contato Realizado', variant: 'default', className: 'bg-indigo-500 hover:bg-indigo-600' },
  proposta_emitida: { label: 'Proposta Emitida', variant: 'default', className: 'bg-violet-500 hover:bg-violet-600' },
  negociacao: { label: 'Negociação', variant: 'default', className: 'bg-amber-500 hover:bg-amber-600' },
  fechada: { label: 'Fechada', variant: 'default', className: 'bg-green-700 hover:bg-green-800' },
  perdida: { label: 'Perdida', variant: 'secondary' },
};

export function OpportunityStatusBadge({ status }: { status: OpportunityStatus }) {
  const config = statusConfig[status] ?? { label: status, variant: 'outline' as const };
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}

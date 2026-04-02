import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSuggestedBrokers, useDispatchLead } from '@/hooks/useOpportunities';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, MapPin, TrendingUp, Zap, CheckCircle } from 'lucide-react';

interface DispatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  leadName: string;
  productId: string | null;
  onSuccess?: () => void;
}

export function DispatchModal({ open, onOpenChange, leadId, leadName, productId, onSuccess }: DispatchModalProps) {
  const { user } = useAuth();
  const { data: brokers, isLoading } = useSuggestedBrokers(open ? leadId : undefined);
  const dispatch = useDispatchLead();
  const [selectedBrokerId, setSelectedBrokerId] = useState<string | null>(null);

  const handleDispatch = async () => {
    if (!selectedBrokerId || !user?.id || !productId) return;
    await dispatch.mutateAsync({
      leadId,
      brokerId: selectedBrokerId,
      productId,
      dispatcherId: user.id,
    });
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Despachar Lead</DialogTitle>
          <DialogDescription>
            Selecione a corretora para enviar o lead <strong>{leadName}</strong>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : !brokers?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>Nenhuma corretora elegível encontrada.</p>
            <p className="text-xs mt-1">Verifique se há corretoras ativas com o produto e região compatíveis.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {brokers.map((broker, idx) => (
              <Card
                key={broker.broker_id}
                className={`cursor-pointer transition-all ${
                  selectedBrokerId === broker.broker_id
                    ? 'ring-2 ring-primary border-primary'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedBrokerId(broker.broker_id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {idx === 0 && <Badge className="bg-amber-500 hover:bg-amber-600 text-xs">Recomendada</Badge>}
                        <span className="font-semibold text-foreground">{broker.company_name}</span>
                        {broker.trade_name && (
                          <span className="text-sm text-muted-foreground">({broker.trade_name})</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Prioridade: {broker.priority_level}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Capacidade: {broker.current_capacity_used}/{broker.weekly_capacity || '∞'}
                        </span>
                        {broker.region_match && (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <MapPin className="h-3 w-3" />
                            Região compatível
                          </span>
                        )}
                        {broker.product_match && (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle className="h-3 w-3" />
                            Produto compatível
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedBrokerId === broker.broker_id && (
                      <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            onClick={handleDispatch}
            disabled={!selectedBrokerId || dispatch.isPending || !productId}
          >
            {dispatch.isPending ? 'Despachando...' : 'Despachar para esta corretora'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

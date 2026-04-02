import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type OpportunityStatus =
  | 'enviada' | 'aceita' | 'recusada' | 'expirada'
  | 'em_atendimento' | 'contato_realizado' | 'proposta_emitida'
  | 'negociacao' | 'fechada' | 'perdida';

export type Opportunity = {
  id: string;
  lead_id: string;
  broker_id: string;
  dispatcher_id: string | null;
  product_id: string;
  route_mode: string | null;
  status: OpportunityStatus;
  sla_accept_until: string | null;
  accepted_at: string | null;
  refused_at: string | null;
  expired_at: string | null;
  closed_at: string | null;
  lost_at: string | null;
  lost_reason: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
  leads?: { full_name: string; email: string | null; phone: string | null; city: string | null; state: string | null } | null;
  brokers?: { company_name: string; trade_name: string | null } | null;
  products?: { name: string; slug: string } | null;
};

export function useOpportunities(filters?: {
  status?: string;
  broker_id?: string;
  product_id?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['opportunities', filters],
    queryFn: async () => {
      let query = supabase
        .from('opportunities')
        .select('*, leads(full_name, email, phone, city, state), brokers(company_name, trade_name), products(name, slug)')
        .order('created_at', { ascending: false });

      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.broker_id) query = query.eq('broker_id', filters.broker_id);
      if (filters?.product_id) query = query.eq('product_id', filters.product_id);

      const { data, error } = await query;
      if (error) throw error;
      return data as Opportunity[];
    },
  });
}

export function useOpportunityCounts() {
  return useQuery({
    queryKey: ['opportunity_counts'],
    queryFn: async () => {
      const now = new Date().toISOString();
      const [enviadas, atrasadas] = await Promise.all([
        supabase.from('opportunities').select('id', { count: 'exact', head: true }).eq('status', 'enviada'),
        supabase.from('opportunities').select('id', { count: 'exact', head: true }).eq('status', 'enviada').lt('sla_accept_until', now),
      ]);
      return {
        enviadas: enviadas.count ?? 0,
        atrasadas: atrasadas.count ?? 0,
      };
    },
  });
}

export function useDispatchLead() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      leadId,
      brokerId,
      productId,
      dispatcherId,
      slaHours = 48,
    }: {
      leadId: string;
      brokerId: string;
      productId: string;
      dispatcherId: string;
      slaHours?: number;
    }) => {
      const slaUntil = new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString();

      // Create opportunity
      const { data: opp, error: oppErr } = await supabase
        .from('opportunities')
        .insert({
          lead_id: leadId,
          broker_id: brokerId,
          product_id: productId,
          dispatcher_id: dispatcherId,
          route_mode: 'manual',
          status: 'enviada',
          sla_accept_until: slaUntil,
        })
        .select()
        .single();
      if (oppErr) throw oppErr;

      // Update lead status
      const { error: leadErr } = await supabase
        .from('leads')
        .update({ status: 'despachado' })
        .eq('id', leadId);
      if (leadErr) throw leadErr;

      // Increment broker capacity
      const { data: broker } = await supabase.from('brokers').select('current_capacity_used').eq('id', brokerId).single();
      if (broker) {
        await supabase.from('brokers').update({
          current_capacity_used: (broker.current_capacity_used ?? 0) + 1,
        }).eq('id', brokerId);
      }

      // Create status history
      await supabase.from('opportunity_status_history').insert({
        opportunity_id: opp.id,
        previous_status: null,
        new_status: 'enviada',
        changed_by_user_id: dispatcherId,
        note: 'Lead despachado manualmente',
      });

      // Audit log
      await supabase.from('audit_logs').insert({
        user_id: dispatcherId,
        entity_type: 'opportunity',
        entity_id: opp.id,
        action: 'dispatch_lead',
        payload_json: { lead_id: leadId, broker_id: brokerId, product_id: productId },
      });

      return opp;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['opportunities'] });
      qc.invalidateQueries({ queryKey: ['dashboard_stats'] });
      qc.invalidateQueries({ queryKey: ['opportunity_counts'] });
      qc.invalidateQueries({ queryKey: ['brokers'] });
      toast({ title: 'Lead despachado com sucesso!' });
    },
    onError: (e) => toast({ title: 'Erro ao despachar', description: e.message, variant: 'destructive' }),
  });
}

export function useSuggestedBrokers(leadId: string | undefined) {
  return useQuery({
    queryKey: ['suggested_brokers', leadId],
    enabled: !!leadId,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('suggest_brokers_for_lead', { _lead_id: leadId! });
      if (error) throw error;
      return data as Array<{
        broker_id: string;
        company_name: string;
        trade_name: string | null;
        priority_level: number;
        weekly_capacity: number;
        current_capacity_used: number;
        available_capacity: number;
        region_match: boolean;
        product_match: boolean;
      }>;
    },
  });
}

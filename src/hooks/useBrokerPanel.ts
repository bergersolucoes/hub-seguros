import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Opportunity, OpportunityStatus } from '@/hooks/useOpportunities';

/**
 * Hook exclusivo do painel corretora.
 * RLS garante que só retorna dados da corretora do usuário autenticado.
 */

export function useBrokerOpportunities(filters?: {
  status?: string;
  product_id?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['broker_opportunities', filters],
    queryFn: async () => {
      let query = supabase
        .from('opportunities')
        .select('*, leads(full_name, email, phone, whatsapp, city, state, cpf_cnpj, best_contact_time, notes, product_id, qualification_score), products(name, slug)')
        .order('created_at', { ascending: false });

      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.product_id) query = query.eq('product_id', filters.product_id);

      const { data, error } = await query;
      if (error) throw error;
      return data as Opportunity[];
    },
  });
}

export function useBrokerOpportunity(id: string | undefined) {
  return useQuery({
    queryKey: ['broker_opportunities', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*, leads(full_name, email, phone, whatsapp, city, state, cpf_cnpj, best_contact_time, notes, product_id, qualification_score), products(name, slug)')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data as Opportunity & {
        leads: {
          full_name: string;
          email: string | null;
          phone: string | null;
          whatsapp: string | null;
          city: string | null;
          state: string | null;
          cpf_cnpj: string | null;
          best_contact_time: string | null;
          notes: string | null;
          product_id: string | null;
          qualification_score: number | null;
        } | null;
      };
    },
  });
}

export function useOpportunityHistory(opportunityId: string | undefined) {
  return useQuery({
    queryKey: ['opportunity_history', opportunityId],
    enabled: !!opportunityId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunity_status_history')
        .select('*')
        .eq('opportunity_id', opportunityId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useBrokerDashboardCounts() {
  return useQuery({
    queryKey: ['broker_dashboard_counts'],
    queryFn: async () => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const monthStart = startOfMonth.toISOString();

      const [enviadas, aceitas, emAtendimento, propostas, fechadasMes, perdidasMes, totalMes] = await Promise.all([
        supabase.from('opportunities').select('id', { count: 'exact', head: true }).eq('status', 'enviada'),
        supabase.from('opportunities').select('id', { count: 'exact', head: true }).eq('status', 'aceita'),
        supabase.from('opportunities').select('id', { count: 'exact', head: true }).in('status', ['em_atendimento', 'contato_realizado']),
        supabase.from('opportunities').select('id', { count: 'exact', head: true }).eq('status', 'proposta_emitida'),
        supabase.from('opportunities').select('id', { count: 'exact', head: true }).eq('status', 'fechada').gte('closed_at', monthStart),
        supabase.from('opportunities').select('id', { count: 'exact', head: true }).eq('status', 'perdida').gte('lost_at', monthStart),
        supabase.from('opportunities').select('id', { count: 'exact', head: true }).gte('created_at', monthStart),
      ]);

      const totalRespondidas = (fechadasMes.count ?? 0) + (perdidasMes.count ?? 0);
      const taxaFechamento = totalRespondidas > 0 ? Math.round(((fechadasMes.count ?? 0) / totalRespondidas) * 100) : 0;

      const totalRecebidas = totalMes.count ?? 0;
      const totalAceitas = (aceitas.count ?? 0) + (emAtendimento.count ?? 0) + (propostas.count ?? 0) + (fechadasMes.count ?? 0);
      const taxaAceite = totalRecebidas > 0 ? Math.round((totalAceitas / totalRecebidas) * 100) : 0;

      return {
        enviadas: enviadas.count ?? 0,
        aceitas: aceitas.count ?? 0,
        emAtendimento: (emAtendimento.count ?? 0) + (propostas.count ?? 0),
        propostas: propostas.count ?? 0,
        fechadasMes: fechadasMes.count ?? 0,
        perdidasMes: perdidasMes.count ?? 0,
        taxaAceite,
        taxaFechamento,
      };
    },
  });
}

export function useUpdateOpportunityStatus() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      id,
      currentStatus,
      newStatus,
      lostReason,
      internalNotes,
    }: {
      id: string;
      currentStatus: string;
      newStatus: OpportunityStatus;
      lostReason?: string;
      internalNotes?: string;
    }) => {
      const updateData: Record<string, unknown> = { status: newStatus };

      if (newStatus === 'aceita') updateData.accepted_at = new Date().toISOString();
      if (newStatus === 'recusada') updateData.refused_at = new Date().toISOString();
      if (newStatus === 'expirada') updateData.expired_at = new Date().toISOString();
      if (newStatus === 'fechada') updateData.closed_at = new Date().toISOString();
      if (newStatus === 'perdida') {
        updateData.lost_at = new Date().toISOString();
        updateData.lost_reason = lostReason;
      }
      if (internalNotes !== undefined) updateData.internal_notes = internalNotes;

      const { error: oppErr } = await supabase
        .from('opportunities')
        .update(updateData)
        .eq('id', id);
      if (oppErr) throw oppErr;

      // If refused or expired, decrement capacity
      if (newStatus === 'recusada' || newStatus === 'expirada') {
        const { data: opp } = await supabase.from('opportunities').select('broker_id').eq('id', id).single();
        if (opp) {
          const { data: broker } = await supabase.from('brokers').select('current_capacity_used').eq('id', opp.broker_id).single();
          if (broker) {
            await supabase.from('brokers').update({
              current_capacity_used: Math.max(0, (broker.current_capacity_used ?? 0) - 1),
            }).eq('id', opp.broker_id);
          }
        }
      }

      // Generate billable events based on status transitions
      const feeTypeForStatus: Record<string, string> = {
        aceita: 'accepted_lead',
        proposta_emitida: 'proposal',
        fechada: 'closed_sale',
      };

      const feeType = feeTypeForStatus[newStatus];
      if (feeType) {
        const { data: opp } = await supabase
          .from('opportunities')
          .select('broker_id, product_id')
          .eq('id', id)
          .single();
        if (opp) {
          const { data: fee } = await supabase
            .from('fees')
            .select('*')
            .eq('broker_id', opp.broker_id)
            .eq('fee_type', feeType)
            .eq('is_active', true)
            .maybeSingle();
          if (fee) {
            const now = new Date();
            await supabase.from('billable_events').insert({
              broker_id: opp.broker_id,
              opportunity_id: id,
              fee_id: fee.id,
              event_type: feeType,
              amount: fee.amount,
              reference_month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
              status: 'pending',
            });
          }
        }
      }

      // Status history
      await supabase.from('opportunity_status_history').insert({
        opportunity_id: id,
        previous_status: currentStatus,
        new_status: newStatus,
        changed_by_user_id: user?.id || null,
        note: newStatus === 'perdida' ? lostReason : undefined,
      });

      // Audit log
      await supabase.from('audit_logs').insert({
        user_id: user?.id || null,
        entity_type: 'opportunity',
        entity_id: id,
        action: `status_change_${newStatus}`,
        payload_json: { previous_status: currentStatus, new_status: newStatus },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['broker_opportunities'] });
      qc.invalidateQueries({ queryKey: ['broker_dashboard_counts'] });
      qc.invalidateQueries({ queryKey: ['opportunity_history'] });
      qc.invalidateQueries({ queryKey: ['opportunities'] });
      qc.invalidateQueries({ queryKey: ['opportunity_counts'] });
      toast({ title: 'Status atualizado' });
    },
    onError: (e) => toast({ title: 'Erro ao atualizar status', description: e.message, variant: 'destructive' }),
  });
}

export function useBrokerProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['broker_profile', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      // Get user's broker_id via users table (RLS allows own record)
      const { data: userData, error: userErr } = await supabase
        .from('users')
        .select('broker_id')
        .eq('id', user!.id)
        .single();
      if (userErr || !userData?.broker_id) return null;

      const { data: broker, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('id', userData.broker_id)
        .single();
      if (error) throw error;
      return broker;
    },
  });
}

export function useBrokerTeam() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['broker_team', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      // Get broker_id first
      const { data: userData } = await supabase
        .from('users')
        .select('broker_id')
        .eq('id', user!.id)
        .single();
      if (!userData?.broker_id) return [];

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('broker_id', userData.broker_id)
        .order('name');
      if (error) throw error;
      return data;
    },
  });
}

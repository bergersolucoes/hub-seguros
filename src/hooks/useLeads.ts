import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type LeadStatus = 'novo' | 'em_triagem' | 'qualificado' | 'descartado' | 'aguardando_despacho' | 'despachado' | 'redistribuicao' | 'encerrado';

export type Lead = {
  id: string;
  source: string | null;
  product_id: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  cpf_cnpj: string | null;
  city: string | null;
  state: string | null;
  notes: string | null;
  lgpd_consent: boolean | null;
  status: LeadStatus;
  qualification_score: number | null;
  best_contact_time: string | null;
  created_at: string;
  updated_at: string;
  products?: { name: string; slug: string } | null;
};

export function useLeads(filters?: {
  status?: string;
  product_id?: string;
  source?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: async () => {
      let query = supabase
        .from('leads')
        .select('*, products(name, slug)')
        .order('created_at', { ascending: false });

      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.product_id) query = query.eq('product_id', filters.product_id);
      if (filters?.source) query = query.eq('source', filters.source);
      if (filters?.search) {
        query = query.or(
          `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Lead[];
    },
  });
}

export function useLead(id: string | undefined) {
  return useQuery({
    queryKey: ['leads', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*, products(name, slug)')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data as Lead;
    },
  });
}

export function useLeadAnswers(leadId: string | undefined) {
  return useQuery({
    queryKey: ['lead_answers', leadId],
    enabled: !!leadId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_answers')
        .select('*')
        .eq('lead_id', leadId!);
      if (error) throw error;
      return data;
    },
  });
}

export function useLeadMutations() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: LeadStatus; notes?: string }) => {
      const updateData: Record<string, unknown> = { status };
      if (notes !== undefined) updateData.notes = notes;

      const { data, error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['dashboard_stats'] });
    },
    onError: (e) => toast({ title: 'Erro ao atualizar lead', description: e.message, variant: 'destructive' }),
  });

  const updateLead = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; [key: string]: unknown }) => {
      const { error } = await supabase.from('leads').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: (e) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  return { updateStatus, updateLead };
}

export function useLeadCounts() {
  return useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];

      const [novos, emTriagem, aguardandoDespacho, todayLeads] = await Promise.all([
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'novo'),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'em_triagem'),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'aguardando_despacho'),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'novo').gte('created_at', today),
      ]);

      return {
        novos: novos.count ?? 0,
        emTriagem: emTriagem.count ?? 0,
        aguardandoDespacho: aguardandoDespacho.count ?? 0,
        todayLeads: todayLeads.count ?? 0,
      };
    },
  });
}

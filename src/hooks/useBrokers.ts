import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Broker = {
  id: string;
  company_name: string;
  trade_name: string | null;
  cnpj: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  is_active: boolean | null;
  priority_level: number | null;
  weekly_capacity: number | null;
  current_capacity_used: number | null;
  accepts_auto_distribution: boolean | null;
  accepts_manual_distribution: boolean | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type BrokerRegion = {
  id: string;
  broker_id: string;
  state: string | null;
  city: string | null;
  zip_start: string | null;
  zip_end: string | null;
};

export type BrokerProductLink = {
  id: string;
  broker_id: string;
  product_id: string;
  is_active: boolean | null;
  custom_fee_type: string | null;
  custom_fee_value: number | null;
  priority_rank: number | null;
  max_leads_per_week: number | null;
  created_at: string;
  products?: { name: string; slug: string } | null;
};

export function useBrokers() {
  return useQuery({
    queryKey: ['brokers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('brokers').select('*').order('company_name');
      if (error) throw error;
      return data as Broker[];
    },
  });
}

export function useBroker(id: string | undefined) {
  return useQuery({
    queryKey: ['brokers', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from('brokers').select('*').eq('id', id!).single();
      if (error) throw error;
      return data as Broker;
    },
  });
}

export function useBrokerMutations() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const create = useMutation({
    mutationFn: async (broker: Omit<Broker, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('brokers').insert(broker).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['brokers'] }); toast({ title: 'Corretora criada com sucesso' }); },
    onError: (e) => toast({ title: 'Erro ao criar corretora', description: e.message, variant: 'destructive' }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...broker }: Partial<Broker> & { id: string }) => {
      const { data, error } = await supabase.from('brokers').update(broker).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['brokers'] }); toast({ title: 'Corretora atualizada' }); },
    onError: (e) => toast({ title: 'Erro ao atualizar', description: e.message, variant: 'destructive' }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('brokers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['brokers'] }); toast({ title: 'Corretora removida' }); },
    onError: (e) => toast({ title: 'Erro ao remover', description: e.message, variant: 'destructive' }),
  });

  return { create, update, remove };
}

export function useBrokerRegions(brokerId: string | undefined) {
  return useQuery({
    queryKey: ['broker_regions', brokerId],
    enabled: !!brokerId,
    queryFn: async () => {
      const { data, error } = await supabase.from('broker_regions').select('*').eq('broker_id', brokerId!);
      if (error) throw error;
      return data as BrokerRegion[];
    },
  });
}

export function useBrokerRegionMutations() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const create = useMutation({
    mutationFn: async (region: { broker_id: string; state?: string; city?: string; zip_start?: string; zip_end?: string }) => {
      const { error } = await supabase.from('broker_regions').insert(region);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['broker_regions'] }); toast({ title: 'Região adicionada' }); },
    onError: (e) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('broker_regions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['broker_regions'] }); },
  });

  return { create, remove };
}

export function useBrokerProducts(brokerId: string | undefined) {
  return useQuery({
    queryKey: ['broker_products', brokerId],
    enabled: !!brokerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('broker_products')
        .select('*, products(name, slug)')
        .eq('broker_id', brokerId!);
      if (error) throw error;
      return data as BrokerProductLink[];
    },
  });
}

export function useBrokerProductMutations() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const create = useMutation({
    mutationFn: async (bp: { broker_id: string; product_id: string; custom_fee_type?: string; custom_fee_value?: number; priority_rank?: number; max_leads_per_week?: number }) => {
      const { error } = await supabase.from('broker_products').insert(bp);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['broker_products'] }); toast({ title: 'Produto vinculado' }); },
    onError: (e) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('broker_products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['broker_products'] }); },
  });

  return { create, remove };
}

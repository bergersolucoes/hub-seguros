import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// ─── FEES ────────────────────────────────────────────────────────────────────

export type FeeType = 'setup' | 'monthly' | 'qualified_lead' | 'accepted_lead' | 'proposal' | 'closed_sale';

export const feeTypeLabels: Record<FeeType, string> = {
  setup: 'Fee de Setup',
  monthly: 'Fee Mensal',
  qualified_lead: 'Fee por Lead Qualificado',
  accepted_lead: 'Fee por Lead Aceito',
  proposal: 'Fee por Proposta',
  closed_sale: 'Fee por Fechamento',
};

export type Fee = {
  id: string;
  broker_id: string;
  product_id: string | null;
  fee_name: string;
  fee_type: FeeType;
  amount: number;
  is_active: boolean | null;
  created_at: string;
  brokers?: { company_name: string } | null;
  products?: { name: string } | null;
};

export function useFees(filters?: { broker_id?: string; product_id?: string }) {
  return useQuery({
    queryKey: ['fees', filters],
    queryFn: async () => {
      let query = supabase
        .from('fees')
        .select('*, brokers(company_name), products(name)')
        .order('created_at', { ascending: false });
      if (filters?.broker_id) query = query.eq('broker_id', filters.broker_id);
      if (filters?.product_id) query = query.eq('product_id', filters.product_id);
      const { data, error } = await query;
      if (error) throw error;
      return data as Fee[];
    },
  });
}

export function useFeeMutations() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const create = useMutation({
    mutationFn: async (fee: {
      broker_id: string;
      product_id?: string | null;
      fee_name: string;
      fee_type: string;
      amount: number;
    }) => {
      const { error } = await supabase.from('fees').insert(fee);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['fees'] }); toast({ title: 'Fee criada com sucesso' }); },
    onError: (e) => toast({ title: 'Erro ao criar fee', description: e.message, variant: 'destructive' }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; [key: string]: unknown }) => {
      const { error } = await supabase.from('fees').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['fees'] }); toast({ title: 'Fee atualizada' }); },
    onError: (e) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('fees').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['fees'] }); toast({ title: 'Fee removida' }); },
    onError: (e) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  return { create, update, remove };
}

// ─── BILLABLE EVENTS ─────────────────────────────────────────────────────────

export type BillableEvent = {
  id: string;
  broker_id: string;
  opportunity_id: string | null;
  fee_id: string;
  event_type: string | null;
  amount: number;
  reference_month: string | null;
  status: string;
  created_at: string;
  brokers?: { company_name: string } | null;
  fees?: { fee_name: string; fee_type: string } | null;
};

export function useBillableEvents(filters?: { broker_id?: string; reference_month?: string; status?: string }) {
  return useQuery({
    queryKey: ['billable_events', filters],
    queryFn: async () => {
      let query = supabase
        .from('billable_events')
        .select('*, brokers(company_name), fees(fee_name, fee_type)')
        .order('created_at', { ascending: false });
      if (filters?.broker_id) query = query.eq('broker_id', filters.broker_id);
      if (filters?.reference_month) query = query.eq('reference_month', filters.reference_month);
      if (filters?.status) query = query.eq('status', filters.status);
      const { data, error } = await query;
      if (error) throw error;
      return data as BillableEvent[];
    },
  });
}

// ─── INVOICES ────────────────────────────────────────────────────────────────

export type Invoice = {
  id: string;
  broker_id: string;
  reference_month: string;
  subtotal: number;
  discount: number | null;
  total: number;
  status: string;
  due_date: string;
  paid_at: string | null;
  created_at: string;
  brokers?: { company_name: string } | null;
};

export type InvoiceItem = {
  id: string;
  invoice_id: string;
  billable_event_id: string | null;
  description: string;
  amount: number;
  quantity: number | null;
  total: number;
};

export function useInvoices(filters?: { broker_id?: string; status?: string; reference_month?: string }) {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: async () => {
      let query = supabase
        .from('invoices')
        .select('*, brokers(company_name)')
        .order('created_at', { ascending: false });
      if (filters?.broker_id) query = query.eq('broker_id', filters.broker_id);
      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.reference_month) query = query.eq('reference_month', filters.reference_month);
      const { data, error } = await query;
      if (error) throw error;
      return data as Invoice[];
    },
  });
}

export function useInvoiceItems(invoiceId: string | undefined) {
  return useQuery({
    queryKey: ['invoice_items', invoiceId],
    enabled: !!invoiceId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', invoiceId!)
        .order('description');
      if (error) throw error;
      return data as InvoiceItem[];
    },
  });
}

export function useInvoiceMutations() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, paid_at, discount }: { id: string; status: string; paid_at?: string; discount?: number }) => {
      const data: Record<string, unknown> = { status };
      if (paid_at) data.paid_at = paid_at;
      if (discount !== undefined) data.discount = discount;
      const { error } = await supabase.from('invoices').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      qc.invalidateQueries({ queryKey: ['financial_summary'] });
      toast({ title: 'Fatura atualizada' });
    },
    onError: (e) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  return { updateStatus };
}

// ─── INVOICE GENERATION ──────────────────────────────────────────────────────

export function useGenerateInvoice() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      brokerId,
      referenceMonth,
      dueDate,
      discount = 0,
    }: {
      brokerId: string;
      referenceMonth: string;
      dueDate: string;
      discount?: number;
    }) => {
      // 1. Get pending billable events for this broker + month
      const { data: events, error: evErr } = await supabase
        .from('billable_events')
        .select('*')
        .eq('broker_id', brokerId)
        .eq('reference_month', referenceMonth)
        .eq('status', 'pending');
      if (evErr) throw evErr;

      // 2. Get monthly fee if exists
      const { data: monthlyFees } = await supabase
        .from('fees')
        .select('*')
        .eq('broker_id', brokerId)
        .eq('fee_type', 'monthly')
        .eq('is_active', true);

      const eventItems = (events || []).map((e) => ({
        description: e.event_type || 'Evento',
        amount: e.amount,
        quantity: 1,
        total: e.amount,
        billable_event_id: e.id,
      }));

      const monthlyItems = (monthlyFees || []).map((f) => ({
        description: f.fee_name,
        amount: f.amount,
        quantity: 1,
        total: f.amount,
        billable_event_id: null,
      }));

      const allItems = [...eventItems, ...monthlyItems];
      if (allItems.length === 0) throw new Error('Nenhum item para faturar neste período.');

      const subtotal = allItems.reduce((sum, i) => sum + i.total, 0);
      const total = Math.max(0, subtotal - discount);

      // 3. Create invoice
      const { data: invoice, error: invErr } = await supabase
        .from('invoices')
        .insert({
          broker_id: brokerId,
          reference_month: referenceMonth,
          subtotal,
          discount,
          total,
          status: 'open',
          due_date: dueDate,
        })
        .select()
        .single();
      if (invErr) throw invErr;

      // 4. Create invoice items
      const items = allItems.map((item) => ({
        ...item,
        invoice_id: invoice.id,
      }));
      const { error: itemErr } = await supabase.from('invoice_items').insert(items);
      if (itemErr) throw itemErr;

      // 5. Mark billable events as billed
      if (events && events.length > 0) {
        const eventIds = events.map((e) => e.id);
        await supabase
          .from('billable_events')
          .update({ status: 'billed' })
          .in('id', eventIds);
      }

      return invoice;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      qc.invalidateQueries({ queryKey: ['billable_events'] });
      qc.invalidateQueries({ queryKey: ['financial_summary'] });
      toast({ title: 'Fatura gerada com sucesso!' });
    },
    onError: (e) => toast({ title: 'Erro ao gerar fatura', description: e.message, variant: 'destructive' }),
  });
}

// ─── FINANCIAL SUMMARY ──────────────────────────────────────────────────────

export function useFinancialSummary() {
  return useQuery({
    queryKey: ['financial_summary'],
    queryFn: async () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const [totalMes, pendente, aberto, pago] = await Promise.all([
        supabase.from('invoices').select('total').eq('reference_month', currentMonth),
        supabase.from('billable_events').select('amount').eq('status', 'pending'),
        supabase.from('invoices').select('total').in('status', ['open', 'sent']),
        supabase.from('invoices').select('total').eq('status', 'paid').eq('reference_month', currentMonth),
      ]);

      const faturadoMes = (totalMes.data || []).reduce((s, r) => s + Number(r.total), 0);
      const totalPendente = (pendente.data || []).reduce((s, r) => s + Number(r.amount), 0);
      const totalAberto = (aberto.data || []).reduce((s, r) => s + Number(r.total), 0);
      const totalPago = (pago.data || []).reduce((s, r) => s + Number(r.total), 0);

      // Overdue invoices
      const { count: inadimplentes } = await supabase
        .from('invoices')
        .select('id', { count: 'exact', head: true })
        .in('status', ['open', 'sent'])
        .lt('due_date', now.toISOString().split('T')[0]);

      return {
        faturadoMes,
        totalPendente,
        totalAberto,
        totalPago,
        inadimplentes: inadimplentes ?? 0,
      };
    },
  });
}

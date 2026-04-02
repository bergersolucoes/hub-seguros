import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  description: string | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  public_page_enabled: boolean | null;
  default_fee_type: string | null;
  default_fee_value: number | null;
  created_at: string;
  updated_at: string;
};

export type ProductFormField = {
  id: string;
  product_id: string;
  field_key: string;
  label: string;
  field_type: string;
  placeholder: string | null;
  is_required: boolean | null;
  sort_order: number | null;
  options_json: Json | null;
  created_at: string;
};

type ProductFormFieldPayload = {
  product_id: string;
  field_key: string;
  label: string;
  field_type: string;
  placeholder?: string;
  is_required?: boolean;
  sort_order?: number;
  options_json?: Json;
};

type ProductFormFieldUpdate = {
  id: string;
  field_key?: string;
  label?: string;
  field_type?: string;
  placeholder?: string;
  is_required?: boolean;
  sort_order?: number;
  options_json?: Json;
};

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').order('name');
      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['products', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', id!).single();
      if (error) throw error;
      return data as Product;
    },
  });
}

export function useProductMutations() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const create = useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('products').insert(product).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); toast({ title: 'Produto criado com sucesso' }); },
    onError: (e) => toast({ title: 'Erro ao criar produto', description: e.message, variant: 'destructive' }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...product }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase.from('products').update(product).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); toast({ title: 'Produto atualizado' }); },
    onError: (e) => toast({ title: 'Erro ao atualizar', description: e.message, variant: 'destructive' }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); toast({ title: 'Produto removido' }); },
    onError: (e) => toast({ title: 'Erro ao remover', description: e.message, variant: 'destructive' }),
  });

  return { create, update, remove };
}

export function useProductFormFields(productId: string | undefined) {
  return useQuery({
    queryKey: ['product_form_fields', productId],
    enabled: !!productId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_form_fields')
        .select('*')
        .eq('product_id', productId!)
        .order('sort_order');
      if (error) throw error;
      return data as ProductFormField[];
    },
  });
}

export function useProductFormFieldMutations() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const create = useMutation({
    mutationFn: async (field: ProductFormFieldPayload) => {
      const { error } = await supabase.from('product_form_fields').insert(field);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['product_form_fields'] }); toast({ title: 'Campo adicionado' }); },
    onError: (e) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...field }: ProductFormFieldUpdate) => {
      const { error } = await supabase.from('product_form_fields').update(field).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['product_form_fields'] }); },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('product_form_fields').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['product_form_fields'] }); },
  });

  return { create, update, remove };
}

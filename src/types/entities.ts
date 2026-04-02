// Entidades do domínio — interfaces placeholder prontas para conexão com tabelas

export type LeadStatus = 'novo' | 'qualificado' | 'descartado' | 'convertido';
export type OportunidadeStatus = 'pendente' | 'aceita' | 'recusada' | 'convertida' | 'expirada';
export type ProdutoSlug = 'auto' | 'saude' | 'consorcio';
export type FeeType = 'fixo' | 'percentual';
export type InvoiceStatus = 'aberta' | 'paga' | 'cancelada';

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  produto_slug: ProdutoSlug;
  status: LeadStatus;
  dados_adicionais: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Oportunidade {
  id: string;
  lead_id: string;
  corretora_id: string;
  produto_id: string;
  status: OportunidadeStatus;
  valor_estimado: number | null;
  observacoes: string | null;
  aceita_em: string | null;
  expirada_em: string | null;
  created_at: string;
  updated_at: string;
}

export interface Corretora {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string | null;
  ativa: boolean;
  dono_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Produto {
  id: string;
  nome: string;
  slug: ProdutoSlug;
  descricao: string | null;
  ativo: boolean;
  created_at: string;
}

export interface Roteamento {
  id: string;
  produto_id: string;
  corretora_id: string;
  prioridade: number;
  ativo: boolean;
  regiao: string | null;
  created_at: string;
}

export interface Fee {
  id: string;
  produto_id: string;
  tipo: FeeType;
  valor: number;
  descricao: string | null;
  ativo: boolean;
  created_at: string;
}

export interface BillableEvent {
  id: string;
  oportunidade_id: string;
  corretora_id: string;
  fee_id: string;
  valor: number;
  descricao: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  corretora_id: string;
  status: InvoiceStatus;
  valor_total: number;
  periodo_inicio: string;
  periodo_fim: string;
  emitida_em: string | null;
  paga_em: string | null;
  created_at: string;
}

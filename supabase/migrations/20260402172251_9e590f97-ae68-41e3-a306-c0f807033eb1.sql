
-- =====================================================
-- TABLES (created first, RLS/policies added after functions)
-- =====================================================

-- 1. BROKERS
CREATE TABLE public.brokers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  trade_name TEXT,
  cnpj TEXT,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  city TEXT,
  state TEXT,
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  priority_level INTEGER DEFAULT 0,
  weekly_capacity INTEGER DEFAULT 0,
  current_capacity_used INTEGER DEFAULT 0,
  accepts_auto_distribution BOOLEAN DEFAULT false,
  accepts_manual_distribution BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_brokers_updated_at BEFORE UPDATE ON public.brokers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. USERS
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'broker_operator' CHECK (role IN ('admin','dispatcher','broker_owner','broker_operator')),
  broker_id UUID REFERENCES public.brokers(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. PRODUCTS
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  public_page_enabled BOOLEAN DEFAULT true,
  default_fee_type TEXT,
  default_fee_value NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. BROKER_REGIONS
CREATE TABLE public.broker_regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES public.brokers(id) ON DELETE CASCADE,
  state TEXT,
  city TEXT,
  zip_start TEXT,
  zip_end TEXT
);

-- 5. BROKER_PRODUCTS
CREATE TABLE public.broker_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES public.brokers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  custom_fee_type TEXT,
  custom_fee_value NUMERIC,
  priority_rank INTEGER DEFAULT 0,
  max_leads_per_week INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. PRODUCT_FORM_FIELDS
CREATE TABLE public.product_form_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  field_key TEXT NOT NULL,
  label TEXT NOT NULL,
  field_type TEXT NOT NULL,
  placeholder TEXT,
  is_required BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  options_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. LEADS
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  cpf_cnpj TEXT,
  city TEXT,
  state TEXT,
  notes TEXT,
  lgpd_consent BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo','em_triagem','qualificado','descartado','aguardando_despacho','despachado','redistribuicao','encerrado')),
  qualification_score INTEGER,
  best_contact_time TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. LEAD_ANSWERS
CREATE TABLE public.lead_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  field_key TEXT NOT NULL,
  answer_text TEXT,
  answer_json JSONB
);

-- 9. OPPORTUNITIES
CREATE TABLE public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  broker_id UUID NOT NULL REFERENCES public.brokers(id) ON DELETE CASCADE,
  dispatcher_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  route_mode TEXT CHECK (route_mode IN ('manual','suggested','automatic')),
  status TEXT NOT NULL DEFAULT 'enviada' CHECK (status IN ('enviada','aceita','recusada','expirada','em_atendimento','contato_realizado','proposta_emitida','negociacao','fechada','perdida')),
  sla_accept_until TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  refused_at TIMESTAMPTZ,
  expired_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  lost_at TIMESTAMPTZ,
  lost_reason TEXT,
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. OPPORTUNITY_STATUS_HISTORY
CREATE TABLE public.opportunity_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  changed_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. ROUTING_RULES
CREATE TABLE public.routing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  state TEXT,
  city TEXT,
  broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE,
  priority INTEGER DEFAULT 0,
  rule_type TEXT,
  rule_config_json JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. FEES
CREATE TABLE public.fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES public.brokers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  fee_name TEXT NOT NULL,
  fee_type TEXT NOT NULL CHECK (fee_type IN ('setup','monthly','qualified_lead','accepted_lead','proposal','closed_sale')),
  amount NUMERIC NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. BILLABLE_EVENTS
CREATE TABLE public.billable_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES public.brokers(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
  fee_id UUID NOT NULL REFERENCES public.fees(id) ON DELETE CASCADE,
  event_type TEXT,
  amount NUMERIC NOT NULL,
  reference_month TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','billed','paid','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. INVOICES
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES public.brokers(id) ON DELETE CASCADE,
  reference_month TEXT NOT NULL,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC,
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','sent','paid','overdue','cancelled')),
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 15. INVOICE_ITEMS
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  billable_event_id UUID REFERENCES public.billable_events(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  quantity INTEGER DEFAULT 1,
  total NUMERIC NOT NULL
);

-- 16. AUDIT_LOGS
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  payload_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- HELPER FUNCTIONS (after tables exist)
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_user_role(_auth_id UUID)
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT role FROM public.users WHERE id = _auth_id LIMIT 1 $$;

CREATE OR REPLACE FUNCTION public.get_user_broker_id(_auth_id UUID)
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT broker_id FROM public.users WHERE id = _auth_id LIMIT 1 $$;

CREATE OR REPLACE FUNCTION public.is_admin_or_dispatcher(_auth_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.users WHERE id = _auth_id AND role IN ('admin', 'dispatcher') AND is_active = true) $$;

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================
ALTER TABLE public.brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billable_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- brokers
CREATE POLICY "Admin/dispatcher full access brokers" ON public.brokers FOR ALL TO authenticated USING (public.is_admin_or_dispatcher(auth.uid()));
CREATE POLICY "Broker users view own broker" ON public.brokers FOR SELECT TO authenticated USING (id = public.get_user_broker_id(auth.uid()));

-- users
CREATE POLICY "Admin/dispatcher full access users" ON public.users FOR ALL TO authenticated USING (public.is_admin_or_dispatcher(auth.uid()));
CREATE POLICY "Users view own record" ON public.users FOR SELECT TO authenticated USING (id = auth.uid());

-- products
CREATE POLICY "Admin/dispatcher full access products" ON public.products FOR ALL TO authenticated USING (public.is_admin_or_dispatcher(auth.uid()));
CREATE POLICY "All authenticated view active products" ON public.products FOR SELECT TO authenticated USING (is_active = true);

-- broker_regions
CREATE POLICY "Admin/dispatcher full access broker_regions" ON public.broker_regions FOR ALL TO authenticated USING (public.is_admin_or_dispatcher(auth.uid()));
CREATE POLICY "Broker users view own regions" ON public.broker_regions FOR SELECT TO authenticated USING (broker_id = public.get_user_broker_id(auth.uid()));

-- broker_products
CREATE POLICY "Admin/dispatcher full access broker_products" ON public.broker_products FOR ALL TO authenticated USING (public.is_admin_or_dispatcher(auth.uid()));
CREATE POLICY "Broker users view own products" ON public.broker_products FOR SELECT TO authenticated USING (broker_id = public.get_user_broker_id(auth.uid()));

-- product_form_fields
CREATE POLICY "Admin/dispatcher full access product_form_fields" ON public.product_form_fields FOR ALL TO authenticated USING (public.is_admin_or_dispatcher(auth.uid()));
CREATE POLICY "All authenticated view form fields" ON public.product_form_fields FOR SELECT TO authenticated USING (true);

-- leads
CREATE POLICY "Admin/dispatcher full access leads" ON public.leads FOR ALL TO authenticated USING (public.is_admin_or_dispatcher(auth.uid()));

-- lead_answers
CREATE POLICY "Admin/dispatcher full access lead_answers" ON public.lead_answers FOR ALL TO authenticated USING (public.is_admin_or_dispatcher(auth.uid()));

-- opportunities
CREATE POLICY "Admin/dispatcher full access opportunities" ON public.opportunities FOR ALL TO authenticated USING (public.is_admin_or_dispatcher(auth.uid()));
CREATE POLICY "Broker users view own opportunities" ON public.opportunities FOR SELECT TO authenticated USING (broker_id = public.get_user_broker_id(auth.uid()));
CREATE POLICY "Broker users update own opportunities" ON public.opportunities FOR UPDATE TO authenticated USING (broker_id = public.get_user_broker_id(auth.uid()));

-- opportunity_status_history
CREATE POLICY "Admin/dispatcher full access opp_history" ON public.opportunity_status_history FOR ALL TO authenticated USING (public.is_admin_or_dispatcher(auth.uid()));
CREATE POLICY "Broker users view own opp history" ON public.opportunity_status_history FOR SELECT TO authenticated USING (opportunity_id IN (SELECT id FROM public.opportunities WHERE broker_id = public.get_user_broker_id(auth.uid())));

-- routing_rules
CREATE POLICY "Admin/dispatcher full access routing_rules" ON public.routing_rules FOR ALL TO authenticated USING (public.is_admin_or_dispatcher(auth.uid()));

-- fees
CREATE POLICY "Admin/dispatcher full access fees" ON public.fees FOR ALL TO authenticated USING (public.is_admin_or_dispatcher(auth.uid()));
CREATE POLICY "Broker users view own fees" ON public.fees FOR SELECT TO authenticated USING (broker_id = public.get_user_broker_id(auth.uid()));

-- billable_events
CREATE POLICY "Admin/dispatcher full access billable_events" ON public.billable_events FOR ALL TO authenticated USING (public.is_admin_or_dispatcher(auth.uid()));
CREATE POLICY "Broker users view own billable_events" ON public.billable_events FOR SELECT TO authenticated USING (broker_id = public.get_user_broker_id(auth.uid()));

-- invoices
CREATE POLICY "Admin/dispatcher full access invoices" ON public.invoices FOR ALL TO authenticated USING (public.is_admin_or_dispatcher(auth.uid()));
CREATE POLICY "Broker users view own invoices" ON public.invoices FOR SELECT TO authenticated USING (broker_id = public.get_user_broker_id(auth.uid()));

-- invoice_items
CREATE POLICY "Admin/dispatcher full access invoice_items" ON public.invoice_items FOR ALL TO authenticated USING (public.is_admin_or_dispatcher(auth.uid()));
CREATE POLICY "Broker users view own invoice_items" ON public.invoice_items FOR SELECT TO authenticated USING (invoice_id IN (SELECT id FROM public.invoices WHERE broker_id = public.get_user_broker_id(auth.uid())));

-- audit_logs
CREATE POLICY "Admin/dispatcher full access audit_logs" ON public.audit_logs FOR ALL TO authenticated USING (public.is_admin_or_dispatcher(auth.uid()));

-- =====================================================
-- UPDATE handle_new_user TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));

  INSERT INTO public.users (id, name, email, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email, 'broker_operator');

  RETURN NEW;
END;
$$;

-- =====================================================
-- SEED DATA
-- =====================================================
INSERT INTO public.products (name, slug, category, description, is_active, is_featured, public_page_enabled) VALUES
  ('Seguro Auto', 'auto', 'seguro', 'Proteção completa para veículos com coberturas personalizáveis.', true, true, true),
  ('Seguro Saúde Empresarial', 'saude', 'seguro', 'Planos de saúde empresariais com ampla rede credenciada.', true, true, true),
  ('Consórcio', 'consorcio', 'consorcio', 'Consórcios para imóveis, veículos e serviços.', true, true, true);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_users_broker_id ON public.users(broker_id);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_broker_regions_broker_id ON public.broker_regions(broker_id);
CREATE INDEX idx_broker_products_broker_id ON public.broker_products(broker_id);
CREATE INDEX idx_broker_products_product_id ON public.broker_products(product_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_product_id ON public.leads(product_id);
CREATE INDEX idx_lead_answers_lead_id ON public.lead_answers(lead_id);
CREATE INDEX idx_opportunities_broker_id ON public.opportunities(broker_id);
CREATE INDEX idx_opportunities_lead_id ON public.opportunities(lead_id);
CREATE INDEX idx_opportunities_status ON public.opportunities(status);
CREATE INDEX idx_opp_history_opportunity_id ON public.opportunity_status_history(opportunity_id);
CREATE INDEX idx_fees_broker_id ON public.fees(broker_id);
CREATE INDEX idx_billable_events_broker_id ON public.billable_events(broker_id);
CREATE INDEX idx_invoices_broker_id ON public.invoices(broker_id);
CREATE INDEX idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_routing_rules_product_id ON public.routing_rules(product_id);

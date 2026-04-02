
DO $$ BEGIN
  -- Foreign Keys (skip if already exists)
  BEGIN ALTER TABLE public.broker_regions ADD CONSTRAINT broker_regions_broker_id_fkey FOREIGN KEY (broker_id) REFERENCES public.brokers(id) ON DELETE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.broker_products ADD CONSTRAINT broker_products_broker_id_fkey FOREIGN KEY (broker_id) REFERENCES public.brokers(id) ON DELETE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.broker_products ADD CONSTRAINT broker_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.product_form_fields ADD CONSTRAINT product_form_fields_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.leads ADD CONSTRAINT leads_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.lead_answers ADD CONSTRAINT lead_answers_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.opportunities ADD CONSTRAINT opportunities_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.opportunities ADD CONSTRAINT opportunities_broker_id_fkey FOREIGN KEY (broker_id) REFERENCES public.brokers(id) ON DELETE RESTRICT; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.opportunities ADD CONSTRAINT opportunities_dispatcher_id_fkey FOREIGN KEY (dispatcher_id) REFERENCES public.users(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.opportunities ADD CONSTRAINT opportunities_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.opportunity_status_history ADD CONSTRAINT opportunity_status_history_opportunity_id_fkey FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.opportunity_status_history ADD CONSTRAINT opportunity_status_history_changed_by_user_id_fkey FOREIGN KEY (changed_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.routing_rules ADD CONSTRAINT routing_rules_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.routing_rules ADD CONSTRAINT routing_rules_broker_id_fkey FOREIGN KEY (broker_id) REFERENCES public.brokers(id) ON DELETE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.fees ADD CONSTRAINT fees_broker_id_fkey FOREIGN KEY (broker_id) REFERENCES public.brokers(id) ON DELETE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.fees ADD CONSTRAINT fees_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.billable_events ADD CONSTRAINT billable_events_broker_id_fkey FOREIGN KEY (broker_id) REFERENCES public.brokers(id) ON DELETE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.billable_events ADD CONSTRAINT billable_events_opportunity_id_fkey FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.billable_events ADD CONSTRAINT billable_events_fee_id_fkey FOREIGN KEY (fee_id) REFERENCES public.fees(id) ON DELETE RESTRICT; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.invoices ADD CONSTRAINT invoices_broker_id_fkey FOREIGN KEY (broker_id) REFERENCES public.brokers(id) ON DELETE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.invoice_items ADD CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.invoice_items ADD CONSTRAINT invoice_items_billable_event_id_fkey FOREIGN KEY (billable_event_id) REFERENCES public.billable_events(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.audit_logs ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_object THEN NULL; END;

  -- CHECK Constraints
  BEGIN ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('admin','dispatcher','broker_owner','broker_operator')); EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.leads ADD CONSTRAINT leads_status_check CHECK (status IN ('novo','em_triagem','qualificado','descartado','aguardando_despacho','despachado','redistribuicao','encerrado')); EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.opportunities ADD CONSTRAINT opportunities_route_mode_check CHECK (route_mode IN ('manual','suggested','automatic')); EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.opportunities ADD CONSTRAINT opportunities_status_check CHECK (status IN ('enviada','aceita','recusada','expirada','em_atendimento','contato_realizado','proposta_emitida','negociacao','fechada','perdida')); EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.fees ADD CONSTRAINT fees_fee_type_check CHECK (fee_type IN ('setup','monthly','qualified_lead','accepted_lead','proposal','closed_sale')); EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.billable_events ADD CONSTRAINT billable_events_status_check CHECK (status IN ('pending','billed','paid','cancelled')); EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TABLE public.invoices ADD CONSTRAINT invoices_status_check CHECK (status IN ('open','sent','paid','overdue','cancelled')); EXCEPTION WHEN duplicate_object THEN NULL; END;

  -- UNIQUE
  BEGIN ALTER TABLE public.broker_products ADD CONSTRAINT broker_products_broker_product_unique UNIQUE (broker_id, product_id); EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

-- Triggers (DROP IF EXISTS + CREATE)
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_brokers_updated_at ON public.brokers;
CREATE TRIGGER update_brokers_updated_at BEFORE UPDATE ON public.brokers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_opportunities_updated_at ON public.opportunities;
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

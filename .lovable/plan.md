

# Migration: Foreign Keys e CHECK Constraints

## O que será feito

Uma migration para adicionar todas as foreign keys e CHECK constraints ausentes nas tabelas existentes, conforme o schema definido pelo usuário.

## Foreign Keys a adicionar

| Tabela | Coluna | Referencia |
|--------|--------|------------|
| users | broker_id | brokers(id) ON DELETE SET NULL |
| broker_regions | broker_id | brokers(id) ON DELETE CASCADE |
| broker_products | broker_id | brokers(id) ON DELETE CASCADE |
| broker_products | product_id | products(id) ON DELETE CASCADE |
| product_form_fields | product_id | products(id) ON DELETE CASCADE |
| leads | product_id | products(id) ON DELETE SET NULL |
| lead_answers | lead_id | leads(id) ON DELETE CASCADE |
| opportunities | lead_id | leads(id) ON DELETE CASCADE |
| opportunities | broker_id | brokers(id) ON DELETE RESTRICT |
| opportunities | dispatcher_id | users(id) ON DELETE SET NULL |
| opportunities | product_id | products(id) ON DELETE SET NULL |
| opportunity_status_history | opportunity_id | opportunities(id) ON DELETE CASCADE |
| opportunity_status_history | changed_by_user_id | users(id) ON DELETE SET NULL |
| routing_rules | product_id | products(id) ON DELETE SET NULL |
| routing_rules | broker_id | brokers(id) ON DELETE CASCADE |
| fees | broker_id | brokers(id) ON DELETE CASCADE |
| fees | product_id | products(id) ON DELETE SET NULL |
| billable_events | broker_id | brokers(id) ON DELETE CASCADE |
| billable_events | opportunity_id | opportunities(id) ON DELETE SET NULL |
| billable_events | fee_id | fees(id) ON DELETE RESTRICT |
| invoices | broker_id | brokers(id) ON DELETE CASCADE |
| invoice_items | invoice_id | invoices(id) ON DELETE CASCADE |
| invoice_items | billable_event_id | billable_events(id) ON DELETE SET NULL |
| audit_logs | user_id | users(id) ON DELETE SET NULL |

## CHECK Constraints a adicionar

| Tabela | Coluna | Valores permitidos |
|--------|--------|--------------------|
| users | role | admin, dispatcher, broker_owner, broker_operator |
| leads | status | novo, em_triagem, qualificado, descartado, aguardando_despacho, despachado, redistribuicao, encerrado |
| opportunities | route_mode | manual, suggested, automatic |
| opportunities | status | enviada, aceita, recusada, expirada, em_atendimento, contato_realizado, proposta_emitida, negociacao, fechada, perdida |
| fees | fee_type | setup, monthly, qualified_lead, accepted_lead, proposal, closed_sale |
| billable_events | status | pending, billed, paid, cancelled |
| invoices | status | open, sent, paid, overdue, cancelled |

## UNIQUE Constraint

- `broker_products (broker_id, product_id)` — evitar duplicidade de vínculo

## Trigger updated_at

- Conectar o trigger `update_updated_at_column` às tabelas: users, brokers, leads, opportunities, products

## Detalhes técnicos

- Uma única migration SQL com todos os `ALTER TABLE ... ADD CONSTRAINT`
- Uso de `IF NOT EXISTS` onde possível, ou `DO $$ ... EXCEPTION WHEN ...` para idempotência
- Nenhuma alteração de código frontend necessária — apenas integridade referencial no banco


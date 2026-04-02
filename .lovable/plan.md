

# Hub de Oportunidades de Seguros — Plano de Implementação (M1)

## Visão Geral

Construir a base estrutural completa da aplicação: autenticação, sistema de roles, layouts por perfil, rotas protegidas e páginas placeholder para todas as áreas. Supabase será usado para auth e banco de dados.

---

## Etapa 1 — Supabase + Autenticação

**Ativar Lovable Cloud** para provisionar Supabase automaticamente.

**Tabelas e tipos criados via migrations:**

- `user_roles` table com enum `app_role` (`admin`, `dispatcher`, `dono_corretora`, `operador_corretora`)
- Função `has_role(uuid, app_role)` com `SECURITY DEFINER`
- RLS na tabela `user_roles`
- Trigger para criar role padrão no signup (opcional, pode ser atribuído pelo admin)

**Auth pages:**
- `/login` — email/senha com Supabase Auth
- `/esqueci-senha` — reset password flow
- `/reset-password` — página para definir nova senha

---

## Etapa 2 — Tipos e Contexto de Auth

**Arquivos:**
- `src/types/roles.ts` — tipos para `AppRole`, constantes de roles
- `src/types/entities.ts` — interfaces placeholder para `Lead`, `Oportunidade`, `Corretora`, `Produto`, `Roteamento`, `Fee`, `BillableEvent`, `Invoice`
- `src/contexts/AuthContext.tsx` — provider com estado do usuário, role atual, loading
- `src/hooks/useAuth.ts` — hook para consumir o contexto
- `src/hooks/useRole.ts` — hook para verificar role do usuário

---

## Etapa 3 — Layout e Navegação

**Componentes de layout:**
- `src/components/layouts/PublicLayout.tsx` — header + footer para páginas públicas
- `src/components/layouts/AuthenticatedLayout.tsx` — sidebar + header + main content
- `src/components/layouts/Sidebar.tsx` — usando Shadcn Sidebar, com menus condicionais por role

**Sidebar condicional:**
- Admin: Usuários, Produtos, Regras, Fees, Logs
- Dispatcher: Dashboard, Leads, Oportunidades, Corretoras, Produtos, Financeiro, Relatórios
- Corretora (dono/operador): Dashboard, Oportunidades, Clientes, Financeiro, Perfil

---

## Etapa 4 — Proteção de Rotas

- `src/components/ProtectedRoute.tsx` — verifica auth + role, redireciona para `/login` ou página de acesso negado
- Cada grupo de rotas envolto com a role correspondente

---

## Etapa 5 — Páginas (todas como placeholder estruturado)

**Públicas (sem auth):**
- `/` — Landing page com CTA para cotação
- `/seguros` — Lista de produtos
- `/seguro/auto`, `/seguro/saude`, `/seguro/consorcio` — Detalhe do produto
- `/cotacao/:slug` — Formulário de cotação (captura de lead)
- `/obrigado` — Thank you page

**Dispatcher (7 páginas):**
- Dashboard, Leads, Oportunidades, Corretoras, Produtos, Financeiro, Relatórios

**Corretora (5 páginas):**
- Dashboard, Oportunidades, Clientes, Financeiro, Perfil

**Admin (5 páginas):**
- Usuários, Produtos, Regras, Fees, Logs

Cada página terá título, breadcrumb, e placeholders para filtros/tabelas.

---

## Etapa 6 — Registro de Rotas

Atualizar `App.tsx` com todas as rotas organizadas em grupos:
- Rotas públicas (PublicLayout)
- Rotas de auth (sem layout)
- Rotas protegidas por role (AuthenticatedLayout + ProtectedRoute)

---

## Estrutura de Pastas Final

```text
src/
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useRole.ts
├── types/
│   ├── roles.ts
│   └── entities.ts
├── components/
│   ├── layouts/
│   │   ├── PublicLayout.tsx
│   │   ├── AuthenticatedLayout.tsx
│   │   └── AppSidebar.tsx
│   ├── ProtectedRoute.tsx
│   └── NavLink.tsx (existente)
├── pages/
│   ├── Index.tsx (landing)
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── ResetPassword.tsx
│   ├── public/
│   │   ├── Seguros.tsx
│   │   ├── SeguroAuto.tsx
│   │   ├── SeguroSaude.tsx
│   │   ├── SeguroConsorcio.tsx
│   │   ├── Cotacao.tsx
│   │   └── Obrigado.tsx
│   ├── dispatcher/
│   │   ├── Dashboard.tsx
│   │   ├── Leads.tsx
│   │   ├── Oportunidades.tsx
│   │   ├── Corretoras.tsx
│   │   ├── Produtos.tsx
│   │   ├── Financeiro.tsx
│   │   └── Relatorios.tsx
│   ├── corretora/
│   │   ├── Dashboard.tsx
│   │   ├── Oportunidades.tsx
│   │   ├── Clientes.tsx
│   │   ├── Financeiro.tsx
│   │   └── Perfil.tsx
│   └── admin/
│       ├── Usuarios.tsx
│       ├── Produtos.tsx
│       ├── Regras.tsx
│       ├── Fees.tsx
│       └── Logs.tsx
```

## Detalhes Técnicos

- **Supabase Auth**: email/senha, `onAuthStateChange` listener
- **Roles**: tabela separada `user_roles`, nunca no perfil
- **RLS**: `has_role()` SECURITY DEFINER function
- **Sidebar**: Shadcn `<Sidebar collapsible="icon">` com `SidebarProvider`
- **Entidades preservadas**: lead, oportunidade, corretora, produto, roteamento, fee, billable_event, invoice — todas com tipos TypeScript definidos, prontas para conexão com tabelas
- **Design**: Tailwind, badges com status visuais, esqueleto de filtros e busca nas listas


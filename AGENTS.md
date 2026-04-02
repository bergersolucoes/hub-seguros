# AGENTS.md

## Objetivo
Este projeto deve ser trabalhado de forma incremental, segura e rastreável.
Antes de alterar qualquer código, leia a estrutura existente e entenda o contexto do projeto.

## Regras de trabalho
1. Não faça mudanças grandes demais de uma vez.
2. Sempre proponha etapas pequenas e seguras.
3. Antes de editar, informe quais arquivos pretende alterar.
4. Não mexa em áreas não solicitadas.
5. Preserve a arquitetura existente, a menos que uma mudança estrutural seja explicitamente aprovada.
6. Evite criar código paralelo quando já existir uma estrutura compatível no projeto.
7. Prefira reutilizar tipos, hooks, serviços e componentes já existentes.
8. Ao final de mudanças relevantes, atualize a documentação do projeto em `docs/contexto-projeto.md` e, se necessário, `docs/decisoes-tecnicas.md`.
9. Em mudanças sensíveis, valide impacto em autenticação, permissões, banco e fluxo principal.
10. Sempre separar claramente:
   - banco
   - frontend
   - autenticação
   - permissões
   - integrações
   - regras de negócio

## Fluxo padrão
1. Ler o projeto
2. Diagnosticar
3. Propor plano em etapas pequenas
4. Executar apenas a etapa solicitada
5. Validar
6. Documentar
7. Commitar

## Restrições
- Não transformar o projeto em outra arquitetura sem aprovação.
- Não apagar arquivos importantes sem informar.
- Não renomear conceitos de domínio sem necessidade.
- Não introduzir placeholders como solução final.

## Padrão de resposta esperado
Sempre que possível, responder com:
1. o que foi entendido
2. o que será alterado
3. quais arquivos serão afetados
4. riscos
5. resultado esperado

## Documentação de apoio
Leia sempre que existir:
- `docs/contexto-projeto.md`
- `docs/decisoes-tecnicas.md`
- `docs/backlog.md`
- `docs/prompts-codex.md`
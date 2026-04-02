# Prompts úteis para o Codex

## Diagnóstico inicial
Leia este repositório inteiro antes de alterar qualquer coisa.
Quero que você primeiro faça apenas um diagnóstico:
1. stack usada
2. estrutura de rotas
3. integração com backend
4. o que já foi implementado
5. o que está faltando
6. quais partes parecem inconsistentes ou incompletas

Não altere arquivos ainda.
Primeiro me mostre um plano de correção em etapas pequenas.

---

## Backlog técnico
Transforme o diagnóstico em um backlog técnico objetivo, em etapas pequenas, arquivo por arquivo.

Quero que você organize assim:
1. nome da etapa
2. objetivo
3. arquivos que precisam ser alterados
4. tabelas/funções impactadas
5. risco da alteração
6. dependências
7. o que deve ser validado ao final

Regras:
- não altere nada ainda
- não agrupe mudanças grandes demais
- priorize primeiro o que destrava a base do sistema sem quebrar o que já existe

No final, me diga qual deve ser a primeira etapa realmente segura para implementar.

---

## Execução de etapa
Agora implemente somente a etapa [X] do plano.
Não altere outras áreas do sistema.
Antes de editar, me diga quais arquivos pretende alterar.

---

## Revisão de mudança
Revise as alterações feitas nesta etapa e me diga:
1. o que foi alterado
2. riscos introduzidos
3. o que ainda falta validar
4. se a implementação está consistente com a arquitetura existente

---

## Resumo de etapa
Resuma a etapa concluída em no máximo 15 linhas, de forma reaproveitável para continuidade futura do projeto.

---

## Atualização de contexto
Atualize o arquivo `docs/contexto-projeto.md` com base no estado atual real do projeto, sem inventar funcionalidades inexistentes.
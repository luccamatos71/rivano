# AGENTS.md — Guia do Projeto Rivano

## Contexto
A Rivano é uma marca de óculos premium-acessível, com estética editorial, minimalista, sofisticada e fashion. O site deve parecer uma marca de moda, não uma loja genérica.

## Objetivo
Site próprio da Rivano com catálogo migrado da Nuvemshop, sem cadastro manual produto a produto.

## Stack
- Astro (geração estática)
- TypeScript
- Tailwind CSS
- Estrutura simples e fácil de manter

## Diretrizes
- Visual premium, editorial, elegante e mobile-first
- Sem checkout próprio nesta fase — compra via WhatsApp
- Produtos organizados em src/data/products.json
- Imagens salvas em /public/products/[slug]/
- Sem overengineering
- Não alterar escopo sem necessidade
- Não usar dados fictícios como se fossem reais
- Se faltar dado de produto, marcar como incompleto em vez de inventar
- Não mexer em partes não relacionadas ao pedido atual
- Sempre listar arquivos criados ou alterados ao final
- Sempre indicar como testar localmente
- SEO, performance e responsividade são obrigatórios

## Fluxo de desenvolvimento
1. Planejar antes de implementar
2. Estrutura base do projeto ✅
3. Script de migração dos produtos ✅
4. Base de produtos gerada (products.json + imagens) ✅
5. Catálogo de produtos
6. Página individual de produto
7. Botão de compra pelo WhatsApp
8. Revisão mobile, SEO e performance

## Regras para scripts de migração
- Não duplicar produtos
- Não sobrescrever dados manualmente editados sem aviso
- Gerar logs claros
- Listar produtos com dados incompletos
- Permitir rodar novamente sem bagunçar a pasta
- Não baixar imagens quebradas
- Nomes de arquivos baseados no slug do produto

## Arquivos críticos
- src/data/products.json — fonte da verdade dos produtos
- public/products/ — imagens organizadas por slug
- scripts/import-csv.ts — migração CSV → JSON
- scripts/scrape-images.ts — download e otimização de imagens

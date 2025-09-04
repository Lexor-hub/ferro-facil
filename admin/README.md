# Admin - Azul Grupo Soares

Painel administrativo separado para gerenciar produtos, banners, ofertas e carrossel.

## Estrutura
- **Login apenas** (sem cadastro público)
- **Role-based access** (apenas usuários com role='admin')
- **SEO bloqueado** (noindex, robots.txt)
- **Domínio separado** recomendado (admin.seudominio.com)

## Funcionalidades
- ✅ Produtos (CRUD + imagens + categorias)
- ✅ Categorias (CRUD + ativo/inativo)
- ✅ Banners (CRUD + período + posição)
- ✅ Ofertas Semanais (CRUD + ordenação)
- ✅ Carrossel Logística (CRUD + ordenação)

## Configuração Inicial
1. Criar usuário admin no Supabase
2. Definir role='admin' na tabela profiles
3. Instalar dependências: `npm install`
4. Executar: `npm run dev`

## Deploy
Deploy em subdomínio separado para segurança máxima.
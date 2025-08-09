# ✅ Checklist - Deploy Railway

## 🔧 Pré-Deploy

### 1. Banco de Dados MySQL
- [ ] Escolher provedor MySQL:
  - [ ] **Opção A**: MySQL Local (desenvolvimento)
  - [ ] **Opção B**: Railway MySQL (recomendado)
  - [ ] **Opção C**: AWS RDS, Google Cloud SQL, etc.
- [ ] Configurar banco de dados
- [ ] Anotar credenciais:
  - [ ] Host: `_________________`
  - [ ] Username: `_________________`
  - [ ] Password: `_________________`
  - [ ] Database: `legacy_camp`

### 2. Código
- [ ] Código commitado no GitHub
- [ ] Todos os arquivos de configuração presentes:
  - [ ] `railway.json` ✅
  - [ ] `railway.toml` ✅
  - [ ] `package.json` ✅
  - [ ] `tsconfig.json` ✅
  - [ ] `nest-cli.json` ✅
  - [ ] `.dockerignore` ✅
- [ ] Build testado localmente: `npm run build`
- [ ] Dependência `rimraf` instalada

### 3. Variáveis de Ambiente
Preparar para adicionar no Railway:
```env
# Banco de Dados
DB_HOST=_________________
DB_PORT=3306
DB_USERNAME=_________________
DB_PASSWORD=_________________
DB_DATABASE=legacy_camp

# Aplicação
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://seu-frontend.vercel.app

# Email (Gmail)
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-app-password
```

## 🚀 Deploy

### 1. Railway Dashboard
- [ ] Acessar [railway.app](https://railway.app)
- [ ] Fazer login
- [ ] Criar novo projeto
- [ ] Conectar repositório GitHub

### 2. Configuração
- [ ] Adicionar variáveis de ambiente
- [ ] Verificar configuração do `railway.json`
- [ ] Aguardar primeiro deploy

### 3. Verificação
- [ ] Deploy concluído com sucesso
- [ ] Health check passando (`/api`)
- [ ] Logs sem erros
- [ ] URL da aplicação funcionando

## 🧪 Testes Pós-Deploy

### 1. Health Check
```bash
curl https://seu-app.railway.app/api
```

### 2. API Endpoints
```bash
# Listar inscrições
curl https://seu-app.railway.app/inscricoes

# Criar inscrição
curl -X POST https://seu-app.railway.app/inscricoes \
  -H "Content-Type: application/json" \
  -d @test-inscricao.json
```

### 3. Documentação
- [ ] Swagger UI acessível: `https://seu-app.railway.app/api`
- [ ] Todos os endpoints documentados
- [ ] Exemplos funcionando

## 🔍 Troubleshooting

### Problemas Comuns
- [ ] **Erro de conexão com banco**: Verificar variáveis de ambiente
- [ ] **Erro de build**: Verificar dependências no `package.json`
- [ ] **Erro de porta**: Railway usa `PORT` automaticamente
- [ ] **Erro de banco não encontrado**: Verificar se o banco foi criado

### Logs Importantes
- [ ] Verificar logs no Railway Dashboard
- [ ] Procurar por erros de conexão
- [ ] Verificar se a aplicação iniciou corretamente

## 📊 Monitoramento

### Configurações Recomendadas
- [ ] Alertas configurados
- [ ] Logs sendo salvos
- [ ] Métricas de performance

### URLs Importantes
- [ ] **Aplicação**: `https://seu-app.railway.app`
- [ ] **API Docs**: `https://seu-app.railway.app/api`
- [ ] **Health Check**: `https://seu-app.railway.app/api`

## 🎯 Próximos Passos

Após deploy bem-sucedido:
- [ ] Configurar domínio customizado
- [ ] Configurar SSL/HTTPS
- [ ] Configurar monitoramento
- [ ] Testar com frontend
- [ ] Documentar URLs finais

## 📞 Suporte

Se houver problemas:
1. Verificar logs no Railway
2. Testar localmente primeiro
3. Verificar variáveis de ambiente
4. Consultar documentação do Railway

---

**Status do Deploy**: ⏳ Pendente
**Data**: _________________
**Responsável**: _________________ 
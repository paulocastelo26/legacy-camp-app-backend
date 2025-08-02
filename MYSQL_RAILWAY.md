# 🗄️ Configurando MySQL no Railway

Este guia mostra como configurar um banco MySQL diretamente no Railway, que é a opção mais simples e integrada.

## 🚀 Passo a Passo

### 1. Criar Projeto no Railway
1. Acesse [railway.app](https://railway.app)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha "Deploy from GitHub repo"
5. Selecione seu repositório

### 2. Adicionar Banco MySQL
1. No projeto criado, clique em "New"
2. Selecione "Database" → "MySQL"
3. Railway criará automaticamente um banco MySQL
4. Aguarde a criação (pode demorar alguns minutos)

### 3. Configurar Aplicação
1. Clique em "New" novamente
2. Selecione "Service" → "GitHub Repo"
3. Escolha o mesmo repositório
4. Railway detectará que é uma aplicação Node.js

### 4. Conectar Aplicação ao Banco
1. Na aplicação criada, vá em "Variables"
2. Railway já criou as variáveis do banco automaticamente
3. Verifique se as variáveis estão presentes:
   ```env
   MYSQLHOST=...
   MYSQLUSER=...
   MYSQLPASSWORD=...
   MYSQLDATABASE=...
   MYSQLPORT=...
   ```

### 5. Mapear Variáveis
Adicione as variáveis mapeadas para sua aplicação:
```env
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_USERNAME=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}
DB_DATABASE=${MYSQLDATABASE}
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://seu-frontend.vercel.app
```

## 🔧 Configuração Alternativa

Se preferir usar variáveis diretas:

### 1. Copiar Credenciais
1. No serviço MySQL, vá em "Connect"
2. Copie as credenciais mostradas
3. Vá na aplicação → "Variables"
4. Adicione manualmente:

```env
DB_HOST=seu_host_mysql
DB_PORT=3306
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=legacy_camp
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://seu-frontend.vercel.app
```

## 🧪 Testando a Conexão

### 1. Verificar Logs
1. Vá em "Deployments"
2. Clique no deploy mais recente
3. Verifique se não há erros de conexão

### 2. Testar API
```bash
# Health check
curl https://seu-app.railway.app/api

# Testar inscrição
curl -X POST https://seu-app.railway.app/inscricoes \
  -H "Content-Type: application/json" \
  -d @test-inscricao.json
```

## 🔍 Troubleshooting

### Erro: "Access denied for user"
- Verifique se as variáveis estão corretas
- Confirme se o usuário tem permissões no banco

### Erro: "Unknown database"
- Verifique se o banco `legacy_camp` foi criado
- A aplicação criará automaticamente se `synchronize: true`

### Erro: "Connection timeout"
- Verifique se o host está correto
- Confirme se a porta está acessível

## 💰 Custos

- **Railway MySQL**: Incluído no plano pago ($5/mês)
- **Free Tier**: Limitado, mas suficiente para testes
- **Escalabilidade**: Automática conforme uso

## 🎯 Vantagens do Railway MySQL

✅ **Integração perfeita** com Railway
✅ **Configuração automática** de variáveis
✅ **Backup automático** incluído
✅ **Escalabilidade** automática
✅ **Monitoramento** integrado
✅ **SSL** configurado automaticamente

## 📊 Monitoramento

### Métricas Disponíveis
- Uptime do banco
- Conexões ativas
- Performance de queries
- Uso de disco

### Logs
- Acessíveis no dashboard do MySQL
- Queries lentas
- Erros de conexão
- Tentativas de acesso

---

## 🎉 Pronto!

Com o MySQL configurado no Railway, sua aplicação terá:
- Banco de dados gerenciado
- Backup automático
- Escalabilidade
- Monitoramento integrado
- Zero configuração manual 
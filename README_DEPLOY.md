# 🚀 Deploy no Railway

Este guia explica como fazer o deploy da aplicação Legacy Camp Backend no Railway.

## 📋 Pré-requisitos

1. **Conta no Railway**: [railway.app](https://railway.app)
2. **Banco MySQL** (local ou na nuvem)
3. **Código no GitHub**: Repositório com o código da aplicação

## 🔧 Configuração do Banco de Dados

### Opção 1: MySQL Local (Desenvolvimento)
```bash
# Instalar MySQL localmente
# Windows: https://dev.mysql.com/downloads/installer/
# Linux: sudo apt install mysql-server
# macOS: brew install mysql

# Criar banco de dados
mysql -u root -p
CREATE DATABASE legacy_camp;
```

### Opção 2: MySQL na Nuvem (Produção)
Você pode usar qualquer provedor:
- **Railway MySQL**: Integrado ao Railway
- **AWS RDS**: Amazon Relational Database Service
- **Google Cloud SQL**: Google Cloud Platform
- **Azure Database**: Microsoft Azure
- **DigitalOcean Managed Databases**: DigitalOcean
- **Heroku Postgres**: Heroku (PostgreSQL)

### 3. Configurar Credenciais
Configure as variáveis de ambiente com suas credenciais:
- **Host**: Endereço do seu banco MySQL
- **Username**: Usuário do banco
- **Password**: Senha do banco
- **Database**: Nome do banco (ex: `legacy_camp`)

## 🚀 Deploy no Railway

### 1. Conectar Repositório
1. Acesse [railway.app](https://railway.app)
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Escolha seu repositório
5. Clique em "Deploy Now"

### 2. Configurar Variáveis de Ambiente
No Railway, vá em "Variables" e adicione:

```env
# Configurações do Banco de Dados MySQL
DB_HOST=seu_host_mysql_aqui
DB_PORT=3306
DB_USERNAME=seu_username_aqui
DB_PASSWORD=sua_password_aqui
DB_DATABASE=legacy_camp

# Configurações da Aplicação
PORT=3000
NODE_ENV=production

# URL do Frontend (para CORS)
FRONTEND_URL=https://seu-frontend.vercel.app
```

### 3. Adicionar Banco MySQL (Opcional)
Se quiser usar o MySQL integrado do Railway:
1. No projeto Railway, clique em "New"
2. Selecione "Database" → "MySQL"
3. Railway criará automaticamente as variáveis de ambiente
4. Copie as variáveis para o seu serviço de aplicação

### 3. Configurar Domínio (Opcional)
1. No Railway, vá em "Settings"
2. Em "Domains", clique em "Generate Domain"
3. Ou adicione seu domínio customizado

## 🔄 Processo de Deploy

O Railway irá:
1. **Detectar** que é uma aplicação Node.js
2. **Instalar** dependências (`npm install`)
3. **Buildar** a aplicação (`npm run build`)
4. **Executar** com `npm run start:prod`

## 📊 Monitoramento

### Logs
- Acesse "Deployments" no Railway
- Clique em qualquer deploy para ver os logs
- Use "View Logs" para logs em tempo real

### Health Check
- A aplicação responde em `/` para health check
- Railway monitora automaticamente

## 🔧 Configurações Avançadas

### Railway.json
O arquivo `railway.json` já está configurado com:
- Builder: NIXPACKS (detecção automática)
- Start Command: `npm run start:prod`
- Health Check: `/`
- Restart Policy: ON_FAILURE

### Package.json
Scripts configurados:
- `build`: Compila TypeScript
- `start:prod`: Executa a aplicação em produção

## 🚨 Troubleshooting

### Erro de Conexão com Banco
```
Error: connect ECONNREFUSED
```
**Solução**: Verificar se as variáveis de ambiente do banco estão corretas

### Erro de Build
```
Error: Cannot find module
```
**Solução**: Verificar se todas as dependências estão no `package.json`

### Erro de Porta
```
Error: listen EADDRINUSE
```
**Solução**: Railway usa a variável `PORT` automaticamente

### Erro de Conexão com Banco
```
Error: connect ECONNREFUSED
```
**Solução**: Verificar se as variáveis de ambiente do banco estão corretas

## 📱 Testando o Deploy

### 1. Verificar Health Check
```bash
curl https://seu-app.railway.app/
```

### 2. Testar API
```bash
# Listar inscrições
curl https://seu-app.railway.app/inscricoes

# Criar inscrição
curl -X POST https://seu-app.railway.app/inscricoes \
  -H "Content-Type: application/json" \
  -d @test-inscricao.json
```

### 3. Documentação Swagger
Acesse: `https://seu-app.railway.app/api`

## 🔄 Deploy Automático

O Railway faz deploy automático quando:
- Você faz push para a branch principal
- Você faz merge de um Pull Request

## 💰 Custos

- **Railway**: $5/mês para projetos pagos (free tier disponível)
- **MySQL**: Depende do provedor escolhido
  - **Railway MySQL**: Incluído no plano
  - **AWS RDS**: ~$15/mês (free tier disponível)
  - **Google Cloud SQL**: ~$10/mês (free tier disponível)
  - **Local**: Gratuito

## 📞 Suporte

Se houver problemas:
1. Verifique os logs no Railway
2. Confirme as variáveis de ambiente
3. Teste localmente primeiro
4. Verifique a documentação do Railway

### Documentação
- [Railway Docs](https://docs.railway.app)
- [MySQL Docs](https://dev.mysql.com/doc/)
- [NestJS Deployment](https://docs.nestjs.com/deployment)

## 🎯 Próximos Passos

1. ✅ Deploy no Railway
2. 🔄 Configurar domínio customizado
3. 🔒 Configurar SSL/HTTPS
4. 📊 Configurar monitoramento
5. 🔄 Configurar CI/CD avançado 
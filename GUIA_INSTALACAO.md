# 🚀 Guia de Instalação - Legacy Camp Backend

## Pré-requisitos

1. **Node.js 18+** instalado
2. **MySQL 8.0+** instalado e rodando
3. **Git** (opcional)

## 📋 Passo a Passo

### 1. Instalar Dependências

```bash
npm install
```

Se houver erro com `tsconfig-paths`, execute:
```bash
npm install tsconfig-paths@^4.1.0 --save-dev
```

### 2. Configurar Banco de Dados

1. **Acesse o MySQL:**
```bash
mysql -u root -p
```

2. **Crie o banco de dados:**
```sql
CREATE DATABASE legacy_camp;
```

3. **Verifique se foi criado:**
```sql
SHOW DATABASES;
```

### 3. Configurar Variáveis de Ambiente

1. **Copie o arquivo de exemplo:**
```bash
copy env.example .env
```

2. **Edite o arquivo `.env`:**
```env
# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=sua_senha_aqui
DB_DATABASE=legacy_camp

# Configurações da Aplicação
PORT=3000
NODE_ENV=development
```

### 4. Iniciar o Servidor

```bash
npm run start:dev
```

## ✅ Verificação

Se tudo estiver funcionando, você verá:

```
🚀 Aplicação rodando na porta 3000
📚 Documentação disponível em http://localhost:3000/api
```

## 🔗 URLs Importantes

- **API:** http://localhost:3000
- **Documentação Swagger:** http://localhost:3000/api
- **Frontend:** http://localhost:4200

## 🛠️ Solução de Problemas

### Erro: "No matching version found for tsconfig-paths"
```bash
npm install tsconfig-paths@^4.1.0 --save-dev
```

### Erro: "Connection refused" (MySQL)
1. Verifique se o MySQL está rodando
2. Confirme as credenciais no `.env`
3. Teste a conexão: `mysql -u root -p`

### Erro: "Database doesn't exist"
```sql
CREATE DATABASE legacy_camp;
```

## 📞 Suporte

Se ainda houver problemas, verifique:
1. Versão do Node.js: `node --version`
2. Versão do MySQL: `mysql --version`
3. Logs do servidor no terminal 
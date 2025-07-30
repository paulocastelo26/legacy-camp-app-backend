# Legacy Camp Backend

Backend em NestJS para o sistema de inscrições do Legacy Camp.

## 🚀 Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações de banco de dados.

3. **Configurar banco de dados:**
- Crie um banco MySQL chamado `legacy_camp`
- Configure as credenciais no arquivo `.env`

## 🏃‍♂️ Executando

**Desenvolvimento:**
```bash
npm run start:dev
```

**Produção:**
```bash
npm run build
npm run start:prod
```

## 📚 API Documentation

Após iniciar o servidor, acesse:
- **Swagger UI:** http://localhost:3000/api
- **API Base URL:** http://localhost:3000

## 🗄️ Endpoints

### Inscrições
- `POST /inscricoes` - Criar nova inscrição
- `GET /inscricoes` - Listar todas as inscrições
- `GET /inscricoes/:id` - Buscar inscrição por ID
- `PATCH /inscricoes/:id` - Atualizar inscrição
- `DELETE /inscricoes/:id` - Remover inscrição
- `PATCH /inscricoes/:id/status` - Atualizar status da inscrição
- `GET /inscricoes/status/:status` - Listar por status
- `GET /inscricoes/stats` - Estatísticas das inscrições

## 🛠️ Scripts Disponíveis

- `npm run build` - Compilar o projeto
- `npm run start` - Iniciar em modo produção
- `npm run start:dev` - Iniciar em modo desenvolvimento
- `npm run start:debug` - Iniciar em modo debug
- `npm run lint` - Executar linter
- `npm run test` - Executar testes
- `npm run test:watch` - Executar testes em modo watch
- `npm run test:cov` - Executar testes com cobertura

## 📊 Estrutura do Banco

A aplicação cria automaticamente a tabela `inscricoes` com todos os campos necessários para o formulário de inscrição.

## 🔧 Configuração

### Variáveis de Ambiente

- `DB_HOST` - Host do banco de dados
- `DB_PORT` - Porta do banco de dados
- `DB_USERNAME` - Usuário do banco
- `DB_PASSWORD` - Senha do banco
- `DB_DATABASE` - Nome do banco
- `PORT` - Porta da aplicação
- `NODE_ENV` - Ambiente (development/production) 
# 📧 Configuração do Sistema de Email

Este guia explica como configurar o sistema de envio de emails para inscritos do Legacy Camp.

## 🔧 Configuração do Gmail (Recomendado)

### 1. Configurar App Password no Gmail

1. **Acesse sua conta Google**
   - Vá em [myaccount.google.com](https://myaccount.google.com)
   - Faça login na sua conta Gmail

2. **Ativar verificação em duas etapas**
   - Vá em "Segurança"
   - Ative "Verificação em duas etapas"

3. **Gerar App Password**
   - Vá em "Segurança" → "Senhas de app"
   - Selecione "Email" e "Outro (nome personalizado)"
   - Digite "Legacy Camp" como nome
   - Clique em "Gerar"
   - **Copie a senha gerada** (16 caracteres)

### 2. Configurar Variáveis de Ambiente

Adicione ao seu arquivo `.env`:

```env
# Configurações de Email (Gmail)
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-app-password-gerada
```

### 3. Configuração no Railway

No Railway Dashboard, adicione as variáveis:

```env
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-app-password-gerada
```

## 📧 Endpoints Disponíveis

### 1. **Email de Boas-vindas**
```bash
POST /email/welcome
```
```json
{
  "inscricaoId": "1"
}
```

### 2. **Email de Atualização de Status**
```bash
POST /email/status-update
```
```json
{
  "inscricaoId": "1",
  "newStatus": "APROVADA"
}
```

### 3. **Email Personalizado**
```bash
POST /email/custom
```
```json
{
  "inscricaoId": "1",
  "subject": "📢 Informações Importantes",
  "message": "Sua mensagem personalizada aqui..."
}
```

### 4. **Email em Massa**
```bash
POST /email/bulk
```
```json
{
  "inscricaoIds": ["1", "2", "3"],
  "subject": "🎉 Confirmação",
  "message": "Mensagem para todos..."
}
```

### 5. **Teste de Email**
```bash
GET /email/test/1
```

## 🧪 Testando os Endpoints

### 1. **Criar uma inscrição primeiro**
```bash
curl -X POST http://localhost:3000/inscricoes \
  -H "Content-Type: application/json" \
  -d @test-inscricao.json
```

### 2. **Testar email de boas-vindas**
```bash
curl -X POST http://localhost:3000/email/welcome \
  -H "Content-Type: application/json" \
  -d '{"inscricaoId": "1"}'
```

### 3. **Testar email personalizado**
```bash
curl -X POST http://localhost:3000/email/custom \
  -H "Content-Type: application/json" \
  -d @test-email.json
```

## 🔧 Configuração Alternativa (Outros Provedores)

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu-email@outlook.com
EMAIL_PASSWORD=sua-senha
```

### Yahoo
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu-email@yahoo.com
EMAIL_PASSWORD=sua-app-password
```

### Provedor Personalizado
```env
EMAIL_HOST=smtp.seu-provedor.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu-email@seu-dominio.com
EMAIL_PASSWORD=sua-senha
```

## 📋 Templates de Email

### Email de Boas-vindas
- ✅ Nome personalizado
- ✅ Detalhes da inscrição
- ✅ Próximos passos
- ✅ Design responsivo

### Email de Status
- ✅ Status personalizado
- ✅ Mensagem específica por status
- ✅ Design profissional

### Email Personalizado
- ✅ Assunto customizado
- ✅ Mensagem personalizada
- ✅ Formatação HTML

## 🚨 Troubleshooting

### Erro: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Este é o erro mais comum com Gmail. Siga estes passos:**

#### ✅ **Solução 1: Usar App Password (Recomendado)**

1. **Acesse sua conta Google**
   - Vá em [myaccount.google.com](https://myaccount.google.com)
   - Faça login na sua conta Gmail

2. **Ativar verificação em duas etapas (OBRIGATÓRIO)**
   - Vá em "Segurança"
   - Ative "Verificação em duas etapas"
   - Siga as instruções para configurar

3. **Gerar App Password**
   - Vá em "Segurança" → "Senhas de app"
   - Selecione "Email" e "Outro (nome personalizado)"
   - Digite "Legacy Camp" como nome
   - Clique em "Gerar"
   - **Copie a senha gerada** (16 caracteres, formato: `abcd-efgh-ijkl-mnop`)

4. **Atualizar variáveis de ambiente**
   ```env
   EMAIL_USER=seu-email@gmail.com
   EMAIL_PASSWORD=abcd-efgh-ijkl-mnop  # Use a App Password gerada
   ```

#### ✅ **Solução 2: Verificar Configurações**

1. **Verificar se as variáveis estão corretas**
   ```bash
   # No Railway Dashboard ou arquivo .env
   EMAIL_USER=seu-email@gmail.com  # Email completo
   EMAIL_PASSWORD=abcd-efgh-ijkl-mnop  # App Password (16 caracteres)
   ```

2. **Testar localmente primeiro**
   ```bash
   # Teste com curl
   curl -X POST http://localhost:3000/email/test/1
   ```

#### ✅ **Solução 3: Configuração Alternativa**

Se ainda não funcionar, use configuração manual:

```typescript
// No email.service.ts
this.transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: this.configService.get<string>('EMAIL_USER'),
    pass: this.configService.get<string>('EMAIL_PASSWORD'),
  },
  tls: {
    rejectUnauthorized: false
  }
});
```

### Erro: "Connection timeout"
- Verifique as configurações de host e porta
- Teste a conexão manualmente
- Verifique firewall/proxy

### Erro: "Authentication failed"
- Gmail: Use App Password
- Outlook: Ative "Acesso a app menos seguro"
- Yahoo: Use App Password

### Email não chega
- Verifique a pasta de spam
- Teste com email próprio primeiro
- Verifique logs da aplicação

## 📊 Monitoramento

### Logs Importantes
- ✅ Email enviado com sucesso
- ❌ Erro ao enviar email
- 📧 Destinatário e assunto

### Métricas
- Total de emails enviados
- Taxa de sucesso
- Emails por tipo

## 🔒 Segurança

### Boas Práticas
- ✅ Use App Passwords (não senhas normais)
- ✅ Não commite credenciais no código
- ✅ Use variáveis de ambiente
- ✅ Monitore logs de envio

### Configuração Segura
```env
# ✅ Correto
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=abcd-efgh-ijkl-mnop

# ❌ Incorreto
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=minha-senha-normal
```

## 🎯 Próximos Passos

1. ✅ Configurar Gmail com App Password
2. ✅ Adicionar variáveis de ambiente
3. ✅ Testar endpoints localmente
4. ✅ Configurar no Railway
5. ✅ Testar em produção

---

**Status**: ✅ Sistema de email configurado e pronto para uso!

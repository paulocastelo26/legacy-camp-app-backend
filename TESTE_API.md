# 🧪 Guia de Teste da API - Legacy Camp

## 📋 Como Testar

### 1. **Usando Swagger UI**
1. Acesse: http://localhost:3000/api
2. Clique em `POST /inscricoes`
3. Clique em "Try it out"
4. Cole um dos JSONs abaixo
5. Clique em "Execute"

### 2. **Usando cURL**
```bash
curl -X POST http://localhost:3000/inscricoes \
  -H "Content-Type: application/json" \
  -d @test-inscricao.json
```

### 3. **Usando Postman**
- **URL:** `POST http://localhost:3000/inscricoes`
- **Headers:** `Content-Type: application/json`
- **Body:** Raw JSON (cole um dos exemplos abaixo)

## 📄 Exemplos de JSON para Teste

### **Exemplo 1: Membro Lagoinha com Alergias**
```json
{
  "fullName": "João Silva Santos",
  "birthDate": "2005-03-15",
  "age": 19,
  "gender": "masculino",
  "phone": "(11) 98765-4321",
  "email": "joao.silva@email.com",
  "address": "Rua das Flores, 123 - Centro, Manaus - AM, CEP: 69000-000",
  "socialMedia": "@joao_silva (Instagram) / João Silva Santos (Facebook)",
  "emergencyContactName": "Maria Silva Santos",
  "emergencyContactPhone": "(11) 91234-5678",
  "emergencyContactRelationship": "Mãe",
  "isLagoinhaMember": "sim",
  "churchName": "Lagoinha Manaus Sede",
  "ministryParticipation": "Participante do ministério de jovens e líder de grupo de células há 2 anos. Atualmente sou voluntário no ministério de louvor e participo ativamente do GC (Grupo de Células) do bairro Centro.",
  "registrationLot": "lote1",
  "paymentMethod": "pix",
  "paymentProof": "comprovante_pix_joao_silva.pdf",
  "shirtSize": "M",
  "hasAllergy": "sim",
  "allergyDetails": "Alergia a frutos do mar (camarão, lagosta) e intolerância leve à lactose. Em caso de contato, apresento reações cutâneas e gastrointestinais.",
  "usesMedication": "nao",
  "medicationDetails": "",
  "dietaryRestriction": "Intolerância à lactose",
  "hasMinistryTest": "sim",
  "ministryTestResults": "1º Dom: Ensino/Exortação (principal) - 2º Dom: Serviço/Diaconia",
  "prayerRequest": "Peço oração para que eu possa crescer espiritualmente durante o acampamento e desenvolver melhor os dons que Deus me deu. Também peço oração pela minha família e pelos estudos.",
  "imageAuthorization": true,
  "analysisAwareness": true,
  "termsAwareness": true,
  "truthDeclaration": true
}
```

### **Exemplo 2: Não Membro**
```json
{
  "fullName": "Pedro Oliveira Lima",
  "birthDate": "2004-11-08",
  "age": 20,
  "gender": "masculino",
  "phone": "(11) 97777-8888",
  "email": "pedro.lima@email.com",
  "address": "Rua do Comércio, 789 - Centro, Itacoatiara - AM, CEP: 69100-000",
  "socialMedia": "Pedro Lima (Facebook)",
  "emergencyContactName": "Lucia Oliveira",
  "emergencyContactPhone": "(11) 93333-4444",
  "emergencyContactRelationship": "Irmã",
  "isLagoinhaMember": "nao",
  "churchName": "Igreja Batista Betel de Itacoatiara",
  "ministryParticipation": "Participante do ministério de jovens e líder de grupo de estudo bíblico. Também sou voluntário no ministério de música.",
  "registrationLot": "lote1",
  "paymentMethod": "carne",
  "paymentProof": "",
  "shirtSize": "G",
  "hasAllergy": "sim",
  "allergyDetails": "Alergia a amendoim e castanhas. Reação anafilática em caso de ingestão.",
  "usesMedication": "nao",
  "medicationDetails": "",
  "dietaryRestriction": "Vegetariana",
  "hasMinistryTest": "nao",
  "ministryTestResults": "",
  "prayerRequest": "Peço oração para que eu possa conhecer melhor a Deus e encontrar meu propósito através do acampamento.",
  "imageAuthorization": true,
  "analysisAwareness": true,
  "termsAwareness": true,
  "truthDeclaration": true
}
```

### **Exemplo 3: Sem Alergias**
```json
{
  "fullName": "Mariana Santos Silva",
  "birthDate": "2006-02-14",
  "age": 18,
  "gender": "feminino",
  "phone": "(11) 95555-6666",
  "email": "mariana.silva@email.com",
  "address": "Travessa da Paz, 321 - Flores, Manaus - AM, CEP: 69058-000",
  "socialMedia": "@mari_silva (Instagram) / Mariana Silva (Facebook)",
  "emergencyContactName": "Roberto Santos",
  "emergencyContactPhone": "(11) 94444-5555",
  "emergencyContactRelationship": "Pai",
  "isLagoinhaMember": "sim",
  "churchName": "Lagoinha Manaus Torres",
  "ministryParticipation": "Participante do ministério de adolescentes e membro ativo do GC há 1 ano. Sou voluntária no ministério de recepção.",
  "registrationLot": "lote2",
  "paymentMethod": "pix",
  "paymentProof": "comprovante_mariana.pdf",
  "shirtSize": "M",
  "hasAllergy": "nao",
  "allergyDetails": "",
  "usesMedication": "nao",
  "medicationDetails": "",
  "dietaryRestriction": "Nenhuma",
  "hasMinistryTest": "sim",
  "ministryTestResults": "1º Dom: Evangelismo - 2º Dom: Profecia",
  "prayerRequest": "Peço oração para que eu possa ser mais corajosa para evangelizar e que Deus me ajude a discernir melhor Sua vontade para minha vida.",
  "imageAuthorization": true,
  "analysisAwareness": true,
  "termsAwareness": true,
  "truthDeclaration": true
}
```

## ✅ Resposta Esperada

Se tudo estiver funcionando, você receberá uma resposta como:

```json
{
  "id": 1,
  "fullName": "João Silva Santos",
  "birthDate": "2005-03-15T00:00:00.000Z",
  "age": 19,
  "gender": "masculino",
  "phone": "(11) 98765-4321",
  "email": "joao.silva@email.com",
  "address": "Rua das Flores, 123 - Centro, Manaus - AM, CEP: 69000-000",
  "socialMedia": "@joao_silva (Instagram) / João Silva Santos (Facebook)",
  "emergencyContactName": "Maria Silva Santos",
  "emergencyContactPhone": "(11) 91234-5678",
  "emergencyContactRelationship": "Mãe",
  "isLagoinhaMember": "sim",
  "churchName": "Lagoinha Manaus Sede",
  "ministryParticipation": "Participante do ministério de jovens e líder de grupo de células há 2 anos...",
  "registrationLot": "lote1",
  "paymentMethod": "pix",
  "paymentProof": "comprovante_pix_joao_silva.pdf",
  "shirtSize": "M",
  "hasAllergy": "sim",
  "allergyDetails": "Alergia a frutos do mar (camarão, lagosta) e intolerância leve à lactose...",
  "usesMedication": "nao",
  "medicationDetails": "",
  "dietaryRestriction": "Intolerância à lactose",
  "hasMinistryTest": "sim",
  "ministryTestResults": "1º Dom: Ensino/Exortação (principal) - 2º Dom: Serviço/Diaconia",
  "prayerRequest": "Peço oração para que eu possa crescer espiritualmente...",
  "imageAuthorization": true,
  "analysisAwareness": true,
  "termsAwareness": true,
  "truthDeclaration": true,
  "status": "PENDENTE",
  "createdAt": "2025-07-29T23:45:00.000Z",
  "updatedAt": "2025-07-29T23:45:00.000Z"
}
```

## 🔍 Outros Endpoints para Testar

### **Listar todas as inscrições:**
```bash
GET http://localhost:3000/inscricoes
```

### **Buscar inscrição por ID:**
```bash
GET http://localhost:3000/inscricoes/1
```

### **Ver estatísticas:**
```bash
GET http://localhost:3000/inscricoes/stats
```

### **Atualizar status:**
```bash
PATCH http://localhost:3000/inscricoes/1/status
Content-Type: application/json

{
  "status": "APROVADA"
}
```

## 🚨 Possíveis Erros

### **400 - Bad Request**
- Dados obrigatórios faltando
- Formato de email inválido
- Idade fora do range (12-100 anos)

### **500 - Internal Server Error**
- Banco de dados não conectado
- Erro na configuração do .env

## 📞 Suporte

Se houver problemas, verifique:
1. Servidor rodando em http://localhost:3000
2. Banco MySQL conectado
3. Arquivo .env configurado
4. Logs do servidor no terminal 
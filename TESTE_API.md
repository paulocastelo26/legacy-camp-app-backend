# Teste da API de Inscrições

Este documento contém exemplos de JSON para testar o endpoint POST de inscrições.

## Endpoint

```
POST /inscricoes
```

## Exemplos de JSON

### 1. Inscrição Básica (test-inscricao.json)
Exemplo de inscrição sem alergias ou medicações:

```json
{
  "fullName": "João Silva Santos",
  "birthDate": "2000-05-15",
  "age": 24,
  "gender": "masculino",
  "phone": "(31) 99999-9999",
  "email": "joao.silva@email.com",
  "address": "Rua das Flores, 123 - Bairro Centro - Belo Horizonte/MG",
  "socialMedia": "@joaosilva",
  "emergencyContactName": "Maria Silva Santos",
  "emergencyContactPhone": "(31) 88888-8888",
  "emergencyContactRelationship": "Mãe",
  "isLagoinhaMember": "sim",
  "churchName": "Igreja Batista da Lagoinha",
  "ministryParticipation": "Participa do ministério de jovens e música",
  "registrationLot": "lote1",
  "paymentMethod": "pix",
  "paymentProof": "https://exemplo.com/comprovante.jpg",
  "shirtSize": "M",
  "hasAllergy": "nao",
  "allergyDetails": null,
  "usesMedication": "nao",
  "medicationDetails": null,
  "dietaryRestriction": "Nenhuma",
  "hasMinistryTest": "sim",
  "ministryTestResults": "Aprovado no teste de liderança e música",
  "prayerRequest": "Oração pela família e pelo crescimento espiritual",
  "imageAuthorization": true,
  "analysisAwareness": true,
  "termsAwareness": true,
  "truthDeclaration": true
}
```

### 2. Inscrição com Alergias (test-inscricao-com-alergias.json)
Exemplo de inscrição com alergias e medicações:

```json
{
  "fullName": "Ana Paula Costa Oliveira",
  "birthDate": "2002-08-22",
  "age": 22,
  "gender": "feminino",
  "phone": "(11) 98765-4321",
  "email": "ana.costa@email.com",
  "address": "Av. Paulista, 1000 - Bela Vista - São Paulo/SP",
  "socialMedia": "@anacosta (Instagram)",
  "emergencyContactName": "Carlos Costa Oliveira",
  "emergencyContactPhone": "(11) 91234-5678",
  "emergencyContactRelationship": "Pai",
  "isLagoinhaMember": "nao",
  "churchName": "Igreja Presbiteriana do Brasil",
  "ministryParticipation": "Líder do ministério de jovens e participa do coral",
  "registrationLot": "lote2",
  "paymentMethod": "cartao",
  "paymentProof": "https://exemplo.com/comprovante-cartao.pdf",
  "shirtSize": "P",
  "hasAllergy": "sim",
  "allergyDetails": "Alergia a frutos do mar e intolerância à lactose",
  "usesMedication": "sim",
  "medicationDetails": "Vitamina D diária e antialérgico quando necessário",
  "dietaryRestriction": "Intolerância à lactose",
  "hasMinistryTest": "nao",
  "ministryTestResults": null,
  "prayerRequest": "Oração para discernimento sobre o chamado ministerial e pela saúde da família",
  "imageAuthorization": true,
  "analysisAwareness": true,
  "termsAwareness": true,
  "truthDeclaration": true
}
```

## Como Testar

### Usando cURL

```bash
# Teste básico
curl -X POST http://localhost:3000/inscricoes \
  -H "Content-Type: application/json" \
  -d @test-inscricao.json

# Teste com alergias
curl -X POST http://localhost:3000/inscricoes \
  -H "Content-Type: application/json" \
  -d @test-inscricao-com-alergias.json
```

### Usando Postman

1. Abra o Postman
2. Crie uma nova requisição POST
3. URL: `http://localhost:3000/inscricoes`
4. Headers: `Content-Type: application/json`
5. Body: Selecione "raw" e "JSON"
6. Cole um dos exemplos JSON acima
7. Clique em "Send"

### Usando Insomnia

1. Abra o Insomnia
2. Crie uma nova requisição POST
3. URL: `http://localhost:3000/inscricoes`
4. Body: Selecione "JSON"
5. Cole um dos exemplos JSON acima
6. Clique em "Send"

## Validações Importantes

- **Idade**: Deve ser entre 12 e 100 anos
- **Gênero**: Apenas "masculino" ou "feminino"
- **Membro Lagoinha**: Apenas "sim" ou "nao"
- **Lote**: Apenas "lote1" ou "lote2"
- **Pagamento**: Apenas "pix", "cartao" ou "carne"
- **Tamanho da camisa**: Apenas "P", "M", "G", "GG", "XG"
- **Alergia/Medicação**: Apenas "sim" ou "nao"
- **Restrição alimentar**: Valores específicos listados no DTO
- **Teste ministerial**: Apenas "sim" ou "nao"
- **Autorizações**: Todos devem ser `true`

## Campos Opcionais

Os seguintes campos são opcionais e podem ser `null`:
- `paymentProof`
- `allergyDetails` (quando `hasAllergy` é "nao")
- `usesMedication`
- `medicationDetails` (quando `usesMedication` é "nao")
- `ministryTestResults` (quando `hasMinistryTest` é "nao")

## Resposta Esperada

A API deve retornar um status 201 (Created) com os dados da inscrição criada, incluindo o ID gerado automaticamente e os timestamps. 
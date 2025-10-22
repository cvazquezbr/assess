# Campaign Questionnaire Manager - API Documentation

## Visão Geral

A API é construída com **tRPC** e oferece endpoints para autenticação OTP, gerenciamento de questionários e acesso administrativo.

Todos os endpoints estão sob `/api/trpc/` e retornam JSON com tratamento automático de erros.

## Autenticação

### 1. Solicitar Código OTP

**Endpoint**: `auth.requestOtp`  
**Método**: POST  
**Autenticação**: Pública

#### Request
```typescript
{
  phone: string      // Obrigatório: número de telefone (mínimo 10 dígitos)
  email?: string     // Opcional: email do usuário
  name?: string      // Opcional: nome do usuário
}
```

#### Response (Sucesso)
```typescript
{
  success: true
  message: "OTP sent successfully"
  expiresIn: 600     // Segundos até expiração (10 minutos)
}
```

#### Response (Erro)
```typescript
{
  code: "INTERNAL_SERVER_ERROR"
  message: "Failed to send OTP"
}
```

#### Exemplo cURL
```bash
curl -X POST https://api.example.com/api/trpc/auth.requestOtp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+5511999999999",
    "email": "user@example.com",
    "name": "João Silva"
  }'
```

#### Exemplo JavaScript
```javascript
const result = await trpc.auth.requestOtp.mutate({
  phone: "+5511999999999",
  email: "user@example.com",
  name: "João Silva"
});

if (result.success) {
  console.log(`OTP enviado. Expira em ${result.expiresIn} segundos`);
}
```

---

### 2. Verificar Código OTP

**Endpoint**: `auth.verifyOtp`  
**Método**: POST  
**Autenticação**: Pública

#### Request
```typescript
{
  phone: string      // Obrigatório: número de telefone
  code: string       // Obrigatório: código de 6 dígitos
}
```

#### Response (Sucesso)
```typescript
{
  success: true
  user: {
    id: string                    // UUID do usuário
    name?: string
    email?: string
    phone?: string
    role: "user" | "admin"        // Papel do usuário
  }
}
```

#### Response (Erro)
```typescript
{
  code: "UNAUTHORIZED"
  message: "Invalid or expired OTP"
}
```

#### Exemplo cURL
```bash
curl -X POST https://api.example.com/api/trpc/auth.verifyOtp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+5511999999999",
    "code": "123456"
  }'
```

#### Exemplo JavaScript
```javascript
try {
  const result = await trpc.auth.verifyOtp.mutate({
    phone: "+5511999999999",
    code: "123456"
  });
  
  console.log(`Login bem-sucedido! Usuário: ${result.user.name}`);
  // Redirecionar para dashboard
  window.location.href = "/questionnaire";
} catch (error) {
  console.error("OTP inválido ou expirado");
}
```

---

### 3. Logout

**Endpoint**: `auth.logout`  
**Método**: POST  
**Autenticação**: Protegida

#### Response
```typescript
{
  success: true
}
```

#### Exemplo JavaScript
```javascript
await trpc.auth.logout.mutate();
window.location.href = "/";
```

---

### 4. Obter Usuário Atual

**Endpoint**: `auth.me`  
**Método**: GET  
**Autenticação**: Protegida

#### Response
```typescript
{
  id: string
  name?: string
  email?: string
  phone?: string
  role: "user" | "admin"
  createdAt: Date
  lastSignedIn: Date
} | null  // null se não autenticado
```

#### Exemplo JavaScript
```javascript
const user = await trpc.auth.me.useQuery();

if (user.data) {
  console.log(`Bem-vindo, ${user.data.name || user.data.phone}`);
}
```

---

## Questionário

### 5. Obter ou Criar Questionário

**Endpoint**: `questionnaire.getOrCreate`  
**Método**: GET  
**Autenticação**: Protegida

#### Response
```typescript
{
  id: string                      // UUID da resposta
  userId: string                  // Referência ao usuário
  currentStep: number             // 0-10 (seção atual)
  isCompleted: boolean            // Status de conclusão
  completedAt?: Date              // Data de conclusão
  
  // Dados das seções (60+ campos)
  businessPurpose?: string
  productStage?: string
  activeUsers?: string
  sixMonthGoals?: string[]
  // ... mais campos conforme schema
  
  createdAt: Date
  updatedAt: Date
}
```

#### Exemplo JavaScript
```javascript
const questionnaire = await trpc.questionnaire.getOrCreate.useQuery();

if (questionnaire.data) {
  console.log(`Progresso: ${questionnaire.data.currentStep + 1}/11`);
  console.log(`Status: ${questionnaire.data.isCompleted ? 'Completo' : 'Em progresso'}`);
}
```

---

### 6. Atualizar Questionário

**Endpoint**: `questionnaire.update`  
**Método**: POST  
**Autenticação**: Protegida

#### Request
```typescript
{
  id: string                      // UUID da resposta
  data: Record<string, any>       // Dados a atualizar
  currentStep?: number            // Seção atual (opcional)
  isCompleted?: boolean           // Status (opcional)
}
```

#### Response
```typescript
{
  id: string
  userId: string
  currentStep: number
  isCompleted: boolean
  completedAt?: Date
  // ... dados atualizados
  updatedAt: Date
}
```

#### Exemplo JavaScript
```javascript
const updated = await trpc.questionnaire.update.mutate({
  id: "response-id",
  data: {
    businessPurpose: "Desenvolver plataforma de e-commerce",
    productStage: "mvp",
    activeUsers: "1-100"
  },
  currentStep: 0
});

console.log("Questionário atualizado com sucesso");
```

---

### 7. Obter Questionário Específico

**Endpoint**: `questionnaire.get`  
**Método**: GET  
**Autenticação**: Protegida

#### Request
```typescript
{
  id: string  // UUID da resposta
}
```

#### Response
```typescript
{
  id: string
  userId: string
  // ... dados completos
}
```

#### Autorização
- Usuários podem visualizar apenas seus próprios questionários
- Admins podem visualizar qualquer questionário

#### Exemplo JavaScript
```javascript
const response = await trpc.questionnaire.get.useQuery({ 
  id: "response-id" 
});

if (response.data) {
  console.log(response.data);
}
```

---

### 8. Listar Todos os Questionários (Admin)

**Endpoint**: `questionnaire.listAll`  
**Método**: GET  
**Autenticação**: Protegida (Admin only)

#### Response
```typescript
QuestionnaireResponse[]  // Array de todas as respostas
```

#### Autorização
- Apenas usuários com `role: "admin"` podem acessar
- Retorna erro `FORBIDDEN` se não for admin

#### Exemplo JavaScript
```javascript
const allResponses = await trpc.questionnaire.listAll.useQuery();

if (allResponses.data) {
  console.log(`Total de questionários: ${allResponses.data.length}`);
  
  const completed = allResponses.data.filter(r => r.isCompleted).length;
  console.log(`Completos: ${completed}`);
}
```

---

## Estrutura de Dados

### QuestionnaireResponse

```typescript
interface QuestionnaireResponse {
  // Identificadores
  id: string
  userId: string
  
  // Seção 1: Contexto do Negócio
  businessPurpose?: string
  productStage?: string          // ideation | prototype | mvp | operation | scaling
  activeUsers?: string           // none | 1-100 | 100-1000 | 1000-10000 | above10000
  sixMonthGoals?: string[]       // launch-mvp | scale-users | performance | reduce-costs | investment
  hasDeadlineOrInvestment?: boolean
  deadlineOrInvestmentDetails?: string
  
  // Seção 2: Organização e Equipe
  teamStructure?: string         // freelancers | internal | mixed | none
  totalProfessionals?: number
  teamProfiles?: Array<{
    role: string                 // frontend | backend | uxui | pm | architect | devops | qa
    quantity: number
  }>
  dedicationType?: string        // partial | full | ondemand
  fattoRole?: string             // substitute | complement | full-cycle
  
  // Seção 3: Escopo e Ciclo
  fattoEntryPoint?: string       // execution | conception | design | full-cycle
  requirementsProcess?: string   // documented | partial | informal
  plannedFeatures?: number
  validationMethod?: string      // internal | users | none
  
  // Seção 4: Tecnologia e Arquitetura
  mainTechnologies?: string
  systemsCount?: number
  architectureModel?: string     // monolithic | microservices | serverless | undefined
  architectureAutonomy?: string  // full | approval | maintain
  externalIntegrations?: number
  hasCriticalIntegrations?: boolean
  criticalIntegrationsDetails?: string
  
  // Seção 5: DevOps e Entregas
  environments?: string[]        // dev | homolog | prod
  environmentsCount?: number
  provisioningResponsible?: string
  cicdImplemented?: string       // yes | partial | no
  deliveryTools?: string[]       // github-actions | gitlab-ci | jenkins
  monthlyDeploys?: number
  fattoDeployResponsibility?: string
  
  // Seção 6: Suporte e Sustentação
  fattoSustainment?: boolean
  monthlyIncidents?: number
  currentSupport?: string
  slaDuration?: string           // 24h | 48h | 72h | ondemand
  releaseRoadmap?: string        // monthly | quarterly | ondemand | undefined
  
  // Seção 7: Governança
  meetingFrequency?: string      // daily | weekly | biweekly | ondemand
  regularMeetingParticipants?: number
  hasProductOwner?: boolean
  backlogTools?: string
  decisionFormalization?: string // high | medium | low
  
  // Seção 8: Expectativas Comerciais
  contractModel?: string         // fixed | dedicated | hours | hybrid
  billingType?: string           // fixed | delivery | hourly
  startTimeline?: string         // immediate | 30days | 90days | undefined
  budgetRange?: string           // 50k | 50-150k | 150-300k | 300k+ | undefined
  requiredProfessionals?: number
  
  // Seção 9: Riscos e Aprendizados
  previousVendors?: boolean
  vendorCount?: number
  mainDifficulties?: string[]    // deadlines | communication | quality | continuity | costs
  lessonsLearned?: string
  
  // Seção 10: Próximos Passos
  expectedFattoRole?: string[]   // consulting | development | support | devops | qa
  prioritaryDeliverables?: string[] // prototype | mvp | refactor | migration | performance
  shortTermDeliverables?: number
  expectedFattoAutonomy?: string // total | partial | support
  
  // Seção 11: Síntese
  analystNotes?: string
  
  // Metadados
  currentStep: number            // 0-10
  isCompleted: boolean
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

---

## Tratamento de Erros

Todos os erros retornam no formato:

```typescript
{
  code: string      // UNAUTHORIZED | FORBIDDEN | NOT_FOUND | INTERNAL_SERVER_ERROR
  message: string   // Descrição do erro
}
```

### Códigos Comuns

| Código | Significado | Causa |
|--------|------------|-------|
| `UNAUTHORIZED` | Não autenticado | OTP inválido, sessão expirada |
| `FORBIDDEN` | Sem permissão | Tentativa de acessar recurso de outro usuário |
| `NOT_FOUND` | Recurso não existe | ID inválido ou deletado |
| `INTERNAL_SERVER_ERROR` | Erro do servidor | Falha no banco de dados ou SMS |

---

## Rate Limiting

- **OTP**: Máximo 5 requisições por telefone em 1 hora
- **Verificação**: Máximo 3 tentativas por OTP
- **Geral**: 100 requisições por minuto por IP

---

## Exemplos Completos

### Fluxo de Autenticação e Preenchimento

```javascript
// 1. Solicitar OTP
const otpResult = await trpc.auth.requestOtp.mutate({
  phone: "+5511999999999",
  name: "João Silva"
});

console.log(`Código enviado. Expira em ${otpResult.expiresIn}s`);

// 2. Verificar OTP (após receber código)
const authResult = await trpc.auth.verifyOtp.mutate({
  phone: "+5511999999999",
  code: "123456"
});

console.log(`Bem-vindo, ${authResult.user.name}`);

// 3. Obter ou criar questionário
const questionnaire = await trpc.questionnaire.getOrCreate.useQuery();

// 4. Atualizar seção 1
await trpc.questionnaire.update.mutate({
  id: questionnaire.data.id,
  data: {
    businessPurpose: "Desenvolver plataforma SaaS",
    productStage: "mvp",
    activeUsers: "100-1000"
  },
  currentStep: 0
});

// 5. Avançar para próxima seção
await trpc.questionnaire.update.mutate({
  id: questionnaire.data.id,
  data: {
    teamStructure: "mixed",
    totalProfessionals: 5
  },
  currentStep: 1
});

// 6. Completar questionário
const final = await trpc.questionnaire.update.mutate({
  id: questionnaire.data.id,
  data: { analystNotes: "Análise concluída" },
  currentStep: 10,
  isCompleted: true
});

console.log(`Questionário completo em ${final.completedAt}`);
```

---

## Webhooks (Futuro)

Planejado para futuras versões:
- Notificação ao completar questionário
- Alertas para admin
- Integração com CRM

---

## Changelog

### v1.0.0 (Inicial)
- Autenticação OTP
- CRUD de questionários
- Painel administrativo
- 11 seções de formulário


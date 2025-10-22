# Campaign Questionnaire Manager

Uma aplicação React JS com Material-UI para gerenciar o preenchimento de questionários de campanha com autenticação OTP, formulário multi-etapas e painel administrativo.

## 🎯 Funcionalidades Principais

### Autenticação OTP
- **Login seguro** via código de verificação por SMS
- **Código com expiração** de 10 minutos
- **Limite de tentativas** para segurança
- **Recuperação de sessão** automática

### Formulário Multi-Etapas
- **11 seções** bem organizadas cobrindo:
  1. Contexto do Negócio e Solução
  2. Organização e Equipe Atual
  3. Escopo e Ciclo de Desenvolvimento
  4. Tecnologia e Arquitetura
  5. DevOps, Entregas e Ambientes
  6. Suporte, Sustentação e Evolutividade
  7. Governança, Comunicação e Processos
  8. Expectativas Comerciais e Contrato
  9. Riscos e Aprendizados Anteriores
  10. Próximos Passos e Envolvimento
  11. Síntese e Observações

- **Progresso visual** com barra de progresso e indicador percentual
- **Salvamento automático** a cada seção
- **Validação de campos** em tempo real
- **Recuperação de respostas** anteriores

### Painel Administrativo
- **Visualização de todos os questionários** preenchidos
- **Filtros por status** (completo/em progresso)
- **Estatísticas resumidas** (total, completos, em progresso)
- **Detalhes de cada resposta** com timestamps
- **Exportação de dados** (preparado para implementação)

### Design e UX
- **Material-UI (MUI)** para componentes profissionais
- **Gradientes modernos** em cores primárias
- **Responsividade** completa (mobile, tablet, desktop)
- **Acessibilidade** com suporte a teclado
- **Tema claro** com bom contraste

## 🚀 Arquitetura Técnica

### Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Express 4 + tRPC 11
- **Database**: MySQL/TiDB com Drizzle ORM
- **Autenticação**: Manus OAuth + OTP customizado
- **Styling**: Material-UI + Emotion + Tailwind CSS

### Estrutura de Pastas
```
campaign-questionnaire-app/
├── client/
│   └── src/
│       ├── pages/
│       │   ├── Home.tsx              # Landing page
│       │   ├── Auth.tsx              # OTP authentication
│       │   ├── Questionnaire.tsx     # Multi-step form
│       │   └── AdminDashboard.tsx    # Admin panel
│       ├── components/
│       │   └── questionnaire/
│       │       ├── Section1.tsx      # Business Context
│       │       ├── Section2.tsx      # Organization
│       │       └── ...
│       ├── App.tsx                   # Routes
│       └── main.tsx
├── server/
│   ├── routers.ts                    # tRPC procedures
│   ├── db.ts                         # Database helpers
│   └── _core/                        # Framework internals
├── drizzle/
│   └── schema.ts                     # Database schema
└── package.json
```

## 📊 Schema de Banco de Dados

### Tabelas Principais

#### `users`
- `id` (PK): Identificador único
- `name`: Nome do usuário
- `email`: Email (único)
- `phone`: Telefone (único)
- `role`: admin | user
- `loginMethod`: Método de autenticação
- `createdAt`, `lastSignedIn`: Timestamps

#### `otpVerifications`
- `id` (PK): Identificador único
- `phone`: Número de telefone
- `code`: Código OTP (6 dígitos)
- `isVerified`: Status de verificação
- `attempts`: Número de tentativas
- `expiresAt`: Expiração do código

#### `questionnaireResponses`
- `id` (PK): Identificador único
- `userId` (FK): Referência ao usuário
- `currentStep`: Seção atual (0-10)
- `isCompleted`: Status de conclusão
- **Campos de dados**: 60+ campos para armazenar respostas de cada seção
- `createdAt`, `updatedAt`, `completedAt`: Timestamps

## 🔐 Fluxo de Autenticação

1. **Requisição de OTP**
   ```
   POST /api/trpc/auth.requestOtp
   { phone, email?, name? }
   ```

2. **Envio de SMS** (integração necessária)
   - Código de 6 dígitos
   - Válido por 10 minutos
   - Máximo 3 tentativas

3. **Verificação de OTP**
   ```
   POST /api/trpc/auth.verifyOtp
   { phone, code }
   ```

4. **Criação de Sessão**
   - Cookie JWT assinado
   - Válido por 30 dias
   - Renovado automaticamente

## 📝 API tRPC

### Procedures Públicos

#### `auth.requestOtp`
Solicita envio de código OTP para autenticação.

```typescript
input: {
  phone: string        // Obrigatório
  email?: string       // Opcional
  name?: string        // Opcional
}

output: {
  success: boolean
  message: string
  expiresIn: number    // Segundos até expiração
}
```

#### `auth.verifyOtp`
Verifica o código OTP e cria sessão.

```typescript
input: {
  phone: string        // Obrigatório
  code: string         // 6 dígitos
}

output: {
  success: boolean
  user: {
    id: string
    name?: string
    email?: string
    phone?: string
    role: "user" | "admin"
  }
}
```

### Procedures Protegidos

#### `questionnaire.getOrCreate`
Obtém ou cria o questionário do usuário.

```typescript
output: QuestionnaireResponse
```

#### `questionnaire.update`
Atualiza respostas do questionário.

```typescript
input: {
  id: string
  data: Record<string, any>
  currentStep?: number
  isCompleted?: boolean
}

output: QuestionnaireResponse
```

#### `questionnaire.listAll`
Lista todos os questionários (admin only).

```typescript
output: QuestionnaireResponse[]
```

## 🎨 Design System

### Cores Primárias
- **Gradiente Principal**: `#667eea` → `#764ba2` (roxo/azul)
- **Gradiente Sucesso**: `#10b981` → `#059669` (verde)
- **Fundo**: `#f9fafb` (cinza claro)

### Tipografia
- **Headings**: Roboto, fontWeight 700
- **Body**: Roboto, fontWeight 400
- **Captions**: Roboto, fontWeight 400, tamanho reduzido

### Espaçamento
- **Gap padrão**: 3 unidades MUI (24px)
- **Padding container**: 4 unidades (32px)
- **Radius**: 2 unidades (8px)

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 18+
- pnpm 10+
- Banco de dados MySQL/TiDB

### Variáveis de Ambiente
```env
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-secret-key
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_TITLE=Campaign Questionnaire Manager
VITE_APP_LOGO=https://example.com/logo.png
```

### Instalação
```bash
# Instalar dependências
pnpm install

# Configurar banco de dados
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev
```

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 600px
- **Tablet**: 600px - 960px
- **Desktop**: > 960px

### Adaptações
- Layout em grid responsivo
- Botões com tamanho adequado
- Campos de formulário em largura total
- Tabelas com scroll horizontal em mobile

## 🧪 Testes

### Fluxo de Teste Recomendado

1. **Autenticação**
   - [ ] Solicitar OTP com número válido
   - [ ] Verificar recebimento do código
   - [ ] Validar código incorreto
   - [ ] Validar código expirado
   - [ ] Login bem-sucedido

2. **Formulário**
   - [ ] Navegar entre seções
   - [ ] Salvar respostas
   - [ ] Voltar e verificar dados salvos
   - [ ] Completar formulário
   - [ ] Verificar timestamps

3. **Admin Dashboard**
   - [ ] Visualizar lista de questionários
   - [ ] Filtrar por status
   - [ ] Ver detalhes de resposta
   - [ ] Verificar estatísticas

4. **Responsividade**
   - [ ] Testar em mobile (375px)
   - [ ] Testar em tablet (768px)
   - [ ] Testar em desktop (1920px)

## 📈 Próximos Passos

### Melhorias Recomendadas
1. **Integração SMS**
   - Implementar Twilio, AWS SNS ou similar
   - Configurar templates de mensagem

2. **Validação Avançada**
   - Validação customizada por seção
   - Campos obrigatórios dinâmicos
   - Validação cross-field

3. **Exportação de Dados**
   - PDF com respostas formatadas
   - Excel com dados estruturados
   - CSV para análise

4. **Notificações**
   - Email de confirmação
   - Alertas para admin
   - Lembretes de preenchimento

5. **Analytics**
   - Rastreamento de progresso
   - Tempo médio de preenchimento
   - Taxa de conclusão

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs do servidor
2. Validar variáveis de ambiente
3. Confirmar conectividade do banco de dados
4. Revisar console do navegador

## 📄 Licença

Proprietary - FATTO ↔ RAVYZ Partnership


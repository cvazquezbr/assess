# Campaign Questionnaire Manager - Setup Guide

Guia completo para configurar, desenvolver e fazer deploy da aplicação.

## 📋 Pré-requisitos

- **Node.js**: 18.0.0 ou superior
- **pnpm**: 10.0.0 ou superior (ou npm/yarn)
- **MySQL/TiDB**: 5.7+ ou compatível
- **Git**: Para versionamento

## 🚀 Instalação Local

### 1. Clonar o Repositório

```bash
git clone <seu-repositorio>
cd campaign-questionnaire-app
```

### 2. Instalar Dependências

```bash
pnpm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/campaign_questionnaire

# JWT
JWT_SECRET=seu-secret-aleatorio-aqui

# Manus OAuth
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# App
VITE_APP_TITLE=Campaign Questionnaire Manager
VITE_APP_LOGO=https://seu-dominio.com/logo.png

# SMS Service (escolha um)
# Twilio
TWILIO_ACCOUNT_SID=seu-twilio-sid
TWILIO_AUTH_TOKEN=seu-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# AWS SNS (alternativa)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=sua-chave
AWS_SECRET_ACCESS_KEY=seu-secret
```

### 4. Configurar Banco de Dados

```bash
# Criar banco de dados
mysql -u root -p -e "CREATE DATABASE campaign_questionnaire CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Executar migrações
pnpm db:push
```

### 5. Iniciar Servidor de Desenvolvimento

```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`

## 🔧 Integração de SMS

### Opção 1: Twilio

1. Criar conta em https://www.twilio.com
2. Obter credenciais (Account SID, Auth Token)
3. Configurar número de telefone
4. Adicionar ao `.env.local`:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

5. Implementar no `server/routers.ts`:

```typescript
import twilio from 'twilio';

async function sendOtpSms(phone: string, code: string): Promise<boolean> {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    await client.messages.create({
      body: `Seu código de autenticação é: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    return true;
  } catch (error) {
    console.error('SMS error:', error);
    return false;
  }
}
```

### Opção 2: AWS SNS

1. Criar conta AWS
2. Configurar SNS
3. Adicionar ao `.env.local`:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

4. Implementar no `server/routers.ts`:

```typescript
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

async function sendOtpSms(phone: string, code: string): Promise<boolean> {
  const client = new SNSClient({ region: process.env.AWS_REGION });
  
  try {
    await client.send(new PublishCommand({
      Message: `Seu código de autenticação é: ${code}`,
      PhoneNumber: phone,
    }));
    return true;
  } catch (error) {
    console.error('SMS error:', error);
    return false;
  }
}
```

## 📊 Estrutura de Pastas

```
campaign-questionnaire-app/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── lib/              # Utilitários e hooks
│   │   ├── App.tsx           # Roteamento
│   │   └── main.tsx          # Entrada
│   └── public/               # Assets estáticos
├── server/                    # Backend Express + tRPC
│   ├── routers.ts            # Definição de procedures tRPC
│   ├── db.ts                 # Helpers de banco de dados
│   ├── storage.ts            # S3 helpers
│   └── _core/                # Framework internals
├── drizzle/                  # ORM e migrações
│   ├── schema.ts             # Definição de tabelas
│   └── migrations/           # Histórico de migrações
├── shared/                   # Código compartilhado
├── package.json              # Dependências
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
└── README.md                 # Documentação
```

## 🧪 Testes

### Testar Autenticação OTP

```bash
# 1. Solicitar OTP
curl -X POST http://localhost:3000/api/trpc/auth.requestOtp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+5511999999999"}'

# 2. Verificar OTP (use o código recebido)
curl -X POST http://localhost:3000/api/trpc/auth.verifyOtp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+5511999999999", "code": "123456"}'
```

### Testar Questionário

```bash
# Obter ou criar questionário
curl -X GET http://localhost:3000/api/trpc/questionnaire.getOrCreate \
  -H "Authorization: Bearer <seu-token>"

# Atualizar questionário
curl -X POST http://localhost:3000/api/trpc/questionnaire.update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{
    "id": "response-id",
    "data": {"businessPurpose": "..."},
    "currentStep": 0
  }'
```

## 🏗️ Build para Produção

```bash
# Build frontend
pnpm build

# Verificar build
pnpm preview

# Gerar relatório de tamanho
pnpm build --analyze
```

## 🚢 Deploy

### Opção 1: Vercel (Recomendado para Frontend)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Com variáveis de ambiente
vercel env add DATABASE_URL
vercel env add JWT_SECRET
# ... adicione outras variáveis
```

### Opção 2: Docker

Crie um `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

Build e execute:

```bash
docker build -t campaign-questionnaire .
docker run -p 3000:3000 \
  -e DATABASE_URL=mysql://... \
  -e JWT_SECRET=... \
  campaign-questionnaire
```

### Opção 3: Heroku

```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Criar app
heroku create seu-app-name

# Configurar variáveis
heroku config:set DATABASE_URL=mysql://...
heroku config:set JWT_SECRET=...

# Deploy
git push heroku main
```

## 📈 Monitoramento

### Logs

```bash
# Desenvolvimento
pnpm dev

# Produção (Vercel)
vercel logs

# Produção (Docker)
docker logs <container-id>
```

### Métricas

- **Performance**: Usar Lighthouse (Chrome DevTools)
- **Erros**: Integrar Sentry ou similar
- **Analytics**: Configurar Google Analytics ou Plausible

## 🔒 Segurança

### Checklist de Segurança

- [ ] Usar HTTPS em produção
- [ ] Configurar CORS corretamente
- [ ] Validar todas as entradas
- [ ] Usar variáveis de ambiente para secrets
- [ ] Implementar rate limiting
- [ ] Adicionar CSRF protection
- [ ] Configurar headers de segurança (CSP, X-Frame-Options, etc.)
- [ ] Manter dependências atualizadas
- [ ] Fazer backup regular do banco de dados

### Atualizar Dependências

```bash
# Verificar atualizações
pnpm outdated

# Atualizar
pnpm update

# Atualizar major versions
pnpm upgrade --latest
```

## 🐛 Troubleshooting

### Erro: "Cannot find module '@/components/questionnaire/Section1'"

```bash
# Limpar cache e reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Erro: "Database connection failed"

```bash
# Verificar conexão MySQL
mysql -u user -p -h host -e "SELECT 1;"

# Verificar DATABASE_URL
echo $DATABASE_URL

# Recriar banco de dados
pnpm db:push
```

### Erro: "OTP not sending"

1. Verificar credenciais de SMS (Twilio/AWS)
2. Verificar número de telefone (formato internacional)
3. Verificar logs: `pnpm dev`
4. Testar SMS manualmente via console do Twilio/AWS

### Erro: "Port 3000 already in use"

```bash
# Usar porta diferente
pnpm dev -- --port 3001

# Ou matar processo
lsof -i :3000
kill -9 <PID>
```

## 📞 Suporte

Para dúvidas:
1. Consultar documentação em `README.md` e `API.md`
2. Verificar logs do servidor
3. Validar variáveis de ambiente
4. Revisar console do navegador (F12)

## 📚 Recursos Adicionais

- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🎯 Próximos Passos

1. **Completar seções 2-11** do formulário com campos específicos
2. **Implementar validação avançada** com regras customizadas
3. **Adicionar exportação** (PDF, Excel, CSV)
4. **Implementar notificações** (email, SMS)
5. **Configurar analytics** para rastrear uso
6. **Adicionar testes** (unit, integration, e2e)
7. **Configurar CI/CD** (GitHub Actions, GitLab CI)
8. **Fazer deploy** em produção

---

**Última atualização**: Outubro 2025  
**Versão**: 1.0.0


# Nexora Tasks

Um aplicativo completo de gerenciamento de tarefas diárias com suporte a **Mobile (React Native)** e **Desktop (Linux e Windows via Electron)**, com sincronização de dados entre dispositivos.

## ✨ Funcionalidades

- ✅ **CRUD de Tarefas** — Criar, editar, excluir e listar tarefas
- 🔄 **Toggle de status** — Marcar tarefas como pendentes ou concluídas (com visual diferenciado)
- 🔍 **Filtros** — Todas / Pendentes / Concluídas
- 📅 **Data e hora** — Campo de data/hora com agrupamento (Hoje, Amanhã, Esta semana, etc.)
- 🔴 **Tarefas atrasadas** — Destaque visual em vermelho para tarefas vencidas
- 🏷️ **Categorias** — Criar categorias personalizadas com cores; filtrar tarefas por categoria
- 🏷️ **Etiquetas** — Adicionar múltiplas etiquetas a uma tarefa
- 🗑️ **Exclusão com confirmação** — Modal de confirmação antes de excluir
- 🗑️ **Excluir todas concluídas** — Limpar todas as tarefas concluídas de uma vez
- 💾 **Persistência local** — Dados salvos no SQLite (funciona 100% offline)
- 🔄 **Sincronização** — Sync automático com o servidor ao detectar conexão (last-write-wins)
- 📡 **Indicador de sync** — Status de sincronização visível na UI
- 🌙 **Tema claro/escuro** — Toggle manual ou automático baseado no sistema
- 🔔 **Lembretes** — Configurar lembrete por tarefa (5 min, 15 min, 30 min, 1 hora, 1 dia antes)
- 🔒 **Autenticação JWT** — Login e cadastro seguros

## 🏗️ Arquitetura

```
nexora-tasks/
├── apps/
│   ├── mobile/          # React Native (Expo) — Android, iOS, Web
│   └── desktop/         # Electron — Linux e Windows
├── packages/
│   └── shared/          # Tipos, constantes e utils compartilhados
├── server/              # Backend Node.js/Express/Prisma/PostgreSQL
├── package.json         # Monorepo root (Yarn Workspaces)
└── tsconfig.base.json   # TypeScript base config
```

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Mobile | React Native, Expo, TypeScript |
| Desktop | Electron, React Native Web |
| Compartilhado | TypeScript types/utils |
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma |
| Banco de Dados (servidor) | PostgreSQL |
| Banco de Dados (local) | SQLite (expo-sqlite) |
| Auth | JWT (jsonwebtoken) |
| Navegação | React Navigation |
| Armazenamento offline | AsyncStorage + SQLite |

## 🚀 Configuração e Execução

### Pré-requisitos

- Node.js 18+
- Yarn 1.22+ (ou npm 9+)
- PostgreSQL 14+
- Expo CLI (`npm install -g expo-cli`)
- (Opcional) Android Studio ou Xcode para emuladores

### 1. Clonar e instalar dependências

```bash
git clone https://github.com/pedroHen14/nexora-tasks.git
cd nexora-tasks
yarn install
```

### 2. Configurar o banco de dados

```bash
# Criar banco no PostgreSQL
createdb nexora_tasks

# Configurar variáveis de ambiente do servidor
cd server
cp .env.example .env
# Edite o .env com suas credenciais PostgreSQL e um JWT_SECRET seguro
```

Exemplo de `.env`:
```env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/nexora_tasks"
JWT_SECRET="seu-secret-jwt-super-seguro"
PORT=3000
NODE_ENV=development
```

### 3. Executar as migrações do Prisma

```bash
cd server
yarn prisma:generate   # Gera o cliente Prisma
yarn prisma:migrate    # Aplica as migrações no banco
```

### 4. Iniciar o servidor backend

```bash
# Na raiz do monorepo
yarn dev:server

# Ou diretamente
cd server && yarn dev
```

O servidor estará disponível em `http://localhost:3000`.

### 5. Executar o app mobile (Expo)

```bash
# Na raiz do monorepo
yarn dev:mobile

# Ou diretamente
cd apps/mobile && expo start
```

Opções:
- **Android**: pressione `a` para abrir no emulador ou escaneie o QR Code com o Expo Go
- **iOS**: pressione `i` para abrir no simulador ou escaneie o QR Code com a câmera
- **Web**: pressione `w` para abrir no navegador

#### Configurar URL da API no mobile

Crie o arquivo `apps/mobile/.env` (ou `apps/mobile/.env.local`):

```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/api
```

> Use o IP da sua máquina na rede local (não `localhost`) para que o dispositivo físico consiga acessar o servidor.

### 6. Executar o app desktop (Electron)

```bash
# Na raiz do monorepo
yarn dev:desktop

# Ou diretamente
cd apps/desktop && npm run dev
```

Isso iniciará o servidor web Expo e o Electron lado a lado.

## 📦 Build para produção

### Mobile (Android APK / iOS IPA)

```bash
cd apps/mobile
eas build --platform android  # Requer conta Expo e EAS CLI
eas build --platform ios
```

### Desktop (Linux AppImage + DEB / Windows NSIS)

```bash
cd apps/desktop
npm run build
```

Os instaladores serão gerados na pasta `apps/desktop/release/`.

### Servidor

```bash
cd server
yarn build   # Compila TypeScript para dist/
yarn start   # Executa a versão compilada
```

## 🗄️ Modelos de Dados

### Task

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;        // ISO date string (AAAA-MM-DD)
  dueTime?: string;        // HH:mm
  categoryId?: string;
  tags: string[];
  reminder?: ReminderType; // 'none' | '5min' | '15min' | '30min' | '1hour' | '1day'
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
  userId: string;
}
```

### Category

```typescript
interface Category {
  id: string;
  name: string;
  color: string;   // Hex color
  icon?: string;
  userId: string;
}
```

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
```

## 🔌 API REST

Base URL: `http://localhost:3000/api`

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/auth/register` | Cadastrar usuário | ❌ |
| POST | `/auth/login` | Login | ❌ |
| GET | `/auth/me` | Dados do usuário atual | ✅ |
| GET | `/tasks` | Listar tarefas | ✅ |
| POST | `/tasks` | Criar tarefa | ✅ |
| PUT | `/tasks/:id` | Atualizar tarefa | ✅ |
| DELETE | `/tasks/:id` | Excluir tarefa | ✅ |
| DELETE | `/tasks/completed/all` | Excluir todas concluídas | ✅ |
| POST | `/tasks/sync` | Sincronizar tarefas locais | ✅ |
| GET | `/categories` | Listar categorias | ✅ |
| POST | `/categories` | Criar categoria | ✅ |
| PUT | `/categories/:id` | Atualizar categoria | ✅ |
| DELETE | `/categories/:id` | Excluir categoria | ✅ |

> Rotas marcadas com ✅ requerem header `Authorization: Bearer <token>`

## 🔄 Sincronização

A sincronização funciona da seguinte forma:

1. Todas as operações de CRUD são salvas **localmente no SQLite** primeiro
2. Após cada mudança, o app tenta sincronizar com o servidor automaticamente
3. Se não houver conexão, os dados ficam apenas locais
4. Ao conectar novamente, o sync envia as tarefas locais para o servidor
5. Conflitos são resolvidos com **last-write-wins** baseado no campo `updatedAt`
6. O servidor retorna todas as tarefas mergeadas para o cliente

## 🎨 Temas

O app suporta tema claro e escuro:
- **Automático**: segue a preferência do sistema operacional
- **Manual**: toggle na tela de Perfil

## 🔔 Notificações

### Mobile (Expo Notifications)
- Configuradas por tarefa com antecedência (5 min, 15 min, 30 min, 1 hora, 1 dia antes)
- Requer permissão do usuário

### Desktop (Electron + Notification API)
- Notificações nativas do sistema operacional (Linux e Windows)
- Enviadas via IPC do renderer para o processo principal

## 📂 Estrutura de Pastas

```
apps/mobile/src/
├── components/     # TaskItem, FilterBar, SyncIndicator
├── contexts/       # AuthContext, TasksContext, ThemeContext
├── database/       # SQLite (database.ts, taskRepository, categoryRepository)
├── navigation/     # AppNavigator, AuthNavigator, MainNavigator, TasksStack
├── screens/        # auth/, tasks/, categories/, profile/
├── services/       # api.ts, authService.ts, syncService.ts
├── styles/         # theme.ts (light/dark)
└── types/          # navigation.ts

apps/desktop/src/
├── main/           # main.ts (Electron main process), preload.ts

packages/shared/src/
├── types/          # Task, Category, User interfaces
├── constants/      # Colors, default categories, reminder options
└── utils/          # Sorting, filtering, grouping, date formatting

server/src/
├── lib/            # Prisma client singleton
├── middlewares/    # JWT auth middleware
├── routes/         # auth, tasks, categories
└── index.ts        # Express app entry point
```

## 🧹 Linting e Formatação

```bash
# Lint
yarn lint

# Formatar código
yarn format
```

## 📝 Variáveis de Ambiente

### Servidor (`server/.env`)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão PostgreSQL | `postgresql://user:pass@localhost:5432/nexora_tasks` |
| `JWT_SECRET` | Secret para assinar tokens JWT | `my-super-secret` |
| `PORT` | Porta do servidor | `3000` |
| `NODE_ENV` | Ambiente | `development` |

### Mobile (`apps/mobile/.env`)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `EXPO_PUBLIC_API_URL` | URL base da API | `http://192.168.1.100:3000/api` |

## 🤝 Contribuição

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: add minha feature'`
4. Push para a branch: `git push origin feature/minha-feature`
5. Abra um Pull Request

## 📄 Licença

MIT License — veja [LICENSE](LICENSE) para detalhes.

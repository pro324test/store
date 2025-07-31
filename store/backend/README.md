# Backend API

A modern NestJS backend with GraphQL and Prisma ORM following best practices.

## Tech Stack

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications
- **GraphQL**: Query language and runtime for APIs with Apollo Server integration
- **Prisma**: Next-generation ORM for Node.js and TypeScript
- **TypeScript**: For type safety and better developer experience
- **SQLite**: Database (can be changed to PostgreSQL, MySQL, etc.)

## Features

- 🚀 GraphQL API with Apollo Server
- 🗄️ Database management with Prisma ORM
- 🌍 Internationalization (i18n) with nestjs-i18n
- 🏗️ Modular architecture following NestJS best practices
- 🔧 TypeScript for type safety
- 🧪 Testing setup with Jest
- 📝 Code formatting with Prettier
- 🔍 Linting with ESLint

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database configuration
```

3. Generate Prisma client:
```bash
npx prisma generate
```

4. Run database migrations:
```bash
npx prisma migrate dev --name init
```

## Development

### Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run lint` - Lint the code
- `npm run format` - Format the code

### GraphQL Playground

When running in development mode, GraphQL Playground is available at:
```
http://localhost:3000/graphql
```

### Database Management

- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma db push` - Push schema changes to database
- `npx prisma generate` - Generate Prisma client

## Project Structure

```
src/
├── app.module.ts          # Main application module
├── main.ts               # Application entry point
├── generated/            # Auto-generated files (i18n types)
├── i18n/                 # Internationalization files
│   ├── en/              # English translations
│   │   ├── common.json  # Common translations
│   │   └── messages.json# Feature-specific messages
│   └── ar/              # Arabic translations
│       ├── common.json  # Common translations
│       └── messages.json# Feature-specific messages
├── prisma/               # Prisma configuration
│   ├── prisma.module.ts  # Prisma module
│   └── prisma.service.ts # Prisma service
└── user/                 # User module (example)
    ├── user.model.ts     # GraphQL model
    ├── user.module.ts    # User module
    ├── user.resolver.ts  # GraphQL resolver
    └── user.service.ts   # Business logic
```

## Internationalization (i18n)

The application supports multiple languages using nestjs-i18n. Currently supported languages:
- English (en) - Default/Fallback
- Arabic (ar)

### Language Resolution

The application resolves the language in the following order of priority:
1. **Query Parameter**: `?lang=en` or `?lang=ar`
2. **Custom Header**: `x-lang: en` or `x-lang: ar`
3. **Accept-Language Header**: Standard browser header

### API Examples with i18n

#### REST API

Get welcome message in English:
```bash
curl http://localhost:3000/welcome
# Response: "Welcome"
```

Get welcome message in Arabic:
```bash
curl http://localhost:3000/welcome?lang=ar
# Response: "أهلاً وسهلاً"
```

Using custom header:
```bash
curl -H "x-lang: ar" http://localhost:3000/welcome
# Response: "أهلاً وسهلاً"
```

#### GraphQL API

The GraphQL API automatically detects the language from the request context:

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "x-lang: ar" \
  -d '{"query": "mutation { createUser(email: \"user@example.com\") { id email } }"}'
```

### Adding New Languages

1. Create a new language directory in `src/i18n/` (e.g., `src/i18n/fr/`)
2. Add translation files (`common.json`, `messages.json`)
3. The application will automatically detect and load the new language
4. Rebuild the application to generate updated TypeScript types

### Adding New Translations

1. Add new keys to the appropriate JSON files in `src/i18n/[lang]/`
2. Use TypeScript autocomplete with the generated types in `src/generated/i18n.generated.ts`
3. In services, inject `I18nService` and use: `this.i18n.translate('key.path')`

## API Examples

### GraphQL Queries

Get all users:
```graphql
query {
  users {
    id
    email
    name
  }
}
```

Get a specific user:
```graphql
query {
  user(id: 1) {
    id
    email
    name
  }
}
```

Create a user:
```graphql
mutation {
  createUser(email: "user@example.com", name: "John Doe") {
    id
    email
    name
  }
}
```

## Best Practices Implemented

### NestJS Best Practices
- **Modular Architecture**: Each feature is organized in its own module following NestJS conventions
- **Dependency Injection**: Using NestJS's built-in DI container for loose coupling
- **Type Safety**: Full TypeScript implementation with strict typing
- **Configuration Management**: Using @nestjs/config for environment variables
- **Error Handling**: Proper exception handling and HTTP status codes
- **Testing**: Comprehensive Jest testing framework setup with unit tests

### Prisma Best Practices
- **Type-Safe Database Operations**: Using Prisma's generated client for type safety
- **Database Abstraction**: Clean separation between database layer and business logic
- **Migration Management**: Proper database versioning with Prisma migrations
- **Connection Management**: Efficient database connection handling
- **Schema Design**: Following relational database design principles

### Internationalization Best Practices
- **Multi-Language Support**: Complete i18n implementation with nestjs-i18n
- **Language Resolution**: Multiple resolution strategies (query, header, accept-language)
- **Type Safety**: Generated TypeScript types for translation keys
- **Fallback Strategy**: English as default fallback language
- **Asset Management**: Proper translation file organization and build integration
- **Context Awareness**: GraphQL context integration for language detection

### Code Quality
- **ESLint and Prettier**: Automated code formatting and linting
- **Git Integration**: Proper .gitignore configuration for generated files
- **Build Optimization**: Efficient asset copying and compilation
- **Development Experience**: Hot reload and watch mode for rapid development
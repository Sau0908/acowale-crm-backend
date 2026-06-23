# Acowale CRM — Backend

Customer feedback platform API built with Node.js, Express, TypeScript, and PostgreSQL.

## Tech Stack

- **Node.js + Express** — REST API
- **TypeScript** — Type safety
- **PostgreSQL** — Database (hosted on Neon)
- **Prisma ORM** — Database client and migrations
- **Zod** — Request validation
- **Morgan** — Request logging

## API Endpoints

| Method | Endpoint                   | Description                                   |
| ------ | -------------------------- | --------------------------------------------- |
| GET    | `/`                        | Server status                                 |
| GET    | `/health`                  | Health check                                  |
| POST   | `/api/feedback`            | Submit feedback                               |
| GET    | `/api/feedback`            | Get all feedback (filter, search, pagination) |
| GET    | `/api/feedback/analytics`  | Analytics summary                             |
| PATCH  | `/api/feedback/:id/status` | Update feedback status                        |

## Getting Started

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your DATABASE_URL in .env

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
PORT=8000
NODE_ENV=development
```

## Project Structure

```
src/
├── index.ts                  → App entry point
├── routes/
│   └── feedback.ts           → Route definitions
├── controllers/
│   └── feedbackController.ts → Request handlers
├── middleware/
│   ├── errorHandler.ts       → Global error handler
│   └── validate.ts           → Zod validation middleware
├── schemas/
│   └── feedbackSchema.ts     → Zod schemas and types
└── db/
    └── prisma.ts             → Prisma client singleton
prisma/
└── schema.prisma             → Database schema
```

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run db:migrate # Run migrations
npm run db:studio  # Open Prisma Studio
```

## Related

- **Frontend Repository** — Next.js + TypeScript + Tailwind CSS
- **DECISIONS.md** — Engineering decisions, trade-offs, and rationale
- **TEACH_US.md** — Engineering practice suggestion for Acowale

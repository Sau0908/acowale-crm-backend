# Engineering Decision Log — Acowale CRM Machine Test

---

## 1. Why did you choose this technology stack?

**Backend: Node.js + Express + TypeScript**
I chose Node.js with Express because it is lightweight, fast to set up, and well-suited for building REST APIs. TypeScript was added on top to catch type errors early and make the codebase more maintainable. Express gave me full control over the request-response cycle without unnecessary abstractions.

**Frontend: Next.js + TypeScript + Tailwind CSS**
Next.js with App Router made sense because it handles routing, SSR, and project structure out of the box. Tailwind CSS allowed UI development without writing custom CSS files (inline css ). TypeScript ensured type safety across the frontend also.

**Validation: Zod**
Zod was used for schema validation on both the API input and frontend forms. It integrates cleanly with TypeScript and gives runtime type safety which plain TypeScript interfaces cannot provide.

**ORM: Prisma**
Prisma was chosen because it provides a type-safe database client, readable schema definitions, and built-in migration tooling. It reduced the chances of writing incorrect SQL and sped up development.

---

## 2. Why did you choose this database?

**PostgreSQL (hosted on Neon)**

PostgreSQL is a production-grade relational database that handles structured data well.
Since feedback data has a fixed schema with categories and statuses, a relational database was a fit instead of NoSQL.

Instead of using the local database connections I used Neon (Hosted Version of PostgreSQL ) that is publicly accessible, which was necessary for the live deployment requirement.

I used **Prisma Enums** for `FeedbackCategory` and `FeedbackStatus` since these are fixed values that are unlikely to change .This keeps the schema simple and avoids the need for tables like for the category or status.

---

## 3. Why did you structure your application this way?

**Backend structure: routes → controllers → services (db)**

I followed a layered architecture:

- `routes/` handles only URL mapping
- `controllers/` handles request/response logic
- `db/prisma.ts` is a singleton Prisma client
- `schemas/` holds all Zod validation schemas
- `middleware/` holds reusable middleware like error handling and validation

This separation makes each layer independently testable and easy to extend. If a new developer joins, they can find the right file without reading the entire codebase.

**Frontend structure: app/ + components/ + services/ + types/**

- `app/` contains only page-level files (Next.js App Router convention)
- `components/` holds reusable UI pieces
- `services/` centralises all API calls so components never call `fetch` directly
- `types/` and `constants/` are shared across the app

This structure avoids scattering API logic across components and makes it easy to swap the backend URL or add error handling in one place.

---

## 4. What trade-offs did you make due to time constraints?

- **No authentication** — The dashboard is publicly accessible. In production, the admin dashboard would be behind JWT-based auth or session-based login.
- **No rate limiting** — The feedback submission endpoint has no rate limiting. A bad actor could spam the database. In production, I would add `express-rate-limit`.
- **No unit tests** — Due to time constraints, automated tests were not written. I manually tested all API endpoints using curl.
- **No pagination UI on dashboard** — The frontend shows recent feedbacks but full pagination controls were simplified.
- **No file uploads** — Feedback is text-only. Attachments or screenshots would be a useful real-world addition.

---

## 5. What would you improve if you had one more week?

- Add JWT-based authentication for the admin dashboard
- Write unit tests for controllers and integration tests for APIs using Supertest
- Add rate limiting on the feedback submission endpoint
- Add email notifications when new feedback is submitted (Nodemailer)
- Improve the dashboard with date range filters and trend charts over time
- Set up a proper CI/CD pipeline using GitHub Actions
- Add request ID tracing for better observability across logs

---

## 6. What was the most difficult technical challenge you faced?

The most unexpected challenge was **Prisma v7's breaking change** — the new engine type requires either an `adapter` or `accelerateUrl` to be passed to the `PrismaClient` constructor, which is a significant departure from v5 and v6 behaviour. The error message was not immediately clear.

I resolved it by downgrading to Prisma v5 which has straightforward configuration and does not require adapters for standard PostgreSQL connections. This also taught me to always pin dependency versions in production projects rather than relying on the latest tag.

---

## 7. Which AI tools did you use?

- **Claude (Anthropic)** — Used throughout the project for debugging, architecture decisions, and writing documentation.

---

## 8. Share one instance where AI helped you.

When I hit the Prisma v7 `PrismaClientConstructorValidationError` about missing `adapter` or `accelerateUrl`, AI quickly identified that this was a breaking change introduced in Prisma v7 and suggested downgrading to v5.22.0 as the fastest fix. What could have taken an hour of reading changelogs was resolved in minutes. It helped me keep momentum rather than getting stuck on a tooling issue.

---

## 9. Share one instance where you disagreed with AI and why.

AI initially suggested creating separate `FeedbackCategory` and `FeedbackStatus` database tables with foreign key relationships to the `Feedback` model.
While this is technically more flexible, I disagreed because the categories and statuses in this application are fixed and will not change at runtime. Creating separate tables would add unnecessary joins . I overrode the suggestion and used Prisma enums instead, which are enforced at the database level.

---

## 10. What would break first if this application suddenly had 100,000 users?

The **database connection pool** would be the first bottleneck. Neon's free tier has connection limits, and with 100,000 concurrent users, the PostgreSQL connection pool would exhaust quickly. Each request opens a Prisma connection and without pooling configured at the infrastructure level, the database would start rejecting connections.

The second thing to break would be the **feedback submission endpoint** — without rate limiting, a spike in traffic could flood the database with writes and slow down read queries for the dashboard.

Fixes would include: Adding a queue (like BullMQ or Redis) for write operations, and putting a CDN + cache layer in front of the analytics endpoint since that data does not need to be real-time.

---

## 11. What is one thing in this assignment that you would improve, change, or challenge?

I would challenge the scope of the **admin dashboard being completely open with no authentication**. The assignment describes it as an "AdminConsole" but does not require authentication as a core requirement — only as a bonus. In a real product, exposing feedback data including customer emails and comments without any access control would be a privacy and compliance issue from day one.

I would make basic authentication a core requirement, even if it is just a simple one . It sets the right engineering mindset from the start — security should not be an afterthought.

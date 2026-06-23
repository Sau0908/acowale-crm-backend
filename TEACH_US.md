# TEACH_US.md

## Architecture Decision Records (ADRs)

Most engineering teams lose context when developers leave or months pass. ADRs solve this by documenting _why_ a decision was made, not just _what_ was decided.

```
# ADR-001: Use PostgreSQL over MongoDB

## Status: Accepted
## Context: Need a database for structured feedback with a fixed schema.
## Decision: PostgreSQL
## Reason: Relational data, type-safe queries via Prisma, strong consistency.
## Trade-off: Schema migrations required for changes.
```

A simple `DECISIONS.md` folder can become a valuable knowledge base over time, helping new engineers understand architectural choices quickly and reducing repeated discussions about past decisions.

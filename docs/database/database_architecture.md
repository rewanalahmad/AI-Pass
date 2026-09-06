                    FastAPI
                       │
                Service Layer
                       │
                  SQLAlchemy
                       │
                       ▼
              Supabase PostgreSQL


Supabase
├── PostgreSQL       ← relational application state
├── Auth             ← only if team chooses it
├── Storage          ← files/documents where appropriate
└── pgvector         ← potentially later for Knowledge/RAG

Database source of truth:
Supabase PostgreSQL

ORM:
SQLAlchemy

Schema evolution:
Versioned migrations

Do not use:
new ad-hoc JSON/in-memory stores
for durable platform state
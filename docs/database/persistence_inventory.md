| Area                | Current storage        | Decision                           |
| ------------------- | ---------------------- | ---------------------------------- |
| Core ORM            | SQLAlchemy             | KEEP                               |
| Supabase/Postgres   | primary DB             | KEEP                               |
| `app/db/session.py` | SQLite                 | DEPRECATE/REVIEW                   |
| Tenant state        | Python dict            | MIGRATE                            |
| Provider registry   | Python list            | MIGRATE                            |
| Agent models        | Postgres ORM           | EXTEND                             |
| Workflow versions   | Postgres ORM           | NORMALIZE                          |
| Audit               | Postgres ORM           | KEEP                               |
| HR                  | Postgres/domain models | KEEP                               |
| Compliance          | partly memory          | DEFER/MIGRATE                      |
| JSON registries     | JSON files             | REVIEW                             |
| RAG vectors         | FAISS                  | KEEP outside relational DB for now |

Primary DB:
Supabase PostgreSQL

ORM:
SQLAlchemy

Current DB connection:
app/core/db/database.py

Current table creation:
Base.metadata.create_all()

Other persistence mechanisms found:
- Supabase SDK
- SQLite fallback
- second hardcoded SQLite session
- JSON registries
- in-memory tenant storage
- hardcoded provider/model registry


Missing:
- organizations
- workspaces
- workspace memberships
- proper RBAC
- provider/model persistence
- migration framework

Inconsistent:
- UUID/String/Integer IDs
- timestamp formats
- tenant_id without FK
- duplicated auth implementations
- duplicated DB/session paths
- workflow representations
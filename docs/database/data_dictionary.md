organizations:
| Column       | Type        | Purpose                        |
| ------------ | ----------- | ------------------------------ |
| `id`         | UUID        | Primary key                    |
| `name`       | TEXT        | Organization name              |
| `slug`       | TEXT        | Unique organization identifier |
| `status`     | TEXT/ENUM   | active/suspended               |
| `created_at` | TIMESTAMPTZ | creation time                  |
| `updated_at` | TIMESTAMPTZ | last update                    |


workspaces

| Column            | Type        |
| ----------------- | ----------- |
| `id`              | UUID        |
| `organization_id` | UUID FK     |
| `name`            | TEXT        |
| `slug`            | TEXT        |
| `status`          | TEXT        |
| `created_at`      | TIMESTAMPTZ |
| `updated_at`      | TIMESTAMPTZ |


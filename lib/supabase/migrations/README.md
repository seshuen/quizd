# Database Migrations

This directory contains SQL migration files for the Supabase database.

## Available Migrations

### `get_distinct_categories.sql`

**Purpose:** Optimize category filtering in the CategoryFilter component.

**What it does:**
- Creates a PostgreSQL function `get_distinct_categories()` that efficiently returns unique category values from the topics table
- Prevents the need to fetch all topic rows just to extract unique categories
- Significantly improves performance when you have many topics

**How to apply:**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `get_distinct_categories.sql`
4. Click **Run** to execute the migration

**Performance Impact:**
- **Before:** Fetches ALL topics (N rows) → Extracts categories in JavaScript → De-duplicates
- **After:** Database returns only unique categories (typically 5-10 rows)

**Backwards Compatibility:**
The CategoryFilter component automatically falls back to the old method if this function doesn't exist, so the migration is optional but recommended.

## Creating New Migrations

When adding new database functions or schema changes:

1. Create a new `.sql` file in this directory
2. Use descriptive names (e.g., `add_user_streak_tracking.sql`)
3. Add comments explaining what the migration does
4. Update this README with migration instructions
5. Test the migration in a development environment first

## Best Practices

- ✅ Always add comments to your SQL
- ✅ Make migrations idempotent (use `CREATE OR REPLACE`)
- ✅ Document the purpose and impact
- ✅ Test with real data before deploying to production
- ❌ Never drop tables without a backup
- ❌ Don't commit sensitive data or credentials

# Database Setup

This project uses Supabase as the database backend.

## Database Seeding

Database seeding is handled through custom scripts that are **not committed to version control** for security and environment-specific reasons.

### How to Seed the Database

1. **Set up your environment variables**
   - Ensure you have the following in your `.env.local` file:
     ```
     SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ```

2. **Prepare your seed data**
   - Create a `data/questions.json` file with your topics and questions
   - Format should include:
     - `topics`: Array of topic objects with `slug` and other properties
     - `questions`: Array of question objects with `topic`, `question_text`, `correct_answer`, `incorrect_answers`, and `difficulty`

3. **Create the seeding script**
   - The seed script should be placed in `scripts/seed-database.ts`
   - It should handle inserting topics and questions into the database
   - Use the Supabase service role key for database operations

4. **Run the seeding process**
   - Execute the seed script using: `npx tsx scripts/seed-database.ts`
   - Or add a script to `package.json`: `"seed": "npx tsx scripts/seed-database.ts"`

## Database Schema

The database includes the following main tables:

- **profiles**: User profile information
- **topics**: Quiz topics/categories
- **questions**: Quiz questions with answers and difficulty levels

## Notes

- Seeding scripts are excluded from version control to prevent accidental commits of sensitive data or environment-specific configurations
- Always use environment variables for database credentials
- Never commit the service role key to the repository

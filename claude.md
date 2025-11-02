# QuizD Project Rules

## Meta Rules

- No emojis in code, comments, or documentation
- Keep rules simple and concise
- Prefer clear examples over explanations

## React Hooks - MANDATORY

1. **Call all hooks BEFORE any conditional returns**
   - Violating this breaks React's Rules of Hooks
   - Move useMemo/useCallback/useEffect to top of component

2. **Memoize expensive computations with useMemo**
   - Arrays/objects that shouldn't change on re-render
   - Example: `useMemo(() => [...items].sort(), [dependency])`

3. **Memoize client instances with useMemo**
   - Database clients, API clients must be created once
   - Example: `const supabase = useMemo(() => createClient(), [])`

4. **Include ALL dependencies in dependency arrays**
   - useEffect, useCallback, useMemo must list all dependencies
   - Missing dependencies cause stale closures

## Database Queries - MANDATORY

**Avoid N+1 queries - use Supabase joins:**

```typescript
// CORRECT - Single query with join
const { data } = await supabase
  .from('game_sessions')
  .select(`*, topics!inner(name, slug)`)
  .eq('id', sessionId)

// WRONG - Multiple queries (N+1 pattern)
const session = await supabase.from('game_sessions').select('*')
const topic = await supabase.from('topics').select('*').eq('id', session.topic_id)
```

## Test-Driven Development

**TDD is REQUIRED for:**
- New business logic functions
- Bug fixes (write failing test first)
- Complex utility functions
- Form validation

**TDD is OPTIONAL for:**
- Performance fixes (hooks, memoization, query optimization)
- UI styling changes
- Implementing from detailed specs
- Simple refactoring

**When using /project:implement:**
- Spec file acts as test specification
- Implement what's in the spec
- Write verification tests after if needed

## Testing Requirements

- Mock all Supabase/database calls (use sinon)
- Tests in `test/**/*.test.ts(x)`
- Run `npm test` before committing

## Dev Server Management

**ALWAYS use `npm run dev:restart` when starting dev server during testing**

DO NOT use `npm run dev` directly - it creates duplicate server instances.

## Common Mistakes - DO NOT

1. Call hooks after conditional returns
2. Create new client instances on every render
3. Have missing dependencies in useEffect/useCallback
4. Make multiple sequential database queries when joins work
5. Compute expensive values on every render without memoization
6. Use `npm run dev` when testing (use `npm run dev:restart` instead)

## Commit Message Format

```
<type>: <short summary>

- <change 1>
- <change 2>
```

Types: feat, fix, refactor, perf, test, docs, chore

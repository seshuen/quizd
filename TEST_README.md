# Testing Documentation

## Overview
This project uses **Mocha** as the testing framework with **Chai** for assertions. Tests use fake Supabase credentials to avoid real database calls.

## Test Structure

```
test/
├── setup.ts                      # Global test setup with fake credentials
├── lib/
│   ├── supabase/
│   │   └── client.test.ts       # Browser client tests
│   └── utils.test.ts             # Utility function tests
└── components/
    └── ui/
        ├── Button.test.tsx       # Button component tests
        └── Input.test.tsx        # Input component tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Test Results

✅ **42 passing tests**

- **5 tests** for Supabase client creation
- **8 tests** for utility functions (cn)
- **14 tests** for Button component
- **15 tests** for Input component

## Mocking Strategy

Instead of using complex mocking libraries, we use **fake Supabase credentials**:

```typescript
// In test/setup.ts
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fake-test-project.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-jwt-token';
```

This allows the Supabase client to be created without making real API calls. All database operations will fail gracefully, which is perfect for unit testing pure functions and components.

## Writing Tests

### Basic Test Structure

```typescript
import { expect } from 'chai';

describe('Feature Name', () => {
  it('should do something', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = someFunction(input);

    // Assert
    expect(result).to.equal('expected');
  });
});
```

### Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).to.exist;
  });
});
```

## Test Coverage

### ✅ What's Tested:
- **lib/utils.ts** - `cn()` class name utility function
- **lib/supabase/client.ts** - Browser Supabase client creation
- **components/ui/Button.tsx** - All variants, sizes, and props
- **components/ui/Input.tsx** - All types, labels, errors, and props

### Functions Tested:
1. **cn()** - Class name merging with Tailwind support
2. **createClient()** - Supabase client factory function
3. **Button** - Rendering, variants, sizes, disabled states
4. **Input** - Rendering, types, labels, error messages, accessibility

## Test Configuration

- **.mocharc.json**: Mocha configuration
- **tsconfig.node.json**: TypeScript config for tests (CommonJS)
- **test/setup.ts**: Global setup with fake credentials and DOM

## Best Practices

### ✅ DO:
- Test pure functions and component logic
- Use descriptive test names
- Test edge cases and different variants
- Keep tests focused and isolated
- Use fake credentials for Supabase

### ❌ DON'T:
- Make real database calls in tests
- Test implementation details
- Write tests that depend on other tests
- Skip writing tests for "simple" code

## TDD Workflow

Follow the Red-Green-Refactor cycle:

1. **🔴 RED** - Write a failing test
2. **🟢 GREEN** - Write minimal code to pass
3. **🔵 BLUE** - Refactor while keeping tests green

See [.claude/TDD_GUIDELINES.md](.claude/TDD_GUIDELINES.md) for detailed TDD practices.

## Examples

### Testing a Utility Function

```typescript
describe('cn()', () => {
  it('should merge class strings', () => {
    const result = cn('btn', 'btn-primary');
    expect(result).to.equal('btn btn-primary');
  });

  it('should handle conditionals', () => {
    const isActive = true;
    const result = cn('btn', isActive && 'active');
    expect(result).to.equal('btn active');
  });
});
```

### Testing a Component

```typescript
describe('Button', () => {
  it('should render with primary variant', () => {
    render(<Button variant="primary">Click</Button>);
    const button = screen.getByRole('button');
    expect(button.className).to.include('bg-blue-600');
  });

  it('should handle onClick', () => {
    let clicked = false;
    render(<Button onClick={() => { clicked = true; }}>Click</Button>);
    screen.getByRole('button').click();
    expect(clicked).to.be.true;
  });
});
```

## Debugging Tests

### Run specific test file:
```bash
npx mocha test/lib/utils.test.ts
```

### Common Issues:

**Module not found**: Check that tsconfig-paths is configured

**React not defined**: Ensured React is imported globally in setup.ts

**Timeout**: Increase timeout in .mocharc.json

## Future Improvements

1. **Integration Tests**: Test full user workflows
2. **E2E Tests**: Add Playwright or Cypress
3. **Coverage Reports**: Add nyc/istanbul for coverage
4. **CI/CD Integration**: Run tests in GitHub Actions

## Resources

- [TDD Guidelines](.claude/TDD_GUIDELINES.md)
- [Mocha Documentation](https://mochajs.org/)
- [Chai Assertions](https://www.chaijs.com/)
- [Testing Library](https://testing-library.com/react)

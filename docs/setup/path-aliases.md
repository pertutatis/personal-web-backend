# Path Aliases Configuration

This document describes how to configure path aliases (like `@/`) in the project to enable absolute imports.

## Configuration Steps

### 1. Update tsconfig.json

Add the following configuration to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 2. Update next.config.js

Add the following configuration to your `next.config.js`:

```javascript
const nextConfig = {
  experimental: {
    esmExternals: 'loose'
  }
};

module.exports = nextConfig;
```

### 3. Create jsconfig.json

Create a `jsconfig.json` file in the root directory with the following content:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Usage

After configuring the path aliases, you can use them in your imports:

```typescript
// Instead of relative imports like:
import { Book } from "../../../domain/Book";

// You can use absolute imports with the @ alias:
import { Book } from "@/contexts/blog/book/domain/Book";
```

## Benefits

1. Cleaner imports - No more long relative paths with multiple "../"
2. More maintainable - Moving files around doesn't break imports
3. Better IDE support - Better autocompletion and type checking
4. Consistent - All imports follow the same pattern

## Troubleshooting

If imports are not working:

1. Make sure all configuration files are properly set up
2. Restart your TypeScript server in VS Code
3. Restart your development server
4. Clear your Next.js cache (`.next` folder)

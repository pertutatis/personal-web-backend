import { TestHelper } from '@/contexts/shared/infrastructure/__tests__/TestHelper';

declare global {
  namespace NodeJS {
    interface Global {
      TestHelper: typeof TestHelper;
    }
  }

  var TestHelper: typeof TestHelper;
}

export {};

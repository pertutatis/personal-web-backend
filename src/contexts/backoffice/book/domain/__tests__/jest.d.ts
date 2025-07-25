import { Pool } from 'pg'

declare global {
  namespace NodeJS {
    interface Global {
      __TEST_POOLS__: Record<string, Pool>
    }
  }

  var __TEST_POOLS__: Record<string, Pool>
}

export {}

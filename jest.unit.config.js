const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './'
});

const customJestConfig = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '**/domain/__tests__/**/*.test.ts',
    '**/application/__tests__/**/*.test.ts'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/domain/**/*.ts',
    'src/**/application/**/*.ts',
    '!src/**/*.d.ts',
    '!src/types/**/*.ts'
  ],
  coverageDirectory: 'coverage/unit',
  coverageReporters: ['text', 'lcov'],
  // Run tests in parallel for unit tests
  maxWorkers: '50%',
  // Setup global test timeout
  testTimeout: 5000
};

module.exports = createJestConfig(customJestConfig);

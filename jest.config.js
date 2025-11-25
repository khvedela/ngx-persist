module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  moduleNameMapper: {
    '^ngx-persist$': '<rootDir>/projects/ngx-persist/src/public-api.ts',
    '^ngx-persist/(.*)$': '<rootDir>/projects/ngx-persist/src/lib/$1'
  },
  transform: {
    '^.+\.(ts|js|html)$': ['jest-preset-angular', {
      tsconfig: '<rootDir>/projects/ngx-persist/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    }],
  },
};
/**
 * Jest configuration for frontend tests
 */
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/tests/__mocks__/fileMock.js'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/tests/**',
    '!src/**/*.stories.{js,jsx}'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx}'
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  extensionsToTreatAsEsm: ['.jsx'],
  transformIgnorePatterns: [
    '/node_modules/(?!(axios)/)'
  ]
};
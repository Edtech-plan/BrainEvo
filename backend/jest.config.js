const path = require('path');

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/backend/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/main.js',
    '!src/routes.js',
  ],
  setupFilesAfterEnv: [path.join(__dirname, '../tests/backend/setup.js')],
  roots: [path.join(__dirname, '..')],
  moduleNameMapper: {
    '^backend/(.*)$': '<rootDir>/$1',
  },
  coveragePathIgnorePatterns: ['/node_modules/', '/api/'],
  testPathIgnorePatterns: ['/node_modules/'],
};

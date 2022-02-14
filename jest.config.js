module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/(services|middleware)/*.js'],
  testMatch: ['**/*.test.js'],
  testPathIgnorePatterns: ['./node_modules/'],
  silent: false,
  forceExit: true,
  verbose: true,
  testEnvironment: 'node',
};

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  rules: {
    quotes: [1, 'single', 'avoid-escape'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-extra-semi': 'off',
    '@typescript-eslint/no-case-declarations': 'off',
    '@typescript-eslint/no-async-promise-executor': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
  env: {
    browser: true,
    node: true,
  },
}

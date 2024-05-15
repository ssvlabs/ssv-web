module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
  ignorePatterns: ['build', '.eslintrc.cjs', 'scripts', 'config', '**/*.css', '**/*.scss'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    '@typescript-eslint/no-loss-of-precision': 'off',
    'no-prototype-builtins': 'off',
    'no-extra-boolean-cast': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
  }
};

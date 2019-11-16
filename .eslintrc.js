module.exports = {
  extends: ['plugin:prettier/recommended'],

  plugins: ['prettier'],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    'prettier/prettier': 'error',
    'function-paren-newline': 0,
    'function-call-argument-newline': 0,
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: 'never',
        ObjectPattern: 'never',
        ImportDeclaration: 'never',
        ExportDeclaration: 'never'
      }
    ],
    'object-property-newline': 0
  }
};

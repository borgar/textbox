import jsdoc from 'eslint-plugin-jsdoc';
import stylistic from '@stylistic/eslint-plugin';

export default [
  jsdoc.configs['flat/recommended'],

  {
    plugins: {
      jsdoc: jsdoc,
    },
    settings: {
      jsdoc: {
        tagNamePreference: {
          property: 'prop',
          returns: 'return'
        }
      }
    },
    rules: {
      'jsdoc/tag-lines': [ 'error', 'any', { startLines: 1 } ],
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-property-description': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/check-alignment': 'off',
      'jsdoc/no-defaults': 'off'
    }
  },

  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module'
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/array-bracket-newline': [ 'error', 'consistent' ],
      '@stylistic/array-bracket-spacing': [ 'error', 'always' ],
      '@stylistic/array-element-newline': [ 'error', 'consistent' ],
      '@stylistic/arrow-parens': [ 'error', 'as-needed' ],
      '@stylistic/arrow-spacing': [ 'error', { before: true, after: true } ],
      '@stylistic/block-spacing': [ 'error', 'always' ],
      '@stylistic/brace-style': [ 'error', 'stroustrup', { allowSingleLine: true } ],
      // '@stylistic/comma-dangle': [ 'error', 'never' ],
      // 'comma-dangle': [ 'error', 'always-multiline' ],
      '@stylistic/comma-spacing': [ 'error', { before: false, after: true } ],
      '@stylistic/comma-style': [ 'error', 'last' ],
      '@stylistic/computed-property-spacing': [ 'error', 'never' ],
      '@stylistic/dot-location': [ 'error', 'property' ],
      '@stylistic/eol-last': 'error',
      '@stylistic/func-call-spacing': [ 'error', 'never' ],
      '@stylistic/function-paren-newline': [ 'error', 'consistent' ],
      '@stylistic/generator-star-spacing': [ 'error', { before: false, after: true, method: { before: true, after: false } } ],
      '@stylistic/implicit-arrow-linebreak': [ 'error', 'beside' ],
      '@stylistic/indent': [ 'error', 2, { SwitchCase: 1, ignoredNodes: [ 'JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXFragment', 'JSXOpeningFragment', 'JSXClosingFragment', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild' ] } ],
      '@stylistic/jsx-quotes': [ 'error', 'prefer-double' ],
      '@stylistic/key-spacing': [ 'error', { singleLine: { beforeColon: false, afterColon: true }, multiLine: { beforeColon: false, afterColon: true, mode: 'minimum' } } ],
      '@stylistic/keyword-spacing': [ 'error', { before: true, after: true } ],
      '@stylistic/linebreak-style': [ 'error', 'unix' ],
      '@stylistic/lines-between-class-members': [ 'error', 'always', { exceptAfterSingleLine: true } ],
      '@stylistic/max-len': [ 'error', { code: 100, comments: 80, tabWidth: 2, ignoreUrls: true, ignorePattern: '^\\s*\\* @\\S', ignoreStrings: true, ignoreTemplateLiterals: true, ignoreRegExpLiterals: true } ],
      '@stylistic/multiline-ternary': [ 'error', 'always-multiline' ],
      '@stylistic/new-parens': 'error',
      '@stylistic/newline-per-chained-call': [ 'error', { ignoreChainWithDepth: 2 } ],
      '@stylistic/no-confusing-arrow': [ 'error', { allowParens: true } ],
      '@stylistic/no-extra-parens': [ 'error', 'functions' ],
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/no-floating-decimal': 'warn',
      '@stylistic/no-mixed-spaces-and-tabs': 'error',
      '@stylistic/no-multi-spaces': [ 'error', { ignoreEOLComments: true, exceptions: { VariableDeclarator: true, ArrayExpression: true } } ],
      '@stylistic/no-multiple-empty-lines': [ 'error', { max: 1, maxEOF: 1, maxBOF: 0 } ],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/no-whitespace-before-property': 'error',
      '@stylistic/nonblock-statement-body-position': [ 'error', 'beside' ],
      '@stylistic/object-curly-newline': [ 'error', { consistent: true } ],
      '@stylistic/object-curly-spacing': [ 'error', 'always' ],
      '@stylistic/object-property-newline': [ 'error', { allowAllPropertiesOnSameLine: true } ],
      '@stylistic/operator-linebreak': [ 'error', 'after', { overrides: { '?': 'before', ':': 'before' } } ],
      '@stylistic/padded-blocks': [ 'error', 'never' ],
      '@stylistic/quote-props': [ 'error', 'consistent-as-needed' ],
      '@stylistic/quotes': [ 'error', 'single', 'avoid-escape' ],
      '@stylistic/rest-spread-spacing': [ 'error', 'never' ],
      '@stylistic/semi': [ 'error', 'always' ],
      '@stylistic/semi-spacing': [ 'error', { before: false, after: true } ],
      '@stylistic/semi-style': [ 'error', 'last' ],
      '@stylistic/space-before-blocks': [ 'error', 'always' ],
      '@stylistic/space-before-function-paren': [ 'error', 'always' ],
      '@stylistic/space-in-parens': [ 'error', 'never' ],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-unary-ops': [ 'error', { words: true, nonwords: false } ],
      '@stylistic/spaced-comment': [ 'error', 'always', { markers: [ 'global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',' ] } ],
      '@stylistic/switch-colon-spacing': 'error',
      '@stylistic/template-curly-spacing': [ 'error', 'never' ],
      '@stylistic/template-tag-spacing': [ 'error', 'never' ],
      '@stylistic/wrap-iife': [ 'error', 'any' ],
      '@stylistic/yield-star-spacing': [ 'error', 'after' ],
    }
  }
];

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 统一换行符，"\n" unix(for LF) and "\r\n" for windows(CRLF)，默认unix
    // off或0: 禁用规则
    'linebreak-style': 'off',
    "indent": ["off", 2],
    "comma-dangle": ["error", "only-multiline"],
    "max-len" : ["error", {code : 300}],
    'space-before-function-paren' : 0,
    'object-curly-newline' : 'off',
    'prefer-template': 'off',
    "consistent-return": 0,
    'arrow-parens': 0,
    'no-param-reassign': 0,
    'quote-props': 0,
    'vue/no-unused-vars': 0,
    'no-var': 0,
    'prefer-destructuring': 0,
    'no-unused-vars': 0,
    'no-unreachable': 0,
    'import/no-extraneous-dependencies': 0,
    "no-tabs":"off",
    'indent' : 'off',
    'no-plusplus': 'off',
    'operator-linebreak': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};

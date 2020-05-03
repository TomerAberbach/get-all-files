module.exports = {
  extends: [
    `eslint:recommended`,
    `plugin:ava/recommended`,
    `prettier`,
    `plugin:prettier/recommended`
  ],
  plugins: [`prettier`, `ava`],
  env: {
    es6: true,
    node: true
  },
  parserOptions: {
    sourceType: `module`,
    ecmaFeatures: {
      modules: true,
      impliedStrict: true
    }
  },
  parser: `babel-eslint`,
  rules: {
    quotes: [`error`, `backtick`]
  }
}

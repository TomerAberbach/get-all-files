module.exports = context => ({
  presets: [
    [
      `@babel/env`,
      {
        targets: {
          node: 10
        },
        modules: context.env() === `module` ? false : `commonjs`
      }
    ]
  ]
})

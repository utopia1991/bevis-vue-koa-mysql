// eslint 配置文件，官方文档：http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // 在下面添加规则，0 代表off关闭，1代表warn，2代表error
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 对象写成每个属性一行：关闭
    'object-property-newline': 0,
    // 命名为驼峰式：关闭
    'camelcase': 0,
    // 定义变量不被应用：关闭
    'no-unused-vars': 0
  }
}

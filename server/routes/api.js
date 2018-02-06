const router = require('koa-router')()
const userModel = require('../models/db')
const menu = require('../models/menu.json')
const users = require('../models/users.json')
const checkNotLogin = require('../middlewares/check').checkNotLogin
const checkLogin = require('../middlewares/check').checkLogin

router.prefix('/api')

router.get('/users', function (ctx, next) {
  ctx.body = users
})

router.get('/meta', function (ctx, next) {
  ctx.body = menu
})

router.post('/signin', async (ctx, next) => {
  console.log(ctx.request.body)
  let name = ctx.request.body.name;
  let pass = ctx.request.body.password;

  await userModel.findDataByName(name)
    .then(result => {
      let res = result
      if (name === res[0]['name'] && md5(pass) === res[0]['pass']) {
        ctx.body = true
        ctx.session.user = res[0]['name']
        ctx.session.id = res[0]['id']
        console.log('ctx.session.id', ctx.session.id)
        console.log('session', ctx.session)
        console.log('登录成功')
      } else {
        ctx.body = false
        console.log('用户名或密码错误!')
      }
    }).catch(err => {
      console.log(err)
    })

})

module.exports = router

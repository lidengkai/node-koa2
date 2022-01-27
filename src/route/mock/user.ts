import Router from 'koa-router'
import path from 'path'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import User from '../../model/api/User'
import { mockPath } from '../../config'
import * as result from '../../utils/result'
import * as formatter from '../../utils/formatter'
import checkLogin from '../../utils/checkLogin'

const db = new Low<User.Type[]>(
  new JSONFile(path.join(mockPath, 'user.json')),
  [
    { id: 1, username: 'admin', password: '123456', role: 1 },
    { id: 2, username: 'test', password: '123456', role: 2 },
  ]
)

const router = new Router({
  prefix: '/mock/user',
})

router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body || ({} as any)
  await db.read()
  const user = db.data.find(
    (t) =>
      t.username === formatter.toString(username) &&
      t.password === formatter.toString(password)
  )
  if (user) {
    ctx.session!.user_id = user.id
    ctx.response.body = result.success(user)
  } else {
    ctx.response.body = result.error('用户名或密码错误')
  }
})

router.get('/logout', async (ctx) => {
  ctx.session!.user_id = null
  ctx.response.body = result.success()
})

router.use(checkLogin)

router.get('/info', async (ctx) => {
  const { user_id } = ctx.session!
  await db.read()
  const user = db.data.find((t) => t.id === formatter.toNumber(user_id))
  ctx.response.body = user ? result.success(user) : result.error()
})

export default router

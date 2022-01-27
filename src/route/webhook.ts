import Router from 'koa-router'
import { env } from '../config'
import { doExec } from '../utils/exec'

const router = new Router()

// 本地开发禁用
if (env) {
  router.all('/routes/webhook', async (ctx) => {
    const res = await doExec('git pull')
    ctx.response.body = res.message
  })
}

export default router

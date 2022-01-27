import Router from 'koa-router'
import { env, PWD_CIPHER, PWD_IV } from '../config'
import { encode } from '../utils/password'
import * as formatter from '../utils/formatter'

const router = new Router()

// 本地开发启用
if (env === undefined) {
  router.all('/routes/password', async (ctx) => {
    const { query } = ctx.request.query || {}
    const str = formatter.toString(query).trim()
    ctx.response.body = str && encode(str, PWD_CIPHER, PWD_IV)
  })
}

export default router

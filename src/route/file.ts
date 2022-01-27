import Router from 'koa-router'
import * as server from '../server/file'
import checkLogin from '../utils/checkLogin'
import { readFileForm } from '../utils/file'

const router = new Router({
  prefix: '/file',
})

router.use(checkLogin)

router.post('/upload', async (ctx) => {
  const { files } = await readFileForm(ctx.req)
  ctx.response.body = await server.upload(files.file as any)
})

export default router

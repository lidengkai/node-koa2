import Router from 'koa-router'
import * as server from '../../server/api/test'
import * as formatter from '../../utils/formatter'
import * as result from '../../utils/result'
import checkLogin from '../../utils/checkLogin'
import Test from '../../model/api/Test'

const router = new Router({
  prefix: '/api/test',
})

router.use(checkLogin)

router.post('/', async (ctx) => {
  const { name, status, value } = ctx.request.body || ({} as any)
  const test = await server.add({
    name: formatter.toString(name, true),
    status: formatter.toNumber(status, true),
    value: formatter.toNumber(value, true),
  })
  ctx.response.body = test ? result.success(test) : result.error('添加失败')
})

router.get('/:id', async (ctx) => {
  const { id } = ctx.params || {}
  const test = await server.get(formatter.toNumber(id))
  ctx.response.body = test ? result.success(test) : result.error('不存在')
})

router.put('/:id', async (ctx) => {
  const { id } = ctx.params || {}
  const { name, status, value } = ctx.request.body || ({} as any)
  const num = await server.set(formatter.toNumber(id), {
    name: formatter.toString(name, true),
    status: formatter.toNumber(status, true),
    value: formatter.toNumber(value, true),
  })
  ctx.response.body = num === 1 ? result.success() : result.error('未修改', -1)
})

router.delete('/:id', async (ctx) => {
  const { id } = ctx.params || {}
  const num = await server.del(formatter.toNumber(id))
  ctx.response.body = num === 1 ? result.success() : result.error('删除失败')
})

router.post('/:page/:size', async (ctx) => {
  const { page, size } = ctx.params || {}
  const { sort, order } = ctx.request.query || {}
  const { name, status, value } = ctx.request.body || ({} as any)
  const res = await server.list({
    name: formatter.toString(name, true),
    status: formatter.fieldIn(status, (t) => formatter.toNumber(t, true)),
    value: formatter.fieldBetween(value, (t) => formatter.toNumber(t, true)),
    page: formatter.toNumber(page, true),
    size: formatter.toNumber(size, true),
    sort: formatter.filedSort(sort, Test.rawAttributes),
    order: formatter.filedOrder(order),
  })
  ctx.response.body = result.success({
    total: res.count,
    list: res.rows,
    page: formatter.toNumber(page, true) || 1,
    size: formatter.toNumber(size, true) ?? res.count,
  })
})

export default router

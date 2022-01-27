import Router from 'koa-router'
import path from 'path'
import Test from '../../model/api/Test'
import { mockPath } from '../../config'
import MockDb from '../../utils/mockDb'
import * as result from '../../utils/result'
import * as formatter from '../../utils/formatter'
import checkLogin from '../../utils/checkLogin'

const db = new MockDb<Test.Type[], 'id'>(path.join(mockPath, 'test.json'), {
  primaryKey: 'id',
})

const router = new Router({
  prefix: '/mock/test',
})

router.use(checkLogin)

router.post('/', async (ctx) => {
  const { name, status, value } = ctx.request.body || ({} as any)
  const test = await db.add({
    name: formatter.toString(name, true),
    status: formatter.toNumber(status, true) ?? 0,
    value: formatter.toNumber(value, true),
  })
  ctx.response.body = test ? result.success(test) : result.error('添加失败')
})

router.get('/:id', async (ctx) => {
  const { id } = ctx.params || {}
  const test = await db.get(formatter.toNumber(id))
  ctx.response.body = test ? result.success(test) : result.error('不存在')
})

router.put('/:id', async (ctx) => {
  const { id } = ctx.params || {}
  const { name, status, value } = ctx.request.body || ({} as any)
  const num = await db.set(formatter.toNumber(id), {
    name: formatter.toString(name, true),
    status: formatter.toNumber(status, true),
    value: formatter.toNumber(value, true),
  })
  ctx.response.body = num === 1 ? result.success() : result.error('未修改', -1)
})

router.delete('/:id', async (ctx) => {
  const { id } = ctx.params || {}
  const num = await db.del(formatter.toNumber(id))
  ctx.response.body = num === 1 ? result.success() : result.error('删除失败')
})

router.post('/:page/:size', async (ctx) => {
  const { page, size } = ctx.params || {}
  const { sort, order } = ctx.request.query || {}
  const { name, status, value } = ctx.request.body || ({} as any)
  const options = {
    name: formatter.toString(name, true),
    status: formatter.fieldIn(status, (t) => formatter.toNumber(t, true)),
    value: formatter.fieldBetween(value, (t) => formatter.toNumber(t, true)),
    page: formatter.toNumber(page, true),
    size: formatter.toNumber(size, true),
    sort: formatter.filedSort(sort, Test.rawAttributes),
    order: formatter.filedOrder(order),
  }
  const list = db.getData().filter((t) => {
    if (options.name && !t.name?.includes(options.name)) {
      return false
    }
    if (options.status.length && !options.status.includes(t.status)) {
      return false
    }
    if (options.value.length) {
      const [start, end] = options.value
      if (start !== undefined && !(t.value! >= start)) {
        return false
      }
      if (end !== undefined && !(t.value! <= end)) {
        return false
      }
    }
    return true
  })
  if (options.sort) {
    if (options.order === 'asc') {
      list.sort(
        (a, b) =>
          formatter.toNumber(a[options.sort!]) -
          formatter.toNumber(b[options.sort!])
      )
    } else if (options.order === 'desc') {
      list.sort(
        (a, b) =>
          formatter.toNumber(b[options.sort!]) -
          formatter.toNumber(a[options.sort!])
      )
    }
  }
  const res = {
    total: list.length,
    list,
  }
  if (options.page !== undefined && options.size !== undefined) {
    res.list = list.slice(
      (options.page - 1) * options.size,
      options.page * options.size
    )
  }
  ctx.response.body = result.success(res)
})

export default router

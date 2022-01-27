import Router from 'koa-router'
import path from 'path'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import User from '../../model/api/Test'
import { mockPath } from '../../config'
import * as result from '../../utils/result'
import * as formatter from '../../utils/formatter'
import checkLogin from '../../utils/checkLogin'
import Test from '../../model/api/Test'

const db = new Low<User.Type[]>(
  new JSONFile(path.join(mockPath, 'test.json')),
  []
)

const router = new Router({
  prefix: '/mock/test',
})

router.use(checkLogin)

router.post('/', async (ctx) => {
  const { name, status, value } = ctx.request.body || ({} as any)
  await db.read()
  const id = db.data.reduce((r, t) => Math.max(r, t.id || 0), 0) + 1
  const test = {
    id,
    name: formatter.toString(name, true),
    status: formatter.toNumber(status, true) ?? 0,
    value: formatter.toNumber(value, true),
  }
  db.data.push(test)
  await db.write()
  ctx.response.body = result.success(test)
})

router.get('/:id', async (ctx) => {
  const { id } = ctx.params || {}
  await db.read()
  const test = db.data.find((t) => t.id === formatter.toNumber(id))
  ctx.response.body = test ? result.success(test) : result.error('不存在')
})

router.put('/:id', async (ctx) => {
  const { id } = ctx.params || {}
  const { name, status, value } = ctx.request.body || ({} as any)
  await db.read()
  const test = db.data.find((t) => t.id === formatter.toNumber(id))
  if (test) {
    Object.assign(test, {
      name: formatter.toString(name, true),
      status: formatter.toNumber(status, true),
      value: formatter.toNumber(value, true),
    })
    await db.write()
    return (ctx.response.body = result.success())
  }
  ctx.response.body = result.error()
})

router.delete('/:id', async (ctx) => {
  const { id } = ctx.params || {}
  await db.read()
  const index = db.data.findIndex((t) => t.id === formatter.toNumber(id))
  if (index > -1) {
    db.data.splice(index, 1)
    await db.write()
    return (ctx.response.body = result.success())
  }
  ctx.response.body = result.error('删除失败')
})

router.post('/:page/:size', async (ctx) => {
  const { page, size } = ctx.params || {}
  const { sort, order } = ctx.request.query || {}
  const { name, status, value } = ctx.request.body || ({} as any)
  await db.read()
  const options = {
    name: formatter.toString(name, true),
    status: formatter.fieldIn(status, (t) => formatter.toNumber(t, true)),
    value: formatter.fieldBetween(value, (t) => formatter.toNumber(t, true)),
    page: formatter.toNumber(page, true),
    size: formatter.toNumber(size, true),
    sort: formatter.filedSort(sort, Test.rawAttributes),
    order: formatter.filedOrder(order),
  }
  const list = db.data.filter((t) => {
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

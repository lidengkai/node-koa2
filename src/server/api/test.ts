import * as dao from '../../dao/api/test'
import Test from '../../model/api/Test'

export const list = async (opts: {
  name?: string
  status?: Array<number | undefined>
  value?: [number | undefined, number | undefined]
  page?: number
  size?: number
  sort?: keyof Test.Type
  order?: FieldType.Order
}) => {
  return await dao.list(opts)
}

export const add = async (opts: {
  name: string | undefined
  status: number | undefined
  value: number | undefined
}) => {
  return await dao.create(opts)
}

export const set = async (
  id: number,
  opts: {
    name: string | undefined
    status: number | undefined
    value: number | undefined
  }
) => {
  return await dao.set(id, opts)
}

export const get = async (id: number) => {
  return await dao.get(id)
}

export const del = async (id: number) => {
  return await dao.del(id)
}

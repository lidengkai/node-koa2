import * as options from '../../utils/sequelize'
import Test from '../../model/api/Test'

export const list = async (
  opts: FieldType.Pick<Test.Type, 'name'> &
    FieldType.In<Test.Type, 'status'> &
    FieldType.Between<Test.Type, 'value'> &
    FieldType.Page &
    FieldType.Sorter<Test.Type>,
  transaction?: FieldType.Transaction
) => {
  console.log(opts)
  return await Test.findAndCountAll({
    where: options.where({
      name: options.like(opts.name),
      status: options.inOp(opts.status),
      value: options.between(opts.value),
    }),
    ...options.order(opts.sort, opts.order),
    ...options.page(opts.page, opts.size),
    transaction,
  })
}

export const create = async (
  data: FieldType.Pick<Test.Type, 'name' | 'status' | 'value'>,
  transaction?: FieldType.Transaction
) => {
  return await Test.create(data, {
    transaction,
  }).catch(options.catchUnique({ name: '名称重复' }))
}

export const set = async (
  id: Test.Type['id'],
  data: FieldType.Pick<Test.Type, 'name' | 'status' | 'value'>,
  transaction?: FieldType.Transaction
) => {
  return await Test.update(data, {
    where: options.where({
      id,
    }),
    transaction,
  })
    .then((result) => {
      return result?.[0]
    })
    .catch(options.catchUnique({ name: '名称重复' }))
}

export const get = async (
  id: Test.Type['id'],
  transaction?: FieldType.Transaction
) => {
  return await Test.findByPk(id, {
    transaction,
  })
}

export const del = async (
  id: Test.Type['id'],
  transaction?: FieldType.Transaction
) => {
  return await Test.destroy({
    where: options.where({
      id,
    }),
    transaction,
  })
}

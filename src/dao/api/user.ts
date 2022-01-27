import * as options from '../../utils/sequelize'
import User from '../../model/api/User'

export const list = async (
  opts: FieldType.Pick<User.Type, 'username'> &
    FieldType.In<User.Type, 'role'> &
    FieldType.Page,
  transaction?: FieldType.Transaction
) => {
  return await User.findAndCountAll({
    attributes: {
      exclude: ['password'],
    },
    where: options.where({
      username: options.like(opts.username),
      role: options.inOp(opts.role),
    }),
    ...options.page(opts.page, opts.size),
    transaction,
  })
}

export const create = async (
  data: FieldType.Pick<User.Type, 'username' | 'password' | 'role'>,
  transaction?: FieldType.Transaction
) => {
  return await User.create(data, {
    transaction,
  })
}

export const set = async (
  id: User.Type['id'],
  data: FieldType.Pick<User.Type, 'username' | 'password' | 'role'>,
  transaction?: FieldType.Transaction
) => {
  return await User.update(data, {
    where: options.where({
      id,
    }),
    transaction,
  }).then((result) => {
    return result?.[0]
  })
}

export const get = async (
  id: User.Type['id'],
  transaction?: FieldType.Transaction
) => {
  return await User.findByPk(id, {
    attributes: {
      exclude: ['password'],
    },
    transaction,
  })
}

export const del = async (
  id: User.Type['id'],
  transaction?: FieldType.Transaction
) => {
  return await User.destroy({
    where: options.where({
      id,
    }),
    transaction,
  })
}

export const auth = async (
  opts: FieldType.Required<User.Type, 'username' | 'password'>,
  transaction?: FieldType.Transaction
) => {
  return await User.findOne({
    attributes: {
      exclude: ['password'],
    },
    where: options.where({
      username: opts.username,
      password: opts.password,
    }),
    transaction,
  })
}

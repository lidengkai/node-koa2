import Router from 'koa-router'
import Sequelize from 'sequelize'
import { env } from '../config'
import path from 'path'
import * as result from '../utils/result'
import { writeFile } from '../utils/file'
import User from '../model/api/User'
import Test from '../model/api/Test'

const models = [User, Test]

const router = new Router()

const readType = (type: Sequelize.DataType) => {
  const val = (type as any)._length
  if (type instanceof Sequelize.INTEGER) {
    return 'INTEGER' + (val ? `(${val})` : '')
  } else if (type instanceof Sequelize.STRING) {
    return 'VARCHAR' + (val ? `(${val})` : '(255)')
  } else if (type instanceof Sequelize.TEXT) {
    return 'TEXT'
  }
  return false
}

const readInfo = (info: Sequelize.ModelAttributeColumnOptions) => {
  const { allowNull, defaultValue, unique, autoIncrement } = info
  let str = ''
  if (allowNull === true) {
    str += ' NULL'
  } else if (allowNull === false) {
    str += ' NOT NULL'
  }
  if (typeof defaultValue === 'string') {
    str += ' DEFAULT `' + defaultValue + '`'
  } else if (typeof defaultValue === 'number') {
    str += ' DEFAULT ' + defaultValue
  }
  if (unique) {
    str += ' UNIQUE'
  }
  if (autoIncrement) {
    str += ' AUTO_INCREMENT'
  }
  return str
}

const readColums = (columns: {
  [x: string]: Sequelize.ModelAttributeColumnOptions
}) => {
  let str = ''
  let primaryKey = ''
  for (const key in columns) {
    const col = columns[key]
    const type = readType(col.type)
    if (type) {
      const info = readInfo(col)
      if (col.primaryKey) {
        primaryKey = key
      }
      str += `  \`${key}\` ${type}${info},\n`
    }
  }
  str += '  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n'
  str +=
    '  `update_time` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP'
  if (primaryKey) {
    str += ',\n'
    str += `  PRIMARY KEY (\`${primaryKey}\`)\n`
  } else {
    str += '\n'
  }
  return str
}

// 本地开发启用
if (!env) {
  router.all('/routes/table', async (ctx) => {
    let str = ''
    str += `-- 选择数据库\n`
    str += `use node;\n`
    str += `\n`
    str += `-- ALTER TABLE [:name] ADD/CHANGE COLUMN [:oldCol?] :newCol :colType;\n`
    str += `\n`
    for (const model of models) {
      const { tableName, rawAttributes } = model
      str += `-- ${model.options.comment}\n`
      str += `CREATE TABLE IF NOT EXISTS \`${tableName}\` (\n`
      str += readColums(rawAttributes)
      str += `) ENGINE=InnoDB DEFAULT CHARSET=utf8;\n`
      str += `\n`
    }
    try {
      await writeFile(path.join(__dirname, '../../tables.sql'), str)
      ctx.response.body = result.success()
    } catch (err: any) {
      ctx.response.body = result.error(err?.message)
    }
  })
}

export default router

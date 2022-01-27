import path from 'path'
import { fileURLToPath } from 'url'
import { Sequelize } from 'sequelize'
import mysql from './mysql.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const port = 10138
export const env = process.env.NODE_ENV
export const rootPath = path.join(__dirname, '../..')
export const publicPath = path.join(rootPath, 'public')
export const mockPath = path.join(rootPath, 'mockTemp')
export const workspacesPath = path.join(rootPath, '../workspaces/packages')

/** 原始密钥，十六位字符 */
export const PWD_CIPHER = Buffer.from('pwd_cipher123456', 'utf8')
/** 初始化向量，十六位字符 */
export const PWD_IV = Buffer.from('pwd_iv0123456789', 'utf8')

export const session = {
  keys: ['koa2'],
  options: {
    key: 'koa:sess',
    maxAge: 2 * 60 * 60 * 1000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
  },
}

export const sequelize = new Sequelize(
  mysql.database,
  mysql.user,
  mysql.password,
  {
    host: mysql.host,
    port: mysql.port,
    dialect: 'mysql',
    pool: {
      max: mysql.connectionLimit,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      freezeTableName: true,
      timestamps: false,
    },
  }
)

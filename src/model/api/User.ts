import Sequelize from 'sequelize'
import { sequelize } from '../../config'

declare namespace User {
  type Type = {
    id: number
    username: string
    password: string
    role: number
  }
}

class User extends Sequelize.Model {
  declare id: number
  declare username: string
  declare password: string
  declare role: number
}

User.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.DataTypes.STRING(32),
      unique: true,
    },
    password: {
      type: Sequelize.DataTypes.STRING(128),
    },
    role: {
      type: Sequelize.DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'node_user',
    comment: '用户表',
  }
)

export default User

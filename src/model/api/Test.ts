import Sequelize from 'sequelize'
import { sequelize } from '../../config'

declare namespace Test {
  type Type = {
    id?: number
    name?: string
    status?: number
    value?: number
  }
}

class Test extends Sequelize.Model<Test.Type> {
  declare id: number
  declare name: string
  declare status: number
  declare value: number
  static readonly rawAttributes: Record<keyof Test.Type, any>
}

Test.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING(32),
      unique: true,
      allowNull: true,
    },
    status: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
    },
    value: {
      type: Sequelize.DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'Test',
    tableName: 'node_test',
    comment: '测试表',
  }
)

export default Test

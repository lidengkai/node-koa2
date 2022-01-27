declare namespace FieldType {
  type Pick<T, K extends keyof T = keyof T> = { [k in K]?: T[k] }
  type Required<T, K extends keyof T = keyof T> = { [k in K]: T[k] }
  type In<T, K extends keyof T = keyof T> = {
    [k in K]?: Array<T[K] | undefined>
  }
  type Between<T, K extends keyof T = keyof T> = {
    [k in K]?: [T[K] | undefined, T[K] | undefined]
  }
  type Page = {
    page?: number
    size?: number
  }
  type Sorter<T> = {
    sort?: keyof T
    order?: Order
  }
  type Transaction = import('sequelize').Transaction
  type Order = 'desc' | 'asc'
}

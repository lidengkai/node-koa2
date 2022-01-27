import { isFile, readFile, writeFile } from './file'
import { jsonToString, stringToJson } from './formatter'

interface Handle<T extends any[]> {
  is?<K extends keyof T[number], V = T[K]>(key: K, value: V, refer?: V): boolean
  like?<K extends keyof T[number], V = T[K]>(
    key: K,
    value: V,
    refer?: V
  ): boolean
  in?<K extends keyof T[number], V = T[K]>(
    key: K,
    value: V,
    refer?: V[]
  ): boolean
  between?<K extends keyof T[number], V = T[K]>(
    key: K,
    value: V,
    refer?: [V | undefined, V | undefined]
  ): boolean
}

export default class MockDb<T extends any[], K extends keyof T[number]> {
  private filename: string = ''
  private data: T = [] as any
  private primaryKey: K = '' as any
  private primaryMaxValue: number = 0
  private handle: Handle<T> = {}

  constructor(
    filename: string,
    options: {
      primaryKey: K
      defaultData?: T
      handle?: Handle<T>
    }
  ) {
    this.filename = filename
    this.primaryKey = options.primaryKey
    this.handle = this.handle
    this.initData(options?.defaultData)
  }

  private is: NonNullable<Handle<T>['is']> = (key, value, refer) => {
    if (this.handle.is) {
      return this.handle.is(key, value, refer)
    }
    if (refer !== undefined || refer !== null) {
      return value === refer
    }
    return true
  }

  private like: NonNullable<Handle<T>['like']> = (key, value, refer) => {
    if (this.handle.like) {
      return this.handle.like(key, value, refer)
    }
    const text = value?.toString()
    if (text) {
      return text.includes(refer as any)
    }
    return false
  }

  private in: NonNullable<Handle<T>['in']> = (key, value, refer) => {
    if (this.handle.in) {
      return this.handle.in(key, value, refer)
    }
    if (refer?.length) {
      return refer.includes(value)
    }
    return true
  }

  private between: NonNullable<Handle<T>['between']> = (key, value, refer) => {
    if (this.handle.between) {
      return this.handle.between(key, value, refer)
    }
    const [start, end] = refer ?? []
    if (start !== undefined && value < (start as any)) {
      return false
    }
    if (end !== undefined && value > (end as any)) {
      return false
    }
    return true
  }

  private readData = async (filename: string): Promise<T> => {
    const result = await readFile(filename)
    const data = stringToJson(result)
    if (data instanceof Array) {
      return data as any
    }
    return [] as any
  }

  private saveData = async (filename: string, data: T) => {
    await writeFile(filename, jsonToString(data))
  }

  private readPrimaryMaxValue = (primaryKey: K, data: T) => {
    return data.reduce((result, item) => {
      return Math.max(result, item[primaryKey]) || 0
    }, 0)
  }

  private initData = async (defaultData?: T) => {
    if (await isFile(this.filename)) {
      this.data = await this.readData(this.filename)
    } else {
      this.data = defaultData ?? ([] as any)
      await this.saveData(this.filename, this.data)
    }
    this.primaryMaxValue = this.readPrimaryMaxValue(this.primaryKey, this.data)
  }

  async add(info: Exclude<T[number], K>) {
    const item = { ...info }
    if (this.primaryKey) {
      item[this.primaryKey] = ++this.primaryMaxValue
    }
    this.data.push(item)
    await this.saveData(this.filename, this.data)
    return item as T[number]
  }

  async get(id: T[number][K]) {
    return this.data.find((t) => t[this.primaryKey] == id) as T[number] | null
  }

  async set(id: T[number][K], info: Exclude<T[number], K>) {
    let flag = false
    const item = this.data.find((t) => t[this.primaryKey] == id)
    if (item) {
      for (const key in info) {
        const value = info[key]
        if (value !== undefined && item[key] !== value) {
          flag = true
          item[key] = value
        }
      }
      await this.saveData(this.filename, this.data)
    }
    return flag ? 1 : 0
  }

  async del(id: T[number][K]) {
    const index = this.data.findIndex((t) => t[this.primaryKey] == id)
    if (index > -1) {
      this.data.splice(index, 1)
      await this.saveData(this.filename, this.data)
      return 1
    }
    return 0
  }

  getData() {
    return this.data
  }

  findAll(options?: {
    where?: {
      is?: { [x in keyof T[number]]?: T[number][x] }
      like?: { [x in keyof T[number]]?: T[number][x] }
      in?: { [x in keyof T[number]]?: Array<T[number][x]> }
      between?: { [x in keyof T[number]]?: [T[number][x], T[number][x]] }
    }
    order?: Array<[keyof T[number], 'desc' | 'order']>
  }) {
    const list = this.data.filter((item) => {
      for (const key in options?.where?.is) {
        const value = item[key]
        const refer = options?.where?.is[key]
        if (!this.is(key, value, refer)) {
          return false
        }
      }
      for (const key in options?.where?.like) {
        const value = item[key]
        const refer = options?.where?.like[key]
        if (!this.like(key, value, refer)) {
          return false
        }
      }
      for (const key in options?.where?.in) {
        const value = item[key]
        const refer = options?.where?.in[key]
        if (!this.in(key, value, refer)) {
          return false
        }
      }
      for (const key in options?.where?.between) {
        const value = item[key]
        const refer = options?.where?.between[key]
        if (!this.between(key, value, refer)) {
          return false
        }
      }
      return true
    })
  }
}

import moment, { Moment } from 'moment'

/** 字符串 */
export const toString: {
  (value: any): string
  (value: any, canUndefined: true): string | undefined
} = (value: any, canUndefined?: boolean) => {
  const result = value || value === 0 ? value.toString().trim() : ''
  if (canUndefined) {
    if (!result && typeof value !== 'string') {
      return undefined
    }
  }
  return result
}

/** 数字 */
export const toNumber: {
  (value: any): number
  (value: any, canUndefined: true): number | undefined
} = (value: any, canUndefined?: boolean) => {
  const result = Number(value)
  if (canUndefined) {
    if (isNaN(result) || (typeof value === 'string' && !value.trim())) {
      return undefined as any
    }
  }
  return result || 0
}

/** 数组 */
export const toArray = (value: any): any[] => {
  return value instanceof Array ? value : []
}

/** moment */
export const toMoment = (value: any): Moment | '' => {
  return value ? moment(value) : ''
}

/** 字符串转数组 */
export const stringToArray = (value: any, splitCode = ','): string[] => {
  return typeof value === 'string' && value ? value.split(splitCode) : []
}

/** 数组转字符串 */
export const arrayToString = (value: any, splitCode = ','): string => {
  return value instanceof Array ? value.join(splitCode) : ''
}

/** 字符串转json */
export const stringToJson = (value: any): any => {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

/** json转字符串 */
export const jsonToString = (value: any): string => {
  try {
    return JSON.stringify(value)
  } catch {
    return ''
  }
}

/** URLSearch转object */
export const urlSearchToObject = (value: string): any => {
  try {
    const data: any = {}
    if (value) {
      const info = new URLSearchParams(value)
      for (const key of info.keys()) {
        const value = info.get(key)
        data[key] = value
      }
    }
    return data
  } catch {
    return {}
  }
}

/** object转URLSearch */
export const objectToUrlSearch = (value: any): string => {
  try {
    const data = new URLSearchParams()
    if (value) {
      for (const key of value) {
        const info = value[key]
        data.append(key, info)
      }
    }
    return data.toString()
  } catch {
    return ''
  }
}

export const fieldIn = <T = any>(
  value: any,
  factory: (value: any, index: number, list: any) => T
): T[] => {
  return value instanceof Array ? value.map(factory) : []
}

export const fieldBetween = <T = any>(
  value: any,
  factory: (value: any, index: number, list: any) => T
): [T, T] => {
  return value instanceof Array
    ? [factory(value[0], 0, value), factory(value[1], 1, value)]
    : [factory(undefined, 0, []), factory(undefined, 1, [])]
}

export const filedSort = <T = any>(value: any, obj: T): keyof T | undefined => {
  return Object.hasOwnProperty.call(obj, value) ? value : undefined
}

export const filedOrder = (value: any): FieldType.Order | undefined => {
  return value === 'desc' || value === 'asc' ? value : undefined
}

export const success = (data: any = null, message: string = '') => {
  return {
    status: 1,
    message,
    data,
  }
}

export const error = (message: string = '', status: number = 0) => {
  return {
    status,
    message,
    data: null,
  }
}

export default (num: number, chars: string = '') => {
  let str = ''
  const size = 62 + chars.length
  for (let i = num; i--; ) {
    const n = Math.floor(Math.random() * size)
    if (n < 10) {
      str += String.fromCharCode(n + 48) // [0-9]
    } else if (n < 36) {
      str += String.fromCharCode(n + 55) // [a-z]
    } else if (n < 62) {
      str += String.fromCharCode(n + 61) // [A-Z]
    } else {
      str += chars[n - 62] || '' // other
    }
  }
  return str
}

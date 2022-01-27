import path from 'path'
import * as result from '../utils/result'
import { saveFile } from '../utils/file'
import { File } from 'formidable'
import random from '../utils/random'

export const upload = async (file: File) => {
  if (file) {
    const filename =
      `${Date.now()}-${random(5)}` + path.extname(file.name || '')
    const res = await saveFile(filename, file)
    if (res) {
      return result.success(res)
    }
  }
  return result.error('文件上传失败')
}

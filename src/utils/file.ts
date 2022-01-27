import fs from 'fs'
import path from 'path'
import formidable from 'formidable'

type File = formidable.File

export const readFileForm = (
  req: any
): Promise<{
  fields: {
    [x: string]: any
  }
  files: {
    [x: string]: File | File[]
  }
}> => {
  return new Promise((resolve) => {
    const form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
      if (err) {
        return resolve({
          fields: {},
          files: {},
        })
      }
      resolve({ fields, files })
    })
  })
}

const saveToStatic = (name: string, file: File) => {
  const pathname = path.join(__dirname, '../../public/upload', name)
  try {
    const rs = fs.createReadStream(file.path)
    const ws = fs.createWriteStream(pathname)
    rs.pipe(ws)
    return name
  } catch (e) {
    console.error('文件上传失败：', e)
    return null
  }
}

export const saveFile = (filename: string, file: File) => {
  if (file) {
    return saveToStatic(filename, file)
  }
  return null
}

export const getStats = (pathname: string): Promise<fs.Stats | null> => {
  return new Promise((resolve) => {
    fs.stat(pathname, (err, stat) => {
      if (err?.code === 'ENOENT') {
        return resolve(null)
      }
      return resolve(stat)
    })
  })
}

export const isExist = async (pathname: string) => {
  return !!(await getStats(pathname))
}

export const isFile = async (pathname: string) => {
  const result = await getStats(pathname)
  return result?.isFile() ?? false
}

export const writeFile = (
  pathname: string,
  text: string = ''
): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(pathname, text, { encoding: 'utf-8', flag: 'w' }, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

export const readFile = (pathname: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(pathname, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}

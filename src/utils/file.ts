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

export const writeFile = (
  pathname: string,
  text: string = ''
): Promise<NodeJS.ErrnoException | null> => {
  return new Promise((resolve) => {
    fs.writeFile(pathname, text, { encoding: 'utf-8', flag: 'w' }, (err) => {
      resolve(err)
    })
  })
}

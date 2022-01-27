import { exec } from 'child_process'

// 命令行操作
export const doExec = (
  cmd: string
): Promise<{
  flag: boolean
  message: string
}> => {
  return new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return resolve({
          flag: false,
          message: stderr,
        })
      }
      resolve({
        flag: true,
        message: stdout,
      })
    })
  })
}

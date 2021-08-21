import { spawn } from 'child_process'
import ora from 'ora'

export const cwd = process.cwd()

export const runCmd =  (options: {
  command: string,
  params: string[],
  cwd?: string,
  onData?: (data: any) => void,
  labelLoader: string,
  // onExit?: (code: number | null) => void,
  // TODO: add the err handlers!!
}) => new Promise((resolve, reject) => {
  const spinner = ora(options.labelLoader).start()

  const cp = spawn(options.command, options.params, {
    cwd: options.cwd || cwd,
    // stdio: 'inherit',
  })

  cp.stdout?.on('data', (data) => {
    if (options.onData) {
      options.onData(data)
    }
  })

  cp.on('exit', (code) => {
    if (code === 0) {
      spinner.succeed()
      resolve(cp)
    } else {
      spinner.fail()
      reject(code)
    }
  })

  cp.stderr?.on('data', (data) => {
    if (!data.includes('warning')) {
      console.log(`stderr: ${data}`)
    }
  })

  cp.on('close', ()=> {
    // console.error('error: ', code)
  })
})

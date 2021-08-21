import { spawn } from 'child_process'
import path from 'path'
import {  promises } from 'fs'

const { readFile, writeFile } = promises

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

export const readAndWriteTemplateFile = async (template: string, projectPathTowrite: string = '') => {
  const customConfig = await readFile(path.join(__dirname, './templates', template), { encoding: 'utf-8' })
  await writeFile(path.join(cwd, projectPathTowrite, template), customConfig)
  return true
}
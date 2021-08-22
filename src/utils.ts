import { spawn } from 'child_process'
import path from 'path'
import {  promises } from 'fs'
import chalk from 'chalk'

const { readFile, writeFile } = promises

import ora from 'ora'

import { isDebug, cwd } from './constants'

export const logDebug = (...rest: string[]) =>
  console.log(chalk.yellow('\n> Debug:',...rest))

export const runCmd =  (options: {
  command: string,
  params: string[],
  cwd?: string,
  onData?: (data: any) => void,
  labelLoader: string,
  // onExit?: (code: number | null) => void,
  // TODO: add the err handlers!!
}) => new Promise((resolve, reject) => {
  if (isDebug) {
    logDebug('running command `', options.command, options.params.join(' '), '`')
  }

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

export const readAndWriteTemplateFile = async (options: {
  projectName: string,
  template: string,
  projectPathTowrite: string,
}) => {
  const pathToRead = path.join(__dirname, './templates', options.template)
  const pathToWrite = path.join(cwd, options.projectName, options.projectPathTowrite, options.template)

  if (isDebug) {
    logDebug('Reading template file from ', pathToRead)
  }
  const customConfig = await readFile(pathToRead, { encoding: 'utf-8' })

  if (isDebug) {
    logDebug('Writting template file to ', pathToWrite)
  }
  await writeFile(pathToWrite, customConfig)

  return true
}


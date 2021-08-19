#!/usr/bin/env node
import path from 'path'
import { spawn } from 'child_process'
import ora from 'ora'

import inquirer from 'inquirer'

const packages = [
  'graphql@15.5.1',
  'graphql-tag@2.12.5',
  'react-query@3.19.6',
  // tailwindcss
  'tailwindcss@2.2.7',
  'postcss@8.3.6',
  'autoprefixer@10.3.1',
  // testing
  'jest@27.0.6',
  'babel-jest@27.0.6',
  '@testing-library/react@12.0.0',
  '@testing-library@5.14.1',
  'identity-obj-proxy@3.0.0',
  'react-test-renderer@17.0.2',
  'cypress@8.3.0',
]



const cwd = process.cwd()
const runCmd = (options: {
  command: string,
  params: string[],
  cwd?: string,
  onData?: (data: any) => void,
  onExit?: (code: number | null) => void,
  // TODO: add the err handlers!!
}) => {
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
    if (options.onExit) {
      options.onExit(code)
    }
  })

  cp.stderr?.on('data', (data) => {
    console.log(`stderr: ${data}`)
  })

  cp.on('close', (code)=> {
    // console.error('error: ', code)
  })

  return cp
}

inquirer.prompt<{ projectName: string }>([
  {
    type: 'input',
    name: 'projectName',
    message: 'what is the project name?',
    validate(value) {
      if (!value ) {
        return 'Please insert the project name 🙏🙏🙏'
      }
      return true
    }
  }
]).then(({ projectName }) => {
  let spinner = ora('Creating the base nextjs app...').start()

  runCmd({
    command: 'yarn',
    params: ['create', 'next-app', projectName, '--typescript'],
    onExit: () => {
      spinner.succeed()
      spinner = ora('Customizing the application: Installing custom npm packages...')
      // once the nextjs has finished to install the packages, we need to install our custom packages
      runCmd({
        command: 'yarn',
        params: ['add', ...packages],
        // install packages inside the folder that the create-next-app has just created
        cwd: path.join(cwd, projectName),
        onExit: () => {
          spinner.succeed()
          // here we need to create the configurations files
        }
      })
    }
  })
})


#!/usr/bin/env node
import path from 'path'
// import { readFile } from 'fs/promises'

import inquirer from 'inquirer'

import { runCmd, cwd } from './utils'

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
  '@testing-library/jest-dom@5.14.1',
  'identity-obj-proxy@3.0.0',
  'react-test-renderer@17.0.2',
  'cypress@8.3.0',
]

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
]).then(async ({ projectName }) => {
  await runCmd({
    labelLoader: 'Creating the base nextjs app...',
    command: 'yarn',
    params: ['create', 'next-app', projectName, '--typescript'],
  })

  // once the nextjs has finished to install the packages, we need to install our custom packages
  const projectPath = path.join(cwd, projectName);
  await runCmd({
    labelLoader: 'Customizing the application: Installing custom npm packages...',
    command: 'yarn',
    params: ['add', ...packages],
    // install packages inside the folder that the create-next-app has just created
    cwd: projectPath,
  })

  // here we need to create the configurations files
  // 1. Configure tailwindcss
  await runCmd({
    labelLoader: 'Customizing the application: Initializing tailwindcss...',
    command: 'npx',
    params: ['tailwindcss', 'init', '-p'],
    cwd: projectPath,
  })
  // const tailwindConfig = await readFile(path.join(__dirname, ''))
})


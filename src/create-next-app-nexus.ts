#!/usr/bin/env node
import path from 'path'

import inquirer from 'inquirer'
import ora from 'ora'

import { runCmd, readAndWriteTemplateFile } from './utils'
import { cwd } from './constants'

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
  // webpack and typescript
  'tsconfig-paths-webpack-plugin@3.5.1',
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
    labelLoader: 'Installing custom npm packages...',
    command: 'yarn',
    params: ['add', ...packages],
    // install packages inside the folder that the create-next-app has just created
    cwd: projectPath,
  })

  // here we need to create the configurations files
  // 1. Configure tailwindcss
  await runCmd({
    labelLoader: 'Initializing tailwindcss...',
    command: 'npx',
    params: ['tailwindcss', 'init', '-p'],
    cwd: projectPath,
  })
  let spinner = ora('Customizing tailwindcss configuration...').start()
  await readAndWriteTemplateFile({
    projectName,
    template: 'tailwind.config.js',
    projectPathTowrite: './',
  })
  await readAndWriteTemplateFile({
    projectName,
    template: 'globals.css',
    projectPathTowrite: './styles',
  })
  spinner.succeed()

  spinner = ora('Implementing NProgress package...').start()
  spinner.succeed()

  spinner = ora('Configuring webpack alias and ts paths...').start()
  await readAndWriteTemplateFile({
    projectName,
    template: 'next.config.js',
    projectPathTowrite: './',
  })
  await readAndWriteTemplateFile({
    projectName,
    template: 'tsconfig.paths.json',
    projectPathTowrite: './',
  })
  spinner.succeed()
})


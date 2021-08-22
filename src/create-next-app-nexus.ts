#!/usr/bin/env node
import path from 'path'
import {  promises } from 'fs'

import inquirer from 'inquirer'
import ora from 'ora'

import { runCmd, readAndWriteTemplateFile } from './utils'
import { cwd } from './constants'
import { EslintConfig } from './types'

const { readFile, writeFile } = promises

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
  // eslint & prettier
  'prettier@2.3.2',
  'eslint-config-prettier@8.3.0',
  'eslint-plugin-prettier@3.4.1'
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
    command: './node_modules/.bin/tailwindcss',
    params: ['init', '-p'],
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

  spinner = ora('Configuring webpack aliases and ts paths...').start()
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
  const tsConfigContent = await readFile(path.join(cwd, projectName, './tsconfig.json'), { encoding: 'utf-8' })
  const tsConfig = JSON.parse(tsConfigContent) as {[key: string]: string}
  tsConfig.extends = './tsconfig.paths.json'
  await writeFile(path.join(cwd, projectName, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2))
  spinner.succeed()
  
  spinner = ora('Configuring eslint and prettier...').start()
  const eslintConfigContent = await readFile(path.join(cwd, projectName, '.eslintrc.json'), { encoding: 'utf-8' })
  const eslintConfig = JSON.parse(eslintConfigContent) as EslintConfig
  eslintConfig.extends = typeof eslintConfig.extends === 'string' ?
    [eslintConfig.extends, 'prettier'] :
    [...eslintConfig.extends, 'prettier'];
  eslintConfig.plugins = [...(eslintConfig.plugins || []), 'prettier']
  eslintConfig.rules = {
    ...(eslintConfig.rules || {}),
    "prettier/prettier": [
      "error",
      {
        "singleQuote": true,
        "printWidth": 80,
        "jsxBracketSameLine": false,
        "trailingComma": "all",
        "arrowParens": "avoid",
        "endOfLine": "lf"
      }
    ]
  }
  await writeFile(path.join(cwd, projectName, '.eslintrc.json'), JSON.stringify(eslintConfig, null, 2))
  spinner.succeed()
})


#!/usr/bin/env node
import path from 'path'
import { promises } from 'fs'

import chalk from 'chalk'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import ora from 'ora'

import { runCmd, readAndWriteTemplateFile } from './utils'
import { cwd } from './constants'
import { EslintConfig } from './types'

import customApp from './templates/_app'
import homepage from './templates/index'
import envs from './templates/envs'

const { readFile, writeFile, mkdir } = promises

const nodeVersion = parseFloat(process.version.replace('v', ''))
if (nodeVersion < 12.20) {
  console.log(chalk.red('😥 Error: Node version should be equal o greater than 12.20. Please upgrade your nodejs version  🙏'))
  console.log(chalk.yellow('We need v12.20 or greater because we use some packages (like @graphq-codegen) that require it. 😅'))
  process.exit(1)
}

const packages = [
  'graphql@15.5.1',
  'graphql-tag@2.12.5',
  'react-query@3.19.6',
  '@graphql-codegen/cli@2.1.1',
  '@graphql-codegen/typescript@2.1.0',
  '@graphql-codegen/near-operation-file-preset@2.1.0',
  '@graphql-codegen/typescript-operations@2.1.0',
  '@graphql-codegen/typescript-react-query@2.1.0',
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
  'node-fetch@2.6.2',
  'dotenv@10.0.0',
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
  const getProjectPathOf = (folder: string) => path.join(cwd, projectName, folder)

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
  const tsConfigContent = await readFile(getProjectPathOf('./tsconfig.json'), { encoding: 'utf-8' })
  const tsConfig = JSON.parse(tsConfigContent) as {[key: string]: string}
  tsConfig.extends = './tsconfig.paths.json'
  await writeFile(getProjectPathOf('tsconfig.json'), JSON.stringify(tsConfig, null, 2))
  spinner.succeed()

  spinner = ora('Configuring eslint and prettier...').start()
  const eslintConfigContent = await readFile(getProjectPathOf('.eslintrc.json'), { encoding: 'utf-8' })
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
  await writeFile(getProjectPathOf('.eslintrc.json'), JSON.stringify(eslintConfig, null, 2))
  spinner.succeed()

  // customize project file structure
  spinner = ora('Moving files and folders to improve project structure...').start()
  await fs.move(getProjectPathOf('pages'), getProjectPathOf('src/pages'))
  await mkdir(getProjectPathOf('src/shared'))
  await mkdir(getProjectPathOf('src/views'))
  await mkdir(getProjectPathOf('src/api'))
  await writeFile(getProjectPathOf('src/pages/_app.tsx'), customApp)
  await writeFile(getProjectPathOf('src/pages/index.tsx'), homepage)
  spinner.succeed()

  // script "generate": "graphql-codegen"     "generate": "graphql-codegen -r dotenv/config"
  spinner = ora('Configuring graphql-tag, react query and graphql codegen...').start()
  let packageJsonContent = await readFile(getProjectPathOf('./package.json'), { encoding: 'utf-8' })
  let packageJson = JSON.parse(packageJsonContent) as {scripts: {[key: string]: string}}
  packageJson.scripts = {
    ...packageJson.scripts,
    generate: 'graphql-codegen -r dotenv/config',
  }
  await writeFile(getProjectPathOf('package.json'), JSON.stringify(packageJson, null, 2))
  await writeFile(getProjectPathOf('.env'), envs)
  await fs.copy(path.join(__dirname, './templates/codegen.yml'), getProjectPathOf('./codegen.yml'))
  await fs.copy(path.join(__dirname, './templates/fetcher.ts'), getProjectPathOf('src/api/fetcher.ts'))
  spinner.succeed()

  spinner = ora('Configuring jest and cypress...').start()
  await fs.copy(path.join(__dirname, './templates/test-utils'), getProjectPathOf('src/test-utils'))
  await fs.copy(path.join(__dirname, './templates/__mocks__'), getProjectPathOf('src/__mocks__'))
  await fs.copy(path.join(__dirname, './templates/jest.config.js'), getProjectPathOf('./jest.config.js'))
  await fs.copy(path.join(__dirname, './templates/jest.setup.js'), getProjectPathOf('./jest.setup.js'))
  packageJsonContent = await readFile(getProjectPathOf('./package.json'), { encoding: 'utf-8' })
  packageJson = JSON.parse(packageJsonContent) as {scripts: {[key: string]: string}}
  packageJson.scripts = {
    ...packageJson.scripts,
    test: 'jest',
    'test:watch': 'jest --watch',
  }
  await writeFile(getProjectPathOf('package.json'), JSON.stringify(packageJson, null, 2))
  spinner.succeed()
})

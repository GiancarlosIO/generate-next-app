import minimist from 'minimist'

export const argvs = minimist<{
  debug: boolean
}>(process.argv.slice(2))

export const isDebug = argvs.debug

export const cwd = process.cwd()
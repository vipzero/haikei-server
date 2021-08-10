/* eslint-disable no-console */
import chalk from 'chalk'

export const log = console.log
export const info = (str: string | number | object) =>
  console.log(chalk.gray(str))
export const error = (key: string, description: string) => {
  console.error(chalk.red(`${key}: ${description}`))
}

export const warn = (key: string, description: string) => {
  console.warn(chalk.red(`${key}: ${description}`))
}

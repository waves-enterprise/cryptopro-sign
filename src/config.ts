import { config } from 'dotenv'
import { version } from '../package.json'
import { readFileSync } from 'fs'
import * as path from 'path'

config()

type BuildInfo = {
  BUILD_ID: string,
  GIT_COMMIT: string,
  DOCKER_TAG: string,
  VERSION: string,
}

function prepareBuildInfo(): BuildInfo {
  const buildDefault = {
    BUILD_ID: 'development',
    GIT_COMMIT: 'development',
    DOCKER_TAG: 'development',
    VERSION: version,
  }
  try {
    const info = readFileSync('versions.json').toString()
    return {
      ...buildDefault,
      ...JSON.parse(info),
    }

  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('not found versions.json', err.message)
  }
  return buildDefault
}

function getEnv<V = string>(name: string): V | string | undefined
function getEnv<V = string>(name: string, defaultValue: V): V | string
function getEnv<V = string>(name: string, defaultValue?: V): V | string | undefined {
  return process.env[name] ?? defaultValue
}

function parseLogLevel() {
  const logLevel = getEnv('LOG_LEVEL', 'debug,log,warn,error')
  return new Set(logLevel.trim()
    .replace(/ +/g, '')
    .split(',')
    .map((s) => s.trim()))
}

export const BUILD_INFO = prepareBuildInfo()
export const ROOT_DIR = path.resolve(__dirname, '..')

export const CERTIFICATE_PIN = getEnv('CERTIFICATE_PIN')

// REST
export const PORT = Number(getEnv('PORT', 3037))
export const SWAGGER_BASE_PATH = getEnv('SWAGGER_BASE_PATH', '/')

export const LOG_LEVEL = parseLogLevel()

export const isValidEnv = () => {
  const config = getActualEnv()

  return Object.keys(config).reduce((isValid: boolean, key: string) => {
    if (config[key] === undefined || Number.isNaN(config[key])) {
      // eslint-disable-next-line no-console
      console.error(`Please set config/env variable: ${key}`)
      return false
    }
    return isValid
  }, true)
}

export function getActualEnv(): { [key: string]: unknown } {
  return {
    CERTIFICATE_PIN,
    LOG_LEVEL,
    PORT,
    SWAGGER_BASE_PATH,
  }
}

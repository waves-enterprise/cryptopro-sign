import { Logger } from '@nestjs/common'
import { LOG_LEVEL } from '../config'

const loggerService = new Logger()

export const logError = (message: unknown, trace?: string, context?: string) => {
  if (!LOG_LEVEL.has('error')) {
    return
  }
  loggerService.error(message, trace, context)
}

export const logWarn = (message: unknown, context?: string) => {
  if (!LOG_LEVEL.has('warn')) {
    return
  }
  loggerService.warn(message, context)
}

export const log = (message: unknown, context?: string) => {
  if (!LOG_LEVEL.has('log')) {
    return
  }
  loggerService.log(message, context)
}

export const logDebug = (message: unknown, context?: string) => {
  if (!LOG_LEVEL.has('debug')) {
    return
  }
  loggerService.debug(message, context)
}

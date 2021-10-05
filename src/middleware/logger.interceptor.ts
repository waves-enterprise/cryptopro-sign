import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Request, Response } from 'express'
import { log, logError } from '../utils/logUtils'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {

  constructor(
    private readonly reflector: Reflector,
  ) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const noLog = this.reflector.get<boolean>('noLog', context.getHandler())
    if (noLog) {
      return next.handle()
    }
    const removePasswordLogs = this.reflector.get<boolean>('removePasswordLogs', context.getHandler())
    const req: Request = context.switchToHttp().getRequest()
    const hasBody = ['post', 'put', 'patch', 'delete'].includes(req.method.toLowerCase())
    const { originalUrl, body, method } = req

    return next
      .handle()
      .pipe(
        tap({
          next: (): void => {
            const res: Response = context.switchToHttp().getResponse<Response>()
            const { statusCode } = res
            const message = `${method} ${originalUrl} [${statusCode}]`
            log(message, 'RequestLogger')
          },
          error: (error: Error): void => {
            if (error instanceof HttpException) {
              const statusCode = error.getStatus()
              const errorMessage = error.message
              if (removePasswordLogs) {
                body.password = '*excluded*'
              }
              const bodyMessage = hasBody ? `Req body: ${JSON.stringify(body, null, 2)}` : ''

              const message = `${method} ${originalUrl} [${statusCode}] ${errorMessage} ${bodyMessage}`
              logError(message, '', 'RequestLogger')
            }
          },
        }),
      )
  }
}

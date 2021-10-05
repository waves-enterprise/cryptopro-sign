import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common'
import { logError } from '../utils/logUtils'
import { Request, Response } from 'express'

export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    // unhandled error
    if (typeof exception === 'string' || !('getStatus' in exception)) {
      const err = exception?.message ?? exception
      const body = JSON.stringify(request.body, null, 2)
      logError(`${request.url} ${err} req body: ${body}`, exception.stack, 'Unhandled rest exception')
      return response.status(500).json({
        errorMessage: err,
      })
    }

    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse() as string | { message: string | string[] }

    // unknown error
    if (typeof exceptionResponse !== 'object') {
      return response.status(status).json({ errorMessage: exceptionResponse })
    }

    // validation error
    if (Array.isArray(exceptionResponse.message)) {
      return response.status(status).json({
        errorCode: 0,
        errorMessage: exceptionResponse.message.join(', '),
      })
    }

    // known error
    return response.status(status).json(exceptionResponse)
  }
}

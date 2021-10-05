import { HttpException } from '@nestjs/common'

export class InternalException extends HttpException {
  constructor(errorMessage: string | Record<string, unknown>) {
    super(
      {
        errorMessage,
        errorCode: 1,
      },
      500,
    )
  }
}

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map } from 'rxjs/operators'

@Injectable()
export class ResultInterceptor implements NestInterceptor {
  intercept(_1: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map((result) => ({ result })))
  }
}

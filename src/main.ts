import * as express from 'express'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ExpressAdapter } from '@nestjs/platform-express'
import { BUILD_INFO, isValidEnv, PORT, SWAGGER_BASE_PATH } from './config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { HttpExceptionFilter } from './middleware/http.exception.filter'
import { ResultInterceptor } from './middleware/result.interceptor'
import { log, logError } from './utils/logUtils'

async function bootstrap() {
  log(`Build info: ${JSON.stringify(BUILD_INFO, null, 2)}`, 'Main')
  if (!isValidEnv()) {
    process.exit(1)
    return
  }
  const server = express()
  server.disable('x-powered-by')
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
    { cors: { origin: ['*'], credentials: true } },
  )
  app.use(express.json({ limit: '50mb' }))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  app.useGlobalInterceptors(new ResultInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter())

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Voting CryptoPro service')
    .addServer(SWAGGER_BASE_PATH)
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swaggerOptions)
  await SwaggerModule.setup('/docs', app, document)

  await app.listen(PORT)
}

bootstrap()
  .catch((err) => {
    logError(err && err.message || err, err.stack, 'Main')
    process.exit(1)
  })

import { Module } from '@nestjs/common'
import { StatusController } from './status.controller'
import { CryptoProController } from './cryptopro.controller'

@Module({
  imports: [],
  controllers: [
    StatusController,
    CryptoProController,
  ],
})
export class ControllersModule {
}

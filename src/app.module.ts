import { Module } from '@nestjs/common'
import { ControllersModule } from './controllers/controllers.module'

@Module({
  imports: [
    ControllersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}

import { Test, TestingModule } from '@nestjs/testing'
import { StatusController } from '../src/controllers/status.controller'

describe('AppController (health methods)', () => {
  let appController: StatusController

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StatusController],
      providers: [],
    }).compile()
    appController = app.get<StatusController>(StatusController)
  })

  it('should return status', () => {
    const { status } = appController.getStatus()
    expect(status).toBe('OK')
  })

  it('should return livenessProbe', () => {
    const { time } = appController.livenessProbe()
    expect(time).toBeDefined()
  })

  it('should return readinessProbe', () => {
    const { time } = appController.readinessProbe()
    expect(time).toBeDefined()
  })
})

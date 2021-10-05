import { Test, TestingModule } from '@nestjs/testing'
import { CryptoProController } from '../src/controllers/cryptopro.controller'

describe('CryptoProController', () => {
  let controller: CryptoProController

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CryptoProController],
      providers: [],
    }).compile()
    controller = app.get<CryptoProController>(CryptoProController)
  })

  describe('sign', () => {
    it('should successfully sign text', async () => {
      const sign = await controller.sign({ text: 'test' })
      expect({ sign }).toEqual({
        sign: expect.any(String),
      })
    })
  })
})

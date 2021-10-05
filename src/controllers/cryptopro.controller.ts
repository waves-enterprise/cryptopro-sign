import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { SignReqDto, SignResDto } from './dto/sign.dto'
import { cryptoProSign } from '../utils/cryptoProUtils'

@Controller()
@ApiBearerAuth()
export class CryptoProController {

  @Post('cryptopro/sign')
  @ApiOperation({ summary: 'Sign plain text with cryptopro' })
  @ApiResponse({ type: SignResDto })
  sign(@Body() { text }: SignReqDto) {
    return cryptoProSign(text)
  }
}

import { ApiProperty } from '@nestjs/swagger'

export class OKResp {
  @ApiProperty({
    type: Boolean,
    example: true,
  })
  result: boolean
}

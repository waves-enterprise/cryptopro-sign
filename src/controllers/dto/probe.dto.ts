import { ApiProperty } from '@nestjs/swagger'

export class ProbeDto {
  @ApiProperty()
  time: number
}

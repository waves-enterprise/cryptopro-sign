import { ApiProperty } from '@nestjs/swagger'

export class StatusDto {
  @ApiProperty()
  status: string

  @ApiProperty()
  version: string

  @ApiProperty()
  commit: string

  @ApiProperty()
  build: string

  @ApiProperty()
  tag: string
}

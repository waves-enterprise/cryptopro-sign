import { Controller, Get } from '@nestjs/common'
import { BUILD_INFO } from '../config'
import { ApiResponse } from '@nestjs/swagger'
import { ProbeDto } from './dto/probe.dto'
import { StatusDto } from './dto/status.dto'

@Controller()
export class StatusController {
  @Get('/status')
  @ApiResponse({ type: StatusDto })
  getStatus() {
    return {
      status: 'OK',
      build: BUILD_INFO.BUILD_ID,
      commit: BUILD_INFO.GIT_COMMIT,
      tag: BUILD_INFO.DOCKER_TAG,
      version: BUILD_INFO.VERSION,
    }
  }

  @Get('livenessProbe')
  @ApiResponse({
    status: 200,
    description: 'Liveness probe endpoint',
    type: ProbeDto,
  })
  livenessProbe() {
    return { time: Date.now() }
  }

  @Get('readinessProbe')
  @ApiResponse({
    status: 200,
    description: 'Readiness probe endpoint',
    type: ProbeDto,
  })
  readinessProbe() {
    return { time: Date.now() }
  }
}

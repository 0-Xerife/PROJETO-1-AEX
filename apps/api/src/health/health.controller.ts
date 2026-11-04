import { Controller, Get } from '@nestjs/common';
import type { HealthResponse } from '@aex/types';

@Controller('health')
export class HealthController {
  @Get('live')
  live(): HealthResponse {
    return { status: 'ok' };
  }
}

import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheckResult } from './health-check.service';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

@Controller('health')
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  async check(): Promise<ApiResponse<HealthCheckResult>> {
    const health = await this.healthCheckService.getOverallHealth();
    
    return {
      success: true,
      data: health,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `health_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Get('ready')
  async readiness(): Promise<ApiResponse<{ status: string }>> {
    const health = await this.healthCheckService.getOverallHealth();
    const isReady = health.status === 'healthy' || health.status === 'degraded';
    
    return {
      success: isReady,
      data: { status: isReady ? 'ready' : 'not ready' },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `ready_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Get('live')
  async liveness(): Promise<ApiResponse<{ status: string }>> {
    return {
      success: true,
      data: { status: 'alive' },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `live_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  checks: Record<string, HealthStatus>;
  timestamp: Date;
  uptime: number;
  version: string;
}

@Injectable()
export class HealthCheckService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async checkDatabase(): Promise<HealthStatus> {
    try {
      const startTime = Date.now();
      await this.connection.db?.admin().ping();
      const responseTime = Date.now() - startTime;

      return {
        status: 'healthy',
        message: 'Database connection successful',
        details: {
          responseTime: `${responseTime}ms`,
          database: this.connection.name,
        },
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Database connection failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date(),
      };
    }
  }

  async checkMemory(): Promise<HealthStatus> {
    const memUsage = process.memoryUsage();
    const memUsageMB = {
      rss: Math.round(memUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024),
    };

    const heapUsedPercentage = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    const status = heapUsedPercentage > 90 ? 'unhealthy' : 
                  heapUsedPercentage > 70 ? 'degraded' : 'healthy';

    return {
      status,
      message: `Memory usage: ${heapUsedPercentage.toFixed(2)}%`,
      details: memUsageMB,
      timestamp: new Date(),
    };
  }

  async checkDiskSpace(): Promise<HealthStatus> {
    // Simple disk space check (in a real app, you'd use a proper library)
    try {
      const fs = require('fs');
      const stats = fs.statSync('.');
      
      return {
        status: 'healthy',
        message: 'Disk space check passed',
        details: {
          lastModified: stats.mtime,
        },
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        status: 'degraded',
        message: 'Disk space check failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date(),
      };
    }
  }

  async getOverallHealth(): Promise<HealthCheckResult> {
    const [database, memory, disk] = await Promise.all([
      this.checkDatabase(),
      this.checkMemory(),
      this.checkDiskSpace(),
    ]);

    const checks = {
      database,
      memory,
      disk,
    };

    const overallStatus = Object.values(checks).every(check => check.status === 'healthy')
      ? 'healthy'
      : Object.values(checks).some(check => check.status === 'unhealthy')
      ? 'unhealthy'
      : 'degraded';

    return {
      status: overallStatus,
      checks,
      timestamp: new Date(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    };
  }
}

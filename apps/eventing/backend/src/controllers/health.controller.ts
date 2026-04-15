import { Request, Response } from 'express';
import { HealthService } from '../services/health/health.service.js';

/**
 * HTTP controller responsible for system health monitoring.
 * This controller exposes a single endpoint that reports the operational
 * status of the application and its dependencies (e.g. RabbitMQ).
 * It delegates all health checks to HealthService and translates the
 * result into appropriate HTTP status codes:
 * - 200 OK → system healthy
 * - 503 Service Unavailable → system unhealthy or degraded
 */
export class HealthController {
  constructor(private readonly service: HealthService) {}

  /**
   * Returns current system health status.
   * Response:
   * - status: 'ok' | 'error'
   * - rabbitmq: connection status
   * - timestamp: check time
   * - optional error details when unhealthy
   * @param _req Express request (unused)
   * @param res Express response returning health state
   */
  health = async (_req: Request, res: Response) => {
    const result = await this.service.checkHealth();
    if (result.status !== 'ok') {
      return res.status(503).json(result);
    }
    return res.status(200).json(result);
  };
}

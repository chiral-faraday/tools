import { RabbitMQManager } from '../../lib/amqp/amqp.js';
import { IHealthCheckResult, IHealthService } from './types.js';

/**
 * Service responsible for reporting system health.
 * This service aggregates the health status of the application and its
 * dependencies, primarily RabbitMQ, and returns a structured health report.
 * It is designed to be used by health check endpoints for monitoring,
 * orchestration, and readiness/liveness probes.
 */
export class HealthService implements IHealthService {
  constructor(private readonly mq: RabbitMQManager) {}

  /**
   * Performs a health check of the system.
   * The health status is determined based on:
   * - RabbitMQ connection status
   * - channel readiness
   * @returns Object containing:
   * - status: 'ok' | 'error'
   * - rabbitmq: 'connected' | 'disconnected'
   * - channel: boolean indicating channel readiness
   * - timestamp: time of check (ms since epoch)
   * - error?: error message if health check fails
   */
  public async checkHealth(): Promise<IHealthCheckResult> {
    try {
      const status = this.mq.getStatus();

      const isHealthy = status.connected && status.channelReady;

      return {
        status: isHealthy ? 'ok' : 'error',
        rabbitmq: isHealthy ? 'connected' : 'disconnected',
        channel: status.channelReady,
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        status: 'error',
        rabbitmq: 'disconnected',
        error: err instanceof Error ? err.message : 'unknown error',
        timestamp: Date.now(),
      };
    }
  }
}

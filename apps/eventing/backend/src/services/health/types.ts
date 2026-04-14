export type HealthStatus = 'ok' | 'error';

export type RabbitMQHealthStatus = 'connected' | 'disconnected';

export interface IHealthCheckResult {
  status: HealthStatus;
  rabbitmq: 'connected' | 'disconnected';
  timestamp: number;
  channel?: boolean;
  error?: string;
}

export interface IHealthService {
  checkHealth(): Promise<IHealthCheckResult>;
}

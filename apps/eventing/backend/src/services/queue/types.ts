import { QueueConfig } from '../../lib/amqp/types.js';

/**
 * Input DTO for creating a queue (API-facing shape)
 */
export type ICreateQueueDTO = {
  name: string;
  durable?: boolean;
};

/**
 * Queue representation exposed by the service layer.
 *
 * NOTE:
 * This intentionally mirrors QueueConfig (adapter truth model).
 * No transformation layer is introduced.
 */
export type IQueueInfo = QueueConfig;

/**
 * Allowed queue types (domain-level convenience alias)
 */
export enum IQueueType {
  Quorum = 'quorum',
  Classic = 'classic',
}

/**
 * Service contract for queue operations
 */
export interface IQueueService {
  createQueue(input: ICreateQueueDTO): Promise<void>;
  deleteQueue(name: string): Promise<void>;
  listQueues(): IQueueInfo[];
  peekMessages(name: string): Promise<unknown[]>;
  purgeQueue(name: string): Promise<void>;
}

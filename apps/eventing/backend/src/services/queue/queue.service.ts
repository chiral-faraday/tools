import { RabbitMQManager } from '../../lib/amqp/amqp.js';
import { ICreateQueueDTO, IQueueService, IQueueInfo } from './types.js';

/**
 * Service responsible for managing RabbitMQ queues.
 * This service provides application-level operations for:
 * - creating and deleting queues
 * - listing existing queues
 * - inspecting messages without consuming them
 * - purging messages from queues
 * It also enforces domain-level rules (e.g. queue name validation)
 * before delegating to RabbitMQManager.
 */
export class QueueService implements IQueueService {
  constructor(private readonly mq: RabbitMQManager) {}

  /**
   * Creates (or asserts) a queue.
   * Enforces domain rules:
   * - queue name must be non-empty
   * @param dto Queue definition
   * @param dto.name Name of the queue
   * @param dto.durable Whether the queue should survive broker restarts (default: true)
   * @returns Result of the underlying RabbitMQ operation
   */
  public async createQueue(dto: ICreateQueueDTO): Promise<void> {
    // domain rule lives here (NOT controller)
    if (!dto.name || dto.name.trim().length === 0) {
      throw new Error('Queue name is required');
    }
    return this.mq.assertQueue(dto.name, {
      durable: dto.durable ?? true,
    });
  }

  /**
   * Deletes a queue by name.
   * @param name Name of the queue to delete
   * @returns Result of the deletion operation
   */
  public async deleteQueue(name: string): Promise<void> {
    return this.mq.deleteQueue(name);
  }

  /**
   * Lists all known queues.
   * @returns Array of queues managed or reported by RabbitMQManager
   */
  public listQueues(): Array<IQueueInfo> {
    return this.mq.listQueues();
  }

  /**
   * Peeks messages in a queue without consuming them.
   * Messages remain in the queue after this operation.
   * @param name Name of the queue
   * @returns Array of messages currently in the queue
   */
  public async peekMessages(name: string): Promise<Array<unknown>> {
    return this.mq.peekQueue(name);
  }

  /**
   * Removes all messages from a queue without deleting the queue itself.
   * @param name Name of the queue
   * @returns Result of the purge operation
   */
  public async purgeQueue(name: string): Promise<void> {
    return this.mq.purgeQueue(name);
  }
}

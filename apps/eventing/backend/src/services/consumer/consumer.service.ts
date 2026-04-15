import { RabbitMQManager } from '../../lib/amqp/amqp.js';
import {
  IConsumerDTO,
  IConsumerInfo,
  IConsumerService,
  IConsumerTag,
} from './types.js';

/**
 * Service responsible for managing message consumers.
 * This service encapsulates the lifecycle of RabbitMQ consumers:
 * - starting consumers on queues
 * - stopping active consumers
 * - listing currently active consumers
 * It defines the application-level behavior of message consumption,
 * including how messages are handled when received.
 * All low-level AMQP operations are delegated to RabbitMQManager.
 */
export class ConsumerService implements IConsumerService {
  constructor(private readonly mq: RabbitMQManager) {}

  /**
   * Starts a consumer on a given queue.
   * When a message is received, it is passed to a handler function
   * defined within this service. This handler can be extended to
   * implement domain-specific processing logic.
   * @param dto Consumer configuration
   * @param dto.queue Name of the queue to consume from
   * @param dto.autoAck Whether messages should be automatically acknowledged
   * @returns consumerTag Identifier for the created consumer
   */
  public async startConsumer(dto: IConsumerDTO) {
    return this.mq.consume(
      dto.queue,
      (msg) => {
        // domain-level hook (can extend later)
        console.log(`[${dto.queue}]`, msg.content.toString());
      },
      {
        noAck: dto.autoAck ?? false,
      },
    );
  }

  /**
   * Stops an active consumer by its consumer tag.
   * @param consumerTag Identifier of the consumer to stop
   * @returns Result of the cancellation operation
   */
  public stopConsumer(consumerTag: IConsumerTag) {
    return this.mq.cancelConsumer(consumerTag);
  }

  /**
   * Lists all currently active consumers.
   * @returns Array of active consumer descriptors
   */
  public listConsumers(): Array<IConsumerInfo> {
    return this.mq.listConsumers();
  }
}

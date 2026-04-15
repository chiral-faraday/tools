import { RabbitMQManager } from '../../lib/amqp/amqp.js';
import {
  IMessageService,
  IPublishToExchangeDTO,
  ISendToQueueDTO,
} from './types.js';

/**
 * Service responsible for publishing messages to RabbitMQ.
 * This service provides two publishing models:
 * - direct queue publishing (bypasses exchange routing)
 * - exchange-based publishing (uses bindings and routing keys)
 * It acts as an abstraction over RabbitMQManager and defines the
 * application-level contract for producing messages.
 */
export class MessageService implements IMessageService {
  constructor(private readonly mq: RabbitMQManager) {}

  /**
   * Sends a message directly to a queue.
   * This bypasses exchange routing and delivers the message straight
   * to the specified queue.
   * @param dto Message payload
   * @param dto.queue Target queue name
   * @param dto.message Message content (will be serialized)
   * @returns true if the message was accepted by the broker
   */
  public async sendToQueue(dto: ISendToQueueDTO): Promise<boolean> {
    return this.mq.sendToQueue(dto.queue, dto.message);
  }

  /**
   * Publishes a message to an exchange using a routing key.
   * Message delivery depends on:
   * - existing bindings
   * - routing key matching
   * - exchange type
   * If no bindings match, the message may be dropped.
   * @param dto Message payload
   * @param dto.exchange Target exchange name
   * @param dto.routingKey Routing key used for message routing
   * @param dto.message Message content (will be serialized)
   * @returns true if the message was accepted by the broker
   */
  public async publishToExchange(dto: IPublishToExchangeDTO): Promise<boolean> {
    return this.mq.publish(dto.exchange, dto.routingKey, dto.message);
  }
}

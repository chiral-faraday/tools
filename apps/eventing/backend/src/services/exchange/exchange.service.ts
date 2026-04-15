import { RabbitMQManager } from '../../lib/amqp/amqp.js';
import {
  ICreateExchangeDTO,
  IExchangeInfo,
  IExchangeService,
} from './types.js';

/**
 * Service responsible for managing RabbitMQ exchanges.
 * Exchanges receive messages from producers and route them to queues
 * based on bindings, routing keys, and exchange type.
 * This service provides application-level operations for:
 * - creating exchanges
 * - deleting exchanges
 * - listing existing exchanges
 * All AMQP interactions are delegated to RabbitMQManager.
 */
export class ExchangeService implements IExchangeService {
  constructor(private readonly mq: RabbitMQManager) {}

  /**
   * Creates (or asserts) an exchange.
   * If the exchange already exists, it will be verified against the
   * provided type.
   * @param dto Exchange definition
   * @param dto.name Name of the exchange
   * @param dto.type Type of exchange (direct, topic, fanout, headers)
   * @returns Result of the underlying RabbitMQ operation
   */
  public async createExchange(dto: ICreateExchangeDTO): Promise<void> {
    return this.mq.assertExchange(dto.name, dto.type);
  }

  /**
   * Deletes an exchange by name.
   * @param name Name of the exchange to delete
   * @returns Result of the deletion operation
   */
  public async deleteExchange(name: string): Promise<void> {
    return this.mq.deleteExchange(name);
  }

  /**
   * Lists all known exchanges.
   * @returns Array of exchanges managed or reported by RabbitMQManager
   */
  public listExchanges(): Array<IExchangeInfo> {
    return this.mq.listExchanges();
  }
}

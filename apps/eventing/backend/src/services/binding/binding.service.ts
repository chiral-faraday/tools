import { RabbitMQManager } from '../../lib/amqp/amqp.js';
import { IBindingDTO, IBindingInfo, IBindingService } from './types.js';

/**
 * Service responsible for managing bindings between queues and exchanges.
 * This service acts as an abstraction over RabbitMQManager, providing
 * application-level operations for:
 * - creating bindings
 * - removing bindings
 * Bindings define how messages published to an exchange are routed to queues,
 * based on routing keys and exchange type.
 * It does not contain HTTP logic and does not interact directly with
 * Express. All RabbitMQ interactions are delegated to RabbitMQManager.
 */
export class BindingService implements IBindingService {
  constructor(private readonly mq: RabbitMQManager) {}

  /**
   * Creates a binding between a queue and an exchange using a routing key.
   * @param dto Binding definition
   * @param dto.queue Name of the queue
   * @param dto.exchange Name of the exchange
   * @param dto.routingKey Routing key used for the binding
   * @returns Result of the underlying RabbitMQ operation
   */
  public async bind(dto: IBindingDTO): Promise<void> {
    return this.mq.bindQueue(dto);
  }

  /**
   * Removes an existing binding between a queue and an exchange.
   * @param dto Binding definition
   * @param dto.queue Name of the queue
   * @param dto.exchange Name of the exchange
   * @param dto.routingKey Routing key used for the binding
   * @returns Result of the underlying RabbitMQ operation
   */
  public async unbind(dto: IBindingDTO): Promise<void> {
    return this.mq.unbindQueue(dto);
  }

  /**
   * Lists all known bindings.
   * @returns Array of bindings managed or reported by RabbitMQManager
   */
  public listBindings(): Array<IBindingInfo> {
    return this.mq.listBindings();
  }
}

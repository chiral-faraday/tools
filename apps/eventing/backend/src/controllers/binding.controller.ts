import { Request, Response } from 'express';
import { BindingService } from '../services/binding.service.js';

/**
 * HTTP controller responsible for managing queue-exchange bindings.
 * This controller exposes endpoints to create and delete bindings between
 * exchanges and queues in RabbitMQ via the BindingService abstraction.
 * It acts purely as a transport layer:
 * - validates/receives HTTP input
 * - delegates to BindingService
 * - returns appropriate HTTP responses
 * No business logic or RabbitMQ details should exist here.
 */
export class BindingController {
  constructor(private readonly service: BindingService) {}

  /**
   * Creates a binding between a queue and an exchange.
   * Expected request body:
   * - exchange: string
   * - queue: string
   * - routingKey?: string
   * @param req Express request containing binding details in body
   * @param res Express response
   */
  public createBinding = async (req: Request, res: Response) => {
    await this.service.bind(req.body);
    res.status(201).send();
  };

  /**
   * Removes an existing binding between a queue and an exchange.
   * Expected request body:
   * - exchange: string
   * - queue: string
   * - routingKey?: string
   * @param req Express request containing binding details in body
   * @param res Express response
   */
  public deleteBinding = async (req: Request, res: Response) => {
    await this.service.unbind(req.body);
    res.status(204).send();
  };
}

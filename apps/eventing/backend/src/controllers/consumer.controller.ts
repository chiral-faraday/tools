import { Request, Response } from 'express';
import { ConsumerService } from '../services/consumer/consumer.service.js';
import { getParam } from '../lib/http.js';

/**
 * HTTP controller for managing RabbitMQ consumers.
 * This controller exposes lifecycle operations for consumers:
 * - starting consumers
 * - listing active consumers
 * - stopping consumers
 * It acts strictly as a transport layer and delegates all runtime
 * consumer management to ConsumerService.
 * No RabbitMQ or channel logic should exist here.
 */
export class ConsumerController {
  constructor(private readonly service: ConsumerService) {}

  /**
   * Starts a new consumer for a given queue or binding configuration.
   * Expected request body depends on ConsumerService implementation,
   * typically includes queue name and optional consumer options.
   * @param req Express request containing consumer configuration in body
   * @param res Express response returning generated consumer tag
   */
  startConsumer = async (req: Request, res: Response) => {
    const consumerTag = await this.service.startConsumer(req.body);
    res.status(201).json({ consumerTag });
  };

  /**
   * Lists all currently active consumers managed by the application.
   * @param _req Express request (unused)
   * @param res Express response returning array of consumers
   */
  listConsumers = async (_req: Request, res: Response) => {
    const result = this.service.listConsumers();
    res.status(200).json(result);
  };

  /**
   * Stops an active consumer by its consumer tag.
   * Path parameter:
   * - consumerTag: unique identifier of the running consumer
   * @param req Express request containing consumerTag param
   * @param res Express response with no body on success
   */
  stopConsumer = async (req: Request, res: Response) => {
    const tag = getParam(req, 'consumerTag');
    await this.service.stopConsumer(tag);
    res.status(204).send();
  };
}

import { Request, Response } from 'express';
import { QueueService } from '../services/queue.service.js';
import { getParam } from '../lib/http.js';

/**
 * HTTP controller for managing RabbitMQ queues.
 * This controller exposes queue lifecycle and inspection operations:
 * - creation and deletion of queues
 * - listing available queues
 * - peeking messages without consuming them
 * - purging all messages from a queue
 * It acts strictly as a transport layer and delegates all queue logic
 * to QueueService, which interacts with RabbitMQManager.
 */
export class QueueController {
  constructor(private readonly service: QueueService) {}

  /**
   * Creates a new queue.
   * Expected request body:
   * - name: string
   * - options?: object (durable, autoDelete, etc.)
   * @param req Express request containing queue configuration
   * @param res Express response returning created queue metadata
   */
  public createQueue = async (req: Request, res: Response) => {
    const result = await this.service.createQueue(req.body);
    res.status(201).json(result);
  };

  /**
   * Lists all declared queues.
   * @param _req Express request (unused)
   * @param res Express response returning array of queues
   */
  public listQueues = async (_req: Request, res: Response) => {
    const result = this.service.listQueues();
    res.status(200).json(result);
  };

  /**
   * Deletes a queue by name.
   * Path parameter:
   * - name: queue name
   * @param req Express request containing queue name param
   * @param res Express response with no body on success
   */
  public deleteQueue = async (req: Request, res: Response) => {
    const name = getParam(req, 'name');
    await this.service.deleteQueue(name);
    res.status(204).send();
  };

  /**
   * Peeks messages in a queue without consuming them.
   * Path parameter:
   * - name: queue name
   * Response:
   * - queue: string
   * - messages: array of queued messages
   * @param req Express request containing queue name param
   * @param res Express response returning messages in queue
   */
  public peekMessages = async (req: Request, res: Response) => {
    const name = getParam(req, 'name');
    const messages = await this.service.peekMessages(name);
    res.status(200).json({
      queue: name,
      messages,
    });
  };

  /**
   * Removes all messages from a queue without deleting the queue itself.
   * Path parameter:
   * - name: queue name
   * @param req Express request containing queue name param
   * @param res Express response with no body on success
   */
  public purgeQueue = async (req: Request, res: Response) => {
    const name = getParam(req, 'name');
    await this.service.purgeQueue(name);
    res.status(204).send();
  };
}

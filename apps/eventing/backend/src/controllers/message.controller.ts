import { Request, Response } from 'express';
import { MessageService } from '../services/message/message.service.js';

/**
 * HTTP controller for message operations in the eventing system.
 * This controller handles publishing messages to RabbitMQ via two paths:
 * - direct queue publishing
 * - exchange-based publishing
 * It also exposes message acknowledgement endpoints which are currently
 * not implemented and return 501 responses.
 * This controller acts strictly as a transport layer and delegates all
 * message publishing logic to MessageService.
 */
export class MessageController {
  constructor(private readonly service: MessageService) {}

  /**
   * Publishes a message directly to a queue.
   * Expected request body:
   * - queue: string
   * - message: object
   * @param req Express request containing queue publish payload
   * @param res Express response
   */
  sendToQueue = async (req: Request, res: Response) => {
    await this.service.sendToQueue(req.body);
    res.status(202).send();
  };

  /**
   * Publishes a message to an exchange with a routing key.
   * Expected request body:
   * - exchange: string
   * - routingKey: string
   * - message: object
   * @param req Express request containing exchange publish payload
   * @param res Express response
   */
  publishToExchange = async (req: Request, res: Response) => {
    await this.service.publishToExchange(req.body);
    res.status(202).send();
  };

  /**
   * Acknowledges a message (not yet implemented).
   * This endpoint exists for API completeness but is not currently wired
   * into RabbitMQ consumption flow.
   * @param _req Express request (unused)
   * @param res Express response returning 501 Not Implemented
   */
  ackMessage = async (_req: Request, res: Response) => {
    res.status(501).send({ status: 'ack not implemented yet' });
  };

  /**
   * Negatively acknowledges a message (not yet implemented).
   * This endpoint exists for API completeness but is not currently wired
   * into RabbitMQ consumption flow.
   * @param _req Express request (unused)
   * @param res Express response returning 501 Not Implemented
   */
  nackMessage = async (_req: Request, res: Response) => {
    res.status(501).send({ status: 'nack not implemented yet' });
  };
}

import { Request, Response } from 'express';
import { ExchangeService } from '../services/exchange/exchange.service.js';
import { getParam } from '../lib/http.js';

/**
 * HTTP controller for managing RabbitMQ exchanges.
 * This controller provides endpoints for creating, listing, and deleting
 * exchanges via the ExchangeService abstraction.
 * It is strictly a transport layer:
 * - handles HTTP request/response mapping
 * - delegates all business logic to ExchangeService
 * - does not interact with RabbitMQ directly
 */
export class ExchangeController {
  constructor(private readonly service: ExchangeService) {}

  /**
   * Creates a new exchange.
   * Expected request body:
   * - name: string
   * - type: 'direct' | 'topic' | 'fanout' | string
   * - options?: object (durable, autoDelete, etc.)
   * @param req Express request containing exchange definition in body
   * @param res Express response returning created exchange metadata
   */
  createExchange = async (req: Request, res: Response) => {
    const result = await this.service.createExchange(req.body);
    res.status(201).json(result);
  };

  /**
   * Lists all declared exchanges.
   * @param _req Express request (unused)
   * @param res Express response returning array of exchanges
   */
  listExchanges = async (_req: Request, res: Response) => {
    const result = this.service.listExchanges();
    res.status(200).json(result);
  };

  /**
   * Deletes an exchange by name.
   * Path parameter:
   * - name: exchange name to delete
   * @param req Express request containing exchange name param
   * @param res Express response with no body on success
   */
  deleteExchange = async (req: Request, res: Response) => {
    const name = getParam(req, 'name');
    await this.service.deleteExchange(name);
    res.status(200).send();
  };
}

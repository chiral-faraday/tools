import { Request, Response } from 'express';
import { SimulationService } from '../types/simulation.service.js';

/**
 * HTTP controller for system simulation and load testing operations.
 * This controller exposes endpoints used to simulate messaging system behavior:
 * - load generation into queues
 * - (planned) consumer delay simulation
 * It delegates execution to SimulationService and returns results
 * describing the simulated behavior.
 */
export class SimulationController {
  constructor(private readonly service: SimulationService) {}

  /**
   * Simulates load by publishing multiple messages into a queue.
   * This operation is asynchronous and may take time depending on the
   * number of messages requested.
   * Request body:
   * - queue?: string (defaults to 'load-test')
   * - count?: number (defaults to 100)
   * @param req Express request containing simulation parameters
   * @param res Express response returning simulation result
   */
  simulateLoad = async (req: Request, res: Response) => {
    const result = await this.service.simulateLoad({
      queue: req.body.queue ?? 'load-test',
      count: req.body.count ?? 100,
    });
    return res.status(202).json(result);
  };

  /**
   * Simulates consumer processing delay (not yet implemented).
   * This endpoint exists for API completeness but does not currently
   * affect runtime consumer behavior. It returns a placeholder response.
   * Request body:
   * - delayMs?: number (default: 1000)
   * @param req Express request containing delay configuration
   * @param res Express response returning placeholder result
   */
  simulateConsumerDelay = async (req: Request, res: Response) => {
    const result = await this.service.simulateConsumerDelay({
      delayMs: req.body.delayMs ?? 1000,
    });
    return res.status(501).json(result);
  };
}

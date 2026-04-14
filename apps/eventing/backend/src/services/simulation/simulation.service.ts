import { MessageService } from '../message/message.service.js';
import {
  ISimulateConsumerDelayInput,
  ISimulateConsumerDelayResult,
  ISimulateLoadResult,
  ISimulateLoadInput,
  ISimulationService,
} from './types.js';

/**
 * Service responsible for simulating messaging system behavior.
 * This service provides utilities for testing and exploring the system:
 * - generating load by publishing messages to queues
 * - (planned) simulating consumer-side processing delays
 * It operates at a higher level than core messaging services and is
 * intended for development, testing, and demonstration purposes.
 */
export class SimulationService implements ISimulationService {
  constructor(private readonly messages: MessageService) {}

  /**
   * Simulates load by sending a number of messages to a queue.
   * Messages are sent sequentially and include:
   * - index: sequence number
   * - timestamp: time of message creation
   * @param input Simulation parameters
   * @param input.queue Target queue name
   * @param input.count Number of messages to send
   * @returns Summary of the simulation run
   */
  public async simulateLoad(
    input: ISimulateLoadInput,
  ): Promise<ISimulateLoadResult> {
    const count = input.count ?? 100;

    for (let i = 0; i < count; i++) {
      await this.messages.sendToQueue({
        queue: input.queue,
        message: {
          index: i,
          timestamp: Date.now(),
        },
      });
    }

    return {
      status: 'completed',
      queue: input.queue,
      count,
    };
  }

  /**
   * Placeholder for simulating consumer processing delay.
   * This method does not currently affect runtime behavior. It exists
   * to define the intended contract for introducing artificial delay
   * in consumer message handling logic.
   * @param input Simulation parameters
   * @param input.delayMs Desired processing delay in milliseconds
   * @returns Configuration summary (no runtime effect)
   */
  async simulateConsumerDelay(
    input: ISimulateConsumerDelayInput,
  ): Promise<ISimulateConsumerDelayResult> {
    return {
      status: 'configured',
      delayMs: input.delayMs,
      note: 'delay should be applied in consumer handler logic',
    };
  }
}

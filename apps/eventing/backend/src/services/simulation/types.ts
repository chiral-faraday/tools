export type ISimulateLoadInput = {
  queue: string;
  status: string;
  count?: number;
};

export type ISimulateLoadResult = {
  status: 'completed';
  queue: string;
  count: number;
};

export type ISimulateConsumerDelayInput = {
  delayMs: number;
};

export type ISimulateConsumerDelayResult = {
  status: 'configured';
  delayMs: number;
  note: string;
};

export interface ISimulationService {
  simulateLoad(input: ISimulateLoadInput): Promise<ISimulateLoadResult>;
  simulateConsumerDelay(
    input: ISimulateConsumerDelayInput,
  ): Promise<ISimulateConsumerDelayResult>;
}

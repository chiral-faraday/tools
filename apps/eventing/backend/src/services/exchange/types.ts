import { ExchangeConfig } from '../../lib/amqp/types.js';
export type IExchangeType = 'direct' | 'topic' | 'fanout' | 'headers';

/**
 * Input DTO for creating an exchange.
 * This represents the *intent* to create an exchange, not the adapter configuration.
 */
export type ICreateExchangeDTO = {
  name: string;
  type: IExchangeType;
};

export type IExchangeInfo = ExchangeConfig;

/**
 * Service contract for exchange operations.
 */
export interface IExchangeService {
  createExchange(dto: ICreateExchangeDTO): Promise<void>;
  deleteExchange(name: string): Promise<void>;
  listExchanges(): Array<IExchangeInfo>;
}

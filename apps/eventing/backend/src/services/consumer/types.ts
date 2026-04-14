import { ConsumerConfig } from '../../lib/amqp/types.js';

export type IConsumerDTO = {
  queue: string;
  autoAck?: boolean;
};

export type IConsumerInfo = ConsumerConfig;

export type IConsumerTag = string;

export interface IConsumerService {
  startConsumer(dto: IConsumerDTO): Promise<IConsumerTag>;
  stopConsumer(tag: IConsumerTag): Promise<void>;
  listConsumers(): unknown[];
}

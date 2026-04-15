import amqplib from 'amqplib';

export type ExchangeType = 'direct' | 'topic' | 'fanout' | 'headers';

export type BindingConfig = {
  queue: string;
  exchange: string;
  routingKey: string;
};

export type ConsumerConfig = {
  queue: string;
  consumerTag: string;
  autoAck: boolean;
};

export type ExchangeConfig = {
  name: string;
  type: ExchangeType;
  options?: amqplib.Options.AssertExchange;
};

export type QueueConfig = {
  name: string;
  options?: amqplib.Options.AssertQueue;
};

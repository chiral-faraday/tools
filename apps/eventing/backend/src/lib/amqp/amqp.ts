import amqplib from 'amqplib';
import {
  BindingConfig,
  ConsumerConfig,
  ExchangeConfig,
  QueueConfig,
} from './types.js';

const URL = process.env.RABBITMQ_URL ?? 'amqp://guest:guest@rabbitmq:5672';

export interface RabbitMQManagerStatus {
  connected: boolean;
  channelReady: boolean;
  queues: number;
  exchanges: number;
  bindings: number;
}

export class RabbitMQManager {
  private connection?: amqplib.ChannelModel;
  private channel?: amqplib.Channel;
  private consumers: Map<string, ConsumerConfig> = new Map();
  private queues: Map<string, QueueConfig> = new Map();
  private exchanges: Map<string, ExchangeConfig> = new Map();
  private bindings: BindingConfig[] = [];

  constructor(private readonly amqp = amqplib) {}

  // -------------------
  // CONNECTION
  // -------------------

  async initialize(): Promise<void> {
    this.connection = await this.amqp.connect(URL);
    this.channel = await this.connection.createChannel();
  }

  private getChannel(): amqplib.Channel {
    if (!this.channel) throw new Error('Channel not initialized');
    return this.channel;
  }

  public getStatus(): RabbitMQManagerStatus {
    return {
      connected: !!this.connection,
      channelReady: !!this.channel,
      queues: this.queues?.size ?? 0,
      exchanges: this.exchanges?.size ?? 0,
      bindings: this.bindings?.length ?? 0,
    };
  }
  // -------------------
  // QUEUES
  // -------------------

  public createQueueConfig(config: QueueConfig): void {
    this.queues.set(config.name, config);
  }

  public async assertQueue(
    name: string,
    options?: amqplib.Options.AssertQueue,
  ): Promise<void> {
    const ch = this.getChannel();
    const config: QueueConfig = {
      name,
      options: {
        durable: true,
        arguments: { 'x-queue-type': 'quorum' },
        ...options,
      },
    };
    this.queues.set(name, config);
    await ch.assertQueue(name, config.options);
  }

  public async deleteQueue(name: string): Promise<void> {
    const ch = this.getChannel();
    await ch.deleteQueue(name);
    this.queues.delete(name);
  }

  public async peekQueue(queue: string): Promise<Array<unknown>> {
    const channel = this.getChannel();
    const messages: any[] = [];
    let msg;
    while ((msg = await channel.get(queue, { noAck: true }))) {
      messages.push({
        content: msg.content.toString(),
        fields: msg.fields,
        properties: msg.properties,
      });
    }
    return messages;
  }

  public async purgeQueue(name: string): Promise<void> {
    const ch = this.getChannel();
    await ch.purgeQueue(name);
  }

  public listQueues(): Array<QueueConfig> {
    return [...this.queues.values()];
  }

  // -------------------
  // EXCHANGES
  // -------------------

  public async assertExchange(
    name: string,
    type: ExchangeConfig['type'],
    options?: amqplib.Options.AssertExchange,
  ): Promise<void> {
    const ch = this.getChannel();
    const config: ExchangeConfig = {
      name,
      type,
      options: {
        durable: true,
        ...options,
      },
    };
    this.exchanges.set(name, config);
    await ch.assertExchange(name, type, config.options);
  }

  public async deleteExchange(name: string): Promise<void> {
    const ch = this.getChannel();
    await ch.deleteExchange(name);
    this.exchanges.delete(name);
  }

  public listExchanges(): Array<ExchangeConfig> {
    return [...this.exchanges.values()];
  }

  // -------------------
  // BINDINGS
  // -------------------

  public async bindQueue(config: BindingConfig): Promise<void> {
    const ch = this.getChannel();
    this.bindings.push(config);
    await ch.bindQueue(config.queue, config.exchange, config.routingKey);
  }

  public async unbindQueue(config: BindingConfig): Promise<void> {
    const ch = this.getChannel();
    this.bindings = this.bindings.filter(
      (b) =>
        !(
          b.queue === config.queue &&
          b.exchange === config.exchange &&
          b.routingKey === config.routingKey
        ),
    );
    await ch.unbindQueue(config.queue, config.exchange, config.routingKey);
  }

  public listBindings(): Array<BindingConfig> {
    return [...this.bindings];
  }

  // -------------------
  // MESSAGING
  // -------------------

  public sendToQueue(queue: string, message: object): boolean {
    const ch = this.getChannel();
    return ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  public publish(
    exchange: string,
    routingKey: string,
    message: object,
  ): boolean {
    const ch = this.getChannel();
    return ch.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
    );
  }

  // -------------------
  // BOOTSTRAP (IMPORTANT)
  // -------------------

  public async setupTopology(): Promise<void> {
    const ch = this.getChannel();
    for (const q of this.queues.values()) {
      await ch.assertQueue(q.name, q.options);
    }
    for (const ex of this.exchanges.values()) {
      await ch.assertExchange(ex.name, ex.type, ex.options);
    }
    for (const b of this.bindings) {
      await ch.bindQueue(b.queue, b.exchange, b.routingKey);
    }
  }

  // -------------------
  // CONSUMERS
  // -------------------
  public async consume(
    queue: string,
    handler: (msg: amqplib.ConsumeMessage) => void,
    options?: amqplib.Options.Consume,
  ): Promise<string> {
    const ch = this.getChannel();
    const result = await ch.consume(
      queue,
      (msg) => {
        if (!msg) return;
        handler(msg);
      },
      options,
    );
    const config: ConsumerConfig = {
      queue,
      consumerTag: result.consumerTag,
      autoAck: options?.noAck ?? false,
    };
    this.consumers.set(result.consumerTag, config);
    return result.consumerTag;
  }

  public async cancelConsumer(consumerTag: string): Promise<void> {
    const ch = this.getChannel();
    await ch.cancel(consumerTag);
    this.consumers.delete(consumerTag);
  }

  public listConsumers(): Array<ConsumerConfig> {
    return Array.from(this.consumers.values());
  }

  public async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = undefined;
      }
      if (this.connection) {
        await this.connection.close();
        this.connection = undefined;
      }
    } catch (err) {
      // avoid throwing during shutdown
      console.error('[RabbitMQ] close error:', err);
    }
  }
}

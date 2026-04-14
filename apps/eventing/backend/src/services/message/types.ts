export type ISendToQueueDTO = {
  queue: string;
  message: object;
};

export type IPublishToExchangeDTO = {
  exchange: string;
  routingKey: string;
  message: object;
};

export interface IMessageService {
  sendToQueue(dto: ISendToQueueDTO): Promise<boolean>;
  publishToExchange(dto: IPublishToExchangeDTO): Promise<boolean>;
}

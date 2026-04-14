import { BindingConfig } from '../../lib/amqp/types.js';

export type IBindingDTO = {
  queue: string;
  exchange: string;
  routingKey: string;
};

export type IBindingInfo = BindingConfig;

export interface IBindingService {
  bind(dto: IBindingDTO): Promise<void>;
  unbind(dto: IBindingDTO): Promise<void>;
  listBindings(): Array<IBindingInfo>;
}

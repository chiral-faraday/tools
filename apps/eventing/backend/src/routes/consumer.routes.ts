import { Router } from 'express';

export function createConsumerRouter(controller: any): Router {
  const router = Router();

  router.post('/', controller.startConsumer.bind(controller));
  router.get('/', controller.listConsumers.bind(controller));
  router.delete('/:consumerTag', controller.stopConsumer.bind(controller));

  return router;
}

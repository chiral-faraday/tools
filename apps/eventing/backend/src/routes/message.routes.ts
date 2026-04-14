import { Router } from 'express';

export function createMessageRouter(controller: any): Router {
  const router = Router();

  router.post('/queue', controller.sendToQueue.bind(controller));
  router.post('/exchange', controller.publishToExchange.bind(controller));
  router.post('/ack', controller.ackMessage.bind(controller));
  router.post('/nack', controller.nackMessage.bind(controller));

  return router;
}

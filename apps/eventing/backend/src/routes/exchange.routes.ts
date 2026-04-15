import { Router } from 'express';

export function createExchangeRouter(controller: any): Router {
  const router = Router();

  router.post('/', controller.createExchange.bind(controller));
  router.get('/', controller.listExchanges.bind(controller));
  router.delete('/:name', controller.deleteExchange.bind(controller));

  return router;
}

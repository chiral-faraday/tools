import { Router } from 'express';

export function createSimulationRouter(controller: any): Router {
  const router = Router();

  router.post('/load', controller.simulateLoad.bind(controller));

  router.post(
    '/consumer-delay',
    controller.simulateConsumerDelay.bind(controller),
  );

  return router;
}

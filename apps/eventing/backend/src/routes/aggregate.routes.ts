import { Router } from 'express';
import { createQueueRouter } from './queue.routes.js';
import { createMessageRouter } from './message.routes.js';
import { createExchangeRouter } from './exchange.routes.js';
import { createBindingRouter } from './binding.routes.js';
import { createConsumerRouter } from './consumer.routes.js';
import { createSimulationRouter } from './simulation.routes.js';
import { createHealthRouter } from './health.routes.js';

export function createApiRouter(deps: {
  queuesController: any;
  messagesController: any;
  exchangesController: any;
  bindingsController: any;
  consumersController: any;
  simulationController: any;
}) {
  const router = Router();

  router.use('/queues', createQueueRouter(deps.queuesController));
  router.use('/messages', createMessageRouter(deps.messagesController));
  router.use('/exchanges', createExchangeRouter(deps.exchangesController));
  router.use('/bindings', createBindingRouter(deps.bindingsController));
  router.use('/consumers', createConsumerRouter(deps.consumersController));
  router.use('/simulate', createSimulationRouter(deps.simulationController));
  router.use('/health', createHealthRouter());

  return router;
}

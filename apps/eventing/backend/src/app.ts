import express from 'express';
import bodyParser from 'body-parser';
import { createApiRouter } from './routes/aggregate.routes.js';

export function createApp(deps: {
  bindingsController: any;
  consumersController: any;
  exchangesController: any;
  healthController: any;
  messagesController: any;
  queuesController: any;
  simulationController: any;
}) {
  const app = express();

  app.use(bodyParser.json());
  app.use('/api/v1/eventing', createApiRouter(deps));

  return app;
}

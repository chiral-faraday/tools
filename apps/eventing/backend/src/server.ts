import http from 'http';
import { createApp } from './app.js';
import { RabbitMQManager } from './lib/amqp/amqp.js';

// Controllers
import { HealthController } from './controllers/health.controller.js';
import { SimulationController } from './controllers/simulation.controller.js';
import { MessageController } from './controllers/message.controller.js';
import { QueueController } from './controllers/queue.controller.js';
import { ExchangeController } from './controllers/exchange.controller.js';
import { BindingController } from './controllers/binding.controller.js';
import { ConsumerController } from './controllers/consumer.controller.js';

// Services
import { HealthService } from './services/health/health.service.js';
import { SimulationService } from './services/simulation/simulation.service.js';
import { MessageService } from './services/message/message.service.js';
import { QueueService } from './services/queue/queue.service.js';
import { ExchangeService } from './services/exchange/exchange.service.js';
import { BindingService } from './services/binding/binding.service.js';
import { ConsumerService } from './services/consumer/consumer.service.js';

const PORT = process.env.PORT ?? 3000;

async function bootstrap() {
  // -------------------
  // INFRA
  // -------------------
  const mq = new RabbitMQManager();
  await mq.initialize();

  console.log('[RabbitMQ] connected');

  // -------------------
  // SERVICES
  // -------------------

  const bindingService = new BindingService(mq);
  const consumerService = new ConsumerService(mq);
  const exchangeService = new ExchangeService(mq);
  const healthService = new HealthService(mq);
  const messageService = new MessageService(mq);
  const queueService = new QueueService(mq);
  const simulationService = new SimulationService(messageService);

  // -------------------
  // CONTROLLERS
  // -------------------
  const bindingController = new BindingController(bindingService);
  const consumerController = new ConsumerController(consumerService);
  const exchangeController = new ExchangeController(exchangeService);
  const healthController = new HealthController(healthService);
  const messagesController = new MessageController(messageService);
  const queueController = new QueueController(queueService);
  const simulationController = new SimulationController(simulationService);

  // -------------------
  // APP (aggregate router)
  // -------------------

  const app = createApp({
    bindingsController: bindingController,
    consumersController: consumerController,
    exchangesController: exchangeController,
    healthController: healthController,
    messagesController: messagesController,
    queuesController: queueController,
    simulationController: simulationController,
  });

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`[Shutdown] ${signal}`);

    server.close(async () => {
      await mq.close();
      console.log('[RabbitMQ] closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap();

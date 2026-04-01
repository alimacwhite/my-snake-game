import express from 'express';
import eventsRouter from './routes/events.js';
import stripeRouter from './routes/stripe.js';

export function createApp() {
  const app = express();

  app.use('/v1/stripe/webhook', stripeRouter);
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/v1/events', eventsRouter);

  return app;
}

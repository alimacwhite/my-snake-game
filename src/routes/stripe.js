import express from 'express';
import { getStripeClient } from '../services/stripeService.js';
import { markEntryPaid } from '../services/eventService.js';

const router = express.Router();

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const stripe = getStripeClient();
  const signature = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      const userId = pi.metadata.user_id;
      const eventId = pi.metadata.event_id;

      if (userId && eventId) {
        await markEntryPaid({ eventId, userId, paymentIntentId: pi.id });
      }
    }

    return res.json({ received: true });
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

export default router;

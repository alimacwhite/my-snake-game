import express from 'express';
import { createEntryPaymentIntent } from '../services/stripeService.js';
import { getOpenEventById, upsertPendingEntry } from '../services/eventService.js';

const router = express.Router();

// Demo auth shim. Replace with real JWT middleware.
router.use((req, _res, next) => {
  req.user = { id: req.header('x-user-id') || '00000000-0000-0000-0000-000000000001' };
  next();
});

router.get('/', async (_req, res) => {
  res.json({
    data: [
      {
        id: '11111111-1111-1111-1111-111111111111',
        title: 'Silver Hourly',
        event_type: 'ranked_paid',
        entry_fee_cents: 50,
        currency: 'USD',
        status: 'open'
      }
    ]
  });
});

router.post('/:eventId/entry-intent', async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  try {
    const event = (await getOpenEventById(eventId)) || {
      id: eventId,
      title: 'Silver Hourly',
      event_type: 'ranked_paid',
      entry_fee_cents: 50,
      currency: 'USD',
      status: 'open'
    };

    await upsertPendingEntry({ eventId: event.id, userId });

    const paymentIntent = await createEntryPaymentIntent({
      amountCents: event.entry_fee_cents,
      currency: event.currency,
      userId,
      eventId: event.id,
      eventType: event.event_type
    });

    res.json({
      payment_intent_id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
      amount_cents: event.entry_fee_cents,
      currency: event.currency
    });
  } catch (error) {
    res.status(400).json({ error: error.message || 'failed_to_create_entry_intent' });
  }
});

export default router;

import Stripe from 'stripe';

let stripeClient;

export function getStripeClient() {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  }
  return stripeClient;
}

export async function createEntryPaymentIntent({ amountCents, currency, userId, eventId, eventType }) {
  const stripe = getStripeClient();

  return stripe.paymentIntents.create({
    amount: amountCents,
    currency: currency.toLowerCase(),
    automatic_payment_methods: { enabled: true },
    metadata: {
      user_id: userId,
      event_id: eventId,
      game_mode: eventType
    }
  });
}

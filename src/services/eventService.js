import { query } from '../db/client.js';

export async function getOpenEventById(eventId) {
  const result = await query(
    `SELECT id, title, event_type, entry_fee_cents, currency, status
     FROM events
     WHERE id = $1 AND status = 'open'`,
    [eventId]
  );
  return result.rows[0] || null;
}

export async function upsertPendingEntry({ eventId, userId }) {
  await query(
    `INSERT INTO event_entries (event_id, user_id, status)
     VALUES ($1, $2, 'pending')
     ON CONFLICT (event_id, user_id)
     DO UPDATE SET status = 'pending'`,
    [eventId, userId]
  );
}

export async function markEntryPaid({ eventId, userId, paymentIntentId }) {
  await query(
    `UPDATE event_entries
     SET status = 'paid', payment_intent_id = $1
     WHERE event_id = $2 AND user_id = $3`,
    [paymentIntentId, eventId, userId]
  );
}

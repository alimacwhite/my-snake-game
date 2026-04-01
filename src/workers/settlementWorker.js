import 'dotenv/config';
import { query } from '../db/client.js';

async function settleCompletedEvents() {
  const { rows } = await query(
    `SELECT id FROM events WHERE status = 'completed' ORDER BY starts_at ASC LIMIT 20`
  );

  for (const row of rows) {
    // Placeholder settlement logic.
    await query(`UPDATE events SET status = 'settled' WHERE id = $1`, [row.id]);
    console.log(`Settled event ${row.id}`);
  }
}

setInterval(() => {
  settleCompletedEvents().catch(err => {
    console.error('Settlement worker error', err);
  });
}, 30_000);

console.log('Settlement worker started');

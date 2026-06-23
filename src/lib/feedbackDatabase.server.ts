import { neon } from "@neondatabase/serverless";
import { normalizeFeedbackMessage, type AnonymousFeedback, type FeedbackList } from "@/lib/feedback";

export function isFeedbackDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
}

function getSql() {
  const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("feedback_database_not_configured");
  }
  return neon(connectionString);
}

export async function ensureFeedbackSchema() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS kode_wilayah_feedback (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function recordAnonymousFeedback(message: string): Promise<AnonymousFeedback> {
  if (!isFeedbackDatabaseConfigured()) {
    throw new Error("feedback_database_not_configured");
  }

  const normalizedMessage = normalizeFeedbackMessage(message);
  if (!normalizedMessage) {
    throw new Error("invalid_feedback");
  }

  await ensureFeedbackSchema();
  const sql = getSql();

  const rows = await sql`
    INSERT INTO kode_wilayah_feedback (message)
    VALUES (${normalizedMessage})
    RETURNING id, message, created_at
  `;

  const row = rows[0];
  return {
    id: String(row.id),
    message: String(row.message),
    createdAt: String(row.created_at),
  };
}

export async function readAnonymousFeedback(limit = 100): Promise<FeedbackList> {
  if (!isFeedbackDatabaseConfigured()) {
    throw new Error("feedback_database_not_configured");
  }

  await ensureFeedbackSchema();
  const sql = getSql();

  const safeLimit = Math.min(Math.max(limit, 1), 500);
  const countResult = await sql`SELECT COUNT(*)::int AS total FROM kode_wilayah_feedback`;
  const rows = await sql`
    SELECT id, message, created_at
    FROM kode_wilayah_feedback
    ORDER BY created_at DESC
    LIMIT ${safeLimit}
  `;

  return {
    items: rows.map((row) => ({
      id: String(row.id),
      message: String(row.message),
      createdAt: String(row.created_at),
    })),
    totalCount: Number(countResult[0]?.total ?? 0),
  };
}

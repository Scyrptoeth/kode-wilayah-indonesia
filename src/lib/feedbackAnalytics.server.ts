import { randomUUID } from "node:crypto";
import { getCentralRedis, isCentralStorageConfigured } from "@/lib/centralStorage.server";
import { normalizeFeedbackMessage, type AnonymousFeedback, type FeedbackList } from "@/lib/feedback";

const FEEDBACK_LIST_KEY = "kode-wilayah-indonesia:feedback:anonymous";
const MAX_STORED_FEEDBACK = 500;

function normalizeStoredFeedback(value: unknown): AnonymousFeedback | null {
  const parsedValue = typeof value === "string" ? JSON.parse(value) : value;

  if (!parsedValue || typeof parsedValue !== "object") {
    return null;
  }

  const rawFeedback = parsedValue as Partial<AnonymousFeedback>;
  if (
    typeof rawFeedback.id !== "string" ||
    typeof rawFeedback.message !== "string" ||
    typeof rawFeedback.createdAt !== "string"
  ) {
    return null;
  }

  return {
    id: rawFeedback.id,
    message: rawFeedback.message,
    createdAt: rawFeedback.createdAt,
  };
}

export function isCentralFeedbackStorageConfigured() {
  return isCentralStorageConfigured();
}

export async function recordCentralAnonymousFeedback(message: string) {
  const redis = getCentralRedis();
  if (!redis) {
    throw new Error("central_feedback_storage_not_configured");
  }

  const normalizedMessage = normalizeFeedbackMessage(message);
  if (!normalizedMessage) {
    throw new Error("invalid_feedback");
  }

  const feedback: AnonymousFeedback = {
    id: randomUUID(),
    message: normalizedMessage,
    createdAt: new Date().toISOString(),
  };

  await redis.lpush(FEEDBACK_LIST_KEY, JSON.stringify(feedback));
  await redis.ltrim(FEEDBACK_LIST_KEY, 0, MAX_STORED_FEEDBACK - 1);

  return feedback;
}

export async function readCentralAnonymousFeedback(limit = 100): Promise<FeedbackList> {
  const redis = getCentralRedis();
  if (!redis) {
    throw new Error("central_feedback_storage_not_configured");
  }

  const safeLimit = Math.min(Math.max(limit, 1), MAX_STORED_FEEDBACK);
  const [items, totalCount] = await Promise.all([
    redis.lrange<unknown>(FEEDBACK_LIST_KEY, 0, safeLimit - 1),
    redis.llen(FEEDBACK_LIST_KEY),
  ]);

  return {
    items: items.flatMap((item) => {
      try {
        const feedback = normalizeStoredFeedback(item);
        return feedback ? [feedback] : [];
      } catch {
        return [];
      }
    }),
    totalCount,
  };
}

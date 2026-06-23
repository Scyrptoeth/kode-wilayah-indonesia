import { type FeedbackList } from "@/lib/feedback";

type FeedbackSyncResult =
  | { ok: true; source: "central" }
  | { ok: false; source: "local"; error: string };

export async function submitAnonymousFeedback(message: string): Promise<FeedbackSyncResult> {
  try {
    const response = await fetch("/api/feedback", {
      body: JSON.stringify({ message }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      return { ok: false, source: "local", error: payload?.error ?? `http_${response.status}` };
    }

    return { ok: true, source: "central" };
  } catch (error) {
    return { ok: false, source: "local", error: error instanceof Error ? error.message : "network_error" };
  }
}

export async function fetchCentralFeedbackWithToken(token: string): Promise<
  | { ok: true; source: "central"; feedback: FeedbackList }
  | { ok: false; source: "local"; error: string }
> {
  const normalizedToken = token.trim();

  if (!normalizedToken) {
    return { ok: false, source: "local", error: "missing_developer_token" };
  }

  try {
    const response = await fetch("/api/feedback", {
      headers: {
        Authorization: `Bearer ${normalizedToken}`,
      },
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      return { ok: false, source: "local", error: payload?.error ?? `http_${response.status}` };
    }

    const payload = (await response.json()) as { items?: unknown; totalCount?: unknown };
    return {
      ok: true,
      source: "central",
      feedback: {
        items: Array.isArray(payload.items) ? (payload.items as FeedbackList["items"]) : [],
        totalCount: typeof payload.totalCount === "number" ? payload.totalCount : 0,
      },
    };
  } catch (error) {
    return { ok: false, source: "local", error: error instanceof Error ? error.message : "network_error" };
  }
}

import {
  isFeedbackDatabaseConfigured,
  readAnonymousFeedback,
  recordAnonymousFeedback,
} from "@/lib/feedbackDatabase.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FeedbackBody = {
  message?: unknown;
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function getAdminToken(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length).trim();
}

function isDeveloperAuthorized(request: Request) {
  const configuredToken = process.env.KODE_WILAYAH_ADMIN_TOKEN;
  const requestToken = getAdminToken(request);

  return Boolean(configuredToken && requestToken && requestToken === configuredToken);
}

function getErrorStatus(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (message === "invalid_feedback") {
    return 400;
  }

  if (message === "feedback_database_not_configured") {
    return 503;
  }

  return 500;
}

export async function GET(request: Request) {
  if (!isFeedbackDatabaseConfigured()) {
    return jsonResponse({ ok: false, error: "feedback_database_not_configured" }, 503);
  }

  if (!process.env.KODE_WILAYAH_ADMIN_TOKEN) {
    return jsonResponse({ ok: false, error: "admin_token_not_configured" }, 503);
  }

  if (!isDeveloperAuthorized(request)) {
    return jsonResponse({ ok: false, error: "unauthorized" }, 401);
  }

  try {
    const feedback = await readAnonymousFeedback();
    return jsonResponse({ ok: true, source: "database", ...feedback });
  } catch (error) {
    return jsonResponse(
      { ok: false, error: error instanceof Error ? error.message : "unknown_error" },
      getErrorStatus(error),
    );
  }
}

export async function POST(request: Request) {
  if (!isFeedbackDatabaseConfigured()) {
    return jsonResponse({ ok: false, error: "feedback_database_not_configured" }, 503);
  }

  let body: FeedbackBody;

  try {
    body = (await request.json()) as FeedbackBody;
  } catch {
    return jsonResponse({ ok: false, error: "invalid_json" }, 400);
  }

  if (typeof body.message !== "string") {
    return jsonResponse({ ok: false, error: "invalid_feedback" }, 400);
  }

  try {
    const feedback = await recordAnonymousFeedback(body.message);
    return jsonResponse({ ok: true, source: "database", feedback });
  } catch (error) {
    return jsonResponse(
      { ok: false, error: error instanceof Error ? error.message : "unknown_error" },
      getErrorStatus(error),
    );
  }
}

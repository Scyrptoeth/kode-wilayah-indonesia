"use client";

import { Eye, EyeSlash, LockKey } from "@phosphor-icons/react";
import { useCallback, useState } from "react";
import { fetchCentralFeedbackWithToken } from "@/lib/feedbackSync";
import type { AnonymousFeedback, FeedbackList } from "@/lib/feedback";

export default function DeveloperPage() {
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackList | null>(null);

  const loadFeedback = useCallback(async () => {
    setStatus("loading");
    setError(null);

    const result = await fetchCentralFeedbackWithToken(token);
    if (result.ok) {
      setFeedback(result.feedback);
      setStatus("success");
      return;
    }

    setError(result.error);
    setStatus("error");
  }, [token]);

  return (
    <main className="developer-page">
      <section className="developer-hero">
        <div>
          <p className="developer-eyebrow">Developer</p>
          <h1>Feedback Anonim</h1>
          <p>Akses seluruh masukan pengguna yang dikirim melalui kolom feedback anonim.</p>
        </div>
      </section>

      <section className="developer-panel">
        <div className="developer-section-heading">
          <div>
            <p className="developer-eyebrow">Autentikasi</p>
            <h2>Masukkan token admin</h2>
          </div>
        </div>
        <div className="developer-token-form">
          <div className="developer-token-field">
            <label htmlFor="developer-token">Token admin</label>
            <div className="developer-token-input-wrap">
              <LockKey size={18} weight="duotone" aria-hidden="true" />
              <input
                id="developer-token"
                type={showToken ? "text" : "password"}
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="Kode Wilayah Admin Token"
              />
              <button
                type="button"
                className="developer-token-toggle"
                onClick={() => setShowToken((current) => !current)}
                aria-label={showToken ? "Sembunyikan token" : "Tampilkan token"}
              >
                {showToken ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="button"
            className="developer-token-submit"
            onClick={loadFeedback}
            disabled={status === "loading" || !token.trim()}
          >
            {status === "loading" ? "Memuat…" : "Lihat feedback"}
          </button>
        </div>
        {error ? (
          <p className="developer-status is-error" role="alert">
            {getErrorMessage(error)}
          </p>
        ) : null}
      </section>

      {status === "success" && feedback ? (
        <section className="developer-panel">
          <div className="developer-section-heading">
            <div>
              <p className="developer-eyebrow">Feedback anonim</p>
              <h2>Masukan pengguna terbaru</h2>
            </div>
            <span className="developer-count-pill">{feedback.totalCount} total</span>
          </div>
          {feedback.items.length ? (
            <div className="developer-feedback-list">
              {feedback.items.map((item) => (
                <DeveloperFeedbackItem key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="developer-empty">Belum ada feedback yang masuk.</p>
          )}
        </section>
      ) : null}
    </main>
  );
}

function DeveloperFeedbackItem({ item }: { item: AnonymousFeedback }) {
  return (
    <article className="developer-feedback-item">
      <p>{item.message}</p>
      <small>{formatFeedbackDate(item.createdAt)}</small>
    </article>
  );
}

function getErrorMessage(error: string) {
  if (error === "unauthorized") {
    return "Token admin tidak valid.";
  }
  if (error === "feedback_database_not_configured") {
    return "Database feedback belum terhubung. Hubungi developer aplikasi.";
  }
  if (error === "admin_token_not_configured") {
    return "Token admin belum dikonfigurasi di server.";
  }
  if (error === "missing_developer_token") {
    return "Masukkan token admin terlebih dahulu.";
  }
  return "Gagal memuat feedback. Silakan coba lagi.";
}

function formatFeedbackDate(value: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

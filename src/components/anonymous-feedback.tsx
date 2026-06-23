"use client";

import { ChatCircle, CheckCircle, PaperPlaneTilt, XCircle } from "@phosphor-icons/react";
import { type FormEvent, useState } from "react";
import { FEEDBACK_MAX_LENGTH } from "@/lib/feedback";
import { submitAnonymousFeedback } from "@/lib/feedbackSync";

type AnonymousFeedbackStatus = "idle" | "sending" | "sent" | "error";

function getAnonymousFeedbackErrorMessage(error: string | null) {
  if (!error) {
    return null;
  }

  if (error === "central_feedback_storage_not_configured") {
    return "Feedback belum dapat dikirim karena storage terpusat belum aktif.";
  }

  if (error === "invalid_feedback") {
    return "Tulis feedback terlebih dahulu sebelum mengirim.";
  }

  return "Feedback belum berhasil dikirim. Silakan coba lagi.";
}

export function AnonymousFeedback() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<AnonymousFeedbackStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = message.trim();
    if (!trimmed) {
      setStatus("error");
      setError("invalid_feedback");
      return;
    }

    setStatus("sending");
    setError(null);

    const result = await submitAnonymousFeedback(trimmed);
    if (result.ok) {
      setMessage("");
      setStatus("sent");
      return;
    }

    setStatus("error");
    setError(result.error);
  }

  return (
    <section className="anonymous-feedback-panel" aria-labelledby="anonymous-feedback-title">
      <div className="anonymous-feedback-copy">
        <span className="anonymous-feedback-icon">
          <ChatCircle aria-hidden="true" size={20} weight="duotone" />
        </span>
        <div>
          <p className="anonymous-feedback-eyebrow">Feedback Anonim</p>
          <h3 id="anonymous-feedback-title">Beri feedback secara anonim di sini</h3>
        </div>
      </div>
      <form className="anonymous-feedback-form" onSubmit={handleSubmit}>
        <label className="anonymous-feedback-field">
          <span>Isi feedback</span>
          <textarea
            maxLength={FEEDBACK_MAX_LENGTH}
            onChange={(event) => {
              setMessage(event.target.value);
              if (status !== "idle") {
                setStatus("idle");
                setError(null);
              }
            }}
            placeholder="Tulis saran, kendala, atau masukan singkat untuk website ini."
            rows={2}
            value={message}
          />
        </label>
        <button
          className="anonymous-feedback-submit"
          disabled={status === "sending"}
          type="submit"
        >
          <PaperPlaneTilt aria-hidden="true" size={18} weight="bold" />
          {status === "sending" ? "Mengirim" : "Kirim feedback"}
        </button>
      </form>
      {status === "sent" ? (
        <p className="anonymous-feedback-status is-success">
          <CheckCircle aria-hidden="true" size={18} weight="duotone" />
          Terima kasih. Feedback anonim Anda sudah terkirim.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="anonymous-feedback-status is-error">
          <XCircle aria-hidden="true" size={18} weight="duotone" />
          {getAnonymousFeedbackErrorMessage(error)}
        </p>
      ) : null}
    </section>
  );
}

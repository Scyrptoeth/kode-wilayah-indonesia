export const FEEDBACK_MAX_LENGTH = 600;

export type AnonymousFeedback = {
  id: string;
  message: string;
  createdAt: string;
};

export type FeedbackList = {
  items: AnonymousFeedback[];
  totalCount: number;
};

export function normalizeFeedbackMessage(message: string) {
  return message.replace(/\s+/g, " ").trim().slice(0, FEEDBACK_MAX_LENGTH);
}

// FeedbackView.tsx
// Grade score + instructor feedback shown after an assignment is graded.
// FIX: All light-mode colours converted to dark-theme rgba tints.
// FIX: Score + feedback stack vertically on mobile, side-by-side on desktop.

import React from "react";
import { theme } from "@/styles/theme";
import { Submission } from "@/shared/types/assignment.types";
import { Award, MessageCircle } from "lucide-react";

interface FeedbackProps {
  submission: Submission;
  totalPoints: number;
}

export default function FeedbackView({
  submission,
  totalPoints,
}: FeedbackProps) {
  const css = `
    .fv-wrapper {
      border-top:  1px solid ${theme.colors.border};
      padding-top: 32px;
    }
    .fv-inner {
      display:        flex;
      gap:            20px;
      align-items:    stretch;
      flex-direction: column;   /* mobile: stacked */
    }
    .fv-score {
      padding:         24px;
      border-radius:   ${theme.borderRadius.lg};
      background:      ${theme.colors.successBg};
      border:          1px solid ${theme.colors.successBorder};
      text-align:      center;
      display:         flex;
      flex-direction:  column;
      align-items:     center;
      justify-content: center;
      gap:             8px;
    }
    .fv-feedback {
      flex:            1;
      padding:         24px;
      border-radius:   ${theme.borderRadius.lg};
      border:          1px solid ${theme.colors.border};
      background-color:${theme.colors.bgHover};
    }
    @media (min-width: 640px) {
      .fv-inner {
        flex-direction: row;  /* desktop: side by side */
        align-items:    stretch;
      }
      .fv-score {
        width:     180px;
        flex-shrink:0;
      }
    }
  `;

  return (
    <div className="fv-wrapper">
      <style>{css}</style>
      <div className="fv-inner">
        {/* ── Score badge ────────────────────────────────────────── */}
        <div className="fv-score">
          <Award size={30} color={theme.colors.success} />
          <span
            style={{
              display: "block",
              fontSize: "36px",
              fontWeight: 800,
              color: theme.colors.successText,
              lineHeight: 1,
            }}
          >
            {/* Fallback: grade may be null if not yet filled */}
            {submission.grade ?? "—"}
          </span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: theme.colors.textSecondary,
            }}
          >
            out of {totalPoints}
          </span>
        </div>

        {/* ── Instructor feedback ─────────────────────────────────── */}
        <div className="fv-feedback">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
              color: theme.colors.textMain,
            }}
          >
            <MessageCircle size={17} color={theme.colors.primary} />
            <span style={{ fontWeight: 700, fontSize: "15px" }}>
              Instructor Feedback
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: theme.colors.textSecondary,
              lineHeight: "1.7",
              fontStyle: "italic",
            }}
          >
            "{submission.feedback ?? "No feedback provided."}"
          </p>
        </div>
      </div>
    </div>
  );
}

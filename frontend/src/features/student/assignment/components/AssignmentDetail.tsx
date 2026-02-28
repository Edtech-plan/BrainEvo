// AssignmentDetail.tsx
// Full detail view for a single assignment — instructions, attachments, submission/feedback.
// FIX: bgSurface → bgCard, all dividers use theme.colors.border.
// FIX: Responsive header stacks title/meta on mobile.

import React from "react";
import { theme } from "@/styles/theme";
import { Assignment } from "../../../../shared/types/assignment.types";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Calendar,
  FileText,
} from "lucide-react";
import FeedbackView from "./FeedbackView";
import SubmissionArea from "./SubmissionArea";

interface AssignmentDetailsProps {
  assignment: Assignment;
  onBack: () => void;
  onSuccess: () => void;
}

export default function AssignmentDetail({
  assignment,
  onBack,
  onSuccess,
}: AssignmentDetailsProps) {
  const isCompleted =
    assignment.status === "SUBMITTED" || assignment.status === "GRADED";

  const css = `
    /* ── Responsive header: side-by-side on desktop, stacked on mobile ── */
    .ad-header-inner {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }
    .ad-meta {
      text-align: right;
      flex-shrink: 0;
    }
    @media (max-width: 640px) {
      .ad-header-inner {
        flex-direction: column;
        align-items: flex-start;
      }
      .ad-meta {
        text-align: left;
        width: 100%;
        padding-top: 12px;
        border-top: 1px solid ${theme.colors.border};
      }
    }

    /* ── Attachment link hover ─────────────────────────────────────────── */
    .ad-attachment {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: ${theme.borderRadius.md};
      border: 1px solid ${theme.colors.border};
      text-decoration: none;
      background-color: ${theme.colors.bgHover};
      color: ${theme.colors.textMain};
      font-size: 14px;
      font-weight: 600;
      transition: all ${theme.transitions.fast};
    }
    .ad-attachment:hover {
      border-color: rgba(16,185,129,0.4);
      background-color: ${theme.colors.bgActive};
      color: ${theme.colors.primary};
    }

    /* ── Back button hover ─────────────────────────────────────────────── */
    .ad-back-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      color: ${theme.colors.textSecondary};
      cursor: pointer;
      margin-bottom: 20px;
      font-weight: 600;
      font-size: 14px;
      padding: 6px 0;
      font-family: ${theme.font.sans};
      transition: color ${theme.transitions.fast};
    }
    .ad-back-btn:hover {
      color: ${theme.colors.textMain};
    }
  `;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <style>{css}</style>

      {/* ── Back button ──────────────────────────────────────────────── */}
      <button className="ad-back-btn" onClick={onBack}>
        <ArrowLeft size={18} />
        Back to list
      </button>

      {/* ── Main card ────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: theme.colors.bgCard,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.card,
          padding: "clamp(20px, 4vw, 40px)",
        }}
      >
        {/* ── Header ───────────────────────────────────────────────── */}
        <div
          style={{
            borderBottom: `1px solid ${theme.colors.border}`,
            paddingBottom: "24px",
            marginBottom: "28px",
          }}
        >
          <div className="ad-header-inner">
            {/* Left: subject + title */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontSize: "12px",
                  color: theme.colors.primary,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {assignment.subject}
              </span>
              <h1
                style={{
                  margin: "8px 0 0",
                  fontSize: "clamp(20px, 3vw, 28px)",
                  fontWeight: 800,
                  color: theme.colors.textMain,
                  lineHeight: 1.25,
                  letterSpacing: "-0.02em",
                }}
              >
                {assignment.title}
              </h1>
            </div>

            {/* Right: due date + points */}
            <div className="ad-meta">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: theme.colors.textSecondary,
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                <Calendar size={15} color={theme.colors.primary} />
                <span>Due: </span>
                <strong style={{ color: theme.colors.textMain }}>
                  {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </strong>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: theme.colors.textSecondary,
                  fontSize: "14px",
                  fontWeight: 500,
                  marginTop: "6px",
                  justifyContent: "flex-end",
                }}
              >
                <FileText size={15} color={theme.colors.accent} />
                <span>Points: </span>
                <strong style={{ color: theme.colors.textMain }}>
                  {assignment.pointsTotal}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* ── Instructions ─────────────────────────────────────────── */}
        <div style={{ marginBottom: "36px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: theme.colors.textMain,
              marginBottom: "12px",
              margin: "0 0 12px",
            }}
          >
            Instructions
          </h3>
          <p
            style={{
              fontSize: "15px",
              color: theme.colors.textSecondary,
              lineHeight: "1.7",
              whiteSpace: "pre-wrap",
              margin: 0,
              padding: "16px",
              background: theme.colors.bgHover,
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            {assignment.description}
          </p>
        </div>

        {/* ── Attachments ──────────────────────────────────────────── */}
        {assignment.attachments && assignment.attachments.length > 0 && (
          <div style={{ marginBottom: "36px" }}>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: theme.colors.textMain,
                marginBottom: "12px",
                margin: "0 0 12px",
              }}
            >
              Reference Materials
            </h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {assignment.attachments.map((att, i) => (
                <a
                  key={i}
                  href={att.url}
                  className="ad-attachment"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {att.type === "LINK" ? (
                    <ExternalLink size={15} />
                  ) : (
                    <Download size={15} />
                  )}
                  <span>{att.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Submission or Feedback ───────────────────────────────── */}
        {assignment.status === "GRADED" && assignment.mySubmission ? (
          <FeedbackView
            submission={assignment.mySubmission}
            totalPoints={assignment.pointsTotal}
          />
        ) : (
          <SubmissionArea
            assignmentId={assignment.id}
            isSubmitted={isCompleted}
            onSuccess={onSuccess}
          />
        )}
      </div>
    </div>
  );
}

// SubmissionArea.tsx
// Handles file upload and link submission for an assignment.
// FIX: All light-mode colours converted to dark rgba tints.
// FIX: Upload zone, success state, and toggle buttons use dark theme.

import React, { useState } from "react";
import { theme } from "@/styles/theme";
import {
  Upload,
  Link as LinkIcon,
  CheckCircle,
  FileText,
  X,
} from "lucide-react";
import ActionButton from "@/features/student/live-classes/components/ActionButton";
import { useFileUpload } from "../hooks/useFileUpload";

interface SubmissionAreaProps {
  assignmentId: string;
  isSubmitted: boolean;
  onSuccess: () => void;
}

export default function SubmissionArea({
  assignmentId: _assignmentId,
  isSubmitted,
  onSuccess,
}: SubmissionAreaProps) {
  const [method, setMethod] = useState<"FILE" | "LINK">("FILE");
  const [linkUrl, setLinkUrl] = useState("");

  const { file, triggerFileDialog, handleFileChange, clearFile, fileInputRef } =
    useFileUpload();

  const css = `
    /* ── Mobile-first ──────────────────────────────────────────────── */
    .sa-container {
      border-top:   1px solid ${theme.colors.border};
      padding-top:  24px;
      margin-top:   24px;
    }
    .sa-toggle-group {
      display:          flex;
      gap:              6px;
      margin-bottom:    24px;
      background-color: ${theme.colors.bgHover};
      padding:          4px;
      border-radius:    ${theme.borderRadius.md};
      border:           1px solid ${theme.colors.border};
    }
    .sa-toggle-btn {
      flex:            1;
      padding:         10px;
      border-radius:   8px;
      border:          none;
      font-size:       13px;
      font-weight:     600;
      cursor:          pointer;
      transition:      all ${theme.transitions.fast};
      display:         flex;
      align-items:     center;
      justify-content: center;
      gap:             8px;
      font-family:     ${theme.font.sans};
    }
    /* Upload drop zone */
    .sa-upload-zone {
      border:           2px dashed ${theme.colors.border};
      padding:          36px 20px;
      border-radius:    ${theme.borderRadius.lg};
      text-align:       center;
      background-color: ${theme.colors.bgHover};
      cursor:           pointer;
      transition:       all ${theme.transitions.fast};
      position:         relative;
    }
    .sa-upload-zone:hover,
    .sa-upload-zone:focus-visible {
      border-color:     ${theme.colors.primary};
      background-color: ${theme.colors.bgActive};
      outline:          none;
    }
    .sa-submit-wrapper {
      margin-top: 20px;
      width:      100%;
    }

    /* ── Desktop ────────────────────────────────────────────────────── */
    @media (min-width: 640px) {
      .sa-container        { padding-top: 36px; margin-top: 36px; }
      .sa-toggle-group     { display: inline-flex; background-color: transparent; border: none; padding: 0; gap: 12px; }
      .sa-toggle-btn       { flex: none; padding: 8px 18px; }
      .sa-upload-zone      { padding: 52px 40px; }
      .sa-submit-wrapper   { display: flex; justify-content: flex-end; }
    }
  `;

  // ── Submitted / success state ─────────────────────────────────────
  if (isSubmitted) {
    return (
      <div
        style={{
          padding: "28px",
          backgroundColor: theme.colors.successBg,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.successBorder}`,
          textAlign: "center",
          marginTop: "32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <CheckCircle size={32} color={theme.colors.success} />
        <h4
          style={{
            margin: 0,
            color: theme.colors.successText,
            fontSize: "16px",
            fontWeight: 700,
          }}
        >
          Work Submitted
        </h4>
        <p
          style={{
            fontSize: "14px",
            color: theme.colors.textSecondary,
            margin: 0,
          }}
        >
          Your instructor will review it shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="sa-container">
      <style>{css}</style>

      {/* ── Hidden file input ────────────────────────────────────── */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept=".pdf,.doc,.docx,.zip,.jpg,.png"
      />

      <h3
        style={{
          fontSize: "17px",
          fontWeight: 700,
          color: theme.colors.textMain,
          margin: "0 0 18px",
        }}
      >
        Submit Assignment
      </h3>

      {/* ── Method toggle ────────────────────────────────────────── */}
      <div className="sa-toggle-group">
        {(["FILE", "LINK"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className="sa-toggle-btn"
            style={{
              backgroundColor:
                method === m ? theme.colors.bgCard : "transparent",
              color:
                method === m
                  ? theme.colors.primary
                  : theme.colors.textSecondary,
              boxShadow: method === m ? theme.shadows.sm : "none",
              border:
                method === m
                  ? `1px solid ${theme.colors.border}`
                  : "1px solid transparent",
            }}
          >
            {m === "FILE" ? (
              <>
                <Upload size={15} /> File Upload
              </>
            ) : (
              <>
                <LinkIcon size={15} /> External Link
              </>
            )}
          </button>
        ))}
      </div>

      {/* ── File drop zone ───────────────────────────────────────── */}
      {method === "FILE" ? (
        <div
          className="sa-upload-zone"
          style={{
            borderColor: file ? theme.colors.success : theme.colors.border,
          }}
          onClick={!file ? triggerFileDialog : undefined}
          onKeyDown={
            !file
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") triggerFileDialog();
                }
              : undefined
          }
          tabIndex={!file ? 0 : -1}
          role="button"
          aria-disabled={!!file}
          aria-label="Upload file area"
        >
          {file ? (
            /* ── File selected state ──────────────────────────── */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "13px",
                  backgroundColor: theme.colors.successBg,
                  border: `1px solid ${theme.colors.successBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileText size={24} color={theme.colors.success} />
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    color: theme.colors.textMain,
                    fontSize: "14px",
                  }}
                >
                  {file.name}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "12px",
                    color: theme.colors.successText,
                    fontWeight: 500,
                  }}
                >
                  Ready to submit ({Math.round(file.size / 1024)} KB)
                </p>
              </div>

              {/* Clear file button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                aria-label="Remove file"
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "none",
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: theme.colors.textSecondary,
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  transition: `all ${theme.transitions.fast}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme.colors.errorBg;
                  e.currentTarget.style.color = theme.colors.error;
                  e.currentTarget.style.borderColor = theme.colors.errorBorder;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = theme.colors.textSecondary;
                  e.currentTarget.style.borderColor = theme.colors.border;
                }}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            /* ── Empty drop zone ──────────────────────────────── */
            <>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  backgroundColor: theme.colors.bgCard,
                  border: `1px solid ${theme.colors.border}`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <Upload size={22} color={theme.colors.textMuted} />
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontWeight: 600,
                  color: theme.colors.textMain,
                }}
              >
                Tap to upload file
              </p>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "13px",
                  color: theme.colors.textMuted,
                }}
              >
                PDF, DOCX, or ZIP — max 10 MB
              </p>
            </>
          )}
        </div>
      ) : (
        /* ── Link input ──────────────────────────────────────── */
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: theme.colors.textMuted,
              pointerEvents: "none",
            }}
          >
            <LinkIcon size={17} />
          </div>
          <input
            type="text"
            placeholder="https://drive.google.com/..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 14px 14px 44px",
              borderRadius: theme.borderRadius.md,
              border: `1.5px solid ${theme.colors.border}`,
              fontSize: "14px",
              outline: "none",
              backgroundColor: theme.colors.bgInput,
              color: theme.colors.textMain,
              fontFamily: theme.font.sans,
              transition: `border-color ${theme.transitions.fast}`,
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = theme.colors.primary;
              e.target.style.boxShadow = theme.shadows.input;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.colors.border;
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      )}

      {/* ── Submit button ─────────────────────────────────────────── */}
      <div className="sa-submit-wrapper">
        <ActionButton
          label={
            file || (method === "LINK" && linkUrl.length > 5)
              ? "Submit Assignment"
              : "Select File to Submit"
          }
          onClick={onSuccess}
          disabled={method === "FILE" ? !file : linkUrl.length < 5}
          style={{ width: "100%", padding: "12px" }}
        />
      </div>
    </div>
  );
}

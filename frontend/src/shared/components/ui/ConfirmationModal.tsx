import React, { useEffect } from "react";
import { theme } from "../../../../styles/theme";
import { AlertTriangle, LogOut, Trash2, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDangerous = false,
}: ConfirmationModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const dangerIcon = confirmLabel.toLowerCase().includes("delete") ? (
    <Trash2 size={24} color={theme.colors.error} />
  ) : confirmLabel.toLowerCase().includes("log out") ||
    confirmLabel.toLowerCase().includes("logout") ? (
    <LogOut size={24} color={theme.colors.error} />
  ) : (
    <AlertTriangle size={24} color={theme.colors.error} />
  );

  return (
    <>
      <style>{`
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cardIn {
          from { transform: scale(0.94) translateY(8px); opacity: 0; }
          to   { transform: scale(1) translateY(0);      opacity: 1; }
        }
        @keyframes sheetIn {
          from { transform: translateY(100%); }
          to   { transform: translateY(0);    }
        }

        /* ── Overlay wrapper ── */
        .cm-overlay {
          position: fixed; inset: 0; z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          animation: overlayIn 0.2s ease-out;
          padding: 20px;
        }

        /* ── Invisible backdrop button (handles click-outside dismiss) ── */
        .cm-backdrop {
          position: fixed; inset: 0;
          width: 100%; height: 100%;
          background: transparent;
          border: none;
          cursor: default;
          z-index: 0;
        }

        /* ── Modal card ── */
        .cm-card {
          background: ${theme.colors.bgCard};
          width: 100%;
          max-width: 400px;
          border-radius: ${theme.borderRadius.xl};
          border: 1px solid ${theme.colors.borderLight};
          box-shadow: ${theme.shadows.modal};
          overflow: hidden;
          animation: cardIn 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          z-index: 1;
        }

        /* ── Close button (top-right) ── */
        .cm-close {
          position: absolute;
          top: 14px; right: 14px;
          background: ${theme.colors.bgHover};
          border: 1px solid ${theme.colors.border};
          border-radius: ${theme.borderRadius.sm};
          color: ${theme.colors.textSecondary};
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          width: 30px; height: 30px;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .cm-close:hover {
          background: ${theme.colors.bgActive};
          color: ${theme.colors.textMain};
          border-color: ${theme.colors.borderLight};
        }

        /* ── Header ── */
        .cm-header {
          padding: 32px 28px 0 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
        }

        /* ── Icon ring ── */
        .cm-icon-ring {
          width: 68px; height: 68px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          background: ${isDangerous ? theme.colors.errorBg : theme.colors.primaryFaint};
          border: 6px solid ${
            isDangerous ? "rgba(248, 81, 73, 0.10)" : "rgba(16, 185, 129, 0.10)"
          };
          box-shadow: ${
            isDangerous
              ? "0 0 0 1px rgba(248,81,73,0.15)"
              : "0 0 0 1px rgba(16,185,129,0.12)"
          };
        }

        /* ── Title ── */
        .cm-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: ${theme.colors.textMain};
          letter-spacing: -0.02em;
          line-height: 1.3;
          font-family: ${theme.font.sans};
        }

        /* ── Body ── */
        .cm-body {
          padding: 14px 28px 28px 28px;
          text-align: center;
        }

        .cm-message {
          margin: 0;
          font-size: 14px;
          color: ${theme.colors.textSecondary};
          line-height: 1.75;
          font-family: ${theme.font.sans};
        }

        /* ── Divider ── */
        .cm-divider {
          height: 1px;
          background: ${theme.colors.border};
          margin: 0;
        }

        /* ── Footer ── */
        .cm-footer {
          padding: 20px 24px;
          display: flex;
          gap: 10px;
          background: ${theme.colors.bgSurface};
        }

        /* ── Cancel button ── */
        .cm-btn-cancel {
          flex: 1;
          padding: 11px 16px;
          border-radius: ${theme.borderRadius.md};
          border: 1px solid ${theme.colors.border};
          background: ${theme.colors.bgHover};
          color: ${theme.colors.textMain};
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: ${theme.font.sans};
        }
        .cm-btn-cancel:hover {
          background: ${theme.colors.bgActive};
          border-color: ${theme.colors.borderLight};
        }
        .cm-btn-cancel:active {
          transform: scale(0.98);
        }

        /* ── Confirm button ── */
        .cm-btn-confirm {
          flex: 1;
          padding: 11px 16px;
          border-radius: ${theme.borderRadius.md};
          border: none;
          background: ${
            isDangerous
              ? `linear-gradient(135deg, ${theme.colors.error}, #c0392b)`
              : theme.gradients.primary
          };
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          font-family: ${theme.font.sans};
          letter-spacing: 0.01em;
          box-shadow: ${
            isDangerous
              ? "0 4px 14px rgba(248, 81, 73, 0.35)"
              : theme.shadows.glowSm
          };
        }
        .cm-btn-confirm:hover {
          transform: translateY(-1px);
          box-shadow: ${
            isDangerous
              ? "0 6px 20px rgba(248, 81, 73, 0.45)"
              : theme.shadows.glow
          };
          opacity: 0.92;
        }
        .cm-btn-confirm:active {
          transform: translateY(0);
          opacity: 1;
        }

        /* ── Mobile: bottom sheet ── */
        @media (max-width: 480px) {
          .cm-overlay {
            align-items: flex-end;
            padding: 0;
          }
          .cm-card {
            max-width: 100%;
            border-radius: ${theme.borderRadius.xl} ${theme.borderRadius.xl} 0 0;
            animation: sheetIn 0.28s cubic-bezier(0.34, 1.2, 0.64, 1);
            padding-bottom: env(safe-area-inset-bottom, 16px);
          }
          /* drag handle pill */
          .cm-card::before {
            content: '';
            display: block;
            width: 36px; height: 4px;
            border-radius: 9999px;
            background: ${theme.colors.border};
            margin: 14px auto 0;
          }
          .cm-header {
            padding: 20px 20px 0 20px;
          }
          .cm-body {
            padding: 12px 20px 24px 20px;
          }
          .cm-footer {
            flex-direction: column-reverse;
            padding: 16px 20px 20px;
          }
          .cm-btn-cancel,
          .cm-btn-confirm {
            width: 100%;
            padding: 14px;
            font-size: 15px;
          }
        }
      `}</style>

      {/* Outer wrapper — layout only, role="presentation" suppresses ESLint */}
      <div className="cm-overlay" role="presentation">
        {/* Real <button> backdrop — handles click-outside, no ESLint warnings */}
        <button
          type="button"
          className="cm-backdrop"
          onClick={onClose}
          aria-label="Close modal"
          tabIndex={-1}
        />

        {/* Modal card — role="dialog" but no onClick needed */}
        <div
          className="cm-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cm-title"
          aria-describedby="cm-message"
        >
          {/* Close button */}
          <button
            type="button"
            className="cm-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={15} />
          </button>

          {/* Header */}
          <div className="cm-header">
            <div className="cm-icon-ring">
              {isDangerous ? (
                dangerIcon
              ) : (
                <span style={{ fontSize: 26 }}>✓</span>
              )}
            </div>
            <h3 id="cm-title" className="cm-title">
              {title}
            </h3>
          </div>

          {/* Body */}
          <div className="cm-body">
            <p id="cm-message" className="cm-message">
              {message}
            </p>
          </div>

          <div className="cm-divider" />

          {/* Footer */}
          <div className="cm-footer">
            <button type="button" className="cm-btn-cancel" onClick={onClose}>
              {cancelLabel}
            </button>
            <button
              type="button"
              className="cm-btn-confirm"
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

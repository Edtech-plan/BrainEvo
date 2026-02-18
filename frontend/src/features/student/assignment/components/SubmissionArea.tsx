import React, { useState } from 'react';
import { theme } from '@/styles/theme';
import { Upload, Link as LinkIcon, CheckCircle, FileText, X } from 'lucide-react';
import ActionButton from '@/features/student/live-classes/components/ActionButton';
import { useFileUpload } from '../hooks/useFileUpload'; // Import our new hook

interface SubmissionAreaProps {
  assignmentId: string;
  isSubmitted: boolean;
  onSuccess: () => void;
}

export default function SubmissionArea({ assignmentId: _assignmentId, isSubmitted, onSuccess }: SubmissionAreaProps) {
  const [method, setMethod] = useState<'FILE' | 'LINK'>('FILE');
  const [linkUrl, setLinkUrl] = useState('');

  // Use our custom hook for file handling logic
  const { file, triggerFileDialog, handleFileChange, clearFile, fileInputRef } = useFileUpload();

  // CSS Styles (Mobile First + Desktop Overrides)
  const css = `
    .submission-container {
      border-top: 1px solid ${theme.colors.border};
      padding-top: 24px;
      margin-top: 24px;
    }
    .toggle-group {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      background-color: ${theme.colors.bgMain};
      padding: 4px;
      border-radius: ${theme.borderRadius.md};
      border: 1px solid ${theme.colors.border};
    }
    .toggle-btn {
      flex: 1;
      padding: 10px;
      border-radius: 6px;
      border: none;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .upload-zone {
      border: 2px dashed ${theme.colors.border};
      padding: 32px 20px;
      border-radius: ${theme.borderRadius.lg};
      text-align: center;
      background-color: ${theme.colors.bgSurface};
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }
    .upload-zone:active {
      background-color: ${theme.colors.bgMain};
      border-color: ${theme.colors.primary};
    }
    .submit-wrapper {
      margin-top: 24px;
      width: 100%;
    }

    @media (min-width: 768px) {
      .submission-container { padding-top: 40px; margin-top: 40px; }
      .toggle-group { display: inline-flex; background-color: transparent; border: none; padding: 0; gap: 12px; }
      .toggle-btn { flex: none; padding: 8px 16px; background-color: transparent; }
      .upload-zone { padding: 48px; background-color: ${theme.colors.bgMain}; }
      .submit-wrapper { display: flex; justify-content: flex-end; width: auto; }
    }
  `;

  // --- Success State View ---
  if (isSubmitted) {
    return (
      <div style={{
        padding: '24px', backgroundColor: theme.colors.successBg,
        borderRadius: theme.borderRadius.lg, border: `1px solid #bbf7d0`,
        textAlign: 'center', marginTop: '32px'
      }}>
        <CheckCircle size={32} color={theme.colors.success} style={{ margin: '0 auto 12px' }} />
        <h4 style={{ margin: 0, color: theme.colors.success, fontSize: '16px', fontWeight: 700 }}>Work Submitted</h4>
        <p style={{ fontSize: '14px', color: theme.colors.textSecondary, marginTop: '4px' }}>Your instructor will review it shortly.</p>
      </div>
    );
  }

  return (
    <div className="submission-container">
      <style>{css}</style>

      {/* --- Hidden Input for File Selection --- */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.zip,.jpg,.png" // Limit file types if needed
      />

      <h3 style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.textMain, marginBottom: '20px' }}>
        Submit Assignment
      </h3>

      {/* --- Method Toggle Buttons --- */}
      <div className="toggle-group">
        <button
          onClick={() => setMethod('FILE')}
          className="toggle-btn"
          style={{
            backgroundColor: method === 'FILE' ? theme.colors.bgSurface : 'transparent',
            color: method === 'FILE' ? theme.colors.primary : theme.colors.textSecondary,
            boxShadow: method === 'FILE' ? theme.shadows.sm : 'none',
          }}
        >
          <Upload size={16} /> File Upload
        </button>
        <button
          onClick={() => setMethod('LINK')}
          className="toggle-btn"
          style={{
            backgroundColor: method === 'LINK' ? theme.colors.bgSurface : 'transparent',
            color: method === 'LINK' ? theme.colors.primary : theme.colors.textSecondary,
            boxShadow: method === 'LINK' ? theme.shadows.sm : 'none',
          }}
        >
          <LinkIcon size={16} /> External Link
        </button>
      </div>

      {/* --- File Upload Area --- */}
      {method === 'FILE' ? (
        <div
          className="upload-zone"
          onClick={!file ? triggerFileDialog : undefined} // Only trigger open if no file selected
          onKeyDown={!file ? (e => { if (e.key === 'Enter' || e.key === ' ') { triggerFileDialog(); } }) : undefined}
          tabIndex={!file ? 0 : -1}
          role="button"
          aria-disabled={!!file}
          style={{ borderColor: file ? theme.colors.success : theme.colors.border }}
        >
          {file ? (
            // Selected File View
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                backgroundColor: theme.colors.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <FileText size={24} color={theme.colors.success} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: theme.colors.textMain, fontSize: '14px' }}>
                  {file.name}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: theme.colors.success, fontWeight: 500 }}>
                  Ready to submit ({Math.round(file.size / 1024)} KB)
                </p>
              </div>

              {/* Clear File Button */}
              <button
                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                style={{
                  position: 'absolute', top: '12px', right: '12px',
                  background: 'none', border: 'none', cursor: 'pointer', color: theme.colors.textSecondary
                }}
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            // Empty State View
            <>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', backgroundColor: theme.colors.bgHover,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
              }}>
                <Upload size={24} color={theme.colors.textSecondary} />
              </div>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: theme.colors.textMain }}>
                Tap to upload file
              </p>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: theme.colors.textSecondary }}>
                PDF, DOCX, or ZIP (Max 10MB)
              </p>
            </>
          )}
        </div>
      ) : (
        // --- Link Input Area ---
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
            color: theme.colors.textSecondary
          }}>
            <LinkIcon size={18} />
          </div>
          <input
            type="text"
            placeholder="https://drive.google.com/..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 16px 16px 48px',
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border}`,
              fontSize: '14px',
              outline: 'none',
              backgroundColor: theme.colors.bgSurface,
              color: theme.colors.textMain
            }}
            onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
            onBlur={(e) => e.target.style.borderColor = theme.colors.border}
          />
        </div>
      )}

      {/* --- Footer Action Button --- */}
      <div className="submit-wrapper">
        <div style={{ width: '100%' }} className="submit-btn-container">
          <ActionButton
            label={file || (method === 'LINK' && linkUrl.length > 5) ? "Submit Assignment" : "Select File to Submit"}
            onClick={onSuccess}
            disabled={method === 'FILE' ? !file : linkUrl.length < 5}
            style={{ width: '100%', padding: '12px' }}
          />
        </div>
      </div>
    </div>
  );
}

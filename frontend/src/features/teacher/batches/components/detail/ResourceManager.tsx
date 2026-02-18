import React, { useRef } from "react";
import {
  FileText,
  PlayCircle,
  Download,
  Trash2,
  Loader2,
  UploadCloud,
} from "lucide-react";
import { BatchResource } from "../../../../../shared/types/batch.types";
import { theme } from "../../../../../../styles/theme";

interface ResourceManagerProps {
  resources: BatchResource[];
  onDelete: (id: string) => void;
  // New props for upload functionality
  onUpload?: (file: File) => void;
  isUploading?: boolean;
}

export const ResourceManager = ({
  resources,
  onDelete,
  onUpload,
  isUploading = false,
}: ResourceManagerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBoxClick = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onUpload) {
      onUpload(files[0]);
    }
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept=".pdf,.doc,.docx,.mp4,.png,.jpg,.jpeg"
      />

      {/* Upload Box */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleBoxClick}
        onKeyDown={(e) => {
          if (!isUploading && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleBoxClick();
          }
        }}
        className={`flex flex-col items-center justify-center p-6 md:p-8 border-2 border-dashed rounded-xl transition text-center relative overflow-hidden ${isUploading ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-slate-50"}`}
        style={{
          backgroundColor: theme.colors.bgSurface,
          borderColor: theme.colors.border,
        }}
      >
        {isUploading ? (
          <div className="animate-pulse flex flex-col items-center">
            <Loader2 className="animate-spin text-indigo-600 mb-3" size={32} />
            <span className="font-bold text-sm text-indigo-600">
              Uploading file...
            </span>
          </div>
        ) : (
          <>
            <div
              className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-3 md:mb-4"
              style={{
                backgroundColor: theme.colors.infoBg,
                color: theme.colors.info,
              }}
            >
              <UploadCloud size={20} className="md:w-6 md:h-6" />
            </div>
            <h3
              className="font-bold text-base md:text-lg"
              style={{ color: theme.colors.textMain }}
            >
              Upload Material
            </h3>
            <p
              className="text-xs md:text-sm mt-1"
              style={{ color: theme.colors.textSecondary }}
            >
              Click to browse PDFs or Videos.
            </p>
          </>
        )}
      </div>

      {/* Resource List */}
      <div className="space-y-3">
        {resources.length === 0 && !isUploading && (
          <div className="text-center py-8 text-sm text-gray-400 italic">
            No resources uploaded yet.
          </div>
        )}

        {resources.map((r) => (
          <div
            key={r.id}
            className="group flex items-center justify-between p-3 md:p-4 border rounded-lg shadow-sm"
            style={{
              backgroundColor: theme.colors.bgSurface,
              borderColor: theme.colors.border,
            }}
          >
            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
              <div
                className="p-2 md:p-3 rounded-lg shrink-0"
                style={{
                  backgroundColor:
                    r.type === "video"
                      ? theme.colors.errorBg
                      : theme.colors.primaryLight,
                  color:
                    r.type === "video"
                      ? theme.colors.error
                      : theme.colors.primary,
                }}
              >
                {r.type === "video" ? (
                  <PlayCircle size={18} className="md:w-5 md:h-5" />
                ) : (
                  <FileText size={18} className="md:w-5 md:h-5" />
                )}
              </div>
              <div className="min-w-0">
                <h4
                  className="font-bold text-sm truncate"
                  style={{ color: theme.colors.textMain }}
                >
                  {r.title}
                </h4>
                <p
                  className="text-xs mt-0.5 truncate"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {r.size ? `${r.size} • ` : ""}
                  {r.uploadDate}
                </p>
              </div>
            </div>
            <button
              onClick={() => onDelete(r.id)}
              className="p-2 md:opacity-0 group-hover:opacity-100 transition hover:bg-red-50 hover:text-red-600 rounded shrink-0"
              style={{ color: theme.colors.textSecondary }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

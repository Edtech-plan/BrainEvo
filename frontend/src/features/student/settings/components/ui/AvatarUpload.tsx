// Circular avatar with camera-icon overlay and initials fallback.
import React, { useRef } from "react";
import { theme } from "@/styles/theme";
import { Camera, User } from "lucide-react";
import Image from "next/image";

interface AvatarUploadProps {
  avatarUrl: string;
  fullName: string;
  onFileSelect: (file: File) => void;
  uploading: boolean;
}

export default function AvatarUpload({
  avatarUrl,
  fullName,
  onFileSelect,
  uploading,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      <style>{`@keyframes auSpin { to { transform: rotate(360deg); } }`}</style>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
          e.target.value = "";
        }}
      />

      {/* Avatar button */}
      <button
        type="button"
        aria-label="Change profile photo"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        style={{
          position: "relative",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          border: `2px solid ${theme.colors.border}`,
          cursor: uploading ? "wait" : "pointer",
          overflow: "hidden",
          padding: 0,
          background: "none",
          flexShrink: 0,
          transition: `border-color ${theme.transitions.fast}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = theme.colors.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = theme.colors.border;
        }}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={fullName || "Avatar"}
            fill
            style={{ objectFit: "cover" }}
            sizes="100%"
            priority={false}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: theme.gradients.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: 800,
              color: "#fff",
            }}
          >
            {initials || <User size={28} />}
          </div>
        )}
        {/* Camera overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: uploading ? 1 : 0,
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => {
            if (!uploading)
              (e.currentTarget as HTMLDivElement).style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            if (!uploading)
              (e.currentTarget as HTMLDivElement).style.opacity = "0";
          }}
        >
          {uploading ? (
            <div
              style={{
                width: "20px",
                height: "20px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "auSpin 0.7s linear infinite",
              }}
            />
          ) : (
            <Camera size={20} color="#fff" />
          )}
        </div>
      </button>

      {/* Upload hint */}
      <div>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: 600,
            color: theme.colors.textMain,
          }}
        >
          Profile Photo
        </p>
        <p
          style={{
            margin: "3px 0 8px",
            fontSize: "12px",
            color: theme.colors.textMuted,
          }}
        >
          JPG, PNG or WebP — max 5 MB
        </p>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          style={{
            padding: "6px 14px",
            borderRadius: theme.borderRadius.md,
            fontFamily: theme.font.sans,
            border: `1px solid ${theme.colors.border}`,
            background: "transparent",
            color: theme.colors.textSecondary,
            fontSize: "12px",
            fontWeight: 600,
            cursor: uploading ? "not-allowed" : "pointer",
            transition: `all ${theme.transitions.fast}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme.colors.primary;
            e.currentTarget.style.color = theme.colors.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme.colors.border;
            e.currentTarget.style.color = theme.colors.textSecondary;
          }}
        >
          {uploading ? "Uploading…" : "Change Photo"}
        </button>
      </div>
    </div>
  );
}

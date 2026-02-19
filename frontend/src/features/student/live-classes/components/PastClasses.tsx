import React from "react";
import ClassCard from "./ClassCard";
import SectionHeader from "./SectionHeader";
import AttendanceBadge from "./AttendanceBadge";
import { useLiveClasses } from "../hooks/useLiveClasses";
import { theme } from "@/styles/theme";
import { History, BookOpen } from "lucide-react";

type AttendanceStatus = "Present" | "Late" | "Absent";

export default function PastClasses() {
  const { pastClasses, loading } = useLiveClasses();

  if (loading) {
    return (
      <div style={{ marginBottom: "28px" }}>
        <style>{`.past-grid{display:grid;grid-template-columns:1fr;gap:14px}@media(min-width:640px){.past-grid{grid-template-columns:1fr 1fr}}@media(min-width:1280px){.past-grid{grid-template-columns:repeat(3,1fr)}}`}</style>
        <div
          style={{
            height: "34px",
            width: "180px",
            background: theme.colors.bgHover,
            borderRadius: "9px",
            marginBottom: "16px",
          }}
        />
        <div className="past-grid">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: "160px",
                background: theme.colors.bgCard,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.lg,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!pastClasses || pastClasses.length === 0) {
    return (
      <div style={{ marginBottom: "28px" }}>
        <SectionHeader
          title="Past Classes"
          subtitle="Your attendance history"
          icon={<History size={17} color="#fff" />}
          iconBg="linear-gradient(135deg, #a78bfa, #7c3aed)"
          count={0}
        />
        <div
          style={{
            background: theme.colors.bgCard,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.lg,
            padding: "32px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "11px",
              background: theme.colors.bgHover,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen size={22} color={theme.colors.textMuted} />
          </div>
          <p
            style={{
              color: theme.colors.textMuted,
              fontSize: "13px",
              margin: 0,
            }}
          >
            No past classes to show
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "28px" }}>
      <style>{`.past-grid{display:grid;grid-template-columns:1fr;gap:14px}@media(min-width:640px){.past-grid{grid-template-columns:1fr 1fr}}@media(min-width:1280px){.past-grid{grid-template-columns:repeat(3,1fr)}}`}</style>
      <SectionHeader
        title="Past Classes"
        subtitle="Your attendance history"
        icon={<History size={17} color="#fff" />}
        iconBg="linear-gradient(135deg, #a78bfa, #7c3aed)"
        count={pastClasses.length}
      />
      <div className="past-grid">
        {pastClasses.map((liveClass) => {
          const scheduledAt = new Date(liveClass.scheduledAt);
          const timeStr = scheduledAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          const attendanceStatus = (liveClass.attendanceStatus ??
            "Absent") as AttendanceStatus;

          return (
            <ClassCard
              key={liveClass.id}
              title={liveClass.title}
              teacher={liveClass.instructor?.name ?? "Instructor"}
              time={timeStr}
              status="Completed"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: theme.colors.textMuted,
                    fontWeight: 500,
                  }}
                >
                  Attendance
                </span>
                <AttendanceBadge status={attendanceStatus} />
              </div>
            </ClassCard>
          );
        })}
      </div>
    </div>
  );
}

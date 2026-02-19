import React from "react";
import ClassCard from "./ClassCard";
import SectionHeader from "./SectionHeader";
import { useLiveClasses } from "../hooks/useLiveClasses";
import { theme } from "@/styles/theme";
import { CalendarClock, Telescope } from "lucide-react";

export default function UpcomingClasses() {
  const { upcomingClasses, loading } = useLiveClasses();

  if (loading) {
    return (
      <div style={{ marginBottom: "28px" }}>
        <style>{`.upcoming-grid{display:grid;grid-template-columns:1fr;gap:14px}@media(min-width:640px){.upcoming-grid{grid-template-columns:1fr 1fr}}@media(min-width:1280px){.upcoming-grid{grid-template-columns:repeat(3,1fr)}}`}</style>
        <div
          style={{
            height: "34px",
            width: "200px",
            background: theme.colors.bgHover,
            borderRadius: "9px",
            marginBottom: "16px",
          }}
        />
        <div className="upcoming-grid">
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

  if (upcomingClasses.length === 0) {
    return (
      <div style={{ marginBottom: "28px" }}>
        <SectionHeader
          title="Upcoming Classes"
          subtitle="Scheduled for later this week"
          icon={<CalendarClock size={17} color="#fff" />}
          iconBg="linear-gradient(135deg, #58a6ff, #1d4ed8)"
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
            <Telescope size={22} color={theme.colors.textMuted} />
          </div>
          <p
            style={{
              color: theme.colors.textMuted,
              fontSize: "13px",
              margin: 0,
            }}
          >
            No upcoming classes scheduled
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "28px" }}>
      <style>{`.upcoming-grid{display:grid;grid-template-columns:1fr;gap:14px}@media(min-width:640px){.upcoming-grid{grid-template-columns:1fr 1fr}}@media(min-width:1280px){.upcoming-grid{grid-template-columns:repeat(3,1fr)}}`}</style>
      <SectionHeader
        title="Upcoming Classes"
        subtitle="Scheduled for later this week"
        icon={<CalendarClock size={17} color="#fff" />}
        iconBg="linear-gradient(135deg, #58a6ff, #1d4ed8)"
        count={upcomingClasses.length}
      />
      <div className="upcoming-grid">
        {upcomingClasses.map((liveClass) => {
          const scheduledAt = new Date(liveClass.scheduledAt);
          const timeStr = scheduledAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });

          return (
            <ClassCard
              key={liveClass.id}
              title={liveClass.title}
              teacher={liveClass.instructor?.name ?? "Instructor"}
              time={timeStr}
              status="Upcoming"
            />
          );
        })}
      </div>
    </div>
  );
}

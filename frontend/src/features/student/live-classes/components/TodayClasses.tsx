import React from "react";
import ClassCard from "./ClassCard";
import SectionHeader from "./SectionHeader";
import ActionButton from "./ActionButton";
import { useLiveClasses } from "../hooks/useLiveClasses";
import { theme } from "@/styles/theme";
import { Sun, CalendarClock } from "lucide-react";

export default function TodayClasses() {
  const { todayClasses, loading } = useLiveClasses();

  if (loading) {
    return (
      <div style={{ marginBottom: "28px" }}>
        <style>{`.today-grid{display:grid;grid-template-columns:1fr;gap:14px}@media(min-width:640px){.today-grid{grid-template-columns:1fr 1fr}}@media(min-width:1280px){.today-grid{grid-template-columns:repeat(3,1fr)}}`}</style>
        <div
          style={{
            height: "34px",
            width: "200px",
            background: theme.colors.bgHover,
            borderRadius: "9px",
            marginBottom: "16px",
          }}
        />
        <div className="today-grid">
          {[1, 2].map((i) => (
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

  if (todayClasses.length === 0) {
    return (
      <div style={{ marginBottom: "28px" }}>
        <SectionHeader
          title="Today's Classes"
          subtitle="Your schedule for today"
          icon={<Sun size={17} color="#fff" />}
          iconBg="linear-gradient(135deg, #f59e0b, #d97706)"
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
            <CalendarClock size={22} color={theme.colors.textMuted} />
          </div>
          <p
            style={{
              color: theme.colors.textMuted,
              fontSize: "13px",
              margin: 0,
            }}
          >
            No classes scheduled for today
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "28px" }}>
      <style>{`.today-grid{display:grid;grid-template-columns:1fr;gap:14px}@media(min-width:640px){.today-grid{grid-template-columns:1fr 1fr}}@media(min-width:1280px){.today-grid{grid-template-columns:repeat(3,1fr)}}`}</style>
      <SectionHeader
        title="Today's Classes"
        subtitle="Your schedule for today"
        icon={<Sun size={17} color="#fff" />}
        iconBg="linear-gradient(135deg, #f59e0b, #d97706)"
        count={todayClasses.length}
      />
      <div className="today-grid">
        {todayClasses.map((liveClass) => {
          const scheduledAt = new Date(liveClass.scheduledAt);
          const endTime = new Date(
            scheduledAt.getTime() + (liveClass.duration ?? 60) * 60 * 1000,
          );
          const timeStr = `${scheduledAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })} – ${endTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;

          return (
            <ClassCard
              key={liveClass.id}
              title={liveClass.title}
              teacher={liveClass.instructor?.name ?? "Instructor"}
              time={timeStr}
              status="Scheduled"
            >
              <ActionButton
                label="View Details"
                variant="ghost"
                style={{ width: "100%" }}
              />
            </ClassCard>
          );
        })}
      </div>
    </div>
  );
}

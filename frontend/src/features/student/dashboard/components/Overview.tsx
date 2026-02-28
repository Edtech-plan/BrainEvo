// src/features/student/dashboard/components/Overview.tsx
import React from "react";
import AttentionAlerts from "./AttentionAlerts";
import ClassSnapshot from "./ClassSnapshot";
import OverviewHeader from "./OverviewHeader";
import OverviewStats from "./OverviewStats";
import PerformanceSnapshot from "./PerformanceSnapshot";
import UpcomingSchedule from "./UpcomingSchedule";

export default function Overview() {
  return (
    <>
      <style>{`
        .ov-grid-main { display:grid; grid-template-columns:1fr;      gap:18px; margin-top:18px; }
        .ov-grid-sub  { display:grid; grid-template-columns:1fr;      gap:18px; }
        @media (min-width:768px)  { .ov-grid-sub  { grid-template-columns:1fr 1fr; } }
        @media (min-width:1024px) { .ov-grid-main { grid-template-columns:minmax(0,1fr) 280px; } }
        @media (min-width:1280px) { .ov-grid-main { grid-template-columns:minmax(0,1fr) 300px; } }
      `}</style>

      <div style={{ paddingBottom: "40px" }}>
        <OverviewHeader />

        <div style={{ marginTop: "18px" }}>
          <OverviewStats />
        </div>

        <div className="ov-grid-main">
          {/* Left column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              minWidth: 0,
            }}
          >
            <div className="ov-grid-sub">
              <ClassSnapshot />
              <UpcomingSchedule />
            </div>
            <PerformanceSnapshot />
          </div>

          {/* Right column — Alerts */}
          <AttentionAlerts />
        </div>
      </div>
    </>
  );
}

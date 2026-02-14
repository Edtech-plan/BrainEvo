import { useState, useEffect } from "react";
import { LiveStats, LiveClass } from "@/shared/types/liveClass.types"; // Correct Alias
import { LiveService } from "../services/live.service";

// FIX: Replaced 'any' with the strict type 'LiveClass[]'
export const useSessionStats = (sessions: LiveClass[]) => {
  const [stats, setStats] = useState<LiveStats>({
    totalClasses: 0,
    totalHours: 0,
    avgAttendancePercentage: 0,
  });

  useEffect(() => {
    // We re-fetch stats whenever the sessions list changes
    LiveService.getStats().then(setStats).catch(console.error);
  }, [sessions]);

  return stats;
};

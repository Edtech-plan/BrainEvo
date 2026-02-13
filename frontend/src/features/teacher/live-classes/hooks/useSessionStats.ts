import { useState, useEffect } from "react";
import { LiveStats } from "../../../../shared/types/live.types";
import { LiveService } from "../services/live.service";

export const useSessionStats = (dependency: any) => {
  const [stats, setStats] = useState<LiveStats>({
    totalClasses: 0,
    totalHours: 0,
    avgAttendancePercentage: 0,
  });

  useEffect(() => {
    LiveService.getStats().then(setStats);
  }, [dependency]);

  return stats;
};

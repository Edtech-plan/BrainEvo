import { useState, useEffect, useCallback } from "react";
import { LiveClass } from "@/shared/types/liveClass.types"; // Unified Import
import { LiveService } from "../services/live.service";

export const useLiveSessions = () => {
  const [sessions, setSessions] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await LiveService.fetchAll();
      setSessions(data);
    } catch (err) {
      setError("Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return { sessions, loading, error, refresh: fetchSessions };
};

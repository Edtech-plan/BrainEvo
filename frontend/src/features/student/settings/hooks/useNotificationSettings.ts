import { useState, useEffect, useCallback } from "react";
import settingsService from "../services/settings.service";
import type {
  NotificationsData,
  NotificationChannel,
  QuietHours,
} from "@/shared/types/settings.types";

type NotifKey = keyof Omit<NotificationsData, "quietHours">;
type ChannelKey = keyof NotificationChannel;

export interface UseNotificationSettingsReturn {
  prefs: NotificationsData;
  loading: boolean;
  error: string;
  onToggle: (key: NotifKey, channel: ChannelKey) => Promise<void>;
  onQuietHoursToggle: () => Promise<void>;
  onQuietHoursChange: (
    field: keyof Pick<QuietHours, "start" | "end">,
    value: string,
  ) => Promise<void>;
}

const DEFAULTS: NotificationsData = {
  assignmentCreated: { email: false, inApp: false },
  gradeReleased: { email: false, inApp: false },
  liveClassReminders: { email: false, inApp: false },
  announcements: { email: false, inApp: false },
  quietHours: { enabled: false, start: "22:00", end: "08:00" },
};

export function useNotificationSettings(): UseNotificationSettingsReturn {
  const [prefs, setPrefs] = useState<NotificationsData>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const s = await settingsService.getSettings();
        if (mounted) setPrefs(s.notifications);
      } catch (err) {
        if (mounted)
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load notification settings.",
          );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Optimistic update — reverts immediately on API failure
  const onToggle = useCallback(
    async (key: NotifKey, channel: ChannelKey) => {
      const prev = prefs;
      const next: NotificationsData = {
        ...prefs,
        [key]: { ...prefs[key], [channel]: !prefs[key][channel] },
      };
      setPrefs(next);
      try {
        const result = await settingsService.updateNotifications({
          [key]: next[key],
        });
        if (!result.success) {
          setPrefs(prev);
          setError("Failed to update notification setting.");
        }
      } catch (err) {
        setPrefs(prev);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update notification setting.",
        );
      }
    },
    [prefs],
  );

  const onQuietHoursToggle = useCallback(async () => {
    const prev = prefs;
    const next: NotificationsData = {
      ...prefs,
      quietHours: { ...prefs.quietHours, enabled: !prefs.quietHours.enabled },
    };
    setPrefs(next);
    try {
      const result = await settingsService.updateNotifications({
        quietHours: next.quietHours,
      });
      if (!result.success) {
        setPrefs(prev);
        setError("Failed to update quiet hours.");
      }
    } catch (err) {
      setPrefs(prev);
      setError(
        err instanceof Error ? err.message : "Failed to update quiet hours.",
      );
    }
  }, [prefs]);

  const onQuietHoursChange = useCallback(
    async (field: keyof Pick<QuietHours, "start" | "end">, value: string) => {
      const next: NotificationsData = {
        ...prefs,
        quietHours: { ...prefs.quietHours, [field]: value },
      };
      setPrefs(next);
      try {
        const result = await settingsService.updateNotifications({
          quietHours: next.quietHours,
        });
        if (!result.success) setError("Failed to update quiet hours.");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update quiet hours.",
        );
      }
    },
    [prefs],
  );

  return {
    prefs,
    loading,
    error,
    onToggle,
    onQuietHoursToggle,
    onQuietHoursChange,
  };
}

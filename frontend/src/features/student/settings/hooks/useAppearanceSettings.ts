import { useState, useEffect, useCallback } from "react";
import settingsService from "../services/settings.service";
import type { AppearanceData } from "@/shared/types/settings.types";

const DEFAULTS: AppearanceData = {
  theme: "dark",
  editorFontSize: 14,
  editorKeymap: "vscode",
};

export interface UseAppearanceSettingsReturn {
  appearance: AppearanceData;
  loading: boolean;
  saving: boolean;
  error: string;
  success: string;
  onChange: <K extends keyof AppearanceData>(
    field: K,
    value: AppearanceData[K],
  ) => void;
  onSave: () => Promise<void>;
}

export function useAppearanceSettings(): UseAppearanceSettingsReturn {
  const [appearance, setAppearance] = useState<AppearanceData>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;
    // subscribe() keeps appearance in sync if another component mutates it
    const unsubscribe = settingsService.subscribe((s) => {
      if (mounted) setAppearance(s.appearance);
    });
    (async () => {
      try {
        setLoading(true);
        const s = await settingsService.getSettings();
        if (mounted) setAppearance(s.appearance);
      } catch (err) {
        if (mounted)
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load appearance settings.",
          );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const onChange = useCallback(
    <K extends keyof AppearanceData>(field: K, value: AppearanceData[K]) => {
      setAppearance((p) => ({ ...p, [field]: value }));
      setSuccess("");
    },
    [],
  );

  const onSave = useCallback(async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const result = await settingsService.updateAppearance(appearance);
      if (result.success) {
        setSuccess("Appearance saved.");
        setTimeout(() => setSuccess(""), 3500);
      } else {
        setError("Failed to save appearance settings.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save appearance settings.",
      );
    } finally {
      setSaving(false);
    }
  }, [appearance]);

  return { appearance, loading, saving, error, success, onChange, onSave };
}

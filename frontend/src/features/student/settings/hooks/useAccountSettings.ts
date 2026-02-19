import { useState, useEffect, useCallback } from "react";
import settingsService from "../services/settings.service";
import type { AccountData, PasswordPayload } from "@/shared/types/settings.types";
import apiClient from "@/shared/lib/axios";

const PW_DEFAULTS: PasswordPayload = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export interface UseAccountSettingsReturn {
  account: AccountData;
  pwForm: PasswordPayload;
  loading: boolean;
  saving: boolean;
  pwSaving: boolean;
  error: string;
  pwError: string;
  success: string;
  pwSuccess: string;
  onChange: (field: keyof AccountData, value: string) => void;
  onPwChange: (field: keyof PasswordPayload, value: string) => void;
  onSave: () => Promise<void>;
  onPwSave: () => Promise<void>;
}

export function useAccountSettings(): UseAccountSettingsReturn {
  const [account, setAccount] = useState<AccountData>({
    timezone: "",
    language: "en",
  });
  const [original, setOriginal] = useState<AccountData>({
    timezone: "",
    language: "en",
  });
  const [pwForm, setPwForm] = useState<PasswordPayload>(PW_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [error, setError] = useState("");
  const [pwError, setPwError] = useState("");
  const [success, setSuccess] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const s = await settingsService.getSettings();
        if (mounted) {
          setAccount(s.account);
          setOriginal(s.account);
        }
      } catch (err) {
        if (mounted)
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load account settings.",
          );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onChange = useCallback((field: keyof AccountData, value: string) => {
    setAccount((p) => ({ ...p, [field]: value }));
    setSuccess("");
  }, []);

  const onPwChange = useCallback(
    (field: keyof PasswordPayload, value: string) => {
      setPwForm((p) => ({ ...p, [field]: value }));
      setPwError("");
    },
    [],
  );

  const onSave = useCallback(async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const result = await settingsService.updateAccount(account);
      if (result.success) {
        setOriginal(account);
        setSuccess("Account settings saved.");
        setTimeout(() => setSuccess(""), 3500);
      } else {
        setError("Failed to save account settings.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save account settings.",
      );
    } finally {
      setSaving(false);
    }
  }, [account]);

  const onPwSave = useCallback(async () => {
    if (
      !pwForm.currentPassword ||
      !pwForm.newPassword ||
      !pwForm.confirmPassword
    ) {
      setPwError("All fields are required.");
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    try {
      setPwSaving(true);
      setPwError("");
      const res = await apiClient.post("/api/auth/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      if (res.data?.success) {
        setPwForm(PW_DEFAULTS);
        setPwSuccess("Password changed successfully.");
        setTimeout(() => setPwSuccess(""), 3500);
      } else {
        setPwError(res.data?.message ?? "Failed to change password.");
      }
    } catch (err) {
      setPwError(
        err instanceof Error ? err.message : "Failed to change password.",
      );
    } finally {
      setPwSaving(false);
    }
  }, [pwForm]);

  return {
    account,
    pwForm,
    loading,
    saving,
    pwSaving,
    error,
    pwError,
    success,
    pwSuccess,
    onChange,
    onPwChange,
    onSave,
    onPwSave,
  };
}

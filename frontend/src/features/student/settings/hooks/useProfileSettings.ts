import { useState, useEffect, useCallback } from "react";
import settingsService from "../services/settings.service";
import type { SocialLinks } from "@/shared/types/settings.types";

interface ProfileForm {
  fullName: string;
  phone: string;
  headline: string;
  avatarUrl: string;
  socialLinks: SocialLinks;
}

export interface UseProfileSettingsReturn {
  form: ProfileForm;
  email: string;
  loading: boolean;
  saving: boolean;
  uploading: boolean;
  error: string;
  success: string;
  isDirty: boolean;
  onChange: (
    field: keyof Omit<ProfileForm, "socialLinks" | "avatarUrl">,
    value: string,
  ) => void;
  onSocialChange: (field: keyof SocialLinks, value: string) => void;
  onAvatarChange: (file: File) => Promise<void>;
  onSave: () => Promise<void>;
}

const DEFAULTS: ProfileForm = {
  fullName: "",
  phone: "",
  headline: "",
  avatarUrl: "",
  socialLinks: { linkedin: "", portfolio: "" },
};

export function useProfileSettings(): UseProfileSettingsReturn {
  const [form, setForm] = useState<ProfileForm>(DEFAULTS);
  const [email, setEmail] = useState("");
  const [original, setOriginal] = useState<ProfileForm>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const s = await settingsService.getSettings();
        const { id: _id, email: emailVal, ...rest } = s.profile;
        if (mounted) {
          setForm(rest);
          setOriginal(rest);
          setEmail(emailVal);
        }
      } catch (err) {
        if (mounted)
          setError(
            err instanceof Error ? err.message : "Failed to load profile.",
          );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const isDirty = JSON.stringify(form) !== JSON.stringify(original);

  const onChange = useCallback(
    (
      field: keyof Omit<ProfileForm, "socialLinks" | "avatarUrl">,
      value: string,
    ) => {
      setForm((p) => ({ ...p, [field]: value }));
      setSuccess("");
    },
    [],
  );

  const onSocialChange = useCallback(
    (field: keyof SocialLinks, value: string) => {
      setForm((p) => ({
        ...p,
        socialLinks: { ...p.socialLinks, [field]: value },
      }));
      setSuccess("");
    },
    [],
  );

  const onAvatarChange = useCallback(async (file: File) => {
    try {
      setUploading(true);
      setError("");
      const url = await settingsService.uploadAvatar(file);
      setForm((p) => ({ ...p, avatarUrl: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Avatar upload failed.");
    } finally {
      setUploading(false);
    }
  }, []);

  const onSave = useCallback(async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const result = await settingsService.updateProfile(form);
      if (result.success) {
        setOriginal(form);
        setSuccess("Profile saved successfully.");
        setTimeout(() => setSuccess(""), 3500);
      } else {
        setError("Failed to save profile. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }, [form]);

  return {
    form,
    email,
    loading,
    saving,
    uploading,
    error,
    success,
    isDirty,
    onChange,
    onSocialChange,
    onAvatarChange,
    onSave,
  };
}

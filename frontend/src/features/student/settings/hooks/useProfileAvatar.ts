// Lightweight read-only hook for displaying avatar + name + email in the navbar.
// Subscribes to settingsService so it INSTANTLY reflects any change made
// anywhere in the app (avatar upload, profile save) without managing form state.
//
// Use this in: DashboardLayout, OverviewHeader, any display-only component.
// Use useProfileSettings in: ProfileSection (the actual editor).

import { useState, useEffect } from "react";
import settingsService from "../services/settings.service";

interface ProfileDisplayState {
  avatarUrl: string;
  fullName: string;
  email: string;
  loading: boolean;
}

export function useProfileAvatar(): ProfileDisplayState {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Subscribe FIRST so any in-flight mutation also reaches this hook.
    // settingsService.notify() is called by uploadAvatar, updateProfile,
    // and every other mutation — so this subscription fires on all of them.
    const unsubscribe = settingsService.subscribe((settings) => {
      if (!mounted) return;
      setAvatarUrl(settings.profile.avatarUrl);
      setFullName(settings.profile.fullName);
      setEmail(settings.profile.email);
    });

    // Initial fetch — populate display state
    (async () => {
      try {
        setLoading(true);
        const s = await settingsService.getSettings();
        if (mounted) {
          setAvatarUrl(s.profile.avatarUrl);
          setFullName(s.profile.fullName);
          setEmail(s.profile.email);
        }
      } catch {
        // Non-critical — navbar just shows initials placeholder
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return { avatarUrl, fullName, email, loading };
}

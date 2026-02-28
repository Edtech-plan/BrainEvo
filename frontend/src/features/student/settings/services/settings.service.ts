// Single source of truth for all Settings API calls.
// Implements an Observer pattern so any hook can react to settings changes
// (e.g. AppearanceSection subscribes for live theme preview).

import apiClient from "@/shared/lib/axios";
import type {
  FullSettings,
  ServiceResponse,
  ProfileData,
  AppearanceData,
  AccountData,
  NotificationsData,
} from "@/shared/types/settings.types";

type SettingsSubscriber = (settings: FullSettings) => void;

class SettingsService {
  private subscribers: Set<SettingsSubscriber> = new Set();

  // Notifies all registered listeners after every successful mutation
  private notify(settings: FullSettings): void {
    this.subscribers.forEach((cb) => cb(settings));
  }

  // Returns an unsubscribe function — call it in useEffect cleanup
  subscribe(cb: SettingsSubscriber): () => void {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  // GET /api/settings — full settings object
  async getSettings(): Promise<FullSettings> {
    const response = await apiClient.get("/api/settings");
    const { success, data } = response.data;
    if (!success || !data) throw new Error("Failed to load settings");
    return data as FullSettings;
  }

  // PUT /api/settings/profile — id and email are server-managed, never sent
  async updateProfile(
    payload: Partial<Omit<ProfileData, "id" | "email">>,
  ): Promise<ServiceResponse> {
    const response = await apiClient.put("/api/settings/profile", payload);
    const result = response.data as ServiceResponse;
    if (result.success && result.data) this.notify(result.data);
    return result;
  }

  // PUT /api/settings/appearance
  async updateAppearance(
    payload: Partial<AppearanceData>,
  ): Promise<ServiceResponse> {
    const response = await apiClient.put("/api/settings/appearance", payload);
    const result = response.data as ServiceResponse;
    if (result.success && result.data) this.notify(result.data);
    return result;
  }

  // PUT /api/settings/account
  async updateAccount(payload: Partial<AccountData>): Promise<ServiceResponse> {
    const response = await apiClient.put("/api/settings/account", payload);
    const result = response.data as ServiceResponse;
    if (result.success && result.data) this.notify(result.data);
    return result;
  }

  // PUT /api/settings/notifications
  async updateNotifications(
    payload: Partial<NotificationsData>,
  ): Promise<ServiceResponse> {
    const response = await apiClient.put(
      "/api/settings/notifications",
      payload,
    );
    const result = response.data as ServiceResponse;
    if (result.success && result.data) this.notify(result.data);
    return result;
  }

  // Converts File to base64, validates size/type, then PUTs to profile endpoint.
  // Matches test expectations exactly: rejects > 5MB and non-image files.
  async uploadAvatar(file: File): Promise<string> {
    if (file.size > 5 * 1024 * 1024)
      throw new Error("File size exceeds 5MB limit.");
    if (!file.type.startsWith("image/")) throw new Error("Invalid file type.");

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.readAsDataURL(file);
    });

    const response = await apiClient.put("/api/settings/profile", {
      avatarUrl: base64,
    });
    const result = response.data as ServiceResponse;
    if (!result.success || !result.data)
      throw new Error("Failed to upload avatar.");
    this.notify(result.data);
    return result.data.profile.avatarUrl;
  }
}

// Singleton — consistent state across all hooks in the same session
const settingsService = new SettingsService();
export default settingsService;

import { useState } from "react";
import { CreateSessionPayload } from "../../../../shared/types/live.types";
import { LiveService } from "../services/live.service";

export const useSessionActions = (onSuccess: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 👇 NEW: Track action-specific errors
  const [actionError, setActionError] = useState<string | null>(null);

  const createSession = async (payload: CreateSessionPayload) => {
    try {
      setIsSubmitting(true);
      setActionError(null); // Reset previous errors
      await LiveService.create(payload);
      onSuccess();
    } catch (error) {
      console.error("Create failed", error);
      // 👇 NEW: Set user-friendly error message
      setActionError("Failed to schedule class. Please try again.");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadRecording = async (id: string, url: string) => {
    try {
      setIsSubmitting(true);
      setActionError(null);
      await LiveService.updateRecording(id, url);
      onSuccess();
    } catch (error) {
      console.error("Upload failed", error);
      // 👇 NEW: Set user-friendly error message
      setActionError("Failed to save recording URL.");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 👇 NEW: Expose resetError so modal can clear it on close
  const resetError = () => setActionError(null);

  return {
    createSession,
    uploadRecording,
    isSubmitting,
    actionError, // <--- Exported
    resetError, // <--- Exported
  };
};

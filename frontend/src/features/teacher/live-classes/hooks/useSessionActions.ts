import { useState } from "react";
import { CreateLiveClassPayload } from "@/shared/types/liveClass.types"; // Unified Import
import { LiveService } from "../services/live.service";

export const useSessionActions = (onSuccess: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const createSession = async (payload: CreateLiveClassPayload) => {
    try {
      setIsSubmitting(true);
      setActionError(null);
      await LiveService.create(payload);
      onSuccess();
    } catch (error) {
      console.error("Create failed", error);
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
      setActionError("Failed to save recording URL.");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetError = () => setActionError(null);

  return {
    createSession,
    uploadRecording,
    isSubmitting,
    actionError,
    resetError,
  };
};

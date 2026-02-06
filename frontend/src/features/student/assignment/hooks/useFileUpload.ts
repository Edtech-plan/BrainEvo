import { useState, useRef } from 'react';

/**
 * Custom hook to handle file selection logic.
 * Returns the selected file, a handler to trigger the file dialog, and a reset function.
 */
export const useFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Trigger the hidden file input click
  const triggerFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle the change event when a user selects a file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  // Clear the selected file
  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input value to allow selecting same file again
    }
  };

  return {
    file,
    triggerFileDialog,
    handleFileChange,
    clearFile,
    fileInputRef
  };
};

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { theme } from '@/shared/components/ui/theme';
import { StudentProfile } from '@/shared/types/settings.types';
import { Camera, Trash2, User, Loader2, Check, X } from 'lucide-react';

interface ProfileHeaderProps {
  profile: StudentProfile;
  onUpdate: (data: string) => void; 
  onUpload: (file: File) => Promise<boolean | undefined>;
  isUploading?: boolean;
}

export default function ProfileHeader({ profile, onUpdate, onUpload, isUploading = false }: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string>('');
  
  // Pending State
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Clean up object URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalError('');

    if (!file.type.startsWith('image/')) {
      setLocalError('Please upload a valid image file (JPG, PNG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { 
      setLocalError('Image size should be less than 5MB.');
      return;
    }

    // Set Pending State (Preview only)
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!pendingFile) return;
    const success = await onUpload(pendingFile);
    if (success) {
      setPendingFile(null);
      setPreviewUrl(null);
    }
  };

  const handleCancel = () => {
    setPendingFile(null);
    setPreviewUrl(null);
    setLocalError('');
  };

  // Logic: Show Preview if pending, otherwise show actual Profile URL
  const displayUrl = previewUrl || profile.avatarUrl;
  const hasAvatar = displayUrl && displayUrl !== '';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '24px',
      padding: '24px', backgroundColor: theme.colors.bgSurface,
      border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.lg,
      marginBottom: '24px', flexWrap: 'wrap'
    }}>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFileSelect}
      />

      <div style={{ position: 'relative' }}>
        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          backgroundColor: theme.colors.primaryLight,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', border: `2px solid ${theme.colors.bgMain}`,
          opacity: isUploading ? 0.7 : 1,
          boxShadow: pendingFile ? `0 0 0 3px ${theme.colors.primaryLight}` : 'none'
        }}>
          {isUploading ? (
            <Loader2 className="spin" size={32} color={theme.colors.primary} />
          ) : hasAvatar ? (
            <Image
              src={displayUrl}
              alt="Profile"
              width={100}
              height={100}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              unoptimized={!!previewUrl}
            />
          ) : (
            <User size={48} color={theme.colors.primary} />
          )}
        </div>
        
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>

        {/* Hide Camera button if pending */}
        {!pendingFile && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: theme.colors.primary, border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: isUploading ? 'not-allowed' : 'pointer', boxShadow: theme.shadows.sm
            }}>
            <Camera size={16} color="#fff" />
          </button>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: theme.colors.textMain }}>
          {profile.fullName}
        </h3>
        <p style={{ margin: '4px 0 0', color: theme.colors.textSecondary, fontSize: '14px' }}>
          {profile.email}
        </p>
        
        {localError && (
          <p style={{ color: theme.colors.error, fontSize: '13px', marginTop: '8px', margin: 0 }}>
            {localError}
          </p>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', alignItems: 'center' }}>
          {pendingFile ? (
            <>
              <button 
                onClick={handleSave}
                disabled={isUploading}
                style={{
                  padding: '8px 16px', borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.primary, border: 'none',
                  fontSize: '13px', fontWeight: 600, cursor: isUploading ? 'wait' : 'pointer', color: '#fff',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                {isUploading ? <Loader2 size={14} className="spin" /> : <Check size={14} />}
                Save Photo
              </button>
              
              <button 
                onClick={handleCancel}
                disabled={isUploading}
                style={{
                  padding: '8px 16px', borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.bgMain, border: `1px solid ${theme.colors.border}`,
                  fontSize: '13px', fontWeight: 600, cursor: isUploading ? 'not-allowed' : 'pointer', 
                  color: theme.colors.textMain, display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                <X size={14} /> Cancel
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                style={{
                  padding: '8px 16px', borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.bgMain, border: `1px solid ${theme.colors.border}`,
                  fontSize: '13px', fontWeight: 600, cursor: isUploading ? 'not-allowed' : 'pointer', color: theme.colors.textMain
                }}>
                Upload New
              </button>
              
              {hasAvatar && (
                <button 
                  onClick={() => onUpdate('')}
                  disabled={isUploading}
                  style={{
                    padding: '8px 16px', borderRadius: theme.borderRadius.md,
                    backgroundColor: 'transparent', border: 'none',
                    fontSize: '13px', fontWeight: 600, cursor: isUploading ? 'not-allowed' : 'pointer', color: theme.colors.error,
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}>
                  <Trash2 size={14} /> Remove Photo
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Calendar, Clock, Link as LinkIcon, AlertCircle, Loader2, User as UserIcon } from 'lucide-react';
import { theme } from '@/shared/components/ui/theme';
import liveClassService from '@/features/student/live-classes/services/liveClass.service';
import userService from '@/modules/user/user.service';
import type { User } from '@/shared/types';
import { useLiveClasses } from '@/features/student/live-classes';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  selectedTime?: string;
  onEventCreated?: () => void;
}

// Move InputWrapper outside component to prevent recreation on every render
const InputWrapper = React.memo(({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) => {
  InputWrapper.displayName = 'InputWrapper';
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: theme.colors.textSecondary,
        display: 'flex',
        alignItems: 'center',
        zIndex: 1
      }}>
        {icon}
      </div>
      {children}
    </div>
  );
});
InputWrapper.displayName = 'InputWrapper';

export default function AddEventModal({ isOpen, onClose, selectedDate, selectedTime, onEventCreated }: AddEventModalProps) {
  const [eventName, setEventName] = useState('');
  const [link, setLink] = useState('');
  const [date, setDate] = useState(
    selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [time, setTime] = useState(selectedTime || '09:00');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const { refetch } = useLiveClasses();
  const prevIsOpenRef = useRef(false);
  const initializedRef = useRef(false);

  // Memoize the onChange handler to prevent re-renders
  const handleEventNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEventName(e.target.value);
  }, []);

  // Initialize form when modal opens - only reset when modal first opens
  useEffect(() => {
    if (!isOpen) {
      prevIsOpenRef.current = false;
      initializedRef.current = false;
      return;
    }

    const wasJustOpened = !prevIsOpenRef.current;

    if (wasJustOpened) {
      // Only reset form fields when modal first opens
      setEventName('');
      setLink('');
      setSelectedStudentId('');
      setError(null);

      // Set initial date only when modal first opens
      if (selectedDate) {
        setDate(selectedDate.toISOString().split('T')[0]);
      } else {
        setDate(new Date().toISOString().split('T')[0]);
      }

      // Set initial time only when modal first opens
      if (selectedTime) {
        setTime(selectedTime);
      } else {
        setTime('09:00');
      }

      fetchStudents();
      prevIsOpenRef.current = true;
      initializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const fetchStudents = async () => {
    try {
      setStudentsLoading(true);
      setError(null);
      const response = await userService.getUsers();
      if (response.success && response.data) {
        // Filter only learners (students)
        const learners = response.data.filter(user => user.role === 'learner');
        setStudents(learners);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      // Don't show error for students loading, just log it
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Combine date and time into ISO string
      const dateTime = new Date(`${date}T${time}`);
      const scheduledAt = dateTime.toISOString();

      const eventData = {
        title: eventName,
        scheduledAt,
        meetingLink: link || 'https://meet.google.com', // Default link if not provided
        duration: 60, // Default 60 minutes
        description: eventName, // Use title as description
      };

      const response = await liveClassService.createLiveClass(eventData);

      if (response.success) {
        // Refresh live classes
        await refetch();
        if (onEventCreated) {
          onEventCreated();
        }
        onClose();
      } else {
        setError('Failed to create event. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Error creating event:', err);

      // Handle specific error cases
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 403) {
          setError('You do not have permission to create events. Only teachers and administrators can create events.');
        } else if (axiosError.response?.status === 401) {
          setError('Please log in to create events.');
        } else if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message);
        } else {
          setError('Failed to create event. Please try again.');
        }
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create event. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      role="presentation"
      tabIndex={-1}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .modal-content {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>

      {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-event-modal-title"
        style={{
          backgroundColor: theme.colors.bgSurface,
          borderRadius: theme.borderRadius.lg,
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          position: 'relative',
          border: `1px solid ${theme.colors.border}`,
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation();
            onClose();
          }
        }}
        tabIndex={0}
      >
      {/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme.colors.bgSurface
        }}>
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: theme.colors.textMain,
              margin: 0
            }}>
              Add New Event
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: theme.borderRadius.md,
              border: 'none',
              backgroundColor: 'transparent',
              color: theme.colors.textSecondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              width: '36px',
              height: '36px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.bgHover;
              e.currentTarget.style.color = theme.colors.textMain;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = theme.colors.textSecondary;
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Event Name */}
          <div style={{ marginBottom: '18px' }}>
            <label htmlFor="event-name-input" style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: theme.colors.textMain,
              marginBottom: '8px'
            }}>
              Event Name <span style={{ color: theme.colors.error }}>*</span>
            </label>
            <InputWrapper icon={<Calendar size={18} />}>
              <input
                id="event-name-input"
                key="event-name-input"
                type="text"
                value={eventName}
                onChange={handleEventNameChange}
                required
                autoComplete="off"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  borderRadius: theme.borderRadius.md,
                  border: `1.5px solid ${theme.colors.border}`,
                  fontSize: '14px',
                  color: theme.colors.textMain,
                  backgroundColor: theme.colors.bgMain,
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontFamily: theme.font
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.colors.primaryLight}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Enter event name"
              />
            </InputWrapper>
          </div>

          {/* Date and Time Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
            {/* Date */}
            <div>
            <label htmlFor="event-date-input" style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: theme.colors.textMain,
              marginBottom: '8px'
            }}>
              Date <span style={{ color: theme.colors.error }}>*</span>
            </label>
              <InputWrapper icon={<Calendar size={18} />}>
                <input
                  id="event-date-input"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 14px 14px 44px',
                    borderRadius: theme.borderRadius.md,
                    border: `1.5px solid ${theme.colors.border}`,
                    fontSize: '15px',
                    color: theme.colors.textMain,
                    backgroundColor: theme.colors.bgMain,
                    outline: 'none',
                    transition: 'all 0.2s',
                    fontFamily: theme.font,
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.colors.primaryLight}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.border;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </InputWrapper>
            </div>

            {/* Time */}
            <div>
              <label htmlFor="event-time-input" style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: theme.colors.textMain,
                marginBottom: '8px'
              }}>
                Time <span style={{ color: theme.colors.error }}>*</span>
              </label>
              <InputWrapper icon={<Clock size={18} />}>
                <input
                  id="event-time-input"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 14px 14px 44px',
                    borderRadius: theme.borderRadius.md,
                    border: `1.5px solid ${theme.colors.border}`,
                    fontSize: '15px',
                    color: theme.colors.textMain,
                    backgroundColor: theme.colors.bgMain,
                    outline: 'none',
                    transition: 'all 0.2s',
                    fontFamily: theme.font,
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.colors.primaryLight}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.border;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </InputWrapper>
            </div>
          </div>

          {/* Link (Optional) */}
          <div style={{ marginBottom: '18px' }}>
            <label htmlFor="event-link-input" style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: theme.colors.textMain,
              marginBottom: '8px'
            }}>
              Meeting Link <span style={{ fontSize: '12px', fontWeight: 400, color: theme.colors.textSecondary }}>(Optional)</span>
            </label>
            <InputWrapper icon={<LinkIcon size={18} />}>
              <input
                id="event-link-input"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  borderRadius: theme.borderRadius.md,
                  border: `1.5px solid ${theme.colors.border}`,
                  fontSize: '14px',
                  color: theme.colors.textMain,
                  backgroundColor: theme.colors.bgMain,
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontFamily: theme.font
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.colors.primaryLight}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="https://meet.google.com/..."
              />
            </InputWrapper>
          </div>

          {/* Student Dropdown */}
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="event-student-select" style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: theme.colors.textMain,
              marginBottom: '8px'
            }}>
              Student <span style={{ fontSize: '12px', fontWeight: 400, color: theme.colors.textSecondary }}>(Optional)</span>
            </label>
            <InputWrapper icon={<UserIcon size={18} />}>
              <select
                id="event-student-select"
                aria-label="Select student"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                disabled={studentsLoading}
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 44px',
                  borderRadius: theme.borderRadius.md,
                  border: `1.5px solid ${theme.colors.border}`,
                  fontSize: '15px',
                  color: selectedStudentId ? theme.colors.textMain : theme.colors.textSecondary,
                  backgroundColor: theme.colors.bgMain,
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: theme.font,
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  paddingRight: '36px'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.colors.primaryLight}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="" disabled>
                  {studentsLoading ? 'Loading students...' : 'Select a student'}
                </option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} {student.email ? `(${student.email})` : ''}
                  </option>
                ))}
              </select>
            </InputWrapper>
            {students.length === 0 && !studentsLoading && (
              <p style={{
                fontSize: '11px',
                color: theme.colors.textSecondary,
                marginTop: '4px',
                margin: '4px 0 0 0'
              }}>
                No students available
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px 14px',
              marginBottom: '18px',
              borderRadius: theme.borderRadius.md,
              backgroundColor: theme.colors.errorBg,
              border: `1px solid ${theme.colors.error}30`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} color={theme.colors.error} />
              <span style={{
                color: theme.colors.error,
                fontSize: '13px',
                fontWeight: 500
              }}>
                {error}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
            paddingTop: '12px',
            borderTop: `1px solid ${theme.colors.border}`
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '10px 20px',
                borderRadius: theme.borderRadius.md,
                border: `1.5px solid ${theme.colors.border}`,
                backgroundColor: 'transparent',
                color: theme.colors.textMain,
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: loading ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = theme.colors.bgHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                borderRadius: theme.borderRadius.md,
                border: 'none',
                backgroundColor: loading ? theme.colors.textSecondary : theme.colors.primary,
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: loading ? 'none' : `0 4px 6px -1px ${theme.colors.primary}20`
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
                  e.currentTarget.style.boxShadow = `0 6px 8px -1px ${theme.colors.primary}30`;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = theme.colors.primary;
                  e.currentTarget.style.boxShadow = `0 4px 6px -1px ${theme.colors.primary}20`;
                }
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                  Creating...
                </>
              ) : (
                'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

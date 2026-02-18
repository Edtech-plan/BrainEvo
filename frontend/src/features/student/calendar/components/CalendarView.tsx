import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { theme } from '@/styles/theme';
import MonthView from './views/MonthView';
import WeekView from './views/WeekView';
import DayView from './views/DayView';
import AddEventModal from './AddEventModal';
import EventDetailsModal from './EventDetailsModal';
import { useLiveClasses } from '@/features/student/live-classes';
import { useAssignments } from '@/features/student/assignment/hooks/useAssignments';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { LiveClass } from '@/shared/types';
import type { Assignment } from '@/shared/types';

export type ViewMode = 'month' | 'week' | 'day';

export default function CalendarView() {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<((LiveClass & { type: 'class' }) | (Assignment & { type: 'assignment' })) | null>(null);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);

  const { liveClasses, loading: classesLoading, refetch } = useLiveClasses();
  const { assignments, loading: assignmentsLoading } = useAssignments();
  const { isAuthenticated } = useAuth();

  // All authenticated users can create events
  const canCreateEvents = isAuthenticated;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsViewDropdownOpen(false);
      }
    };

    if (isViewDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isViewDropdownOpen]);

  const loading = classesLoading || assignmentsLoading;

  const handleViewChange = (view: ViewMode) => {
    setViewMode(view);
    setIsViewDropdownOpen(false);
  };

  const getViewLabel = () => {
    return viewMode.charAt(0).toUpperCase() + viewMode.slice(1);
  };


  const handleDateClick = (date: Date, time?: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setIsAddEventModalOpen(true);
  };

  const handleEventCreated = () => {
    refetch();
  };

  const handleEventClick = (event: LiveClass | Assignment, type: 'class' | 'assignment') => {
    if (type === 'class') {
      setSelectedEvent({ ...event, type: 'class' } as LiveClass & { type: 'class' });
    } else {
      setSelectedEvent({ ...event, type: 'assignment' } as Assignment & { type: 'assignment' });
    }
    setIsEventDetailsModalOpen(true);
  };

  const navigateDate = (direction: 'prev' | 'next' | 'today') => {
    const newDate = new Date(currentDate);

    switch (direction) {
      case 'prev':
        if (viewMode === 'month') {
          newDate.setMonth(newDate.getMonth() - 1);
        } else if (viewMode === 'week') {
          newDate.setDate(newDate.getDate() - 7);
        } else {
          newDate.setDate(newDate.getDate() - 1);
        }
        break;
      case 'next':
        if (viewMode === 'month') {
          newDate.setMonth(newDate.getMonth() + 1);
        } else if (viewMode === 'week') {
          newDate.setDate(newDate.getDate() + 7);
        } else {
          newDate.setDate(newDate.getDate() + 1);
        }
        break;
      case 'today':
        newDate.setTime(Date.now());
        break;
    }

    setCurrentDate(newDate);
  };

  const getDateDisplay = () => {
    if (viewMode === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (viewMode === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const css = `
    @media (min-width: 640px) {
      .calendar-controls-row {
        flex-direction: row;
      }
      .calendar-view-buttons {
        width: auto;
      }
      .calendar-view-button {
        flex: none;
      }
    }
  `;

  return (
    <div style={{ paddingBottom: '40px' }}>
      <style>{css}</style>

      {/* Unified Header and Controls Container */}
      <div style={{
        backgroundColor: theme.colors.bgSurface,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border}`,
        padding: '16px',
        marginBottom: '24px',
        boxShadow: theme.shadows.sm
      }}>
        {/* Top Row: Title and Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '16px'
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ marginBottom: 0 }}>
              <h1 style={{
                fontSize: '24px',
                fontWeight: 700,
                color: theme.colors.textMain,
                marginBottom: '4px',
                margin: 0
              }}>
                Calendar
              </h1>
              <p style={{
                fontSize: '16px',
                color: theme.colors.textSecondary,
                margin: 0
              }}>
                Manage your schedule and upcoming classes.
              </p>
            </div>
          </div>

          {/* Add Event and View Dropdown - Aligned with Title */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            paddingTop: '4px' // Align with title baseline
          }}>
            {canCreateEvents && (
              <button
                onClick={() => setIsAddEventModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: theme.borderRadius.md,
                  border: 'none',
                  backgroundColor: theme.colors.primary,
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: theme.shadows.sm,
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
                  e.currentTarget.style.boxShadow = theme.shadows.md;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.primary;
                  e.currentTarget.style.boxShadow = theme.shadows.sm;
                }}
              >
                <Plus size={16} />
                Add Event
              </button>
            )}

            {/* View Mode Dropdown */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.border}`,
                  backgroundColor: theme.colors.bgSurface,
                  color: theme.colors.textMain,
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: theme.shadows.sm,
                  whiteSpace: 'nowrap',
                  minWidth: '120px',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary;
                  e.currentTarget.style.boxShadow = theme.shadows.md;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.border;
                  e.currentTarget.style.boxShadow = theme.shadows.sm;
                }}
              >
                <span>{getViewLabel()}</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: isViewDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}
                />
              </button>

              {isViewDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  backgroundColor: theme.colors.bgSurface,
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.border}`,
                  boxShadow: theme.shadows.lg,
                  zIndex: 1000,
                  minWidth: '120px',
                  overflow: 'hidden'
                }}>
                  {(['day', 'week', 'month'] as ViewMode[]).map((view) => (
                    <button
                      key={view}
                      onClick={() => handleViewChange(view)}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        border: 'none',
                        backgroundColor: viewMode === view ? theme.colors.primaryLight : 'transparent',
                        color: viewMode === view ? theme.colors.primary : theme.colors.textMain,
                        fontSize: '14px',
                        fontWeight: viewMode === view ? 600 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        textTransform: 'capitalize',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      onMouseEnter={(e) => {
                        if (viewMode !== view) {
                          e.currentTarget.style.backgroundColor = theme.colors.bgHover;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (viewMode !== view) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row: Date Navigation */}
        <div className="calendar-controls-row" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          paddingTop: '12px',
          borderTop: `1px solid ${theme.colors.border}`
        }}>
          {/* Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: `${theme.colors.bgMain}80`,
                borderRadius: theme.borderRadius.md,
                padding: '2px',
                border: `1px solid ${theme.colors.border}`
              }}>
                <button
                  onClick={() => navigateDate('prev')}
                  style={{
                    padding: '6px',
                    borderRadius: theme.borderRadius.md,
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: theme.colors.textSecondary,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.bgHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span style={{ fontSize: '20px' }}>←</span>
                </button>
                <button
                  onClick={() => navigateDate('next')}
                  style={{
                    padding: '6px',
                    borderRadius: theme.borderRadius.md,
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: theme.colors.textSecondary,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.bgHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span style={{ fontSize: '20px' }}>→</span>
                </button>
              </div>
              <h2 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: theme.colors.textMain,
                margin: '0 0 0 8px'
              }}>
                {getDateDisplay()}
              </h2>
              <button
                onClick={() => navigateDate('today')}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: theme.colors.primary,
                  backgroundColor: theme.colors.primaryLight,
                  padding: '4px 10px',
                  borderRadius: theme.borderRadius.md,
                  border: 'none',
                  cursor: 'pointer',
                  marginLeft: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${theme.colors.primary}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.primaryLight;
                }}
              >
                Today
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Views */}
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 0',
          color: theme.colors.textSecondary
        }}>
          Loading calendar...
        </div>
      ) : (
        <>
          {viewMode === 'month' && (
            <MonthView
              currentDate={currentDate}
              liveClasses={liveClasses}
              assignments={assignments}
              onDateClick={canCreateEvents ? handleDateClick : undefined}
              onEventClick={handleEventClick}
            />
          )}
          {viewMode === 'week' && (
            <WeekView
              currentDate={currentDate}
              liveClasses={liveClasses}
              assignments={assignments}
              onDateClick={canCreateEvents ? handleDateClick : undefined}
              onEventClick={handleEventClick}
            />
          )}
          {viewMode === 'day' && (
            <DayView
              currentDate={currentDate}
              liveClasses={liveClasses}
              assignments={assignments}
              onDateClick={canCreateEvents ? handleDateClick : undefined}
              onEventClick={handleEventClick}
            />
          )}
        </>
      )}

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => {
          setIsAddEventModalOpen(false);
          setSelectedDate(undefined);
          setSelectedTime(undefined);
        }}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onEventCreated={handleEventCreated}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={isEventDetailsModalOpen}
        onClose={() => {
          setIsEventDetailsModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </div>
  );
}

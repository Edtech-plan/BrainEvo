import React, { useMemo } from 'react';
import { theme } from '@/styles/theme';
import { getEventsForDate, formatTime, isToday } from '../../utils/calendar.utils';
import type { LiveClass } from '@/shared/types';
import type { Assignment } from '@/shared/types';

interface DayViewProps {
  currentDate: Date;
  liveClasses: LiveClass[];
  assignments: Assignment[];
  onDateClick?: (date: Date, time?: string) => void;
  onEventClick?: (event: LiveClass | Assignment, type: 'class' | 'assignment') => void;
}

export default function DayView({ currentDate, liveClasses, assignments, onDateClick, onEventClick }: DayViewProps) {
  const events = useMemo(() => {
    return getEventsForDate(currentDate, liveClasses, assignments);
  }, [currentDate, liveClasses, assignments]);

  const hourSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 12 ? (i === 0 ? 12 : i) : i - 12;
    const period = i < 12 ? 'AM' : 'PM';
    return { hour, period, fullHour: i };
  });

  const getEventPosition = (startTime: Date, endTime: Date) => {
    const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
    const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();
    const duration = endMinutes - startMinutes;

    // Each hour is 60px (reduced from 96px), so 1 minute = 60/60 = 1px
    const top = startMinutes * 1;
    const height = duration * 1;

    return { top, height };
  };

  const allEvents = [
    ...events.liveClasses.map(lc => ({
      ...lc,
      type: 'class' as const,
      start: new Date(lc.scheduledAt),
      end: new Date(new Date(lc.scheduledAt).getTime() + (lc.duration || 60) * 60 * 1000),
    })),
    ...events.assignments.map(a => ({
      ...a,
      type: 'assignment' as const,
      start: new Date(a.dueDate!),
      end: new Date(new Date(a.dueDate!).getTime() + 60 * 60 * 1000), // 1 hour default
    })),
  ].sort((a, b) => a.start.getTime() - b.start.getTime());

  const css = `
    .timeline-scroll::-webkit-scrollbar {
      width: 6px;
    }
    .timeline-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
    .timeline-scroll::-webkit-scrollbar-thumb {
      background-color: #cbd5e1;
      border-radius: 20px;
    }
    .grid-line {
      border-top: 1px solid ${theme.colors.bgHover};
    }
  `;

  return (
    <div style={{ marginTop: '16px' }}>
      <style>{css}</style>

      {/* Date Header */}
      <div style={{
        backgroundColor: theme.colors.bgSurface,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border}`,
        padding: '4px',
        marginBottom: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: theme.shadows.sm
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: theme.colors.textMain,
            margin: 0
          }}>
            {currentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </h2>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{
        backgroundColor: theme.colors.bgSurface,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.sm,
        minHeight: '600px',
        maxHeight: 'calc(100vh - 300px)',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Time Column */}
        <div style={{
          width: '60px',
          flexShrink: 0,
          borderRight: `1px dashed ${theme.colors.border}`,
          backgroundColor: `${theme.colors.bgMain}80`,
          borderRadius: `${theme.borderRadius.lg} 0 0 ${theme.borderRadius.lg}`
        }}>
          <div style={{ height: '60px', borderBottom: 'transparent' }}></div>
          {hourSlots.slice(8, 18).map((slot, idx) => (
            <div key={idx} style={{ height: '60px', position: 'relative' }}>
              <span style={{
                position: 'absolute',
                top: '-10px',
                right: '8px',
                fontSize: '11px',
                fontWeight: 500,
                color: theme.colors.textSecondary
              }}>
                {slot.hour} {slot.period}
              </span>
            </div>
          ))}
        </div>

          {/* Events Area */}
        <div style={{ flex: 1, position: 'relative' }}>
            {/* Grid Lines */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {hourSlots.slice(8, 18).map((_, idx) => (
                <div key={idx} className="grid-line" style={{ height: '60px' }}></div>
              ))}
            </div>

          {/* Clickable Time Slots */}
          {onDateClick && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto', zIndex: 5 }}>
              {hourSlots.slice(8, 18).map((slot, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const clickedDate = new Date(currentDate);
                    const hour = slot.fullHour;
                    const timeString = `${hour.toString().padStart(2, '0')}:00`;
                    onDateClick(clickedDate, timeString);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      const clickedDate = new Date(currentDate);
                      const hour = slot.fullHour;
                      const timeString = `${hour.toString().padStart(2, '0')}:00`;
                      onDateClick(clickedDate, timeString);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select time slot ${slot.label}`}
                  style={{
                    position: 'absolute',
                    top: `${idx * 60}px`,
                    left: 0,
                    right: 0,
                    height: '60px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${theme.colors.primaryLight}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                />
              ))}
            </div>
          )}

          {/* Current Time Indicator */}
          {isToday(currentDate) && (
            <div style={{
              position: 'absolute',
              width: '100%',
              borderTop: '2px solid #ef4444',
              zIndex: 20,
              left: 0,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              top: `${(new Date().getHours() * 60 + new Date().getMinutes() - 8 * 60) * 1}px`
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                position: 'absolute',
                left: '-4px'
              }}></div>
            </div>
          )}

          {/* Events */}
          <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
            {allEvents.map((event, idx) => {
              const position = getEventPosition(event.start, event.end);
              const isClass = event.type === 'class';
              const eventColor = isClass ? {
                bg: '#eff6ff',
                border: theme.colors.primary,
                text: '#1e40af',
                textLight: '#3b82f6'
              } : {
                bg: '#fff7ed',
                border: theme.colors.warning,
                text: '#92400e',
                textLight: '#d97706'
              };

              return (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEventClick) {
                      onEventClick(event, isClass ? 'class' : 'assignment');
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onEventClick) {
                        onEventClick(event, isClass ? 'class' : 'assignment');
                      }
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${event.title}`}
                  style={{
                    position: 'absolute',
                    top: `${position.top}px`,
                    left: '12px',
                    right: '12px',
                    height: `${Math.max(position.height, 40)}px`,
                    backgroundColor: eventColor.bg,
                    borderLeft: `3px solid ${eventColor.border}`,
                    borderRadius: '0 4px 4px 0',
                    padding: '8px 10px',
                    cursor: 'pointer',
                    border: `1px solid ${eventColor.border}30`,
                    boxShadow: theme.shadows.sm,
                    transition: 'all 0.2s',
                    pointerEvents: 'auto'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = theme.shadows.sm;
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    role="presentation"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', height: '100%' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', flex: 1 }}>
                      <div>
                        <h3 style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: eventColor.text,
                          margin: 0,
                          lineHeight: 1.2
                        }}>
                          {event.title}
                        </h3>
                        <p style={{
                          fontSize: '11px',
                          color: eventColor.textLight,
                          margin: '2px 0 0 0',
                          fontWeight: 500
                        }}>
                          {formatTime(event.start)} - {formatTime(event.end)}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        {isClass && 'meetingLink' in event && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '10px',
                            color: eventColor.textLight,
                            backgroundColor: `${eventColor.border}20`,
                            padding: '3px 6px',
                            borderRadius: '3px'
                          }}>
                            <span style={{ fontSize: '12px' }}>📹</span>
                            <span>Zoom</span>
                          </div>
                        )}
                        {isClass && 'instructor' in event && event.instructor && (
                          <div style={{ display: 'flex', gap: '-6px' }}>
                            <div style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: theme.colors.primary,
                              border: `2px solid ${theme.colors.bgSurface}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: '9px',
                              fontWeight: 600
                            }}>
                              {event.instructor.name.charAt(0)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

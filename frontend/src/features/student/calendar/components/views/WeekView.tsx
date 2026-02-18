import React, { useMemo } from 'react';
import { theme } from '@/styles/theme';
import { getWeekDays, getEventsForDate, formatTime, isToday } from '../../utils/calendar.utils';
import type { LiveClass } from '@/shared/types';
import type { Assignment } from '@/shared/types';

interface WeekViewProps {
  currentDate: Date;
  liveClasses: LiveClass[];
  assignments: Assignment[];
  onDateClick?: (date: Date, time?: string) => void;
  onEventClick?: (event: LiveClass | Assignment, type: 'class' | 'assignment') => void;
}

export default function WeekView({ currentDate, liveClasses, assignments, onDateClick, onEventClick }: WeekViewProps) {
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const weekEvents = useMemo(() => {
    return weekDays.map(day => getEventsForDate(day, liveClasses, assignments));
  }, [weekDays, liveClasses, assignments]);

  const hourSlots = Array.from({ length: 10 }, (_, i) => i + 8); // 8 AM to 5 PM

  const getEventPosition = (startTime: Date, dayIndex: number) => {
    const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
    const top = (startMinutes - 8 * 60) * (50 / 60); // 50px per hour (reduced from 80px)
    return { top, dayIndex };
  };

  const getEventHeight = (startTime: Date, endTime: Date) => {
    const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
    const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();
    const duration = endMinutes - startMinutes;
    return (duration / 60) * 50; // 50px per hour (reduced from 80px)
  };

  const css = `
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  `;

  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  const weekRange = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <div style={{ marginTop: '16px' }}>
      <style>{css}</style>

      {/* Week Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: theme.colors.textMain,
            margin: 0
          }}>
            {weekRange}
          </h2>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{
        backgroundColor: theme.colors.bgSurface,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.sm,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Day Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '50px repeat(7, 1fr)',
          borderBottom: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.bgSurface
        }}>
          <div style={{ padding: '10px', borderRight: `1px solid ${theme.colors.border}` }}></div>
          {weekDays.map((day, idx) => {
            const isTodayDate = isToday(day);
            const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            return (
              <div
                key={idx}
                style={{
                  padding: '10px 8px',
                  textAlign: 'center',
                  borderRight: idx < 6 ? `1px solid ${theme.colors.border}` : 'none',
                  minWidth: '80px',
                  backgroundColor: isTodayDate ? `${theme.colors.primaryLight}80` : 'transparent'
                }}
              >
                <p style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: theme.colors.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '4px',
                  margin: '0 0 4px 0'
                }}>
                  {dayLabels[idx]}
                </p>
                {isTodayDate ? (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    backgroundColor: theme.colors.primary,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '14px',
                    boxShadow: `0 0 0 2px ${theme.colors.primaryLight}`
                  }}>
                    {day.getDate()}
                  </div>
                ) : (
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: theme.colors.textMain
                  }}>
                    {day.getDate()}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Time Grid */}
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative', minHeight: '500px', maxHeight: 'calc(100vh - 300px)' }}>
          {/* Background Grid */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: '50px repeat(7, 1fr)',
            pointerEvents: 'none',
            width: '100%',
            height: '100%',
            zIndex: 0
          }}>
            <div style={{
              borderRight: `1px solid ${theme.colors.border}`,
              backgroundColor: `${theme.colors.bgMain}80`
            }}></div>
            {weekDays.map((_, idx) => (
              <div
                key={idx}
                style={{
                  borderRight: idx < 6 ? `1px solid ${theme.colors.border}` : 'none',
                  backgroundColor: isToday(weekDays[idx]) ? `${theme.colors.primaryLight}30` : 'transparent'
                }}
              ></div>
            ))}
          </div>

          {/* Time Slots */}
          <div style={{ position: 'relative', zIndex: 0 }}>
            {hourSlots.map((hour, hourIdx) => (
              <div
                key={hourIdx}
                style={{
                  height: '50px',
                  borderBottom: `1px solid ${theme.colors.border}`,
                  display: 'flex',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{
                  width: '50px',
                  textAlign: 'right',
                  paddingRight: '6px',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: theme.colors.textSecondary,
                  position: 'relative',
                  top: '-8px'
                }}>
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
              </div>
            ))}
          </div>

          {/* Clickable Time Slots */}
          {onDateClick && (
            <div style={{
              position: 'absolute',
              inset: 0,
              left: '50px',
              width: 'calc(100% - 50px)',
              height: '100%',
              pointerEvents: 'auto',
              zIndex: 5
            }}>
              {weekDays.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  style={{
                    position: 'absolute',
                    left: `${(dayIdx / 7) * 100}%`,
                    width: `${100 / 7}%`,
                    height: '100%',
                    display: 'grid',
                    gridTemplateRows: `repeat(${hourSlots.length}, 50px)`,
                    gap: 0
                  }}
                >
                  {hourSlots.map((hour, hourIdx) => (
                    <div
                      key={hourIdx}
                      onClick={(e) => {
                        e.stopPropagation();
                        const clickedDate = new Date(day);
                        const timeString = `${hour.toString().padStart(2, '0')}:00`;
                        onDateClick(clickedDate, timeString);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          const clickedDate = new Date(day);
                          const timeString = `${hour.toString().padStart(2, '0')}:00`;
                          onDateClick(clickedDate, timeString);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select time slot ${hour}:00 on ${day.toLocaleDateString()}`}
                      style={{
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        borderRight: dayIdx < 6 ? `1px solid transparent` : 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${theme.colors.primaryLight}20`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Events */}
          <div style={{
            position: 'absolute',
            inset: 0,
            left: '50px',
            width: 'calc(100% - 50px)',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            {weekDays.map((day, dayIdx) => {
              const dayEvents = weekEvents[dayIdx];
              const allDayEvents = [
                ...dayEvents.liveClasses.map(lc => ({
                  ...lc,
                  type: 'class' as const,
                  start: new Date(lc.scheduledAt),
                  end: new Date(new Date(lc.scheduledAt).getTime() + (lc.duration || 60) * 60 * 1000),
                })),
                ...dayEvents.assignments.map(a => ({
                  ...a,
                  type: 'assignment' as const,
                  start: new Date(a.dueDate!),
                  end: new Date(new Date(a.dueDate!).getTime() + 60 * 60 * 1000),
                })),
              ].sort((a, b) => a.start.getTime() - b.start.getTime());

              return (
                <div
                  key={dayIdx}
                  style={{
                    position: 'absolute',
                    left: `${(dayIdx / 7) * 100}%`,
                    width: `${100 / 7}%`,
                    height: '100%',
                    pointerEvents: 'none',
                    padding: '4px'
                  }}
                >
                  {allDayEvents.map((event, eventIdx) => {
                    const position = getEventPosition(event.start, dayIdx);
                    const height = getEventHeight(event.start, event.end);
                    const isClass = event.type === 'class';
                    const eventColor = isClass ? {
                      bg: '#e0f2fe',
                      border: '#0ea5e9',
                      text: '#0369a1'
                    } : {
                      bg: '#fef3c7',
                      border: '#f59e0b',
                      text: '#b45309'
                    };

                    return (
                      <div
                        key={eventIdx}
                        style={{
                          position: 'absolute',
                          top: `${position.top}px`,
                          left: '3px',
                          right: '3px',
                          height: `${Math.max(height, 30)}px`,
                          backgroundColor: eventColor.bg,
                          borderLeft: `2px solid ${eventColor.border}`,
                          borderRadius: '4px',
                          padding: '6px 8px',
                          cursor: 'pointer',
                          boxShadow: theme.shadows.sm,
                          transition: 'all 0.2s',
                          zIndex: 10
                        }}
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
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = theme.shadows.md;
                          e.currentTarget.style.transform = 'scale(1.02)';
                          e.currentTarget.style.zIndex = '20';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = theme.shadows.sm;
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.zIndex = '10';
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                          <div>
                            <p style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: eventColor.text,
                              margin: 0,
                              lineHeight: 1.2
                            }}>
                              {event.title}
                            </p>
                            <p style={{
                              fontSize: '9px',
                              color: eventColor.text,
                              margin: '2px 0 0 0',
                              fontWeight: 500,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              {isClass && 'meetingLink' in event && (
                                <>
                                  <span style={{ fontSize: '12px' }}>📹</span>
                                  <span>Virtual</span>
                                </>
                              )}
                              {!isClass && (
                                <>
                                  <span style={{ fontSize: '12px' }}>📍</span>
                                  <span>Assignment</span>
                                </>
                              )}
                            </p>
                          </div>
                          <p style={{
                            fontSize: '9px',
                            fontWeight: 500,
                            color: eventColor.text,
                            margin: 0
                          }}>
                            {formatTime(event.start)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

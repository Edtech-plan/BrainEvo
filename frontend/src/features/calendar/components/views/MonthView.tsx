import React, { useMemo } from 'react';
import { theme } from '@/shared/components/ui/theme';
import { getDaysInMonth, getEventsForDate, isToday } from '../../utils/calendar.utils';
import type { LiveClass } from '@/shared/types';
import type { Assignment } from '@/shared/types';

interface MonthViewProps {
  currentDate: Date;
  liveClasses: LiveClass[];
  assignments: Assignment[];
  onDateClick?: (date: Date, time?: string) => void;
  onEventClick?: (event: LiveClass | Assignment, type: 'class' | 'assignment') => void;
}

export default function MonthView({ currentDate, liveClasses, assignments, onDateClick, onEventClick }: MonthViewProps) {
  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  const dayEvents = useMemo(() => {
    return days.map(day => getEventsForDate(day, liveClasses, assignments));
  }, [days, liveClasses, assignments]);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getEventColor = (type: 'class' | 'assignment') => {
    if (type === 'class') {
      return {
        bg: '#eff6ff',
        border: theme.colors.primary,
        text: '#1e40af'
      };
    } else {
      return {
        bg: '#fff7ed',
        border: theme.colors.warning,
        text: '#92400e'
      };
    }
  };

  const css = `
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
      background-color: ${theme.colors.border};
    }
    .calendar-cell {
      background-color: ${theme.colors.bgSurface};
      min-height: 90px;
      padding: 8px;
    }
    @media (max-width: 768px) {
      .calendar-cell {
        min-height: 60px;
        padding: 6px;
      }
    }
  `;

  return (
    <div style={{ marginTop: '16px' }}>
      <style>{css}</style>

      {/* Month Header */}
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
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
        </div>
      </div>

      {/* Calendar */}
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
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: `1px solid ${theme.colors.border}`,
          backgroundColor: `${theme.colors.bgMain}80`
        }}>
          {weekDays.map((day, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: theme.colors.textSecondary
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid" style={{ flex: 1 }}>
          {days.map((day, idx) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isTodayDate = isToday(day);
            const events = dayEvents[idx];
            const allEvents = [
              ...events.liveClasses.map(lc => ({ ...lc, type: 'class' as const })),
              ...events.assignments.map(a => ({ ...a, type: 'assignment' as const })),
            ].slice(0, 3); // Show max 3 events per day

            return (
              <div
                key={idx}
                className="calendar-cell"
                style={{
                  backgroundColor: isCurrentMonth ? theme.colors.bgSurface : `${theme.colors.bgMain}30`,
                  position: 'relative',
                  cursor: onDateClick && isCurrentMonth ? 'pointer' : 'default',
                  transition: 'background-color 0.2s',
                  border: isTodayDate ? `2px solid ${theme.colors.primary}` : 'none'
                }}
                onClick={(e) => {
                  if (onDateClick && isCurrentMonth) {
                    e.stopPropagation();
                    onDateClick(day);
                  }
                }}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && onDateClick && isCurrentMonth) {
                    e.preventDefault();
                    e.stopPropagation();
                    onDateClick(day);
                  }
                }}
                role={onDateClick && isCurrentMonth ? 'button' : undefined}
                tabIndex={onDateClick && isCurrentMonth ? 0 : undefined}
                aria-label={onDateClick && isCurrentMonth ? `Select date ${day.toLocaleDateString()}` : undefined}
                onMouseEnter={(e) => {
                  if (isCurrentMonth && onDateClick) {
                    e.currentTarget.style.backgroundColor = theme.colors.bgHover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (isCurrentMonth) {
                    e.currentTarget.style.backgroundColor = theme.colors.bgSurface;
                  }
                }}
              >
                {/* Date Number */}
                <div style={{ marginBottom: '4px' }}>
                  {isTodayDate ? (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: theme.colors.primary,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      boxShadow: `0 0 0 2px ${theme.colors.primaryLight}`
                    }}>
                      {day.getDate()}
                    </div>
                  ) : (
                    <span style={{
                      fontSize: '13px',
                      fontWeight: isCurrentMonth ? 500 : 400,
                      color: isCurrentMonth ? theme.colors.textMain : `${theme.colors.textSecondary}40`
                    }}>
                      {day.getDate()}
                    </span>
                  )}
                </div>

                {/* Events */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {allEvents.map((event, eventIdx) => {
                    const colors = getEventColor(event.type);
                    return (
                      <div
                        key={eventIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onEventClick) {
                            onEventClick(event, event.type);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onEventClick) {
                              onEventClick(event, event.type);
                            }
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`View details for ${event.title}`}
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                          fontSize: '11px',
                          padding: '3px 6px',
                          borderRadius: '4px',
                          borderLeft: `2px solid ${colors.border}`,
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          boxShadow: theme.shadows.sm,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        title={event.title}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = theme.shadows.md;
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = theme.shadows.sm;
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {event.title}
                      </div>
                    );
                  })}
                  {allEvents.length === 0 && events.liveClasses.length + events.assignments.length > 3 && (
                    <div style={{
                      fontSize: '10px',
                      color: theme.colors.textSecondary,
                      fontStyle: 'italic'
                    }}>
                      +{events.liveClasses.length + events.assignments.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{
          padding: '12px 24px',
          backgroundColor: theme.colors.bgSurface,
          borderTop: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          fontSize: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: theme.colors.primary
            }}></span>
            <span style={{ color: theme.colors.textSecondary, fontWeight: 500 }}>Live Class</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: theme.colors.warning
            }}></span>
            <span style={{ color: theme.colors.textSecondary, fontWeight: 500 }}>Assignment</span>
          </div>
        </div>
      </div>
    </div>
  );
}

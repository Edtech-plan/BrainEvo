import React from 'react';
import { X, Calendar, Clock, Link as LinkIcon, Video } from 'lucide-react';
import { theme } from '@/shared/components/ui/theme';
import type { LiveClass } from '@/shared/types';
import type { Assignment } from '@/shared/types';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: (LiveClass & { type: 'class' }) | (Assignment & { type: 'assignment' }) | null;
}

export default function EventDetailsModal({ isOpen, onClose, event }: EventDetailsModalProps) {
  if (!isOpen || !event) return null;

  const isClass = event.type === 'class';
  const eventDate = isClass
    ? new Date(event.scheduledAt)
    : event.dueDate
    ? new Date(event.dueDate)
    : null;

  const eventEnd = isClass && eventDate
    ? new Date(eventDate.getTime() + (event.duration || 60) * 60 * 1000)
    : eventDate
    ? new Date(eventDate.getTime() + 60 * 60 * 1000)
    : null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
      `}</style>
      {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-details-modal-title"
        style={{
          backgroundColor: theme.colors.bgSurface,
          borderRadius: theme.borderRadius.lg,
          width: '100%',
          maxWidth: '500px',
          boxShadow: theme.shadows.xl,
          position: 'relative',
          animation: 'slideUp 0.2s ease-out',
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
          padding: '24px',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: isClass ? theme.colors.primaryLight : theme.colors.warningLight
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              {isClass ? (
                <Video size={20} color={theme.colors.primary} />
              ) : (
                <Calendar size={20} color={theme.colors.warning} />
              )}
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: isClass ? theme.colors.primary : theme.colors.warning,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {isClass ? 'Live Class' : 'Assignment'}
              </span>
            </div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: theme.colors.textMain,
              margin: 0
            }}>
              {event.title}
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

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Date and Time */}
          {eventDate && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: isClass ? theme.colors.primaryLight : theme.colors.warningLight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Calendar size={20} color={isClass ? theme.colors.primary : theme.colors.warning} />
                </div>
                <div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: theme.colors.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '4px'
                  }}>
                    Date
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: theme.colors.textMain
                  }}>
                    {formatDate(eventDate)}
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: isClass ? theme.colors.primaryLight : theme.colors.warningLight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Clock size={20} color={isClass ? theme.colors.primary : theme.colors.warning} />
                </div>
                <div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: theme.colors.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '4px'
                  }}>
                    Time
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: theme.colors.textMain
                  }}>
                    {formatTime(eventDate)}
                    {eventEnd && ` - ${formatTime(eventEnd)}`}
                    {isClass && event.duration && (
                      <span style={{
                        fontSize: '14px',
                        color: theme.colors.textSecondary,
                        fontWeight: 400,
                        marginLeft: '8px'
                      }}>
                        ({event.duration} minutes)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {isClass && 'description' in event && event.description && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: theme.colors.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>
                Description
              </div>
              <div style={{
                fontSize: '14px',
                color: theme.colors.textMain,
                lineHeight: 1.6
              }}>
                {event.description}
              </div>
            </div>
          )}

          {/* Meeting Link */}
          {isClass && 'meetingLink' in event && event.meetingLink && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: theme.colors.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>
                Meeting Link
              </div>
              <a
                href={event.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: theme.colors.primary,
                  textDecoration: 'none',
                  padding: '8px 12px',
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.primaryLight,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${theme.colors.primary}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.primaryLight;
                }}
              >
                <LinkIcon size={16} />
                <span>Join Meeting</span>
              </a>
            </div>
          )}

          {/* Instructor */}
          {isClass && 'instructor' in event && event.instructor && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: theme.colors.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>
                Instructor
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 600
                }}>
                  {typeof event.instructor === 'object' && 'name' in event.instructor
                    ? event.instructor.name.charAt(0).toUpperCase()
                    : 'I'}
                </div>
                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: theme.colors.textMain
                  }}>
                    {typeof event.instructor === 'object' && 'name' in event.instructor
                      ? event.instructor.name
                      : 'Instructor'}
                  </div>
                  {typeof event.instructor === 'object' && 'email' in event.instructor && (
                    <div style={{
                      fontSize: '14px',
                      color: theme.colors.textSecondary
                    }}>
                      {event.instructor.email}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Assignment Details */}
          {!isClass && 'description' in event && event.description && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: theme.colors.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>
                Description
              </div>
              <div style={{
                fontSize: '14px',
                color: theme.colors.textMain,
                lineHeight: 1.6
              }}>
                {event.description}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: `1px solid ${theme.colors.border}`,
          display: 'flex',
          justifyContent: 'flex-end',
          backgroundColor: theme.colors.bgMain
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: theme.borderRadius.md,
              border: 'none',
              backgroundColor: theme.colors.primary,
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

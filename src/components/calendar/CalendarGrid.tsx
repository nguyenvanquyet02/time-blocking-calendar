import React, { useRef, useCallback } from 'react';
import type { CalendarEvent } from '../../types/calendar';
import { HOUR_HEIGHT, MINUTE_HEIGHT, TOTAL_MINUTES, dateToMinutes } from '../../hooks/useCalendar';
import EventBlock from './EventBlock';
import CurrentTimeLine from './CurrentTimeLine';

interface CalendarGridProps {
  days: Date[];
  events: CalendarEvent[];
  dragCreate: { dayIndex: number; startMinute: number; endMinute: number } | null;
  dragMoveVisible: { eventId: string; dayIndex: number; startMinute: number } | null;
  draggingEventId: string | null;
  onMouseDownEmpty: (dayIndex: number, minuteFromTop: number) => void;
  onMouseMoveGrid: (dayIndex: number, minuteFromTop: number) => void;
  onMouseUpGrid: () => void;
  onMouseDownEvent: (e: React.MouseEvent, eventId: string, offsetMinutes: number, dayIndex: number) => void;
  onClickEvent: (e: React.MouseEvent, eventId: string) => void;
  onContextMenuEvent: (e: React.MouseEvent, eventId: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function getEventsByDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter((e) => {
    const d = new Date(e.startDateTime);
    return (
      d.getFullYear() === day.getFullYear() &&
      d.getMonth() === day.getMonth() &&
      d.getDate() === day.getDate()
    );
  });
}

function getMinuteFromY(y: number): number {
  return Math.max(0, Math.min(y / MINUTE_HEIGHT, TOTAL_MINUTES));
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  events,
  dragCreate,
  dragMoveVisible,
  draggingEventId,
  onMouseDownEmpty,
  onMouseMoveGrid,
  onMouseUpGrid,
  onMouseDownEvent,
  onClickEvent,
  onContextMenuEvent,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  /** Convert a mouse event's Y to minutes relative to the grid top */
  const getMinuteFromEvent = useCallback((e: React.MouseEvent): number => {
    if (!gridRef.current) return 0;
    const rect = gridRef.current.getBoundingClientRect();
    return getMinuteFromY(e.clientY - rect.top);
  }, []);

  /** Determine which day column was clicked */
  const getDayIndexFromEvent = useCallback((e: React.MouseEvent): number => {
    if (!gridRef.current) return 0;
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const colWidth = rect.width / days.length;
    return Math.max(0, Math.min(Math.floor(x / colWidth), days.length - 1));
  }, [days.length]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const minute = getMinuteFromEvent(e);
    const dayIdx = getDayIndexFromEvent(e);
    onMouseMoveGrid(dayIdx, minute);
  }, [getMinuteFromEvent, getDayIndexFromEvent, onMouseMoveGrid]);

  const handleColumnMouseDown = useCallback((e: React.MouseEvent, dayIndex: number) => {
    // Only handle direct clicks on the column background (not on events)
    if ((e.target as HTMLElement).closest('[data-event]')) return;
    if (e.button !== 0) return;
    const minute = getMinuteFromEvent(e);
    onMouseDownEmpty(dayIndex, minute);
  }, [getMinuteFromEvent, onMouseDownEmpty]);

  return (
    <div
      className="flex flex-1 relative"
      style={{ minHeight: `${24 * 60}px` }}
      ref={gridRef}
      onMouseMove={handleMouseMove}
      onMouseUp={onMouseUpGrid}
      onMouseLeave={onMouseUpGrid}
    >
      {days.map((day, dayIndex) => {
        const dayEvents = getEventsByDay(events, day);
        const isToday = dayIndex === 0;

        return (
          <div
            key={dayIndex}
            className={`flex-1 relative border-l border-gray-200 min-w-0 ${isToday ? 'bg-blue-50/20' : 'bg-white'}`}
            style={{ minHeight: `${24 * 60}px` }}
            onMouseDown={(e) => handleColumnMouseDown(e, dayIndex)}
          >
            {/* Hour grid lines */}
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="border-b border-gray-100"
                style={{ height: HOUR_HEIGHT }}
              />
            ))}

            {/* Drag-to-create preview */}
            {dragCreate && dragCreate.dayIndex === dayIndex && (
              <div
                className="absolute left-1 right-1 bg-blue-400/30 border-2 border-blue-400 border-dashed rounded-lg pointer-events-none z-20"
                style={{
                  top: dragCreate.startMinute * MINUTE_HEIGHT,
                  height: (dragCreate.endMinute - dragCreate.startMinute) * MINUTE_HEIGHT,
                }}
              />
            )}

            {/* Events */}
            {dayEvents.map((event) => {
              const isDragging = event.id === draggingEventId;

              // When dragging this event in this column, use preview position
              const previewTop =
                isDragging && dragMoveVisible?.eventId === event.id && dragMoveVisible.dayIndex === dayIndex
                  ? dragMoveVisible.startMinute * MINUTE_HEIGHT
                  : isDragging && dragMoveVisible?.dayIndex !== dayIndex
                    ? undefined // hidden in original column if moved to another
                    : undefined;

              // Hide original event block if it's being dragged to a different column
              if (isDragging && dragMoveVisible && dragMoveVisible.dayIndex !== dayIndex) {
                return null;
              }

              return (
                <EventBlock
                  key={event.id}
                  event={event}
                  isDragging={isDragging}
                  previewTop={previewTop}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    if (e.button !== 0) return;
                    const eventTop = dateToMinutes(event.startDateTime) * MINUTE_HEIGHT;
                    const offsetMinutes = (e.clientY - (gridRef.current!.getBoundingClientRect().top + eventTop)) / MINUTE_HEIGHT;
                    onMouseDownEvent(e, event.id, offsetMinutes, dayIndex);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClickEvent(e, event.id);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onContextMenuEvent(e, event.id);
                  }}
                />
              );
            })}

            {/* Drag-move ghost in destination column */}
            {draggingEventId &&
              dragMoveVisible &&
              dragMoveVisible.dayIndex === dayIndex &&
              (() => {
                const event = events.find((ev) => ev.id === draggingEventId);
                if (!event) return null;
                const duration =
                  (event.endDateTime.getTime() - event.startDateTime.getTime()) / 60000;
                return (
                  <div
                    className="absolute left-1 right-1 rounded-lg pointer-events-none z-20 opacity-50"
                    style={{
                      top: dragMoveVisible.startMinute * MINUTE_HEIGHT,
                      height: duration * MINUTE_HEIGHT,
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    }}
                  />
                );
              })()}
          </div>
        );
      })}

      {/* Current time line — overlays today's column */}
      <CurrentTimeLine dayIndex={0} totalDays={days.length} />
    </div>
  );
};

export default CalendarGrid;

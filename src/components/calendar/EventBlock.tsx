import React from 'react';
import type { CalendarEvent } from '../../types/calendar';
import { HOUR_HEIGHT, TOTAL_MINUTES, dateToMinutes } from '../../hooks/useCalendar';

interface EventBlockProps {
  event: CalendarEvent;
  isDragging?: boolean;
  previewTop?: number; // px override when dragging
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

function formatTimeRange(start: Date, end: Date): string {
  const fmt = (d: Date) => {
    if (d.getHours() === 0 && d.getMinutes() === 0 && d.getTime() > start.getTime()) {
      return '24:00';
    }
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

const EventBlock: React.FC<EventBlockProps> = ({
  event,
  isDragging,
  previewTop,
  onMouseDown,
  onClick,
  onContextMenu,
}) => {
  const startMin =
    previewTop !== undefined
      ? previewTop / (HOUR_HEIGHT / 60)
      : dateToMinutes(event.startDateTime);

  // Calculate duration from actual timestamps to support events ending at midnight / next day (24:00)
  const durationMs = event.endDateTime.getTime() - event.startDateTime.getTime();
  const totalDurationMin = Math.max(15, Math.round(durationMs / 60000));

  // Event block on current day cannot extend past 24:00 (1440 minutes)
  const durationOnDay = Math.min(totalDurationMin, Math.max(15, TOTAL_MINUTES - startMin));

  const top = previewTop !== undefined ? previewTop : startMin * (HOUR_HEIGHT / 60);
  const height = Math.max(durationOnDay * (HOUR_HEIGHT / 60), 18);

  return (
    <div
      className={`absolute left-1 right-1 rounded-lg cursor-pointer select-none transition-shadow overflow-hidden group ${isDragging
          ? 'opacity-70 shadow-xl ring-2 ring-amber-400 z-30'
          : 'shadow-sm hover:shadow-md z-10'
        }`}
      style={{
        top,
        height,
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      }}
      onMouseDown={onMouseDown}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div className="px-2 py-1 h-full flex flex-col justify-start overflow-hidden">
        <p className="text-white text-xs font-semibold leading-tight truncate">{event.title}</p>
        {height >= 36 && (
          <p className="text-amber-100 text-[10px] leading-tight truncate mt-0.5">
            {formatTimeRange(event.startDateTime, event.endDateTime)}
          </p>
        )}
      </div>
    </div>
  );
};

export default EventBlock;

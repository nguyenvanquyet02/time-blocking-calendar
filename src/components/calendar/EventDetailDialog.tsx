import React from 'react';
import type { CalendarEvent } from '../../types/calendar';
import Dialog from '../ui/Dialog';
import Button from '../ui/Button';

interface EventDetailDialogProps {
  event: CalendarEvent;
  onClose: () => void;
}

function formatDateTime(date: Date): string {
  return date.toLocaleString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTime(date: Date, start?: Date): string {
  if (start && date.getHours() === 0 && date.getMinutes() === 0 && date.getTime() > start.getTime()) {
    return '24:00';
  }
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

const EventDetailDialog: React.FC<EventDetailDialogProps> = ({ event, onClose }) => {
  const durationMin = Math.round(
    (event.endDateTime.getTime() - event.startDateTime.getTime()) / 60000
  );

  return (
    <Dialog open onClose={onClose} title={event.title} headerVariant="amber">
      {/* Time block */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-xl">
        <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-blue-800">{formatDateTime(event.startDateTime)}</p>
          <p className="text-xs text-blue-600 mt-0.5">
            → {formatTime(event.endDateTime, event.startDateTime)}&nbsp;·&nbsp;{durationMin} phút
          </p>
        </div>
      </div>

      {/* Description */}
      {event.description ? (
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl mb-5">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{event.description}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic text-center py-2 mb-5">Không có mô tả</p>
      )}

      <Button variant="secondary" className="w-full" onClick={onClose}>
        Đóng
      </Button>
    </Dialog>
  );
};

export default EventDetailDialog;

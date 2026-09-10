import React from 'react';
import { HOUR_HEIGHT } from '../../hooks/useCalendar';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const TimeColumn: React.FC = () => {
  return (
    <div
      className="relative flex-shrink-0 w-16 bg-white border-r border-gray-200"
      style={{ minHeight: `${24 * 60}px` }}
    >
      {HOURS.map((hour) => (
        <div
          key={hour}
          className="relative border-b border-gray-100"
          style={{ height: HOUR_HEIGHT }}
        >
          <span className="absolute -top-2.5 right-2 text-xs text-gray-400 select-none">
            {String(hour).padStart(2, '0')}:00
          </span>
        </div>
      ))}
    </div>
  );
};

export default TimeColumn;

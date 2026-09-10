import React, { useEffect, useState } from 'react';
import { HOUR_HEIGHT, dateToMinutes } from '../../hooks/useCalendar';

interface CurrentTimeLineProps {
  dayIndex: number; // which column is today (always 0 since we start from today)
  totalDays: number;
}

const CurrentTimeLine: React.FC<CurrentTimeLineProps> = ({ dayIndex, totalDays }) => {
  const [minutes, setMinutes] = useState(() => dateToMinutes(new Date()));

  useEffect(() => {
    const update = () => setMinutes(dateToMinutes(new Date()));
    const interval = setInterval(update, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const topPx = minutes * (HOUR_HEIGHT / 60);
  // Position the line within today's column
  const leftPercent = (dayIndex / totalDays) * 100;
  const widthPercent = (1 / totalDays) * 100;

  return (
    <div
      className="absolute z-10 flex items-center pointer-events-none"
      style={{
        top: topPx,
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
      }}
    >
      <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0 -ml-1.5" />
      <div className="flex-1 h-0.5 bg-red-500" />
    </div>
  );
};

export default CurrentTimeLine;

import React from 'react';

interface CalendarHeaderProps {
  days: Date[];
}

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ days }) => {
  const today = new Date();

  return (
    <div className="flex bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="flex-shrink-0 w-16 flex items-end justify-center pb-1 border-r border-gray-200">
        <span className="text-xs text-gray-400 font-medium">GMT+07</span>
      </div>
      {days.map((day, idx) => {
        const isToday =
          day.getDate() === today.getDate() &&
          day.getMonth() === today.getMonth() &&
          day.getFullYear() === today.getFullYear();

        return (
          <div
            key={idx}
            className="flex-1 flex flex-col items-center justify-center py-2 border-l border-gray-200 min-w-0"
          >
            <span className="text-[10px] font-medium text-gray-500 tracking-widest uppercase">
              {DAY_NAMES[day.getDay()]}
            </span>
            <div
              className={`mt-1 w-9 h-9 flex items-center justify-center rounded-full text-[24px] font-semibold transition-colors ${isToday
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              {day.getDate()}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CalendarHeader;

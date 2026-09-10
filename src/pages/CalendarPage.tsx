import React, { useCallback } from 'react';
import { useCalendar } from '../hooks/useCalendar';
import CalendarHeader from '../components/calendar/CalendarHeader';
import TimeColumn from '../components/calendar/TimeColumn';
import CalendarGrid from '../components/calendar/CalendarGrid';
import EventDialog from '../components/calendar/EventDialog';
import EventDetailDialog from '../components/calendar/EventDetailDialog';
import ContextMenu from '../components/calendar/ContextMenu';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import type { CalendarEvent } from '../types/calendar';

const CalendarPage: React.FC = () => {
  const {
    days,
    events,
    isLoading,
    firestoreError,
    dragCreate,
    dragMove,
    dragMoveVisible,
    contextMenu,
    dialog,
    detailEvent,
    startDragCreate,
    updateDragCreate,
    endDragCreate,
    startDragMove,
    updateDragMove,
    endDragMove,
    createEvent,
    updateEvent,
    deleteEvent,
    openContextMenu,
    closeContextMenu,
    openEditDialog,
    openDetail,
    closeDetail,
    setDialog,
  } = useCalendar();

  const handleMouseDownEmpty = useCallback(
    (dayIndex: number, minuteFromTop: number) => {
      if (dragMove) return;
      startDragCreate(dayIndex, minuteFromTop);
    },
    [dragMove, startDragCreate]
  );

  const handleMouseMoveGrid = useCallback(
    (dayIndex: number, minuteFromTop: number) => {
      if (dragCreate) updateDragCreate(minuteFromTop);
      else if (dragMove) updateDragMove(dayIndex, minuteFromTop);
    },
    [dragCreate, dragMove, updateDragCreate, updateDragMove]
  );

  const handleMouseUpGrid = useCallback(() => {
    if (dragCreate) endDragCreate();
    else if (dragMove) endDragMove();
  }, [dragCreate, dragMove, endDragCreate, endDragMove]);

  const handleMouseDownEvent = useCallback(
    (_e: React.MouseEvent, eventId: string, offsetMinutes: number, dayIndex: number) => {
      startDragMove(eventId, offsetMinutes, dayIndex);
    },
    [startDragMove]
  );

  const handleClickEvent = useCallback(
    (_e: React.MouseEvent, eventId: string) => {
      if (!dragMove) openDetail(eventId);
    },
    [dragMove, openDetail]
  );

  const handleContextMenuEvent = useCallback(
    (e: React.MouseEvent, eventId: string) => {
      openContextMenu(eventId, e.clientX, e.clientY);
    },
    [openContextMenu]
  );

  const handleSaveEvent = useCallback(
    (event: CalendarEvent) => {
      if (dialog?.mode === 'edit') updateEvent(event);
      else createEvent(event);
    },
    [dialog, createEvent, updateEvent]
  );

  const handleAddClick = useCallback(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    setDialog({
      mode: 'create',
      initialStart: new Date(d),
      initialEnd: new Date(d.setHours(d.getHours() + 1)),
    });
  }, [setDialog]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
        <h1 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
          Lịch làm việc — 7 ngày tới
        </h1>
        <Button
          variant="primary"
          onClick={handleAddClick}
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Thêm sự kiện
        </Button>
      </div>

      <div
        className={`flex flex-1 overflow-hidden ${dragCreate || dragMove ? 'no-select' : ''}`}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          <CalendarHeader days={days} />
          <div className="flex flex-1 overflow-y-auto overflow-x-hidden calendar-scroll">
            <TimeColumn />
            <CalendarGrid
              days={days}
              events={events}
              dragCreate={dragCreate}
              dragMoveVisible={dragMoveVisible}
              draggingEventId={dragMove?.eventId ?? null}
              onMouseDownEmpty={handleMouseDownEmpty}
              onMouseMoveGrid={handleMouseMoveGrid}
              onMouseUpGrid={handleMouseUpGrid}
              onMouseDownEvent={handleMouseDownEvent}
              onClickEvent={handleClickEvent}
              onContextMenuEvent={handleContextMenuEvent}
            />
          </div>
        </div>
      </div>

      {firestoreError && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-600 text-white text-sm px-5 py-3 rounded-xl shadow-lg">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span>Lỗi Firestore: {firestoreError}</span>
        </div>
      )}

      {isLoading && <LoadingSpinner fullScreen message="Đang tải dữ liệu..." />}

      {dialog && (
        <EventDialog dialog={dialog} onSave={handleSaveEvent} onClose={() => setDialog(null)} />
      )}
      {detailEvent && (
        <EventDetailDialog event={detailEvent} onClose={closeDetail} />
      )}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onEdit={() => openEditDialog(contextMenu.eventId)}
          onDelete={() => deleteEvent(contextMenu.eventId)}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
};

export default CalendarPage;

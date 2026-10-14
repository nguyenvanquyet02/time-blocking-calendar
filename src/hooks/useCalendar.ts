import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  CalendarEvent,
  DragCreateState,
  DragMoveState,
  ContextMenuState,
  DialogState,
} from '../types/calendar';
import * as eventService from '../services/eventService';
import {
  TOTAL_MINUTES,
  SNAP_MINUTES,
  snapToGrid,
  clamp,
  minutesToDate,
  dateToMinutes,
  get7Days,
} from '../utils/dateUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export {
  HOUR_HEIGHT,
  MINUTE_HEIGHT,
  TOTAL_MINUTES,
  SNAP_MINUTES,
  minutesToDate,
  dateToMinutes,
  get7Days,
  generateId,
} from '../utils/dateUtils';

const EVENT_QUERY_KEY = ['events']
export function useCalendar() {
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const queryClient = useQueryClient();
  const { data: events = [], isLoading, error: queryError } = useQuery({
    queryKey: EVENT_QUERY_KEY,
    queryFn: eventService.getEvents

  })
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = get7Days(today);

  const firestoreError = queryError ? queryError.message : null;

  const createMutation = useMutation({
    mutationFn: eventService.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY })
      setDialog(null)
    },
    onError: (err) => {
      console.log(err)
    }
  })
  const updateMutation = useMutation({
    mutationFn: eventService.updateEvent,
    onMutate: async (updatedEvent: CalendarEvent) => {
      // cancel các query đang chạy ngầm để tránh xung đột
      await queryClient.cancelQueries({ queryKey: EVENT_QUERY_KEY })
      // tạo snapshot data sử dụng cho rollback
      const previousEvents = queryClient.getQueryData<CalendarEvent[]>(EVENT_QUERY_KEY) || []
      // cập nhật data mới vào cache
      queryClient.setQueryData<CalendarEvent[]>(EVENT_QUERY_KEY, (oldEvents = []): any => {
        return oldEvents.map((evt: CalendarEvent) => {
          return evt.id === updatedEvent.id ? { ...evt, ...updatedEvent } : evt
        })
      })
      // trả snapshot cũ nếu API lỗi
      return { previousEvents }
    },
    onError: (err, updatedEvent, context) => {
      // updatedEvent data truyền vào mutationFn
      // context: data trả ra của onMutate
      console.log(err)
      // rollback snapshot cũ nếu api lỗi
      if (context?.previousEvents) {
        queryClient.setQueryData(EVENT_QUERY_KEY, context.previousEvents)
      }
    },
    // chạy dù thành công hay thất bại
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY })
      setDialog(null)
    }
  })
  const deleteMutation = useMutation({
    mutationFn: eventService.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY })
      setDialog(null)
      setContextMenu(null)
    },
    onError: (err) => {
      console.log(err)

    }
  })
  const [dragCreate, setDragCreate] = useState<DragCreateState | null>(null);
  const [dragMove, setDragMove] = useState<DragMoveState | null>(null);
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);

  const dragMovePreview = useRef<{ dayIndex: number; startMinute: number } | null>(null);
  const [dragMoveVisible, setDragMoveVisible] = useState<{
    eventId: string;
    dayIndex: number;
    startMinute: number;
  } | null>(null);


  const startDragCreate = useCallback((dayIndex: number, minuteFromTop: number) => {
    const snapped = snapToGrid(clamp(minuteFromTop, 0, TOTAL_MINUTES - SNAP_MINUTES));
    setDragCreate({ dayIndex, startMinute: snapped, endMinute: snapped + SNAP_MINUTES });
  }, []);

  const updateDragCreate = useCallback((minuteFromTop: number) => {
    setDragCreate((prev) => {
      if (!prev) return prev;
      const snapped = snapToGrid(clamp(minuteFromTop, 0, TOTAL_MINUTES));
      const endMinute = Math.max(snapped, prev.startMinute + SNAP_MINUTES);
      return { ...prev, endMinute };
    });
  }, []);

  const endDragCreate = useCallback(() => {
    setDragCreate((prev) => {
      if (prev && prev.endMinute > prev.startMinute) {
        const day = days[prev.dayIndex];
        setDialog({
          mode: 'create',
          initialStart: minutesToDate(day, prev.startMinute),
          initialEnd: minutesToDate(day, prev.endMinute),
        });
      }
      return null;
    });
  }, [days]);


  const startDragMove = useCallback(
    (eventId: string, offsetMinutes: number, dayIndex: number) => {
      const event = events.find((e) => e.id === eventId);
      if (!event) return;
      setDragMove({
        eventId,
        offsetMinutes,
        currentDayIndex: dayIndex,
        currentStartMinute: dateToMinutes(event.startDateTime),
      });
      dragMovePreview.current = { dayIndex, startMinute: dateToMinutes(event.startDateTime) };
    },
    [events]
  );

  const updateDragMove = useCallback(
    (dayIndex: number, minuteFromTop: number) => {
      setDragMove((prev) => {
        if (!prev) return prev;
        const event = events.find((e) => e.id === prev.eventId);
        if (!event) return prev;
        const duration = (event.endDateTime.getTime() - event.startDateTime.getTime()) / 60000;
        const rawStart = minuteFromTop - prev.offsetMinutes;
        const snapped = snapToGrid(clamp(rawStart, 0, TOTAL_MINUTES - duration));
        dragMovePreview.current = { dayIndex, startMinute: snapped };
        setDragMoveVisible({ eventId: prev.eventId, dayIndex, startMinute: snapped });
        return { ...prev, currentDayIndex: dayIndex, currentStartMinute: snapped };
      });
    },
    [events]
  );

  const endDragMove = useCallback(() => {
    setDragMove((prev) => {
      if (!prev) return null;
      const preview = dragMovePreview.current;
      if (!preview) return null;
      const event = events.find((e) => e.id === prev.eventId);
      if (event) {
        const duration = (event.endDateTime.getTime() - event.startDateTime.getTime()) / 60000;
        const newDay = days[preview.dayIndex];
        const newStart = minutesToDate(newDay, preview.startMinute);
        const newEnd = minutesToDate(newDay, preview.startMinute + duration);
        const updated: CalendarEvent = { ...event, startDateTime: newStart, endDateTime: newEnd };
        updateMutation.mutate(updated)
      }
      dragMovePreview.current = null;
      setDragMoveVisible(null);
      return null;
    });
  }, [days, events]);


  const createEvent = useCallback((data: Omit<CalendarEvent, 'id'>) => {
    createMutation.mutate(data)
  }, [createMutation]);

  const updateEvent = useCallback((updated: CalendarEvent) => {
    updateMutation.mutate(updated)
  }, [updateMutation]);

  const deleteEvent = useCallback((id: string) => {
    deleteMutation.mutate(id)
  }, [deleteMutation]);


  const openContextMenu = useCallback((eventId: string, x: number, y: number) => {
    setContextMenu({ eventId, x, y });
  }, []);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  const openEditDialog = useCallback(
    (eventId: string) => {
      const event = events.find((e) => e.id === eventId);
      if (event) setDialog({ mode: 'edit', event });
      setContextMenu(null);
    },
    [events]
  );


  const openDetail = useCallback(
    (eventId: string) => {
      const event = events.find((e) => e.id === eventId);
      if (event) setDetailEvent(event);
    },
    [events]
  );

  const closeDetail = useCallback(() => setDetailEvent(null), []);

  return {
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
  };
}

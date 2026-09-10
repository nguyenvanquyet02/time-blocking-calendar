export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDateTime: Date;
  endDateTime: Date;
}

export interface DragCreateState {
  dayIndex: number;
  startMinute: number;
  endMinute: number;
}

export interface DragMoveState {
  eventId: string;
  offsetMinutes: number;
  currentDayIndex: number;
  currentStartMinute: number;
}

export interface ContextMenuState {
  eventId: string;
  x: number;
  y: number;
}

export interface DialogState {
  mode: 'create' | 'edit';
  event?: CalendarEvent;
  initialStart?: Date;
  initialEnd?: Date;
}

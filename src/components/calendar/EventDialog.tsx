import React, { useState, useEffect } from 'react';
import type { CalendarEvent, DialogState } from '../../types/calendar';
import { generateId, toLocalInputValue, fromLocalInputValue } from '../../utils/dateUtils';
import Dialog from '../ui/Dialog';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

interface EventDialogProps {
  dialog: DialogState;
  onSave: (event: CalendarEvent) => void;
  onClose: () => void;
}

const EventDialog: React.FC<EventDialogProps> = ({ dialog, onSave, onClose }) => {
  const isEdit = dialog.mode === 'edit' && dialog.event;

  const [title, setTitle] = useState(isEdit ? dialog.event!.title : '');
  const [description, setDescription] = useState(isEdit ? dialog.event!.description : '');
  const [startValue, setStartValue] = useState(
    toLocalInputValue(isEdit ? dialog.event!.startDateTime : dialog.initialStart ?? new Date())
  );
  const [endValue, setEndValue] = useState(
    toLocalInputValue(isEdit ? dialog.event!.endDateTime : dialog.initialEnd ?? new Date())
  );
  const [errors, setErrors] = useState<{ title?: string; time?: string }>({});

  useEffect(() => {
    if (isEdit && dialog.event) {
      setTitle(dialog.event.title);
      setDescription(dialog.event.description);
      setStartValue(toLocalInputValue(dialog.event.startDateTime));
      setEndValue(toLocalInputValue(dialog.event.endDateTime));
    }
  }, [dialog]);

  const validate = (): boolean => {
    const newErrors: { title?: string; time?: string } = {};
    if (!title.trim()) newErrors.title = 'Tiêu đề không được để trống';
    if (fromLocalInputValue(endValue) <= fromLocalInputValue(startValue))
      newErrors.time = 'Thời gian kết thúc phải sau thời gian bắt đầu';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const event: CalendarEvent = {
      id: isEdit ? dialog.event!.id : generateId(),
      title: title.trim(),
      description: description.trim(),
      startDateTime: fromLocalInputValue(startValue),
      endDateTime: fromLocalInputValue(endValue),
    };
    onSave(event);
  };

  return (
    <Dialog
      open
      onClose={onClose}
      title={isEdit ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới'}
      headerVariant="blue"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tiêu đề"
          required
          placeholder="Nhập tiêu đề sự kiện..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          autoFocus
        />

        <Textarea
          label="Mô tả"
          placeholder="Nhập mô tả (tùy chọn)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Bắt đầu"
            required
            type="datetime-local"
            value={startValue}
            onChange={(e) => setStartValue(e.target.value)}
            error={errors.time ? ' ' : undefined}
          />
          <Input
            label="Kết thúc"
            required
            type="datetime-local"
            value={endValue}
            onChange={(e) => setEndValue(e.target.value)}
            error={errors.time ? ' ' : undefined}
          />
        </div>
        {errors.time && (
          <p className="text-xs text-red-500 flex items-center gap-1 -mt-2">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd" />
            </svg>
            {errors.time}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            {isEdit ? 'Cập nhật' : 'Tạo sự kiện'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default EventDialog;

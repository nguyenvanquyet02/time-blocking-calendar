import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
  query,
  orderBy,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { CalendarEvent } from '../types/calendar';

const COLLECTION = 'events';


interface FirestoreEvent {
  title: string;
  description: string;
  startDateTime: Timestamp;
  endDateTime: Timestamp;
}

function toFirestore(event: Omit<CalendarEvent, 'id'>): FirestoreEvent {
  return {
    title: event.title,
    description: event.description,
    startDateTime: Timestamp.fromDate(event.startDateTime),
    endDateTime: Timestamp.fromDate(event.endDateTime),
  };
}

function fromFirestore(id: string, data: FirestoreEvent): CalendarEvent {
  return {
    id,
    title: data.title,
    description: data.description,
    startDateTime: data.startDateTime.toDate(),
    endDateTime: data.endDateTime.toDate(),
  };
}

export function subscribeToEvents(
  onEvents: (events: CalendarEvent[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTION), orderBy('startDateTime', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const events: CalendarEvent[] = snapshot.docs.map((doc) =>
        fromFirestore(doc.id, doc.data() as FirestoreEvent)
      );
      onEvents(events);
    },
    (error) => onError(error)
  );
}


export async function createEvent(event: Omit<CalendarEvent, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), toFirestore(event));
  return docRef.id;
}

export async function updateEvent(event: CalendarEvent): Promise<void> {
  const { id, ...rest } = event;
  await updateDoc(doc(db, COLLECTION, id), toFirestore(rest) as Partial<FirestoreEvent>);
}

export async function deleteEvent(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

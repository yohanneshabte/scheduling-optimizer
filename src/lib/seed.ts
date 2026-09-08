import { addDays, setHours, setMinutes, addMinutes } from 'date-fns';
import type { Booking } from './types';
import { ROOMS, CONFIG, PRICING_RULES } from './config';

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function timeStringToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

export function calculatePrice(startTime: Date, durationMinutes: number, roomId: string, partySize: number): number {
  const room = ROOMS.find(r => r.id === roomId);
  if (!room) return 0;

  const hour = startTime.getHours();
  const minute = startTime.getMinutes();
  const timeInMinutes = hour * 60 + minute;

  let appliedRate = 18; // fallback
  let highestPriority = -1;

  for (const rule of PRICING_RULES) {
    let match = true;

    if (rule.condition.timeRange) {
      const startMins = timeStringToMinutes(rule.condition.timeRange.start);
      const endMins = timeStringToMinutes(rule.condition.timeRange.end);
      if (timeInMinutes < startMins || timeInMinutes >= endMins) match = false;
    }

    if (rule.condition.roomFeatureRequired) {
      if (!room.features.includes(rule.condition.roomFeatureRequired)) match = false;
    }

    if (rule.condition.daysOfWeek) {
      if (!rule.condition.daysOfWeek.includes(startTime.getDay())) match = false;
    }

    if (match && rule.priority > highestPriority) {
      highestPriority = rule.priority;
      appliedRate = rule.ratePerHourPerPerson;
    }
  }

  const durationHours = durationMinutes / 60;
  return appliedRate * durationHours * partySize;
}

export function generateMockBookings(): Booking[] {
  const bookings: Booking[] = [];
  const today = new Date();
  const maxRooms = Math.floor(ROOMS.length * (CONFIG.globalSettings.maxConcurrentOccupancyPercent / 100));

  for (let i = 0; i < 14; i++) {
    const currentDay = addDays(today, i);
    const dayOfWeek = currentDay.getDay();
    const isWeekendDay = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;

    const openTimeStr = CONFIG.operatingHours[dayOfWeek]?.open || "08:00";
    const closeTimeStr = CONFIG.operatingHours[dayOfWeek]?.close || "23:30";

    const openMins = timeStringToMinutes(openTimeStr);
    const closeMins = timeStringToMinutes(closeTimeStr);

    let currentTime = setMinutes(setHours(currentDay, Math.floor(openMins/60)), openMins % 60);

    while (currentTime.getHours() * 60 + currentTime.getMinutes() < closeMins - 60) {
      const hourOfDay = currentTime.getHours();

      let probability = 0.4;
      if (isWeekendDay) probability = 0.9;
      else if (hourOfDay >= 17) probability = 0.8;
      else if (hourOfDay < 12) probability = 0.1;

      if (Math.random() < probability) {
        const activeRooms = Math.floor(Math.random() * (maxRooms - 1)) + 1;
        const shuffledRooms = [...ROOMS].sort(() => 0.5 - Math.random());
        const selectedRooms = shuffledRooms.slice(0, activeRooms);

        for (const room of selectedRooms) {
          const isSlowHour = !isWeekendDay && hourOfDay < 17;
          let duration = 60;
          if (isSlowHour && Math.random() > 0.5) {
             duration = [120, 150, 180][Math.floor(Math.random() * 3)];
          } else {
             duration = [60, 90][Math.floor(Math.random() * 2)];
          }

          const partySize = Math.floor(Math.random() * 3) + 1; // 1 to 3
          const wantsMassage = Math.random() > 0.8;

          const startTime = new Date(currentTime);
          const endTimeWithBuffer = addMinutes(startTime, duration + CONFIG.globalSettings.cleaningBufferMinutes);

          const hasOverlap = bookings.some(b =>
            b.roomId === room.id &&
            new Date(b.startTime) < endTimeWithBuffer &&
            new Date(b.endTime) > startTime
          );

          if (!hasOverlap) {
            bookings.push({
              id: generateId(),
              roomId: room.id,
              startTime: startTime.toISOString(),
              endTime: endTimeWithBuffer.toISOString(),
              durationMinutes: duration,
              partySize,
              addOns: wantsMassage ? ['massage'] : [],
              price: calculatePrice(startTime, duration, room.id, partySize),
              isMock: true,
              status: 'confirmed'
            });
          }
        }
      }

      currentTime = addMinutes(currentTime, Math.floor(Math.random() * 2 + 1) * 30);
    }
  }

  return bookings;
}

export function initializeStore() {
  if (!localStorage.getItem('watercourse_bookings_v2')) {
    const mockBookings = generateMockBookings();
    localStorage.setItem('watercourse_bookings_v2', JSON.stringify(mockBookings));
  }
}

export function getBookings(): Booking[] {
  const data = localStorage.getItem('watercourse_bookings_v2');
  return data ? JSON.parse(data) : [];
}

export function addBooking(booking: Booking) {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem('watercourse_bookings_v2', JSON.stringify(bookings));
}

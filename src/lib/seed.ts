import { addDays, setHours, setMinutes, addMinutes } from 'date-fns';
import type { Booking } from './types';
import { ROOMS, MAX_CONCURRENT_ROOMS, CLEAN_BUFFER_MINUTES } from './data';

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function calculatePrice(startTime: Date, duration: number, isPremium: boolean, partySize: number) {

  // Base rates are per hour
  const durationHours = duration / 60;

  // Actually based on our research:
  // Standard: $40 Mon-Thu, $45 Fri-Sun (per person/hour)
  // Premium: $58 Mon-Thu, $65 Fri-Sun (per person/hour)
  const dayOfWeek = startTime.getDay();
  const isWeekendRate = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6; // Fri-Sun

  let ratePerHour = 0;
  if (isPremium) {
    ratePerHour = isWeekendRate ? 65 : 58;
  } else {
    ratePerHour = isWeekendRate ? 45 : 40;
  }

  return ratePerHour * durationHours * partySize;
}

export function generateMockBookings(): Booking[] {
  const bookings: Booking[] = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const currentDay = addDays(today, i);
    const dayOfWeek = currentDay.getDay();
    const isWeekendDay = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;

    // Hours: Sun–Thu 8:00am–11:30pm (23:30), Fri–Sat 8:00am–12:30am (24:30)
    const openHour = 8;
    const closeHour = (dayOfWeek === 5 || dayOfWeek === 6) ? 24 : 23.5;

    // Create random bookings
    let currentTime = setMinutes(setHours(currentDay, openHour), 0);

    // Mock higher occupancy for evenings and weekends
    while (currentTime.getHours() + currentTime.getMinutes() / 60 < closeHour - 2) {
      const hourOfDay = currentTime.getHours();

      // Determine booking probability based on time and day
      // The rules state: "fill empty midweek mornings first (min-max empty slots)"
      // So we want to make sure mornings have a decent amount of bookings in our mock data
      // but still show them as the primary availability gap. Let's adjust to model this better.
      let probability = 0.4; // Base
      if (isWeekendDay) probability = 0.9;
      else if (hourOfDay >= 17) probability = 0.8; // Evenings very full
      else if (hourOfDay < 12) probability = 0.1; // Mornings mostly empty to demonstrate filling them

      if (Math.random() < probability) {
        // Decide how many rooms to book (up to max occupancy)
        const activeRooms = Math.floor(Math.random() * (MAX_CONCURRENT_ROOMS - 1)) + 1;

        // Pick random rooms
        const shuffledRooms = [...ROOMS].sort(() => 0.5 - Math.random());
        const selectedRooms = shuffledRooms.slice(0, activeRooms);

        for (const room of selectedRooms) {
          const durations = [60, 90, 120];
          // Prefer longer bookings in slow hours
          const isSlowHour = !isWeekendDay && hourOfDay < 17;
          let duration = 60;
          if (isSlowHour && Math.random() > 0.5) {
             duration = 120;
          } else {
             duration = durations[Math.floor(Math.random() * durations.length)];
          }

          const partySize = Math.floor(Math.random() * 2) + 1; // 1 or 2
          const wantsPremium = room.hasSaunaOrSteam && Math.random() > 0.3;

          const startTime = new Date(currentTime);
          const endTimeWithBuffer = addMinutes(startTime, duration + CLEAN_BUFFER_MINUTES);

          // Check if this overlaps with existing bookings for this room
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
              duration,
              partySize,
              addOns: {
                massage: Math.random() > 0.8,
                saunaOrSteam: wantsPremium,
              },
              price: calculatePrice(startTime, duration, wantsPremium, partySize),
              isMock: true,
            });
          }
        }
      }

      // Move time forward randomly by 30-60 mins
      currentTime = addMinutes(currentTime, Math.floor(Math.random() * 2 + 1) * 30);
    }
  }

  return bookings;
}

export function initializeStore() {
  if (!localStorage.getItem('watercourse_bookings')) {
    const mockBookings = generateMockBookings();
    localStorage.setItem('watercourse_bookings', JSON.stringify(mockBookings));
  }
}

export function getBookings(): Booking[] {
  const data = localStorage.getItem('watercourse_bookings');
  return data ? JSON.parse(data) : [];
}

export function addBooking(booking: Booking) {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem('watercourse_bookings', JSON.stringify(bookings));
}

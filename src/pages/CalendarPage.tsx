import { useState, useMemo } from 'react';
import { getBookings } from '../lib/seed';
import { ROOMS } from '../lib/config';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const allBookings = getBookings();

  // Generate 14 days for date picker
  const dates = Array.from({ length: 14 }, (_, i) => startOfDay(addDays(new Date(), i)));

  const dayBookings = useMemo(() => {
    return allBookings.filter(b => isSameDay(new Date(b.startTime), selectedDate));
  }, [selectedDate, allBookings]);

  return (
    <div className="flex flex-col h-screen bg-cream pb-16">
      <div className="p-4 bg-white border-b border-warm-stone/50 z-10">
        <h1 className="text-xl font-serif text-dark-wood mb-1">Front Desk · Calendar</h1>
        <p className="text-sm font-bold text-dark-wood">{format(selectedDate, 'EEEE, MMM d')}</p>
        <p className="text-xs text-dark-wood/70">{dayBookings.length} visits today</p>
      </div>

      <div className="border-b border-warm-stone/50 bg-white">
        <div className="flex overflow-x-auto space-x-2 p-2 scrollbar-hide">
          {dates.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const count = allBookings.filter(b => isSameDay(new Date(b.startTime), date)).length;
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg flex flex-col items-center justify-center border transition-colors min-w-[60px] ${
                  isSelected ? 'bg-dark-wood text-cream border-dark-wood' : 'bg-cream text-dark-wood border-transparent hover:bg-warm-stone/20'
                }`}
              >
                <span className="text-xs">{format(date, 'EEE d')}</span>
                <span className={`text-xs font-bold mt-1 ${isSelected ? 'text-sage-light' : 'text-sage-dark'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {ROOMS.map(room => {
          const roomBookings = dayBookings
            .filter(b => b.roomId === room.id)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

          return (
            <div key={room.id} className="bg-white rounded-lg border border-warm-stone overflow-hidden">
              <div className="bg-warm-stone/20 p-2 border-b border-warm-stone font-bold text-sm text-dark-wood">
                {room.name}
              </div>
              <div className="p-3">
                {roomBookings.length === 0 ? (
                  <p className="text-xs text-dark-wood/50 italic">No bookings</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {roomBookings.map(booking => {
                      const start = new Date(booking.startTime);
                      return (
                        <div key={booking.id} className={`text-xs p-2 rounded border flex flex-col ${
                          booking.isMock ? 'bg-cream border-warm-stone' : 'bg-sage-light/20 border-sage'
                        }`}>
                          <span className="font-bold">{format(start, 'h:mm a')}</span>
                          <span className="text-dark-wood/70">{booking.partySize} guest{booking.partySize > 1 ? 's' : ''}</span>
                          <span className="text-dark-wood/50">{booking.durationMinutes}m</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 text-xs text-center text-dark-wood/50 bg-white border-t border-warm-stone/30 pb-20">
        Demo visits only. Colored blocks indicate real bookings.
      </div>
    </div>
  );
}

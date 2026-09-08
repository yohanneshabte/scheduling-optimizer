import { Link } from 'react-router-dom';
import { getBookings } from '../lib/seed';
import { MAX_CONCURRENT_ROOMS } from '../lib/data';
import { startOfToday, addHours, format } from 'date-fns';

export function HomePage() {
  const bookings = getBookings();
  const today = startOfToday();
  const hours = Array.from({ length: 15 }, (_, i) => addHours(today, 8 + i)); // 8am to 10pm

  // Calculate occupancy for heatmap
  const getOccupancyLevel = (hour: Date) => {
    const activeBookings = bookings.filter((b) => {
      const bStart = new Date(b.startTime);
      const bEnd = new Date(b.endTime); // Includes 15 min buffer
      // Simple check if this hour slot overlaps with the booking
      return bStart < addHours(hour, 1) && bEnd > hour;
    });

    const occupancyRate = activeBookings.length / MAX_CONCURRENT_ROOMS;

    if (occupancyRate === 0) return 'bg-warm-stone/20';
    if (occupancyRate < 0.4) return 'bg-sage-light/40';
    if (occupancyRate < 0.8) return 'bg-sage/70';
    return 'bg-sage-dark text-cream';
  };

  return (
    <div className="p-6">
      <div className="text-center mb-10 mt-8">
        <h1 className="text-4xl font-serif text-dark-wood mb-2">Watercourse Way</h1>
        <p className="text-lg text-sage-dark italic">Bath House Spa</p>
      </div>

      <div className="mb-12">
        <Link
          to="/book"
          className="block w-full bg-dark-wood text-cream text-center py-4 rounded-lg font-bold text-lg shadow-md active:scale-95 transition-transform"
        >
          Book a private room
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-dark-wood border-b border-warm-stone pb-2">Today's Availability</h2>
        <div className="grid grid-cols-3 gap-2">
          {hours.map((hour, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-md text-center text-sm font-medium ${getOccupancyLevel(hour)}`}
            >
              {format(hour, 'h a')}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-dark-wood/70 px-2">
          <div className="flex items-center"><div className="w-3 h-3 bg-warm-stone/20 rounded mr-1"></div> Open</div>
          <div className="flex items-center"><div className="w-3 h-3 bg-sage/70 rounded mr-1"></div> Filling</div>
          <div className="flex items-center"><div className="w-3 h-3 bg-sage-dark rounded mr-1"></div> Limited</div>
        </div>
      </div>
    </div>
  );
}

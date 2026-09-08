import { Link } from 'react-router-dom';
import { getBookings } from '../lib/seed';
import { CONFIG } from '../lib/config';

export function HomePage() {
  const bookings = getBookings();
  const now = new Date();

  // Calculate current occupancy
  const currentActiveBookings = bookings.filter(b => {
    const start = new Date(b.startTime);
    const end = new Date(b.endTime); // This includes the buffer, which means the room is "occupied" as it's dirty
    return now >= start && now < end;
  });

  const occupancyCount = currentActiveBookings.length;
  const isEvening = now.getHours() >= 17;

  let occupancyStatus = "Quiet";
  if (occupancyCount >= 6) occupancyStatus = "Full";
  else if (occupancyCount >= 3) occupancyStatus = "Filling";

  return (
    <div>
      <div className="relative h-64 bg-dark-wood overflow-hidden">
        <div className="absolute inset-0 bg-sage-dark/40 mix-blend-multiply"></div>
        <div className="absolute bottom-6 left-6 text-cream">
          <p className="text-sm font-medium tracking-wider uppercase mb-1">Palo Alto · Since 1980</p>
          <h1 className="text-4xl font-serif">{CONFIG.name}</h1>
          <p className="text-sm mt-2 italic">A Journey for the Spirit, a respite for the body</p>
        </div>
      </div>

      <div className="p-6">
        <p className="text-dark-wood/80 mb-6 font-medium">
          Book the room on your phone instead of waiting 30 minutes at the desk.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link to="/book" className="bg-dark-wood text-cream py-4 rounded-lg font-bold text-center shadow-md flex flex-col items-center justify-center">
            <span>Book Now</span>
          </Link>
          <Link to="/reservations" className="bg-warm-stone text-dark-wood py-4 rounded-lg font-bold text-center shadow-md flex flex-col items-center justify-center">
            <span>My Bookings</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-warm-stone overflow-hidden mb-8">
          <div className="p-4 border-b border-warm-stone/50 flex justify-between items-center">
            <div>
              <p className="text-sm text-dark-wood/60 font-medium">Right now ({isEvening ? 'Evening' : 'Morning'})</p>
              <p className="text-xl font-bold text-dark-wood">{occupancyStatus}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-serif text-sage-dark">{occupancyCount}<span className="text-lg text-dark-wood/40">/9</span></p>
              <p className="text-xs text-dark-wood/60">rooms in use</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-dark-wood mb-1">Private Hot Tub Rooms</h3>
            <p className="text-sm text-dark-wood/70">Nine rooms. Pick a time, pick One Pine through Nine Cedar.</p>
          </div>
          <div>
            <h3 className="font-bold text-dark-wood mb-1">Rates</h3>
            <p className="text-sm text-dark-wood/70">Mon-Thu: $40 standard, $58 premium (per person/hour). Fri-Sun: $45 standard, $65 premium.</p>
          </div>
          <div className="bg-sage-light/20 p-4 rounded-lg">
            <h3 className="font-bold text-sage-dark mb-1">Still a demo</h3>
            <p className="text-sm text-dark-wood/80">Private Hot Tub Rooms are booked by phone today. This is how it could feel in the lobby.</p>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-dark-wood/50 pb-8">
          <p>{CONFIG.address}</p>
          <p className="mt-1">{CONFIG.phone}</p>
        </div>
      </div>
    </div>
  );
}

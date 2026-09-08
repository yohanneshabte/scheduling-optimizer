import { useState, useEffect } from 'react';
import { getBookings } from '../lib/seed';
import type { Booking } from '../lib/types';
import { ROOMS } from '../lib/data';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

export function ReservationsPage() {
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // In a real app, this would fetch by user ID.
    // Here we just filter the mock ones out to find ones the user just created.
    const allBookings = getBookings();
    setUserBookings(allBookings.filter(b => !b.isMock));
  }, []);

  const handleCancel = (id: string) => {
    // In demo, we just remove it from local state.
    // To persist cancellation in demo we'd update localStorage, but local state is fine for this view.
    const allBookings = getBookings();
    const updated = allBookings.filter(b => b.id !== id);
    localStorage.setItem('watercourse_bookings', JSON.stringify(updated));
    setUserBookings(userBookings.filter(b => b.id !== id));
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-serif text-dark-wood mb-6 mt-4">My Bookings</h1>

      {userBookings.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg border border-warm-stone mt-10">
          <p className="text-dark-wood/70 mb-4">You have no upcoming reservations.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userBookings.map((booking) => {
            const room = ROOMS.find(r => r.id === booking.roomId);
            const startTime = new Date(booking.startTime);

            return (
              <div key={booking.id} className="bg-white p-4 rounded-lg shadow-sm border border-warm-stone flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg text-dark-wood">{format(startTime, 'MMM do, yyyy')}</p>
                  <p className="text-dark-wood/80">{format(startTime, 'h:mm a')} ({booking.duration} mins)</p>
                  <p className="text-dark-wood/80 mt-1">{room?.name} Room</p>

                  <div className="mt-2 text-sm text-dark-wood/60 flex flex-wrap gap-2">
                    <span className="bg-warm-stone/30 px-2 py-1 rounded">Party of {booking.partySize}</span>
                    {booking.addOns.saunaOrSteam && <span className="bg-sage/20 px-2 py-1 rounded">Premium</span>}
                    {booking.addOns.massage && <span className="bg-sage/20 px-2 py-1 rounded">Massage</span>}
                  </div>
                </div>

                <button
                  onClick={() => handleCancel(booking.id)}
                  className="p-2 text-dark-wood/50 hover:text-red-500 transition-colors"
                  aria-label="Cancel booking"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 p-4 bg-sage-light/20 rounded-lg text-sm text-dark-wood/80">
        <p className="font-semibold mb-1">Cancellation Policy</p>
        <p>We require a 24-hour notification to change or cancel a hot tub reservation. There are no cash or credit card refunds.</p>
      </div>
    </div>
  );
}

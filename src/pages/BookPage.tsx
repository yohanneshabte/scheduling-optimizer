import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays, startOfDay, addMinutes, isSameDay } from 'date-fns';
import { CreditCard } from 'lucide-react';
import { ROOMS, CONFIG } from '../lib/config';
import { getBookings, addBooking, calculatePrice } from '../lib/seed';

export function BookPage() {
  const navigate = useNavigate();
  const bookings = getBookings();
  const [step, setStep] = useState<'time' | 'room' | 'payment' | 'confirm'>('time');

  // Form State
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(addDays(new Date(), 1)));
  const [duration, setDuration] = useState<number>(90); // default to 90 mins
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  // Room State
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [partySize, setPartySize] = useState<number>(2);
  const [wantsMassage, setWantsMassage] = useState<boolean>(false); // NEW FEATURE

  // Generate 14 days for date picker
  const dates = Array.from({ length: 14 }, (_, i) => startOfDay(addDays(new Date(), i)));

  // Get available slots for the selected date
  const availableSlots = useMemo(() => {
    const dayOfWeek = selectedDate.getDay();
    const openTimeStr = CONFIG.operatingHours[dayOfWeek]?.open || "08:00";
    const closeTimeStr = CONFIG.operatingHours[dayOfWeek]?.close || "23:30";

    const [openH, openM] = openTimeStr.split(':').map(Number);
    const [closeH, closeM] = closeTimeStr.split(':').map(Number);

    let slots: Date[] = [];
    let currentTime = addMinutes(selectedDate, openH * 60 + (openM||0));

    // Generate slots every 30 mins
    while (currentTime.getHours() * 60 + currentTime.getMinutes() <= closeH * 60 + (closeM||0) - duration) {
      const startTime = new Date(currentTime);
      const endTimeWithBuffer = addMinutes(startTime, duration + CONFIG.globalSettings.cleaningBufferMinutes);

      // Check global capacity rule during this slot
      const activeAtStart = bookings.filter(b =>
        new Date(b.startTime) <= startTime && new Date(b.endTime) > startTime
      ).length;

      const maxRooms = Math.floor(ROOMS.length * (CONFIG.globalSettings.maxConcurrentOccupancyPercent / 100));

      if (activeAtStart < maxRooms) {
         // Check if ANY room is available
         const availableRoom = ROOMS.find(room => {
            const hasOverlap = bookings.some(b =>
              b.roomId === room.id &&
              new Date(b.startTime) < endTimeWithBuffer &&
              new Date(b.endTime) > startTime
            );
            return !hasOverlap;
         });

         if (availableRoom) {
            slots.push(startTime);
         }
      }

      currentTime = addMinutes(currentTime, 30);
    }

    return slots;
  }, [selectedDate, duration, bookings]);

  // Get available rooms for a selected time
  const availableRooms = useMemo(() => {
    if (!selectedTime) return [];

    const endTimeWithBuffer = addMinutes(selectedTime, duration + CONFIG.globalSettings.cleaningBufferMinutes);

    return ROOMS.filter(room => {
      const hasOverlap = bookings.some(b =>
        b.roomId === room.id &&
        new Date(b.startTime) < endTimeWithBuffer &&
        new Date(b.endTime) > selectedTime
      );
      return !hasOverlap;
    });
  }, [selectedTime, duration, bookings]);

  const handleBook = () => {
    if (!selectedTime || !selectedRoomId) return;

    const price = calculatePrice(selectedTime, duration, selectedRoomId, partySize);

    const newBooking = {
      id: Math.random().toString(36).substr(2, 9),
      roomId: selectedRoomId,
      startTime: selectedTime.toISOString(),
      endTime: addMinutes(selectedTime, duration + CONFIG.globalSettings.cleaningBufferMinutes).toISOString(),
      durationMinutes: duration,
      partySize,
      addOns: wantsMassage ? ['massage'] : [], // NEW FEATURE INCLUDED
      price,
      isMock: false,
      status: 'confirmed' as const
    };

    addBooking(newBooking);
    setStep('confirm');
  };

  if (step === 'confirm') {
    return (
      <div className="p-6 text-center mt-20">
        <h2 className="text-3xl font-serif text-dark-wood mb-4">Confirmed</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-warm-stone mb-8 text-left">
          <p className="font-bold text-lg mb-2">{selectedTime ? format(selectedTime, 'EEEE, MMM do') : ''}</p>
          <p className="text-dark-wood/80 mb-1">{selectedTime ? format(selectedTime, 'h:mm a') : ''} ({duration} mins)</p>
          <p className="text-dark-wood/80 mb-1">{ROOMS.find(r => r.id === selectedRoomId)?.name} Room</p>
          <p className="text-dark-wood/80 mb-4">{partySize} person{partySize > 1 ? 's' : ''}</p>
          {wantsMassage && <p className="text-sage-dark font-medium mb-4 italic">Massage Requested - Staff will confirm by phone</p>}

          <div className="border-t border-warm-stone pt-4">
            <p className="font-bold flex justify-between">
              <span>Total Paid (via Square)</span>
              <span>${selectedTime && selectedRoomId ? calculatePrice(selectedTime, duration, selectedRoomId, partySize) : 0}</span>
            </p>
          </div>
        </div>

        <div className="bg-sage-light/30 p-4 rounded-md text-sage-dark text-sm mb-8 font-medium">
          <strong>This is a demo.</strong> Real bookings still call (650) 462-2000 until we go live.
        </div>

        <button
          onClick={() => navigate('/reservations')}
          className="mt-8 px-6 py-3 bg-sage text-white rounded-lg font-bold w-full active:scale-95 transition-transform"
        >
          View My Bookings
        </button>
      </div>
    );
  }

  if (step === 'payment') {
     const price = selectedTime && selectedRoomId ? calculatePrice(selectedTime, duration, selectedRoomId, partySize) : 0;

     return (
        <div className="p-4 max-w-lg mx-auto">
          <div className="flex items-center mb-6 mt-4">
            <button onClick={() => setStep('room')} className="text-sage-dark font-medium mr-4">← Back</button>
            <h1 className="text-2xl font-serif text-dark-wood">Secure Payment</h1>
          </div>

          <div className="bg-white p-5 rounded-lg border border-warm-stone shadow-sm mb-6">
            <h3 className="font-bold text-dark-wood mb-4">Summary</h3>
            <div className="flex justify-between text-sm text-dark-wood/80 mb-2">
               <span>{ROOMS.find(r => r.id === selectedRoomId)?.name} ({duration} min)</span>
               <span>${price}</span>
            </div>
            {wantsMassage && (
               <div className="flex justify-between text-sm text-dark-wood/80 mb-2">
                  <span className="italic">Add Massage (Pending)</span>
                  <span>TBD</span>
               </div>
            )}
            <div className="flex justify-between text-sm text-dark-wood/80 mb-4">
               <span>Taxes & Fees</span>
               <span>$0.00</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-dark-wood border-t border-warm-stone/50 pt-4">
               <span>Total Due Now</span>
               <span>${price}</span>
            </div>
          </div>

          <div className="bg-sage-light/20 p-4 rounded-lg border border-sage/20 mb-6">
             <h3 className="font-bold text-sage-dark mb-1 text-sm">Cancellation & Late Fee Policy</h3>
             <p className="text-xs text-dark-wood/80 leading-relaxed">
                Cancellations require 24 hours notice. No-shows or late cancellations will be charged the full amount. Arrivals more than 15 minutes late may have their session shortened or canceled without refund.
             </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gray-800"></div>
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-medium text-gray-800 flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-gray-500" />
                  Pay with Card
               </h3>
               {/* Mock Square Logo Text */}
               <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Square</span>
             </div>

             <div className="space-y-4">
               <div>
                  <div className="w-full h-10 bg-gray-50 border border-gray-200 rounded flex items-center px-3 text-gray-400 text-sm">Card number</div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-gray-50 border border-gray-200 rounded flex items-center px-3 text-gray-400 text-sm">MM/YY</div>
                  <div className="h-10 bg-gray-50 border border-gray-200 rounded flex items-center px-3 text-gray-400 text-sm">CVC</div>
               </div>
             </div>
          </div>

          <div className="fixed bottom-16 left-0 right-0 p-4 bg-cream/95 backdrop-blur-sm border-t border-warm-stone z-40">
             <button
                onClick={handleBook}
                className="w-full py-4 bg-gray-900 text-white rounded-lg font-bold flex justify-center items-center active:scale-95 transition-transform"
             >
                Pay ${price}
             </button>
          </div>
          <div className="h-24"></div>
        </div>
     );
  }

  if (step === 'room') {
     return (
        <div className="p-4 max-w-lg mx-auto">
          <div className="flex items-center mb-6 mt-4">
            <button onClick={() => setStep('time')} className="text-sage-dark font-medium mr-4">← Back</button>
            <h1 className="text-2xl font-serif text-dark-wood">Select Room</h1>
          </div>

          <div className="mb-6 bg-white p-4 rounded-lg border border-warm-stone">
             <p className="font-medium text-dark-wood">{selectedTime ? format(selectedTime, 'EEEE, MMM do h:mm a') : ''}</p>
             <p className="text-sm text-dark-wood/70">{duration} minutes</p>

             <div className="mt-4">
                <label className="block text-sm font-bold text-dark-wood mb-2">Party Size</label>
                <div className="flex space-x-2">
                   {[1, 2, 3, 4].map(size => (
                      <button
                         key={size}
                         onClick={() => setPartySize(size)}
                         className={`w-10 h-10 rounded-full flex items-center justify-center border font-medium ${
                            partySize === size ? 'bg-dark-wood text-cream border-dark-wood' : 'bg-white text-dark-wood border-warm-stone'
                         }`}
                      >
                         {size}
                      </button>
                   ))}
                </div>
             </div>

             <div className="mt-6 border-t border-warm-stone/50 pt-4">
                <label className="flex items-center space-x-3 p-3 border border-warm-stone rounded-lg bg-warm-stone/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wantsMassage}
                    onChange={(e) => setWantsMassage(e.target.checked)}
                    className="w-5 h-5 text-sage rounded border-warm-stone focus:ring-sage"
                  />
                  <div>
                    <span className="block font-medium text-dark-wood">Add Massage</span>
                    <span className="text-xs text-sage-dark font-medium italic">Staff will confirm availability by phone</span>
                  </div>
                </label>
             </div>
          </div>

          <div className="space-y-4 pb-24">
             {availableRooms.map(room => {
                const price = selectedTime ? calculatePrice(selectedTime, duration, room.id, partySize) : 0;
                const isSelected = selectedRoomId === room.id;

                return (
                   <div
                      key={room.id}
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                         isSelected ? 'border-sage bg-sage/5' : 'border-warm-stone bg-white'
                      }`}
                   >
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="font-bold text-lg text-dark-wood">{room.name}</h3>
                         <span className="font-bold text-sage-dark">${price}</span>
                      </div>
                      <p className="text-sm text-dark-wood/70 mb-3">{room.description}</p>
                      <div className="flex flex-wrap gap-2">
                         {room.features.filter(f => f !== 'premium').map(f => (
                            <span key={f} className="text-xs bg-warm-stone/30 text-dark-wood/80 px-2 py-1 rounded-md capitalize">
                               {f.replace('_', ' ')}
                            </span>
                         ))}
                      </div>
                   </div>
                );
             })}
          </div>

          <div className="fixed bottom-16 left-0 right-0 p-4 bg-cream/95 backdrop-blur-sm border-t border-warm-stone z-40">
             <button
                disabled={!selectedRoomId}
                onClick={() => setStep('payment')}
                className="w-full py-4 bg-dark-wood text-cream rounded-lg font-bold disabled:opacity-50 active:scale-95 transition-transform"
             >
                Continue to Payment
             </button>
          </div>
        </div>
     );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-serif text-dark-wood mb-6 mt-4">Book a Room</h1>

      <div className="space-y-8 pb-8">
        <div>
          <label className="block text-sm font-bold text-dark-wood mb-2">When</label>
          <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
            {dates.map((date) => {
              const isSelected = isSameDay(date, selectedDate);
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                  className={`flex-shrink-0 w-16 h-20 rounded-lg flex flex-col items-center justify-center border transition-colors ${
                    isSelected ? 'bg-dark-wood text-cream border-dark-wood' : 'bg-white text-dark-wood border-warm-stone hover:bg-warm-stone/20'
                  }`}
                >
                  <span className="text-xs uppercase">{format(date, 'MMM')}</span>
                  <span className="text-xl font-bold">{format(date, 'd')}</span>
                  <span className="text-xs">{format(date, 'EEE')}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-dark-wood mb-2">How long</label>
          <div className="grid grid-cols-2 gap-2">
             {[60, 90, 120, 150].map(mins => (
                <button
                   key={mins}
                   onClick={() => { setDuration(mins); setSelectedTime(null); }}
                   className={`p-3 rounded-lg border font-medium transition-colors ${
                      duration === mins ? 'bg-sage-dark text-white border-sage-dark' : 'bg-white text-dark-wood border-warm-stone hover:border-sage'
                   }`}
                >
                   {mins === 60 ? '1 hour' : mins === 90 ? '90 minutes' : mins === 120 ? '2 hours' : '2½ hours'}
                </button>
             ))}
          </div>
          <p className="text-xs text-dark-wood/60 mt-2">2½ hour visits are for weekday mornings and other quiet times.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-dark-wood mb-2">Available Times (Calendar View)</label>
          {availableSlots.length === 0 ? (
            <p className="text-sm text-dark-wood/70 italic p-4 bg-white rounded-lg border border-warm-stone text-center">
              Nothing open in this window. Try another duration.
            </p>
          ) : (
            <div className="bg-white rounded-lg border border-warm-stone overflow-hidden">
               {/* Minimalist Day Calendar List View */}
               <div className="max-h-64 overflow-y-auto">
                  {availableSlots.map((slot, idx) => {
                     const isEvening = slot.getHours() >= 17;
                     return (
                     <div
                        key={slot.toISOString()}
                        onClick={() => { setSelectedTime(slot); setStep('room'); }}
                        className={`flex items-center justify-between p-4 cursor-pointer hover:bg-sage/5 transition-colors ${
                           idx !== availableSlots.length - 1 ? 'border-b border-warm-stone/30' : ''
                        }`}
                     >
                        <div className="flex items-center space-x-4">
                           <span className="font-bold text-dark-wood w-20">{format(slot, 'h:mm a')}</span>
                           <span className="text-xs text-dark-wood/60 px-2 py-1 bg-warm-stone/20 rounded">
                              {isEvening ? 'Evening Rate' : 'Day Rate'}
                           </span>
                        </div>
                        <span className="text-sage-dark font-medium text-sm">Select &rarr;</span>
                     </div>
                     );
                  })}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

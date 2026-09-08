import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays, startOfDay, addMinutes, isSameDay } from 'date-fns';
import { ROOMS, MAX_CONCURRENT_ROOMS, CLEAN_BUFFER_MINUTES } from '../lib/data';
import { getBookings, addBooking } from '../lib/seed';

export function BookPage() {
  const navigate = useNavigate();
  const bookings = getBookings();
  const [step, setStep] = useState<'form' | 'confirm'>('form');

  // Form State
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(addDays(new Date(), 1)));
  const [duration, setDuration] = useState<number>(60);
  const [partySize, setPartySize] = useState<number>(1);
  const [wantsPremium, setWantsPremium] = useState<boolean>(false);
  const [wantsMassage, setWantsMassage] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // Generate 14 days for date picker
  const dates = Array.from({ length: 14 }, (_, i) => startOfDay(addDays(new Date(), i)));

  // Get available slots for the selected date
  const availableSlots = useMemo(() => {
    const dayOfWeek = selectedDate.getDay();
    const openHour = 8;
    const closeHour = (dayOfWeek === 5 || dayOfWeek === 6) ? 24.5 : 23.5; // 12:30am Fri/Sat, 11:30pm Sun-Thu

    let slots: { time: Date; room: any }[] = [];
    let currentTime = addMinutes(startOfDay(selectedDate), openHour * 60);

    // Generate slots every 30 mins
    while (currentTime.getHours() + currentTime.getMinutes() / 60 <= closeHour - (duration / 60)) {
      const startTime = new Date(currentTime);
      const endTimeWithBuffer = addMinutes(startTime, duration + CLEAN_BUFFER_MINUTES);

      // Filter rooms matching requirements
      const eligibleRooms = ROOMS.filter(r => wantsPremium ? r.hasSaunaOrSteam : true);

      // Check which rooms are available
      const availableRooms = eligibleRooms.filter(room => {
        // Check if this specific room has overlapping bookings
        const hasOverlap = bookings.some(b =>
          b.roomId === room.id &&
          new Date(b.startTime) < endTimeWithBuffer &&
          new Date(b.endTime) > startTime
        );

        if (hasOverlap) return false;

        // Check global capacity rule during this slot
        const activeAtStart = bookings.filter(b =>
          new Date(b.startTime) <= startTime && new Date(b.endTime) > startTime
        ).length;

        return activeAtStart < MAX_CONCURRENT_ROOMS;
      });

      if (availableRooms.length > 0) {
        slots.push({ time: startTime, room: availableRooms[0] });
      }

      currentTime = addMinutes(currentTime, 30);
    }

    return slots;
  }, [selectedDate, duration, wantsPremium, bookings]);

  // Price Calculation
  const price = useMemo(() => {
    if (!selectedTime) return 0;
    const durationHours = duration / 60;
    const dayOfWeek = selectedTime.getDay();
    const isWeekendRate = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6; // Fri-Sun

    let ratePerHour = 0;
    if (wantsPremium) {
      ratePerHour = isWeekendRate ? 65 : 58;
    } else {
      ratePerHour = isWeekendRate ? 45 : 40;
    }

    return ratePerHour * durationHours * partySize;
  }, [selectedTime, duration, wantsPremium, partySize]);

  const handleBook = () => {
    if (!selectedTime || !selectedRoomId) return;

    const newBooking = {
      id: Math.random().toString(36).substr(2, 9),
      roomId: selectedRoomId,
      startTime: selectedTime.toISOString(),
      endTime: addMinutes(selectedTime, duration + CLEAN_BUFFER_MINUTES).toISOString(),
      duration,
      partySize,
      addOns: {
        massage: wantsMassage,
        saunaOrSteam: wantsPremium,
      },
      price,
      isMock: false,
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

          <div className="border-t border-warm-stone pt-4">
            <p className="font-bold flex justify-between">
              <span>Total</span>
              <span>${price}</span>
            </p>
          </div>
        </div>

        <div className="bg-sage-light/30 p-4 rounded-md text-sage-dark text-sm">
          <strong>This is a demo.</strong> Real bookings still call (650) 462-2000 until we go live.
        </div>

        <button
          onClick={() => navigate('/reservations')}
          className="mt-8 text-dark-wood underline font-medium"
        >
          View My Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-serif text-dark-wood mb-6 mt-4">Book a Room</h1>

      <div className="space-y-6">
        {/* Date Picker */}
        <div>
          <label className="block text-sm font-bold text-dark-wood mb-2">Select Date</label>
          <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
            {dates.map((date) => {
              const isSelected = isSameDay(date, selectedDate);
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => { setSelectedDate(date); setSelectedTime(null); setSelectedRoomId(null); }}
                  className={`flex-shrink-0 w-16 h-20 rounded-lg flex flex-col items-center justify-center border ${
                    isSelected ? 'bg-dark-wood text-cream border-dark-wood' : 'bg-white text-dark-wood border-warm-stone'
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

        {/* Duration & Party Size */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-dark-wood mb-2">Duration</label>
            <select
              className="w-full p-3 rounded-lg border border-warm-stone bg-white text-dark-wood focus:ring-2 focus:ring-sage"
              value={duration}
              onChange={(e) => { setDuration(Number(e.target.value)); setSelectedTime(null); setSelectedRoomId(null); }}
            >
              <option value={60}>60 Minutes</option>
              <option value={90}>90 Minutes</option>
              <option value={120}>120 Minutes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-dark-wood mb-2">Party Size</label>
            <select
              className="w-full p-3 rounded-lg border border-warm-stone bg-white text-dark-wood focus:ring-2 focus:ring-sage"
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
            >
              <option value={1}>1 Person</option>
              <option value={2}>2 People</option>
            </select>
          </div>
        </div>

        {/* Add-ons */}
        <div>
          <label className="block text-sm font-bold text-dark-wood mb-2">Room Type & Add-ons</label>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 border border-warm-stone rounded-lg bg-white">
              <input
                type="checkbox"
                checked={wantsPremium}
                onChange={(e) => { setWantsPremium(e.target.checked); setSelectedTime(null); setSelectedRoomId(null); }}
                className="w-5 h-5 text-sage rounded border-warm-stone focus:ring-sage"
              />
              <div>
                <span className="block font-medium">Premium Room (Sauna or Steam)</span>
                <span className="text-xs text-dark-wood/70">+$18-20 per person/hr</span>
              </div>
            </label>
            <label className="flex items-center space-x-3 p-3 border border-warm-stone rounded-lg bg-white">
              <input
                type="checkbox"
                checked={wantsMassage}
                onChange={(e) => setWantsMassage(e.target.checked)}
                className="w-5 h-5 text-sage rounded border-warm-stone focus:ring-sage"
              />
              <div>
                <span className="block font-medium">Add Massage</span>
                <span className="text-xs text-sage-dark font-medium italic">Staff will confirm by phone</span>
              </div>
            </label>
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <label className="block text-sm font-bold text-dark-wood mb-2">Select Time</label>
          {availableSlots.length === 0 ? (
            <p className="text-sm text-dark-wood/70 italic p-4 bg-white rounded-lg border border-warm-stone text-center">
              No slots available for these preferences. Try another date or duration.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2 pb-2">
              {availableSlots.map((slot) => {
                const isSelected = selectedTime?.getTime() === slot.time.getTime();
                return (
                  <button
                    key={slot.time.toISOString()}
                    onClick={() => { setSelectedTime(slot.time); setSelectedRoomId(slot.room.id); }}
                    className={`p-2 text-sm rounded-md border font-medium transition-colors ${
                      isSelected
                        ? 'bg-sage text-white border-sage'
                        : 'bg-white text-dark-wood border-warm-stone hover:border-sage'
                    }`}
                  >
                    {format(slot.time, 'h:mm a')}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Area */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-cream/95 backdrop-blur-sm border-t border-warm-stone">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-dark-wood/70">Total Price</p>
            <p className="text-xl font-bold text-dark-wood">${selectedTime ? price : '--'}</p>
          </div>
          <button
            disabled={!selectedTime}
            onClick={handleBook}
            className="px-8 py-3 bg-dark-wood text-cream rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
          >
            Confirm
          </button>
        </div>
      </div>

      <div className="h-20"></div> {/* Spacer for fixed bottom bar */}
    </div>
  );
}

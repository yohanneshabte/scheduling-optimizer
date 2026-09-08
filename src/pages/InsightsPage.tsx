import { useState } from 'react';

export function InsightsPage() {
  const [appointmentsPerDay, setAppointmentsPerDay] = useState(20);
  const [avgTicket, setAvgTicket] = useState(150);
  const [occupancy, setOccupancy] = useState(60);
  const [costs, setCosts] = useState(40);

  // New Membership & Late Fee Variables
  const [memberships, setMemberships] = useState(50);
  const [membershipPrice, setMembershipPrice] = useState(199);
  const [lateFeeRecoveryPct, setLateFeeRecoveryPct] = useState(5); // % of revenue recovered via late fees

  // Standard Math
  const monthlyBaseRevenue = appointmentsPerDay * avgTicket * 30 * (occupancy / 100);

  // Membership Math (Perspire style model: monthly recurring)
  const monthlyMembershipRevenue = memberships * membershipPrice;

  // Late Fee Recovery Math
  const monthlyLateFeeRevenue = monthlyBaseRevenue * (lateFeeRecoveryPct / 100);

  const totalMonthlyRevenue = monthlyBaseRevenue + monthlyMembershipRevenue + monthlyLateFeeRevenue;
  const monthlyProfit = totalMonthlyRevenue * (1 - costs / 100);

  // Simulated "filled slots" logic +20% on base
  const monthlyProfitOptimized = (monthlyBaseRevenue * 1.20 + monthlyMembershipRevenue + monthlyLateFeeRevenue) * (1 - costs / 100);

  const handleClearData = () => {
    localStorage.removeItem('watercourse_bookings_v2');
    window.location.reload();
  };

  return (
    <div className="p-4 max-w-lg mx-auto pb-24">
      <div className="mb-6 mt-4 text-center">
        <p className="text-sm font-bold tracking-wider text-sage-dark uppercase mb-1">Business Insights</p>
        <h1 className="text-3xl font-serif text-dark-wood">Simulator</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-warm-stone mb-6">
        <h2 className="font-serif text-xl mb-4 text-dark-wood text-center border-b border-warm-stone/50 pb-4">
          Unlocking New Revenue Streams
        </h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-end border-b border-warm-stone/30 pb-2">
            <div>
              <p className="text-sm text-dark-wood/70 font-medium">Total Monthly Rev</p>
              <p className="text-xs text-dark-wood/50">Base + Memberships + Fees</p>
            </div>
            <p className="text-2xl font-bold text-dark-wood">${Math.round(totalMonthlyRevenue).toLocaleString()}</p>
          </div>

          <div className="flex justify-between items-end border-b border-warm-stone/30 pb-2">
            <div>
              <p className="text-sm text-dark-wood/70 font-medium">Monthly Profit</p>
              <p className="text-xs text-dark-wood/50">{costs}% costs</p>
            </div>
            <p className="text-2xl font-bold text-dark-wood">${Math.round(monthlyProfit).toLocaleString()}</p>
          </div>

          <div className="flex justify-between items-end bg-sage-light/20 p-3 rounded-lg border border-sage/30">
            <div>
              <p className="text-sm text-sage-dark font-bold">Optimized Profit</p>
              <p className="text-xs text-sage-dark/70">+20% dead slots filled</p>
            </div>
            <p className="text-2xl font-bold text-sage-dark">${Math.round(monthlyProfitOptimized).toLocaleString()}</p>
          </div>
        </div>

        <p className="text-sm text-dark-wood/80 italic mb-6">
          Simulating the impact of a recurring membership model and stricter late fee/no-show recovery via direct payment integration.
        </p>

        <div className="space-y-4 border-t border-warm-stone/50 pt-6">
          {/* Base Metrics */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-dark-wood uppercase tracking-wide">Base Bookings / day</label>
              <span className="text-sm font-bold text-sage-dark">{appointmentsPerDay}</span>
            </div>
            <input type="range" min="10" max="60" value={appointmentsPerDay} onChange={(e) => setAppointmentsPerDay(Number(e.target.value))} className="w-full accent-dark-wood" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-dark-wood uppercase tracking-wide">Average ticket</label>
              <span className="text-sm font-bold text-sage-dark">${avgTicket}</span>
            </div>
            <input type="range" min="50" max="250" value={avgTicket} onChange={(e) => setAvgTicket(Number(e.target.value))} className="w-full accent-dark-wood" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-dark-wood uppercase tracking-wide">Occupancy</label>
              <span className="text-sm font-bold text-sage-dark">{occupancy}%</span>
            </div>
            <input type="range" min="30" max="100" value={occupancy} onChange={(e) => setOccupancy(Number(e.target.value))} className="w-full accent-dark-wood" />
          </div>

          {/* New Metrics */}
          <div className="bg-sage/5 p-3 rounded-lg border border-sage/20">
             <div className="flex justify-between mb-1">
               <label className="text-xs font-bold text-dark-wood uppercase tracking-wide">Active Memberships</label>
               <span className="text-sm font-bold text-sage-dark">{memberships}</span>
             </div>
             <input type="range" min="0" max="300" step="10" value={memberships} onChange={(e) => setMemberships(Number(e.target.value))} className="w-full accent-sage-dark" />

             <div className="flex justify-between mt-3 mb-1">
               <label className="text-xs font-bold text-dark-wood uppercase tracking-wide">Membership Price</label>
               <span className="text-sm font-bold text-sage-dark">${membershipPrice}/mo</span>
             </div>
             <input type="range" min="99" max="399" step="10" value={membershipPrice} onChange={(e) => setMembershipPrice(Number(e.target.value))} className="w-full accent-sage-dark" />
          </div>

          <div className="bg-warm-stone/10 p-3 rounded-lg border border-warm-stone/30">
             <div className="flex justify-between mb-1">
               <label className="text-xs font-bold text-dark-wood uppercase tracking-wide">Late Fee Recovery</label>
               <span className="text-sm font-bold text-sage-dark">{lateFeeRecoveryPct}%</span>
             </div>
             <input type="range" min="0" max="15" step="1" value={lateFeeRecoveryPct} onChange={(e) => setLateFeeRecoveryPct(Number(e.target.value))} className="w-full accent-dark-wood" />
             <p className="text-xs text-dark-wood/50 mt-1">Revenue recovered from no-shows and late cancellations via integrated card hold.</p>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-dark-wood uppercase tracking-wide">Operating Costs</label>
              <span className="text-sm font-bold text-sage-dark">{costs}%</span>
            </div>
            <input type="range" min="20" max="80" value={costs} onChange={(e) => setCosts(Number(e.target.value))} className="w-full accent-dark-wood" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-warm-stone mb-6">
         <h2 className="font-bold text-lg mb-4 text-dark-wood">Rules already in the calendar</h2>
         <ul className="space-y-3 text-sm text-dark-wood/80">
            <li>
               <strong className="block text-dark-wood">15-minute turn</strong>
               Every visit is followed by a cleaning turn. The next guest cannot land on a wet room.
            </li>
            <li>
               <strong className="block text-dark-wood">Never pack the floor</strong>
               Never more than six of nine private rooms at once. Evenings can look full without crushing staff.
            </li>
            <li>
               <strong className="block text-dark-wood">Fill weekday mornings first</strong>
               Book Now offers quiet morning times before Friday at seven.
            </li>
         </ul>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={handleClearData}
          className="text-red-800/60 font-medium text-sm hover:text-red-800 transition-colors border border-red-800/20 px-4 py-2 rounded-lg"
        >
          Clear demo reservations
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';

export function InsightsPage() {
  const [appointmentsPerDay, setAppointmentsPerDay] = useState(45);
  const [avgTicket, setAvgTicket] = useState(150);
  const [occupancy, setOccupancy] = useState(60);
  const [costs, setCosts] = useState(40);

  // Simple math for the demo
  const monthlyRevenue = appointmentsPerDay * avgTicket * 30 * (occupancy / 100);
  const monthlyProfit = monthlyRevenue * (1 - costs / 100);

  return (
    <div className="p-4 max-w-lg mx-auto pb-24">
      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-serif text-dark-wood">For the front desk</h1>
        <p className="text-sm text-dark-wood/70">Tub Booking Insights Demo</p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-warm-stone mb-6">
        <h2 className="font-bold text-lg mb-4 text-dark-wood">Monthly Projections</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-sage-light/20 rounded-md">
            <p className="text-xs text-dark-wood/70 uppercase tracking-wider mb-1">Revenue</p>
            <p className="text-2xl font-bold text-dark-wood">${Math.round(monthlyRevenue).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-sage/20 rounded-md">
            <p className="text-xs text-dark-wood/70 uppercase tracking-wider mb-1">Profit</p>
            <p className="text-2xl font-bold text-sage-dark">${Math.round(monthlyProfit).toLocaleString()}</p>
          </div>
        </div>

        <div className="p-3 bg-warm-stone/20 rounded-md text-sm text-dark-wood font-medium italic">
          "Online booking + off-peak 2hr blocks could add ~20% revenue"
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-dark-wood">Base Appointments / Day</label>
            <span className="text-sm font-medium">{appointmentsPerDay}</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={appointmentsPerDay}
            onChange={(e) => setAppointmentsPerDay(Number(e.target.value))}
            className="w-full accent-sage-dark"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-dark-wood">Avg Ticket Price ($)</label>
            <span className="text-sm font-medium">${avgTicket}</span>
          </div>
          <input
            type="range"
            min="50"
            max="300"
            value={avgTicket}
            onChange={(e) => setAvgTicket(Number(e.target.value))}
            className="w-full accent-sage-dark"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-dark-wood">Occupancy (%)</label>
            <span className="text-sm font-medium">{occupancy}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={occupancy}
            onChange={(e) => setOccupancy(Number(e.target.value))}
            className="w-full accent-sage-dark"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-dark-wood">Operating Costs (%)</label>
            <span className="text-sm font-medium">{costs}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="90"
            value={costs}
            onChange={(e) => setCosts(Number(e.target.value))}
            className="w-full accent-sage-dark"
          />
        </div>
      </div>
    </div>
  );
}

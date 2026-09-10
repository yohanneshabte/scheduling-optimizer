import type { LocationConfig, Room, PricingRule, RoomFeature } from './types';

export const CONFIG: LocationConfig = {
  id: 'watercourse-way',
  name: 'Watercourse Way',
  address: '165 Channing Avenue, Palo Alto, CA 94301',
  phone: '650-462-2000',
  theme: {
    primary: 'sage-dark',
    secondary: 'warm-stone',
    background: 'cream',
    text: 'dark-wood',
  },
  operatingHours: {
    0: { open: "08:00", close: "23:30" }, // Sun
    1: { open: "08:00", close: "23:30" }, // Mon
    2: { open: "08:00", close: "23:30" }, // Tue
    3: { open: "08:00", close: "23:30" }, // Wed
    4: { open: "08:00", close: "23:30" }, // Thu
    5: { open: "08:00", close: "24:30" }, // Fri (12:30am)
    6: { open: "08:00", close: "24:30" }, // Sat
  },
  globalSettings: {
    cleaningBufferMinutes: 15,
    maxConcurrentOccupancyPercent: 67, // Staff ceiling is 67% (6 of 9 rooms) according to Grok demo
    bookingIncrementsMinutes: [60, 90, 120, 150, 180], // 1hr, 90min, 2hr, 2.5hr, 3hr
  }
};

export const FEATURES: Record<string, RoomFeature> = {
  'sauna': { id: 'sauna', name: 'Sauna' },
  'steam': { id: 'steam', name: 'Steam Room' },
  'cold_plunge': { id: 'cold_plunge', name: 'Cold Plunge' },
  'skylight': { id: 'skylight', name: 'Skylight' },
  'wood_tub': { id: 'wood_tub', name: 'Wood Tub' },
  'tiled_tub': { id: 'tiled_tub', name: 'Tiled Spa' },
  'gunite_tub': { id: 'gunite_tub', name: 'Gunite Tub' },
  'premium': { id: 'premium', name: 'Premium Room (Sauna or Steam)' } // Abstract feature for pricing logic
};

export const ROOMS: Room[] = [
  {
    id: 'one-pine',
    name: 'One Pine',
    description: 'Multi-Jetted Wood Tub, Sauna & Cold Plunge. Dark tiles and a skylight compliment the traditional wooden tubs.',
    features: ['wood_tub', 'sauna', 'cold_plunge', 'skylight', 'premium'],
    capacity: 4,
    basePricePerHour: 40,
  },
  {
    id: 'two-stones',
    name: 'Two Stones',
    description: 'Multi-Jetted Spa & Sauna. A soothing waterfall cascades into the gunite hot tub.',
    features: ['gunite_tub', 'sauna', 'premium'],
    capacity: 4,
    basePricePerHour: 40,
  },
  {
    id: 'three-trillium',
    name: 'Three Trillium',
    description: 'Multi-Jetted Tiled Spa. Natural lighting fills this room through the skylight overhead.',
    features: ['tiled_tub', 'skylight'],
    capacity: 4,
    basePricePerHour: 40,
  },
  {
    id: 'four-water-ouzels',
    name: 'Four Water Ouzels',
    description: 'Multi-Jetted Tiled Spa. Beautiful bamboo etched glass surrounds the tub in this elegant, skylit room.',
    features: ['tiled_tub', 'skylight'],
    capacity: 4,
    basePricePerHour: 40,
  },
  {
    id: 'five-fish',
    name: 'Five Fish',
    description: 'Multi-Jetted Tiled Spa. Backlit fish and wave etched glass.',
    features: ['tiled_tub'],
    capacity: 4,
    basePricePerHour: 40,
  },
  {
    id: 'six-dragonflies',
    name: 'Six Dragonflies',
    description: 'Multi-Jetted Wood Tub, Steam & Cold Plunge. Glass-fronted steam shower and a long soak in a traditional wooden tub under a domed skylight.',
    features: ['wood_tub', 'steam', 'cold_plunge', 'skylight', 'premium'],
    capacity: 4,
    basePricePerHour: 40,
  },
  {
    id: 'seven-moon',
    name: 'Seven Moon',
    description: 'Tiled Spa. (Inferred standard room)',
    features: ['tiled_tub'],
    capacity: 4,
    basePricePerHour: 40,
  },
  {
    id: 'eight-stars',
    name: 'Eight Stars',
    description: 'Multi-Jetted Spa, Sauna & Cold Plunge. Elegant tile work in this spacious room.',
    features: ['tiled_tub', 'sauna', 'cold_plunge', 'premium'],
    capacity: 4,
    basePricePerHour: 40,
  },
  {
    id: 'nine-bats',
    name: 'Nine Bats',
    description: 'Multi-Jetted Spa, Steam & Cold Plunge. Tiled hot tub under a dome of fabricated starlight.',
    features: ['tiled_tub', 'steam', 'cold_plunge', 'premium'],
    capacity: 4,
    basePricePerHour: 40,
  },
];

// $40/$45 for standard, $58/$65 for premium (Mon-Thu vs Fri-Sun)
export const PRICING_RULES: PricingRule[] = [
  {
    id: 'weekday-standard',
    name: 'Weekday Rate Standard',
    condition: { daysOfWeek: [1, 2, 3, 4] }, // Mon-Thu
    ratePerHourPerPerson: 40,
    priority: 1
  },
  {
    id: 'weekend-standard',
    name: 'Weekend Rate Standard',
    condition: { daysOfWeek: [0, 5, 6] }, // Fri-Sun
    ratePerHourPerPerson: 45,
    priority: 2
  },
  {
    id: 'weekday-premium',
    name: 'Weekday Rate Premium',
    condition: { daysOfWeek: [1, 2, 3, 4], roomFeatureRequired: 'premium' },
    ratePerHourPerPerson: 58,
    priority: 3
  },
  {
    id: 'weekend-premium',
    name: 'Weekend Rate Premium',
    condition: { daysOfWeek: [0, 5, 6], roomFeatureRequired: 'premium' },
    ratePerHourPerPerson: 65,
    priority: 4
  }
];

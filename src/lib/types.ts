export interface RoomFeature {
  id: string;
  name: string;
  icon?: string; // identifier for icon
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  features: string[]; // array of feature IDs
  capacity: number; // max people
  basePricePerHour: number; // For simpler setups, or use dynamic rules
  image?: string;
}

export interface LocationConfig {
  id: string;
  name: string;
  address: string;
  phone: string;
  theme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  operatingHours: {
    [dayOfWeek: number]: { open: string; close: string; isClosed?: boolean };
  };
  globalSettings: {
    cleaningBufferMinutes: number;
    maxConcurrentOccupancyPercent: number;
    bookingIncrementsMinutes: number[];
  };
}

export interface PricingRule {
  id: string;
  name: string;
  condition: {
    daysOfWeek?: number[]; // e.g., [0, 5, 6] for Sun, Fri, Sat
    timeRange?: { start: string; end: string }; // e.g., "08:30" to "17:30"
    roomFeatureRequired?: string; // e.g., "sauna"
  };
  ratePerHourPerPerson: number;
  priority: number; // higher priority rules override lower ones if overlapping
}

export interface Booking {
  id: string;
  roomId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string (includes clean buffer)
  durationMinutes: number;
  partySize: number;
  addOns: string[]; // e.g., ["massage"]
  price: number;
  isMock: boolean;
  status: 'confirmed' | 'cancelled';
}

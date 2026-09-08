export interface Room {
  id: string;
  name: string;
  hasSaunaOrSteam: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string (includes 15 min clean buffer)
  duration: number; // 60, 90, 120
  partySize: number;
  addOns: {
    massage: boolean;
    saunaOrSteam: boolean;
  };
  price: number;
  isMock: boolean;
}

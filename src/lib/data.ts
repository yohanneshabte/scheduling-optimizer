import type { Room } from './types';

export const ROOMS: Room[] = [
  { id: '1', name: 'One Pine', hasSaunaOrSteam: false },
  { id: '2', name: 'Two Stones', hasSaunaOrSteam: false },
  { id: '3', name: 'Three Willows', hasSaunaOrSteam: false },
  { id: '4', name: 'Four Lotus', hasSaunaOrSteam: true },
  { id: '5', name: 'Five Reeds', hasSaunaOrSteam: true },
  { id: '6', name: 'Six Dragonflies', hasSaunaOrSteam: true },
  { id: '7', name: 'Seven Moon', hasSaunaOrSteam: true },
  { id: '8', name: 'Eight Stars', hasSaunaOrSteam: true },
  { id: '9', name: 'Nine Cedar', hasSaunaOrSteam: true },
];

export const MAX_CONCURRENT_ROOMS = Math.floor(ROOMS.length * 0.75); // 75% capacity limit
export const CLEAN_BUFFER_MINUTES = 15;

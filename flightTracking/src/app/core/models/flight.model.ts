export interface Flight {
  id: number;
  flightNumber: string;
  callsign: string;
  aircraftType: string;

  origin: string;
  destination: string;

  originLat: number;
  originLng: number;

  destinationLat: number;
  destinationLng: number;

  currentLat: number;
  currentLng: number;

  status: 'Active' | 'Delayed' | 'Arrived';

  etd: string;
  eta: string;
}
import { Injectable,signal  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Flight } from '../models/flight.model';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  flights = signal<Flight[]>([]);

  constructor(
    private http: HttpClient
  ) {}

  loadFlights() {
    this.http.get<Flight[]>('assets/flights.json').subscribe(data => {
        this.flights.set(data);
      });
  }
}
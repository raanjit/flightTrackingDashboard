import { Injectable,signal  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Flight } from '../models/flight.model';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  private flightsSubject =
    new BehaviorSubject<Flight[]>([]);

  flights = signal<Flight[]>([]);

  constructor(
    private http: HttpClient
  ) {}

  loadFlights() {
    this.http
      .get<Flight[]>('assets/flights.json')
      .subscribe(data => {
        console.log(data)
        this.flights.set(data);
      });
  }
}
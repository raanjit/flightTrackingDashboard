import {
  Component,
  signal,
  computed,
  inject,
  effect,
  OnInit
} from '@angular/core';

import { FlightService } from '../../core/services/flight.service';
import { FlightDetails } from '../flight-details/flight-details';
import { KpiCardComponent } from '../kpi-card/kpi-card';
import { FlightMapComponent } from '../flight-map/flight-map';
import { FiltersComponent } from '../filter/filter';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FlightDetails,
    KpiCardComponent,
    FlightMapComponent,
    FiltersComponent
  ],                                    
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  private flightService = inject(FlightService);

  flights = this.flightService.flights;  

  selectedFlight = signal<any>(null);

  filterValues = signal({ callsign: '', status: '' });

  filteredFlights = computed(() => {
    const filters = this.filterValues();
    const allFlights = this.flights();

    return allFlights.filter((flight: any) => {
      const callSignMatch =
        !filters.callsign ||
        flight.callsign
          .toLowerCase()
          .includes(filters.callsign.toLowerCase());

      const statusMatch = !filters.status || flight.status === filters.status;

      return callSignMatch && statusMatch;
    });
  });


  totalFlights = computed(() =>
    this.filteredFlights().length
  );

  activeFlights = computed(() =>
    this.filteredFlights().filter((f: any) => f.status === 'Active').length
  );

  delayedFlights = computed(() =>
    this.filteredFlights().filter((f: any) => f.status === 'Delayed').length
  );

  arrivedFlights = computed(() =>
    this.filteredFlights().filter((f: any) => f.status === 'Arrived').length
  );

  ngOnInit() {
    this.flightService.loadFlights();   
  }

  updateFilters(filters: any) {
    this.filterValues.set(filters);
  }

  selectFlight(flight: any) {
    this.selectedFlight.set(flight);
  }
}
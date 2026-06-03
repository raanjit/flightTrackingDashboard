import {
  Component,
  input,
  output,
  effect,
  AfterViewInit,
  inject,
  NgZone,
  Injector
} from '@angular/core';
import * as L from 'leaflet';

function getFlightIcon(status: string) {
  const colors: Record<string, string> = {
    Active: '#22c55e',
    Delayed: '#f97316',
    Arrived: '#3b82f6'
  };

  return L.divIcon({
    className: 'flight-marker',
    html: `
      <div
        style="
          width:32px;
          height:32px;
          border-radius:50%;
          background:${colors[status] || '#6b7280'};
          color:white;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:16px;
          border:2px solid white;
        "
      >
        ✈
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

@Component({
  selector: 'app-flight-map',
  standalone: true,
  imports: [],
  template: `
    <div id="map" style="height:600px; width:100%; border-radius:12px;"></div>
  `
})
export class FlightMapComponent implements AfterViewInit {

  flights = input<any[]>([]);
  flightSelected = output<any>();

  private map!: L.Map;
  private routeLayer!: L.Polyline;
  private markers: L.Marker[] = [];   
  private zone = inject(NgZone);
  private injector = inject(Injector);

  ngAfterViewInit() {

  this.initMap();

  effect(() => {

    const flights = this.flights();

    this.clearMarkers();
    this.renderFlights(flights);

  }, {
    injector: this.injector
  });

}

  private initMap() {
    this.map = L.map('map').setView([20.5937, 78.9629], 5);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '© OpenStreetMap contributors' }
    ).addTo(this.map);
  }

  private clearMarkers() {
    this.markers.forEach(m => m.removeFrom(this.map));
    this.markers = [];
  }

  private renderFlights(flights: any[]) {
    flights.forEach(flight => {
      if (!flight.currentLat || !flight.currentLng) return;

      const marker = L.marker(
        [flight.currentLat, flight.currentLng],
        { icon: getFlightIcon(flight.status) }  
      );


      marker.addTo(this.map);

      marker.bindPopup(`
        <div style="min-width:180px; font-family:sans-serif;">
          <h3 style="margin:0 0 8px; color:#1e40af;">
            ✈ ${flight.flightNumber}
          </h3>
          <table style="width:100%; font-size:13px;">
            <tr>
              <td><b>Callsign</b></td>
              <td>${flight.callsign}</td>
            </tr>
            <tr>
              <td><b>Aircraft</b></td>
              <td>${flight.aircraftType}</td>
            </tr>
            <tr>
              <td><b>Status</b></td>
              <td>
                <span style="
                  background:${flight.status === 'Active' ? '#dcfce7' : '#fef9c3'};
                  padding:2px 8px;
                  border-radius:99px;
                  font-size:12px;
                ">
                  ${flight.status}
                </span>
              </td>
            </tr>
            <tr>
              <td><b>Origin</b></td>
              <td>${flight.origin}</td>
            </tr>
            <tr>
              <td><b>Destination</b></td>
              <td>${flight.destination}</td>
            </tr>
            <tr>
              <td><b>ETD</b></td>
              <td>${flight.etd}</td>
            </tr>
            <tr>
              <td><b>ETA</b></td>
              <td>${flight.eta}</td>
            </tr>
          </table>
        </div>
      `, { maxWidth: 220 });

      marker.on('click', () => {
        this.zone.run(() => {
          this.drawRoute(flight);
          this.flightSelected.emit(flight);
        });
      });

      this.markers.push(marker);   
    });
  }

  private drawRoute(flight: any) {
    if (this.routeLayer) {
      this.map.removeLayer(this.routeLayer);
    }

    if (
      !flight.originLat ||
      !flight.originLng ||
      !flight.destinationLat ||
      !flight.destinationLng
    ) return;

    this.routeLayer = L.polyline([
      [flight.originLat,      flight.originLng],
      [flight.destinationLat, flight.destinationLng]
    ], {
      color: 'blue',
      weight: 3,
      dashArray: '8, 8',    
      opacity: 0.8
    }).addTo(this.map);

    this.map.fitBounds(this.routeLayer.getBounds(), {
      padding: [50, 50]
    });
  }
}
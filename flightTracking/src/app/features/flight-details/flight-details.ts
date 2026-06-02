import {
 Component,
 Input
} from '@angular/core';

@Component({
  selector: 'app-flight-details',
  imports: [],
  templateUrl: './flight-details.html',
  styleUrl: './flight-details.scss',
})
export class FlightDetails {
  @Input() flight:any

  constructor(){
    console.log(this.flight)

  }
}

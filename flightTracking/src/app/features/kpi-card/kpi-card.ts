import {
 Component,
 Input
} from '@angular/core';

@Component({
 selector:'app-kpi-card',
 template:`
 <div class="card">
   <h3>{{title}}</h3>
   <h2>{{value}}</h2>
 </div>
 `
})
export class KpiCardComponent {

 @Input() title='';

 @Input() count=0;

 @Input() value: any;

}
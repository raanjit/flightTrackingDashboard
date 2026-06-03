import { Component, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './filter.html'
})
export class FiltersComponent implements OnInit {

  private fb = inject(FormBuilder);   

  @Output() filterChange = new EventEmitter();

  filterForm = this.fb.group({      
    callsign: [''],
    status: ['']
  });

  ngOnInit() {
    this.filterForm.valueChanges.subscribe((value: any) => {
      this.filterChange.emit(value);
    });
  }
}
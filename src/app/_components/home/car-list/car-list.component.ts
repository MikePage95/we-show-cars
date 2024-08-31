import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Vehicle } from '@types';
import { formatToCurrency } from '@utils';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.scss',
})
export class CarListComponent implements OnChanges {
  @Input() vehicles: Vehicle[] = [];
  public formatToCurrency = formatToCurrency;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicles']) {
      console.log('Vehicles changed:', this.vehicles);
    }
  }
}

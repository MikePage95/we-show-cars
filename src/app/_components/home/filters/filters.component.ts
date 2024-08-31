import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { Vehicle, VehicleFilters } from '@types';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnChanges {
  @Input() public vehicles!: Vehicle[];
  @Output() public filterChanged = new EventEmitter();

  public filters: VehicleFilters = {
    manufacturer: { options: [] },
    body: { options: [] },
    priceRange: { min: { options: [] }, max: { options: [] } },
  };

  public selectedManufacturer: string = 'Any';
  public selectedBodyType: string = 'Any';
  public selectedPriceRange: { min: string; max: string } = {
    min: 'Any',
    max: 'Any',
  };

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vehicles'] && this.vehicles) {
      this.initializeFilters();
    }
  }

  initializeFilters(): void {
    this.filters.manufacturer.options = [
      ...new Set(
        ['Any', ...this.vehicles.map((vehicle) => vehicle.make)].sort()
      ),
    ];
    this.filters.body.options = [
      ...new Set(
        ['Any', ...this.vehicles.map((vehicle) => vehicle.body)].sort()
      ),
    ];
    this.updatePriceRangeOptions();
  }

  updatePriceRangeOptions(): void {
    const { vehicles } = this;
    const priceOptions: number[] = [];

    const prices = vehicles.map((vehicle) => vehicle.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const roundedMinPrice = Math.floor(minPrice / 50000) * 50000;
    const roundedMaxPrice = Math.ceil(maxPrice / 50000) * 50000;

    for (
      let price = roundedMinPrice;
      price <= roundedMaxPrice;
      price += 50000
    ) {
      priceOptions.push(price);
    }

    this.filters.priceRange.min.options = [
      'Any',
      ...priceOptions.map((price) => price.toLocaleString()).slice(0, -1),
    ];

    this.filters.priceRange.max.options = [
      'Any',
      ...priceOptions.map((price) => price.toLocaleString()).slice(1),
    ];
  }

  onManufacturerSelected(manufacturer: string) {
    this.selectedManufacturer = manufacturer;
    this.emitFilterChange();
  }

  onBodyTypeSelected(bodyType: string) {
    this.selectedBodyType = bodyType;
    this.emitFilterChange();
  }

  onPriceRangeSelected(type: 'min' | 'max', value: string) {
    if (type === 'min') {
      this.selectedPriceRange.min = value;
    } else if (type === 'max') {
      this.selectedPriceRange.max = value;
    }

    this.emitFilterChange();
  }

  private emitFilterChange() {
    this.filterChanged.emit({
      manufacturer: this.selectedManufacturer,
      bodyType: this.selectedBodyType,
      priceRange: {
        min: this.selectedPriceRange.min,
        max: this.selectedPriceRange.max,
      },
    });
  }
}

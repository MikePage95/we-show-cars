import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { HomeService } from '../_services/home.service';
import { HomeModule } from '../_components/home/home.module';

import { SelectedFilters, VehicleWithId } from '@types';
import { parsePrice } from '@utils';

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [HomeService],
  imports: [HomeModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public vehicles: VehicleWithId[] = [];
  public filteredVehicles: VehicleWithId[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.homeService.getVehicles().subscribe((vehicles: VehicleWithId[]) => {
        this.vehicles = vehicles;
        this.filteredVehicles = vehicles;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onFilterChanged(filters: SelectedFilters) {
    const { manufacturer, bodyType, priceRange } = filters;

    const minPrice = parsePrice(priceRange.min) || -Infinity;
    const maxPrice = parsePrice(priceRange.max) || Infinity;

    this.filteredVehicles = this.vehicles.filter((vehicle) => {
      const matchesManufacturer =
        manufacturer === 'Any' || vehicle.make === manufacturer;
      const matchesBodyType = bodyType === 'Any' || vehicle.body === bodyType;
      const vehiclePrice = vehicle.price;

      const matchesPriceRange =
        (minPrice === -Infinity || vehiclePrice >= minPrice) &&
        (maxPrice === Infinity || vehiclePrice <= maxPrice);

      return matchesManufacturer && matchesBodyType && matchesPriceRange;
    });
  }
}

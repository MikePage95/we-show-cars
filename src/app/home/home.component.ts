import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { HomeService } from '../_services/home.service';
import { HomeModule } from '../_components/home/home.module';

import { Vehicle, SelectedFilters } from '@types';
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
  public vehicles: Vehicle[] = [];
  public filteredVehicles: Vehicle[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.homeService.getVehicles().subscribe((vehicles: Vehicle[]) => {
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
        manufacturer === 'All' || vehicle.make === manufacturer;
      const matchesBodyType = bodyType === 'All' || vehicle.body === bodyType;
      const vehiclePrice = parsePrice(vehicle.price);

      const matchesPriceRange =
        (minPrice === -Infinity || vehiclePrice >= minPrice) &&
        (maxPrice === Infinity || vehiclePrice <= maxPrice);

      return matchesManufacturer && matchesBodyType && matchesPriceRange;
    });
  }
}

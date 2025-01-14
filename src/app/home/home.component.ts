import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  BehaviorSubject,
  combineLatest,
  from,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

import { HomeService } from '../_services/home.service';
import { HomeModule } from '../_components/home/home.module';

import { SelectedFilters, VehicleWithId } from '@types';
import { parsePrice } from '@utils';

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [HomeService],
  imports: [HomeModule, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  public vehicles$: Observable<VehicleWithId[]> = from([]);
  public filteredVehicles$: Observable<VehicleWithId[]> = from([]);
  public destroy$ = new Subject<void>();
  private filterSubject = new BehaviorSubject<SelectedFilters>({
    manufacturer: 'Any',
    bodyType: 'Any',
    priceRange: { min: 'Any', max: 'Any' },
  });

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.vehicles$ = this.homeService
      .getVehicles()
      .pipe(takeUntil(this.destroy$));

    this.filteredVehicles$ = combineLatest([
      this.vehicles$,
      this.filterSubject.asObservable(),
    ]).pipe(
      map(([vehicles, filters]) => this.filterVehicles(vehicles, filters)),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFilterChanged(filters: SelectedFilters): void {
    this.filterSubject.next(filters);
  }

  private filterVehicles(
    vehicles: VehicleWithId[],
    filters: SelectedFilters
  ): VehicleWithId[] {
    const { manufacturer, bodyType, priceRange } = filters;
    const minPrice = parsePrice(priceRange.min) || -Infinity;
    const maxPrice = parsePrice(priceRange.max) || Infinity;

    return vehicles.filter((vehicle) => {
      const matchesManufacturer =
        manufacturer === 'Any' || vehicle.make === manufacturer;
      const matchesBodyType = bodyType === 'Any' || vehicle.body === bodyType;
      const matchesPriceRange =
        (minPrice === -Infinity || vehicle.price >= minPrice) &&
        (maxPrice === Infinity || vehicle.price <= maxPrice);

      return matchesManufacturer && matchesBodyType && matchesPriceRange;
    });
  }
}

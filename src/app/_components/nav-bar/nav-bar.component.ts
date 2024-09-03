import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

import { HomeService } from '../../_services/home.service';
import { Cart, Vehicle, VehicleWithId } from '@types';
import { selectCartId } from '../../_store/cart/cart.selectors';
import { AppState } from '../../_store/app.state';
import { formatToCurrency } from '@utils';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
    CommonModule,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  providers: [HomeService],
})
export class NavBarComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public cartId$: Observable<string | null>;
  public cart: string[] = [];
  public cartVehicles: Vehicle[] = [];
  public formatToCurrency = formatToCurrency;

  constructor(
    private homeService: HomeService,
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) {
    this.cartId$ = this.store.pipe(select(selectCartId));
  }

  ngOnInit() {
    this.subscriptions.push(
      this.cartId$.subscribe((cartId) => {
        if (cartId) {
          this.subscriptions.push(
            this.homeService.getCart().subscribe((cart: Cart) => {
              this.cart = cart.items;

              this.homeService
                .getVehiclesByIds(this.cart)
                .subscribe((vehicles) => {
                  console.log(vehicles);
                  this.cartVehicles = vehicles;
                });
            })
          );
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  async removeFromCart(vehicle: VehicleWithId) {
    const { id, make, model } = vehicle;

    try {
      await this.homeService.removeFromCart(id);

      this.snackBar.open(
        `${make} ${model} successfully removed from cart!`,
        'Close',
        {
          duration: 3000,
        }
      );
    } catch (error) {
      console.log(error);
      this.snackBar.open(
        `An error has occured while adding ${make} ${model} to cart.`,
        'Close',
        {
          duration: 3000,
        }
      );
    }
  }
}

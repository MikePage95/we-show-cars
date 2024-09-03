import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Cart, Vehicle, VehicleWithId } from '@types';
import { formatToCurrency } from '@utils';
import { HomeService } from '../../../_services/home.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.scss',
})
export class CarListComponent implements OnInit, OnDestroy {
  @Input() vehicles: Vehicle[] = [];
  public formatToCurrency = formatToCurrency;
  public cart: string[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private homeService: HomeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const cartId = sessionStorage.getItem('cartId');

    if (cartId) {
      this.subscriptions.push(
        this.homeService.getCart().subscribe((cart: Cart) => {
          this.cart = cart.items;
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  async addToCart(vehicle: VehicleWithId) {
    const { id, make, model } = vehicle;
    let action = 'added to';

    try {
      if (!this.cart.includes(id)) {
        await this.homeService.addToCart(id);
      } else {
        action = 'removed from';
        await this.homeService.removeFromCart(id);
      }

      const cartId = sessionStorage.getItem('cartId');

      if (cartId) {
        this.subscriptions.push(
          this.homeService.getCart().subscribe((cart: Cart) => {
            this.cart = cart.items;
          })
        );
      }

      this.snackBar.open(
        `${make} ${model} successfully ${action} to cart!`,
        'Close',
        {
          duration: 3000,
        }
      );
    } catch (error) {
      console.log(error);
      this.snackBar.open(
        `An error has occured while adding ${make} ${model} cart.`,
        'Close',
        {
          duration: 3000,
        }
      );
    }
  }
}

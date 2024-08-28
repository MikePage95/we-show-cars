import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FiltersComponent } from './filters/filters.component';
import { CartComponent } from './cart/cart.component';
import { CarListComponent } from './car-list/car-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FiltersComponent, CartComponent, CarListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'we-show-cars';
}

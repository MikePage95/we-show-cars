import { Component } from '@angular/core';

import {
  CarListComponent,
  CartComponent,
  FiltersComponent,
} from '../_components/home';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarListComponent, CartComponent, FiltersComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}

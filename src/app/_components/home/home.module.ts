import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';

import { CarListComponent } from './car-list/car-list.component';
import { FiltersComponent } from './filters/filters.component';

@NgModule({
  declarations: [CarListComponent, FiltersComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelect,
    MatOption,
    MatDividerModule,
  ],
  exports: [CarListComponent, FiltersComponent],
})
export class HomeModule {}

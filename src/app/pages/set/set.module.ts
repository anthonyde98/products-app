import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetRoutingModule } from './set-routing.module';
import { SetComponent } from './set.component';
import { ProductFormComponent } from 'src/app/components/product-form/product-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageSliderModule } from 'src/app/components/image-slider/image-slider.module';
import { LoadModule } from 'src/app/components/load/load.module';

@NgModule({
  declarations: [
    SetComponent,
    ProductFormComponent
  ],
  imports: [
    CommonModule,
    SetRoutingModule,
    ReactiveFormsModule,
    ImageSliderModule,
    LoadModule
  ]
})
export class SetModule { }

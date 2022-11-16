import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformationRoutingModule } from './information-routing.module';
import { InformationComponent } from './information.component';
import { StarsRatingComponent } from 'src/app/components/stars-rating/stars-rating.component';
import { ImageSliderModule } from 'src/app/components/image-slider/image-slider.module';

@NgModule({
  declarations: [
    InformationComponent,
    StarsRatingComponent
  ],
  imports: [
    CommonModule,
    InformationRoutingModule,
    ImageSliderModule
  ]
})
export class InformationModule { }

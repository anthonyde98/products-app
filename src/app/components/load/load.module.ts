import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadComponent } from './load.component';

@NgModule({
  declarations: [
    LoadComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [LoadComponent]
})
export class LoadModule { }

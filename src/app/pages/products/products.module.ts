import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { FormsModule } from '@angular/forms';
import { ProductComponent } from 'src/app/components/product/product.component';
import { DeleteModalComponent } from 'src/app/components/delete-modal/delete-modal.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductComponent,
    DeleteModalComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class ProductsModule { }

import { Component, Input, OnInit } from '@angular/core';
import { GLOBALS } from 'src/app/enums/globals';
import { Product } from 'src/app/interfaces/product';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @Input() product!: Product;
  deleteProduct: boolean = false;
  defaultImage: string = GLOBALS.defaultImage;

  constructor() { }

  ngOnInit(): void {
  }

}

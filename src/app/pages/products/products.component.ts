import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { catchError, of } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { Response } from 'src/app/interfaces/response';
import { Product } from 'src/app/interfaces/product';
import { Products } from 'src/app/interfaces/products';
import { PaginationConfig } from 'src/app/interfaces/pagination-config';
import { GLOBALS } from 'src/app/enums/globals';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  fields: Array<string> = [];
  limits: Array<number> = GLOBALS.quantityOptions;
  selectedFilter: string = "";
  search: string = "";
  products: Array<Product> = [];
  private skip: number = 0;
  limit: number = GLOBALS.quantityOptions[0];
  pagination: PaginationConfig = {
    currentPage: 1,
    itemsPerPage: this.limit,
    totalItems: 0
  }

  constructor(private productService: ProductService, private categoryService: CategoryService, private toast: ToastrService, 
    private titleService: Title) {
      titleService.setTitle("ProductosApp");
  }

  ngOnInit(): void {
    this.searchCategories();
    this.searchProductsByText();
  }

  private searchCategories(){
    this.categoryService.getCategories().pipe(
      catchError(error => {
        if (error) {
          this.toast.error("Hubo un error al buscar las categorias", "Error");
        }
        return of(error != null);
      })
    ).subscribe((response: Response) => {
      if(response.status === 200){
        this.fields = response.body as Array<string>;
        this.fields.unshift(GLOBALS.defaultOptionSelect)
        this.selectedFilter = this.fields[0];
      }
    })
  }

  searchProductsByText(){
    this.selectedFilter = GLOBALS.defaultOptionSelect;
    this.productService.getProductsByText({q: this.search, skip: this.skip, limit: this.limit}).pipe(
      catchError(error => {
        if (error) {
          this.toast.error("Hubo un error al buscar los productos", "Error");
        }
        return of(error != null);
      })
    ).subscribe((response: Response) => {
      if(response.status === 200){
        const productsResponse = (response.body as Products);
        this.products = productsResponse.products;
        this.pagination.totalItems = productsResponse.total;
        this.pagination.itemsPerPage = this.limit;
      }
    })
  }

  searchProductsByCategory(){
    this.search = ''; 
    if(this.selectedFilter === GLOBALS.defaultOptionSelect){
      this.searchProductsByText();
      return;
    }
    this.productService.getProductsByCategory(this.selectedFilter).pipe(
      catchError(error => {
        if (error) {
          this.toast.error("Hubo un error al buscar los productos", "Error");
        }
        return of(error != null);
      })
    ).subscribe((response: any) => {
      if(response.status === 200){
        const productsResponse = (response.body as Products);
        this.products = productsResponse.products;
        this.pagination.totalItems = productsResponse.total;
        this.pagination.itemsPerPage = this.limit;
      }
    })
  }

  setLimit(){
    this.scrollTop();
    this.limit = Number(this.limit);
    this.selectedFilter = GLOBALS.defaultOptionSelect;
    this.search = '';
    this.pagination.currentPage = 1;
    this.searchProductsByText();
  }

  onPaginationChange($event: number){
    this.scrollTop();
    this.pagination.currentPage = $event;
    this.skip = ($event - 1) * this.limit;
    this.searchProductsByText();
  }

  private scrollTop(){
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
}

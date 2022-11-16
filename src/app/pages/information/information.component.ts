import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AbsoluteRoutes } from 'src/app/enums/routes';
import { Product } from 'src/app/interfaces/product';
import { Response } from 'src/app/interfaces/response';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  product!: Product;
  private id: string = "";
  private routes = AbsoluteRoutes;
  constructor(private rutaActiva: ActivatedRoute, private router: Router, private productService: ProductService, private toast: ToastrService,
    private titleService: Title) {
    this.id = this.rutaActiva.snapshot.paramMap.get('id') || ""; 
  }

  ngOnInit(): void {
    if(this.id){
      this.searchProduct()
    }
    else{
      this.router.navigateByUrl(this.routes.root);
    }
  }

  private searchProduct(){
    this.productService.getProduct(this.id).pipe(
      catchError(error => {
        if (error) {
          this.toast.error("Hubo un error al buscar el producto", "Error");
          this.router.navigateByUrl(this.routes.root);
        }
        return of(error != null);
      })
    ).subscribe((response: Response) => {
      if(response.status === 200){
        this.product = response.body as Product;
        this.titleService.setTitle(this.product.title)
      }
    })
  }

}

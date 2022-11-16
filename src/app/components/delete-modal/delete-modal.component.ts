import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product';

@Component({
  selector: 'delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit {
  @Input() product!: Product;
  @Output() close = new EventEmitter<boolean>();
  @ViewChild('modal', {read: ElementRef}) private modal!: ElementRef;

  constructor(private productService: ProductService, private toast: ToastrService) { }

  ngOnInit(): void { }

  ngAfterViewInit(){
    this.modal.nativeElement.addEventListener("click", ($event: any) => {
      if($event.target.id === "modal"){
        this.close.emit(true)
      }
    })
  }

  deleteProduct(){
    this.productService.deleteProduct(this.product.id.toString()).pipe(
      catchError(error => {
        if (error) {
          this.toast.error("Hubo un error al eliminar el producto", "Error");
          this.close.emit(true);
        }
        return of(error != null);
      })
    ).subscribe((response: Response) => {
      if(response.status === 200){
        this.toast.success("Producto eliminado con exito", "Producto");
        this.close.emit(true);
      }
    })
  }

  cancel(){
    this.close.emit(true)
  }
}

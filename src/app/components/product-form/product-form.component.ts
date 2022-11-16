import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, lastValueFrom, Observable, of } from 'rxjs';
import { GLOBALS } from 'src/app/enums/globals';
import { AbsoluteRoutes } from 'src/app/enums/routes';
import { ImageResponse } from 'src/app/interfaces/image-response';
import { Product } from 'src/app/interfaces/product';
import { CategoryService } from 'src/app/services/category.service';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  defaultImage: string = GLOBALS.defaultImage;
  private routes = AbsoluteRoutes;
  id: string;
  productForm!: FormGroup;
  action: string = "Agregar";
  thumbnail: string = "";
  private thumbnailEdited: boolean = false;
  thumbnailFile!: File | undefined;
  images: Array<string> = [];
  imagesFiles: File[] = [];
  private imagesEdited: boolean = false;
  fields: Array<string> = [];
  loading: boolean = false;

  constructor(private fb: FormBuilder, private rutaActiva: ActivatedRoute, private router: Router, private productService: ProductService, 
    private categoryService: CategoryService, private imageService: ImageService, private toast: ToastrService, private titleService: Title) {
    this.id = this.rutaActiva.snapshot.queryParamMap.get('id') || "";
    this.setForm();
  }

  ngOnInit(): void {
    this.searchCategories();

    if(this.id){
      this.searchProduct()
    }
    else{
      this.titleService.setTitle(this.action)
    }
  }

  private setForm(){
    this.productForm = this.fb.group({
      title: ["", [Validators.required]],
      brand: ["", [Validators.required]],
      category: ["", [Validators.required]],
      price: ["", [Validators.required, Validators.min(1)]],
      discountPercentage: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
      description: ["", [Validators.required, Validators.maxLength(150)]],
      stock: ["", [Validators.required, Validators.min(0)]]
    })
  }

  private searchCategories(){
    this.categoryService.getCategories().pipe(
      catchError(error => {
        if (error) {
          this.toast.error("Hubo un error al buscar las cateogrias", "Error");
        }
        return of(error != null);
      })
    ).subscribe((response: Response) => {
      if(response.status === 200){
        this.fields = response.body as unknown as Array<string>;
        this.productForm.get('category')?.patchValue(this.fields[0]);
      }
    })
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
        const product = response.body as unknown as Product;
        this.setEditForm(product);
        this.titleService.setTitle(product.title)
      }
    })
  }

  private setEditForm(product: any){
    this.action = "Editar"
    this.productForm.patchValue(product);
    this.thumbnail = product.thumbnail;
    this.images = product.images;
  }

  sendFormData(){
    if(this.id){
      this.sendEditData()
    }
    else{
      this.sendAddData()
    }
  }

  private async uploadImage(formData: any){
    try {
      const response: Observable<Response> = this.imageService.uploadImage(formData);
      const data: Response = await lastValueFrom(response);

      if(data.status === 200){
        return (data.body as unknown as ImageResponse).secure_url || "";
      }
    } catch (error) {
      if (error) {
        this.toast.error("Hubo un error al subir una imagen", "Error");
      }
    }

    return "";
  } 

  private async sendAddData(){
    if(this.productForm.invalid || !this.thumbnailFile || this.imagesFiles.length === 0){
      this.toast.warning("Todos los campos son obligatorios, incluso las imagenes", "Error");
      return;
    }

    this.loading = true;

    const formDataThumbnail = new FormData();
    formDataThumbnail.append('file', this.thumbnailFile || "");
    formDataThumbnail.append('upload_preset', GLOBALS.cloudinaryPresetId);
    const url = await this.uploadImage(formDataThumbnail);

    if(url === ""){
      this.toast.error("Hubo un error al subir el thumbnail", "Error");
      return;
    }

    this.thumbnail = url;

    let urls: Array<string> = [];
    for(let i = 0; i < this.images.length; i++){
      const formDataImages = new FormData();
      formDataImages.append('file', this.images[i]);
      formDataImages.append('upload_preset', GLOBALS.cloudinaryPresetId);
      const url = await this.uploadImage(formDataImages);

      if(url === ""){
        this.toast.error("Hubo un error al subir las imagenes", "Error");
        return;
      }

      urls.push(url);
    }
    this.images = urls;

    const product: any = this.productForm.value;

    product.thumbnail = this.thumbnail;
    product.images = this.images;

    this.productService.addProduct(product).pipe(
      catchError(error => {
        if (error) {
          this.toast.error("Hubo un error al buscar el producto", "Error");
          this.loading = false;
        }
        return of(error != null);
      })
    ).subscribe((response: Response) => {
      if(response.status === 200){
        this.toast.success("Producto agregado.", "Producto");
        this.reset();
        this.loading = false;
      }
    })
  }

  private async sendEditData(){
    if(this.productForm.invalid || !this.thumbnail || this.images.length === 0){
      this.toast.warning("Todos los campos son obligatorios, incluso las imagenes", "Error");
      return;
    }

    this.loading = true;

    if(this.thumbnailEdited){
      const formData = new FormData();
      formData.append('file', this.thumbnailFile || "");
      formData.append('upload_preset', GLOBALS.cloudinaryPresetId);
      const url = await this.uploadImage(formData);

      if(url === ""){
        this.toast.error("Hubo un error al subir el thumbnail", "Error");
        return;
      }

      this.thumbnail = url;
    }

    if(this.imagesEdited){
      let urls: Array<string> = [];
      for(let i = 0; i < this.images.length; i++){
        const formDataImages = new FormData();
        formDataImages.append('file', this.images[i]);
        formDataImages.append('upload_preset', GLOBALS.cloudinaryPresetId);
        const url = await this.uploadImage(formDataImages);

        if(url === ""){
          this.toast.error("Hubo un error al subir las imagenes", "Error");
          return;
        }

        urls.push(url);
      }
      this.images = urls;
    }

    const product: any = this.productForm.value;

    product.thumbnail = this.thumbnail;
    product.images = this.images;

    this.productService.updateProduct(this.id, product).pipe(
      catchError(error => {
        if (error) {
          this.toast.error("Hubo un error al buscar los clientes en el servicor", "Error");
          this.loading = false;
        }
        return of(error != null);
      })
    ).subscribe((response: Response) => {
      if(response.status === 200){
        this.toast.success("Producto editado.", "Producto");
        this.loading = false;
        this.router.navigateByUrl(this.routes.root);
      }
    })
  }

  showThumbnail($event: any){
    const file = ($event.target as HTMLInputElement).files;

    if(file && file?.length > 0){
      const reader = new FileReader();
      reader.onload = () => {
        this.thumbnail = reader.result as string;
        this.thumbnailFile = file[0];
        $event.target.value = "";
        if(this.id){
          this.thumbnailEdited = true;
        }
      }
      reader.readAsDataURL(file[0])
    }
  }

  showImages($event: any){
    const file = ($event.target as HTMLInputElement).files;

    if(file && file?.length > 0){
      this.images = [];
      for(let i = 0; i < file.length; i++){
        const reader = new FileReader();
        reader.onload = () => {
          this.images.push(reader.result as string);
          this.imagesFiles.push(file[i]);
          if(this.id){
            this.imagesEdited = true;
          }
          if(i === (file.length - 1)){
            $event.target.value = "";
          }
        }
        reader.readAsDataURL(file[i])
      }
    }
  }

  estiloInput(inputName: string): string{
    let resp = "";

    if(this.productForm.get(inputName)?.invalid && this.productForm.get(inputName)?.touched)
      resp ="red";
    else if(this.productForm.get(inputName)?.valid && this.productForm.get(inputName)?.touched) 
      resp = "green";
    else
      resp = "black";
    
    return resp;
  }

  reset(){
    this.productForm.reset();
    this.productForm.get('category')?.patchValue(this.fields[0])
    this.thumbnail = "";
    this.images = [];
    this.thumbnailFile = undefined;
    this.imagesFiles = [];
  }
}

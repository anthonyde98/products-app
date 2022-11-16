import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIRoutes } from '../enums/routes';
import { Response } from '../interfaces/response';
import { SearchQuery } from '../interfaces/search-query';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  routes = APIRoutes; 
  constructor(private http: HttpClient) { }

  getProductsByText(query: SearchQuery): Observable<any>{
    const dataParam = JSON.parse(JSON.stringify(query));
    const params = new HttpParams({
      fromObject: dataParam,
    });

    return this.http.get<Response>(this.routes.rootDummy + this.routes.products + this.routes.search, {
      params,
      observe: 'response'
    })
  }

  getProductsByCategory(category: string): Observable<any>{
    return this.http.get<Response>(this.routes.rootDummy + this.routes.products + this.routes.category + "/" + category, {
      observe: 'response'
    })
  }

  getProduct(id: string): Observable<any>{
    return this.http.get<Response>(this.routes.rootDummy + this.routes.products + "/" + id, {observe: 'response'})
  }

  addProduct(product: any): Observable<any>{
    return this.http.post<Response>(this.routes.rootDummy + this.routes.products + "/add", product, {observe: 'response'})
  }

  updateProduct(id: string, product: any): Observable<any>{
    return this.http.patch<Response>(this.routes.rootDummy + this.routes.products + "/" + id, product, {observe: 'response'})
  }

  deleteProduct(id: string): Observable<any>{
    return this.http.delete<Response>(this.routes.rootDummy + this.routes.products + "/" + id, {observe: 'response'})
  }
}

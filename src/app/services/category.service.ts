import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIRoutes } from '../enums/routes';
import { Response } from '../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  routes = APIRoutes; 
  constructor(private http: HttpClient) { }

  getCategories(): Observable<any>{
    return this.http.get<Response>(this.routes.rootDummy + this.routes.products + this.routes.categories, {
      observe: 'response'
    })
  }
}

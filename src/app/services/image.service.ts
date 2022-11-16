import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APIRoutes } from '../enums/routes';
import { Response } from '../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  routes = APIRoutes; 
  constructor(private http: HttpClient) { }

  uploadImage(image: any): Observable<any>{
    return this.http.post<Response>(this.routes.imagesCloudinary, image, {
      observe: 'response'
    }).pipe(
      map(response => response)
    );
  }
}

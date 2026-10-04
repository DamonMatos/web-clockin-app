import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marcacion } from '../models/marcacion';

@Injectable({
  providedIn: 'root',
})
export class MarcacionService {

  private http = inject(HttpClient);
  private readonly urlBase = `${environment.api.marcacion.baseUrl}/${environment.api.marcacion.version}`;


  public getById(numerodocumento: string): Observable<Marcacion> {
    const url = `${this.urlBase}/marcacion/${numerodocumento}`;
    return this.http.get<Marcacion>(url);
  }

  public add(marcacion: Marcacion): Observable<Marcacion> {
    const url = `${this.urlBase}/marcacion`;
    return this.http.post<Marcacion>(url, marcacion);
  }
}

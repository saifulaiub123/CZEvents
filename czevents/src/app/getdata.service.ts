import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class GetdataService {
  private _baseUrl: string = environment.apiUrl;

  private apiUrl = `${this._baseUrl}/Events/GetAllEvents`;
  private apiUrl2 = `${this._baseUrl}/Events/GetSpecialEvent/`
  constructor(private http: HttpClient) { }

  fetchEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl, { withCredentials: true });
  }
  getEvent(id: number) {
    return this.http.get<Event[]>(this.apiUrl2+""+id);
  }
  sendData(form: any){
    return this.http.post(`${this._baseUrl}/Events/AddEvent`, form);
  }
  updateEvent(id: any, form: any){
    return this.http.post(`${this._baseUrl}/Events/UpdateEvent/` + id, form);
  }
  deleteEvent(eventId: number){
    return this.http.delete(`${this._baseUrl}/Events/DeleteEvent/${eventId}`);
  }
  login(form: any){
    return this.http.post(`${this._baseUrl}/Events/LoginAdmin`, form);
  }
  addslide(form: any){
    return this.http.post(`${this._baseUrl}/Events/AddSlide`, form);
  }
  getSlides(){
    return this.http.get(`${this._baseUrl}/Events/GetSlides`);
  }
  deleteSlide(id: number){
    return this.http.delete(`${this._baseUrl}/Events/DeleteSlide/${id}`);
  }
  getEventsByCountry(type: any):Observable<Event[]>{
    return this.http.get<Event[]>(`${this._baseUrl}/Events/GetEventByType/${type}`);
  }

}

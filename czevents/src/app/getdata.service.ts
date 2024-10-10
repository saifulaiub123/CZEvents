import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetdataService {
  private apiUrl = 'https://api.ticketconcertcz.com/api/Events/GetAllEvents';
  private apiUrl2 = 'https://api.ticketconcertcz.com/api/Events/GetSpecialEvent/'
  constructor(private http: HttpClient) { }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }
  getEvent(id: number) {
    return this.http.get<Event[]>(this.apiUrl2+""+id);
  }
  sendData(form: any){
    return this.http.post('https://api.ticketconcertcz.com/api/Events/AddEvent', form);
  }
  updateEvent(id: any, form: any){
    return this.http.post('https://api.ticketconcertcz.com/api/Events/UpdateEvent/' + id, form);
  }
  deleteEvent(eventId: number){
    return this.http.delete(`https://api.ticketconcertcz.com/api/Events/DeleteEvent/${eventId}`);
  }
  login(form: any){
    return this.http.post('https://api.ticketconcertcz.com/api/Events/LoginAdmin', form);
  }
  addslide(form: any){
    return this.http.post('https://api.ticketconcertcz.com/api/Events/AddSlide', form);
  }
  getSlides(){
    return this.http.get('https://api.ticketconcertcz.com/api/Events/GetSlides');
  }
  deleteSlide(id: number){
    return this.http.delete(`https://api.ticketconcertcz.com/api/Events/DeleteSlide/${id}`);
  }
  getEventsByCountry(type: any):Observable<Event[]>{
    return this.http.get<Event[]>(`https://api.ticketconcertcz.com/api/Events/GetEventByType/${type}`);
  }

}

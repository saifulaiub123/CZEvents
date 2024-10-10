import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventFilterService {
  private dataSubject = new BehaviorSubject<any>(null);
  data$: Observable<any> = this.dataSubject.asObservable();

  private wordSubject = new BehaviorSubject<any>(null);
  word$: Observable<any> = this.wordSubject.asObservable();
  
  constructor() { }

  sendData(data: any) {
    this.dataSubject.next(data);
  }

  sendWord(data: any){
    this.wordSubject.next(data)
  }
}

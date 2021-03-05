import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private page: BehaviorSubject<Array<{title, text}>>;

  constructor() {
    this.page = new BehaviorSubject<Array<{title, text}>>([]);
  }

  public setPage(page: Array<{title, text}>)  {
    this.page.next(page);
  }

  public getPage(): Observable<Array<{title, text}>> {
    return this.page.asObservable();
  }
}

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  private nav: BehaviorSubject<{name, value}>;
  private navItems: BehaviorSubject<Array<{name, values}>>;

  constructor() { 
    this.nav = new BehaviorSubject<{name, value}>({name: "Landing", value: {text: "Fifth Hack", symbol: 'icon'} });
    this.navItems = new BehaviorSubject<Array<{name, values}>>([{name: "Rules", values: [{text: "Basic Rules", symbol: 'icon'}] }]);
  }

  public setNav(nav: {name, value})  {
    this.nav.next(nav);
  }

  public getNav(): Observable<{name, value}> {
    return this.nav.asObservable();
  }

  public setNavItems(navItems: Array<{name, values}>)  {
    this.navItems.next(navItems);
  }

  public getNavItems(): Observable<Array<{name, values}>> {
    return this.navItems.asObservable();
  }
}

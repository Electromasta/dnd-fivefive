import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DnD 5.5e';
  viewName = '/';

  navItems = [
    { name: "Core Rules", values: ["1 - Item 1", "1 - Item 2"] },
    { name: "Classes", values: ["2 - Item 1", "2 -Item 2"] },
    { name: "Spells & Feats", values: ["3 - Item 1", "3 - Item 2"] },
    { name: "Game Mastery", values: ["4 - Item 1", "4 - Item 2"] },
    { name: "Encounters", values: ["5 - Item 1", "5 - Item 2"] }
  ];

  constructor(private router: Router) {};

  changeOfRoutes()  {
    if  (this.router.url === "/" || this.router.url === "/hero")  {
      this.viewName = "/"
    } else  {
      this.viewName = "/notfound"
    }
  }
}

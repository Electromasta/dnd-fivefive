import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NavService } from './services/nav.service';
import { ReadcsvService } from './services/readcsv.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Fifth Hack';
  viewName: string = '/';

  bookmark: {name, value};
  navItems: Array<{name, values}> = [];

  constructor(private router: Router, private readcsvService: ReadcsvService, private navService: NavService) {};

  ngOnInit(): void {
    this.navService.getNav().subscribe(bookmark => {
      this.bookmark = bookmark;
    });

    this.readcsvService.readCSVFile('navigationbar').subscribe(csv => {
      this.readcsvService.parseCSV(csv).subscribe(table => {

        // Push Nav CSV Data to Nav Items List
        for (let i = 0; i < table.rows.length; i++)  {
          var list = [];

          table.cells[i].forEach(cell => {
            if ("" !== cell)  {
              var c = cell.split('|')
              list.push({text: c[0], symbol: c[1]}); 
            }
          });

          this.navItems.push({ name: table.rows[i], values: list });
        };
        this.navService.setNavItems(this.navItems);
      });
    });
  }

  onNavClick(name, item)  {
    this.navService.setNav({ name: name, value: item });
  }

  isLanding() {
    return "Landing" === this.bookmark.name;
  }

  changeOfRoutes()  {
    if  (this.router.url === "/" || this.router.url === "/hero")  {
      this.viewName = "/";
    } else  {
      this.viewName = "/notfound";
    }
  }
}

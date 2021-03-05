import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';

import { NavService } from '../services/nav.service';
import { PageService } from '../services/page.service';
import { ReadcsvService } from '../services/readcsv.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {
  bookmark: {name, value};
  pages: Array<{title, text}>;
  navItems: Array<{name, values}>;
  popover: {show, poptext, top, right} = { show: false, poptext: "", top: "0px", right: "0px"};
  view: {width, height} = { width: 0, height: 0 };

  tables = [];

  dictionary = {
    "usage dice": "This is an example of a Popover tooltip.  This Popover contains text related to the term 'Usage Dice'",
    "DC": "Difficulty Class"
  };

  @ViewChild('popoverthing') popoverElement: ElementRef;

  constructor(private elementRef: ElementRef, private navService: NavService, private pageService: PageService, private readcsvService: ReadcsvService) { }

  ngOnInit(): void {
    this.navService.getNav().subscribe(bookmark => {
      this.bookmark = bookmark;
      this.getPage(bookmark);
    });

    this.navService.getNavItems().subscribe(navItems => {
      this.navItems = navItems;
    });

    this.pageService.getPage().subscribe(pages => {
      this.pages = pages;
    });

    this.view = { width: window.outerWidth, height: window.outerHeight };
  }

  getPage(bookmark) {
    this.readcsvService.readCSVFile(bookmark.name.replace(/ /g,'').toLowerCase() + "/" + bookmark.value.text.replace(/ /g,'').toLowerCase()).subscribe(csv => {
      this.readcsvService.parseCSV(csv).subscribe(table => {
        var pages = [];

        for (let i = 0; i < table.rows.length; i++)  {
          var pieces = this.applyDictionary(table.cells[i][0]).split('|');
          var spans = [];
          for (let x = 0; x < pieces.length; x++)  {
            if (x%2 === 0) spans.push({type: 'p', data: pieces[x]});
            else  spans.push({type: 'h', data: pieces[x]});
          }
          pages.push({ title: ('.' === table.rows[i]) ? "" : table.rows[i], text: spans, tablename: this.getTable(table.cells[i][1]) });
        }
        this.pageService.setPage(pages);
      });
    }, error => {
      this.pageService.setPage([{title: "Not Found", text: [{type: 'p', data: "File was not Found."}]}]);
    });
  }

  applyDictionary(text) {
    var dictatedtext = text;
    Object.keys(this.dictionary).forEach(key => {
      dictatedtext = dictatedtext.replace(new RegExp(key, 'g'), "|" + key.toString() + "|");
    });
    return dictatedtext;
  }

  getTable(tableName)  {
    var name = "";

    if (tableName && tableName.length > 0) {
      this.tables[tableName] = {rows: [], columns: [], cells: []};
      name = tableName;
      this.readcsvService.readCSVFile("tables/" + tableName.substring(1, tableName.length)).subscribe(csv => {
        this.readcsvService.parseCSV(csv).subscribe(table => {
          table.columns.pop();
          table.cells.forEach(element => {
            element.pop();
          });
          this.tables[tableName] = table;
        });
      });
    }

    return name;
  }

  isHidden(hook: string)  {
    var hidden = true;

    if ("landinghook" === hook && "Landing" === this.bookmark.name ) {
      hidden = false;
    } else  if ("encounterhook" === hook && "Encounters" === this.bookmark.name ) {
      hidden = false;
    } else if ( ("landinghook" !== hook && "encounterhook" !== hook) && ("Landing" !== this.bookmark.name && "Encounters" !== this.bookmark.name) )  {
      hidden = false;
    }

    return hidden;
  }

  onNavClick(name, item)  {
    this.navService.setNav({ name: name, value: item });
  }

  hover(event) {
    this.popover.show = true;
    this.popover.poptext = event.target.innerText;
    this.popover.top = (event.target.offsetTop+17) + "px";

    var calcRight = (this.view.width)-(event.target.offsetLeft+180);

    if (calcRight + 320 > this.view.width)  calcRight = (this.view.width)-340;

    this.popover.right = calcRight + "px";//event.target.offsetLeft
  }

  unhover() {
    this.popover.show = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.view = { width: window.outerWidth, height: window.outerHeight };
  }

}

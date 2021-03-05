import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, from } from 'rxjs';
import { GridRowStyleBuilder } from '@angular/flex-layout/grid/typings/row/row';

import { version } from '../../../package.json';

@Injectable({
  providedIn: 'root'
})
export class ReadcsvService {

  headers = new Headers({
    'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  constructor(private http: HttpClient) {}

  public readCSVFile(filename: string): Observable<any> {
    return this.http.get("./assets/csv/" + filename + ".csv", {responseType: 'text', headers: {'Cache-Control': 'no-cache'}});
  }

  public parseCSV(csv: string): Observable<any> {
    var table = { columns: [], rows: [], cells: [] };
    var r = csv.split('\r\n');

    for (let i = 0; i < r.length; i++)  {
      var row = [];
      var splitChar = (/,"/.test(r[i])) ? ',"' : ',';
      var c = r[i].split(splitChar);
      for (let j = 0; j < c.length; j++)  {
        if ( i === 0 )                  { table.columns.push(c[j]); } 
        else if ( j === 0 )             { table.rows.push(c[j]); } 
        else if ( j === c.length-1 )    { row.push(c[j].slice(0, -1)); }
        else                            { row.push(c[j]); }
      }
      if ( i !== 0 )  table.cells.push(row);
    }

    return from([table]);
  }
}

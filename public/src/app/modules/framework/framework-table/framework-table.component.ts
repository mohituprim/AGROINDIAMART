import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'fw-framework-table',
  templateUrl: './framework-table.component.html',
  styleUrls: ['./framework-table.component.css']
})
export class FrameworkTableComponent {
  @Input() dataSourceInput:any;
  // displayedColumns = ['id', 'productCode'];
  // exampleDatabase = new ExampleDatabase();
  // dataSource: ExampleDataSource | null;
displayedColumns = ['id', 'name', 'progress'];
test=[{color:"yellow", id:"1",name:"Atticus I.",progress:"30"}];
exampleDatabase:any;
dataSource: ExampleDataSource | null;
constructor(){
  this.exampleDatabase = new ExampleDatabase(this.test);

}
  ngOnInit() {
    console.log(this.exampleDatabase);
    this.dataSource = new ExampleDataSource(this.exampleDatabase);
  }
  getColumnHeaderName(item:string){
    return item.toUpperCase();
  }
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get data(): any[] { return this.dataChange.value; }

  constructor(test:any) {
    // Fill up the database with 100 users.
    console.log(this);
    for (let i = 0; i < 1; i++) { this.addUser(test); }
  }

  /** Adds a new user to the database. */
  addUser(test:any) {
    const copiedData = this.data.slice();

    //copiedData.push({color:"yellow", id:"1",name:"Atticus I.",progress:"30"});
    //copiedData.push({color:"yellow", id:"1",name:"Atticus I.",progress:"30"});
    copiedData.push(test);
    console.log(copiedData);
    this.dataChange.next(copiedData);
  }
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleDataSource extends DataSource<any> {
  constructor(private _exampleDatabase: ExampleDatabase) {
    super();
        console.log('exd');
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this._exampleDatabase.dataChange;
  }

  disconnect() {}
}

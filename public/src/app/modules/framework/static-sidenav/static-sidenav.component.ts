import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fw-static-sidenav',
  templateUrl: './static-sidenav.component.html',
  styleUrls: ['./static-sidenav.component.css']
})
export class StaticSidenavComponent implements OnInit {
  @Input() itemList: any;
  constructor() { }

  ngOnInit() {
  }

}

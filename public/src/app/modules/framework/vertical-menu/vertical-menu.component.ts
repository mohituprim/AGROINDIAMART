import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';


@Component({
  selector: 'fw-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.css']
})
export class VerticalMenuComponent implements OnInit {

  @Input() itemList: any;

  constructor() { }

  ngOnInit() {
  }
}

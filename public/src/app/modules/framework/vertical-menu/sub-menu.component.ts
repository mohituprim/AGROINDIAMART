import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';


@Component({
  selector: 'fw-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./vertical-menu.component.css'],
  animations: [
    trigger('listAnimation', [
       //...
    ])
  ]
})
export class SubMenuComponent implements OnInit {

  @Input() subMenu: any;
  constructor() { }

  ngOnInit() {
    this.showSubItems();
    this.toggleSubMenu();
  }
  subItems = [];

  showSubItems() {
    this.subItems = this.subMenu.subMenuItem;
  }

  hideSubItems() {
    this.subItems = [];
  }

  toggleSubMenu() {
    this.subItems.length ? this.hideSubItems() : this.showSubItems();
  }
}
trigger('listAnimation', [
  transition('* => *', [ // each time the binding value changes
    query(':leave', [
      stagger(100, [
        animate('0.5s', style({ opacity: 0 }))
      ])
    ]),
    query(':enter', [
      style({ opacity: 0 }),
      stagger(100, [
        animate('0.5s', style({ opacity: 1 }))
      ])
    ])
  ])
])

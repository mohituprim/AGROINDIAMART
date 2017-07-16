import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'fw-empty-order-cart',
  templateUrl: './empty-order-cart.component.html',
  styleUrls: ['./empty-order-cart.component.css'],
  animations: [
    trigger('flyInOut', [
      // state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({ transform: 'translateX(-100%)', left: +500 }),
        animate("200ms ease-in-out",
          style({
            left: 200,
            opacity: 1.0,
            zIndex: 2
          }))
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class EmptyOrderCartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

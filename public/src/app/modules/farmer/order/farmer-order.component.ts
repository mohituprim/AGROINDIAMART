import { Component, OnInit, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-farmer-order',
  templateUrl: './farmer-order.component.html',
  styleUrls: ['./farmer-order.component.css'],
  animations: [
  trigger('flyInOut', [
    // state('in', style({transform: 'translateX(0)'})),
    transition('void => *', [
      style({transform: 'translateX(-100%)', left: +500}),
      animate("200ms ease-in-out",
                            style({
                                left: 200,
                                opacity: 1.0,
                                zIndex: 2
                            }))
    ]),
    transition('* => void', [
      animate(100, style({transform: 'translateX(100%)'}))
    ])
  ])
]
})
export class FarmerOrderComponent implements OnInit {

  animationState="in"
  constructor() { }

  ngOnInit() {
  }

}

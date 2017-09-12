import { Component, OnInit } from '@angular/core';
import { ICarouselConfig, AnimationConfig } from 'angular4-carousel';
import {PlatformLocation  } from '@angular/common';

@Component({
  selector: 'app-default-content',
  templateUrl: './default-content.component.html',
  styleUrls: ['./default-content.component.css']
})
export class DefaultContentComponent implements OnInit {

  baseImgPath:string;
  constructor(private platformLocation: PlatformLocation) { 
        this.baseImgPath=this.platformLocation.pathname + "assets/img/crop3.jpg";
  }

  ngOnInit() {

  }

  public imageSources: string[] = [
      "http://fakeimg.pl/800x400/?text=Hello",
     "http://fakeimg.pl/800x400/?text=Hello",
     "http://fakeimg.pl/800x400/?text=Hello",
  ];
  
  public config: ICarouselConfig = {
    verifyBeforeLoad: true,
    log: false,
    animation: true,
    animationType: AnimationConfig.SLIDE,
    autoplay: true,
    autoplayDelay: 2000,
    stopAutoplayMinWidth: 768
  };

  tiles = [
    {text: 'One', cols: 1, rows: 1, color: '#f3f3f3;'},
    {text: 'Two', cols: 1, rows: 1, color: '#f3f3f3;'},
    {text: 'Three', cols: 1, rows: 1, color: '#f3f3f3;'},
    {text: 'Four', cols: 1, rows: 1, color: '#f3f3f3;'},
    {text: 'Five', cols: 1, rows: 1, color: '#f3f3f3;'},
    {text: 'Six', cols: 1, rows: 1, color: '#f3f3f3;'},
  ];

        subMenuItems = [
                    {name:'Agriculture Product', link:'/farmer/order/buy', cols: 1, rows: 1},
                    {name:'Machinary', link:'/farmer/order/sell', cols: 1, rows: 1},
                    {name:'Fertilizer', link:'/farmer/order/services', cols: 1, rows: 1},
                    {name:'Agriculture Land', link:'/farmer/order/rent', cols: 1, rows: 1},
                  ]

}

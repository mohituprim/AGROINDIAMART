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

}

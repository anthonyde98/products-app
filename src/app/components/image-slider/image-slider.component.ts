import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent implements OnInit {
  @Input() images: Array<string> = [];

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { Stars } from 'src/app/enums/icons';

@Component({
  selector: 'stars-rating',
  templateUrl: './stars-rating.component.html',
  styleUrls: ['./stars-rating.component.css']
})
export class StarsRatingComponent implements OnInit {
  @Input() rating: number = 0;
  fullStars: Array<any> = [];
  halfStar: boolean = false;
  emptyStars: Array<any> = [];
  starsIcons = Stars;

  constructor() { }

  ngOnInit(): void {
    this.fullStars = new Array(Math.floor(this.rating));
    this.halfStar = (this.rating - Math.floor(this.rating)) > 0;
    this.emptyStars = new Array(5 - Math.ceil(this.rating));
  }

}

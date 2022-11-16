import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'btn-scroll-top',
  templateUrl: './btn-scroll-top.component.html',
  styleUrls: ['./btn-scroll-top.component.css']
})
export class BtnScrollTopComponent implements OnInit {
  windowScrolled: boolean = false;
  
  constructor() {}

  @HostListener("window:scroll", []) onWindowScroll() {
    this.scrollFunction();
  }
    
  private scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20){
      this.windowScrolled = true;
    } 
    else{
      this.windowScrolled = false;
    }
  }
  
  topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  } 
  
  ngOnInit() {}
}
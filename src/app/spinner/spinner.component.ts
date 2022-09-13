import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-gif',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public showProgressBar: boolean = false;
  @Input("progressValue") public progressValue: number;
  @Input("showProgress") public showProgress: boolean;

  showProgressBarfn(){
    this.showProgressBar = true;
  }
}

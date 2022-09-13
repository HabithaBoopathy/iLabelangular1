import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PrintedCosting } from '../../../models/printedCosting';

@Component({
  selector: 'app-printed',
  templateUrl: './printed.component.html',
  styleUrls: ['./printed.component.css'],
})
export class PrintedComponent implements OnInit {
  //costing obj
  costing: PrintedCosting;

  constructor(private router: Router) {
    this.costing = new PrintedCosting();
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  back() {
    // this.router.navigate(['/home/uforms', this.costing.orderId]);
  }

  ngOnInit(): void {}
}

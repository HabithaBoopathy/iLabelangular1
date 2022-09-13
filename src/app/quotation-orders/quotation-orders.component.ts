import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { QuotationForm } from '../models/QuotationForm';
import { QuotationService } from '../services/orderForms/quotation.service';

@Component({
  selector: 'app-quotation-orders',
  templateUrl: './quotation-orders.component.html',
  styleUrls: ['./quotation-orders.component.css'],
})
export class QuotationOrdersComponent implements OnInit {
  quotation: QuotationForm = new QuotationForm();
  quotationObservable: Observable<QuotationForm[]>;
  p: number = 1;
  searchText: string;

  constructor(
    private router: Router,
    private quotationService: QuotationService
  ) {}

  ngOnInit() {
    this.quotationService.getQuotationList().subscribe((data) => {
      this.quotation = data;

      this.reloadData();
    });
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initializion
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  back() {
    this.router.navigate(['/home/dashboard']);
  }

  createRoute() {
    this.router.navigate(['/home/quotation']);
  }

  updateQuotationRoute(id) {
    this.router.navigate(['/home/quotation', id]);
  }

  reloadData() {
    this.quotationObservable = this.quotationService.getQuotationList();
  }

  deleteQuotation(id: number) {
    this.quotationService.deleteQuotation(id).subscribe(
      (data) => {
        console.log(data);
        this.reloadData();
      },
      (error) => console.log(error)
    );
  }
}

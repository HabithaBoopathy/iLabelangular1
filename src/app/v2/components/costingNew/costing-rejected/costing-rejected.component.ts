import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonDetailsCosting } from '../model/common-details-costing';
import { CostingService } from '../services/costing.service';

@Component({
  selector: 'app-costing-rejected',
  templateUrl: './costing-rejected.component.html',
  styleUrls: ['./costing-rejected.component.css'],
})
export class CostingRejectedComponent implements OnInit {
  searchText: string;

  commonDetails: CommonDetailsCosting[];

  statusReference: number;

  currentPage: number = 1;

  constructor(private costingService: CostingService, private router: Router) {}

  ngOnInit(): void {
    this.costingService.getCommonDetailsRejectedByCustomer().subscribe(
      (data) => {
        this.commonDetails = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  redirect(trimType, id) {
    if (trimType == 'Woven') {
      this.router.navigate([
        '/home/wovenCosting',
        id,
        { previousPage: 'costingRejected' },
      ]);
    } else if (trimType == 'Printed') {
      this.router.navigate([
        '/home/printedCosting',
        id,
        { previousPage: 'costingRejected' },
      ]);
    } else if (trimType == 'Tag') {
      this.router.navigate([
        '/home/tagCosting',
        id,
        { previousPage: 'costingRejected' },
      ]);
    } else if (trimType == 'Sticker-Flexo') {
      this.router.navigate([
        '/home/stickerFlexoCosting',
        id,
        { previousPage: 'costingRejected' },
      ]);
    } else if (trimType == 'Sticker-Offset') {
      this.router.navigate([
        '/home/stickerOffsetCosting',
        id,
        { previousPage: 'costingRejected' },
      ]);
    }
  }
}

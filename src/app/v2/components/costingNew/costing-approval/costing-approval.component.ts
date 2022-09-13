import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonDetailsCosting } from '../model/common-details-costing';
import { CostingService } from '../services/costing.service';
@Component({
  selector: 'app-costing-approval',
  templateUrl: './costing-approval.component.html',
  styleUrls: ['./costing-approval.component.css'],
})
export class CostingApprovalComponent implements OnInit {
  searchText: string;

  commonDetails: CommonDetailsCosting[];

  statusReference: number;

  currentPage: number = 1;

  constructor(private costingService: CostingService, private router: Router) {}

  ngOnInit(): void {
    this.costingService.getCommonDetailsWaitingForApproval().subscribe(
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
        { previousPage: 'costingApproval' },
      ]);
    } else if (trimType == 'Printed') {
      this.router.navigate([
        '/home/printedCosting',
        id,
        { previousPage: 'costingApproval' },
      ]);
    } else if (trimType == 'Tag') {
      this.router.navigate([
        '/home/tagCosting',
        id,
        { previousPage: 'costingApproval' },
      ]);
    } else if (trimType == 'Sticker-Flexo') {
      this.router.navigate([
        '/home/stickerFlexoCosting',
        id,
        { previousPage: 'costingApproval' },
      ]);
    } else if (trimType == 'Sticker-Offset') {
      this.router.navigate([
        '/home/stickerOffsetCosting',
        id,
        { previousPage: 'costingApproval' },
      ]);
    }
  }
}

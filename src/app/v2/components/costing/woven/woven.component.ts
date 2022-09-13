import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Everything } from 'src/app/models/orderForms/Everything';
import { EverythingService } from 'src/app/services/orderForms/everything.service';
import { WovenCosting } from '../../../models/wovenCosting';
import { CostingService } from '../../../services/costing.service';
import { SnackBarService } from 'src/app/services/snackBar.service';

@Component({
  selector: 'app-woven',
  templateUrl: './woven.component.html',
  styleUrls: ['./woven.component.css'],
})
export class WovenComponent implements OnInit {
  //order obj
  order: Everything;

  //wovenCosting obj
  costing: WovenCosting;

  //flag for existing costing sheet check
  isNew: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private everythingService: EverythingService,
    private costingService: CostingService,
    private snackBarService: SnackBarService
  ) {
    this.costing = new WovenCosting();
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
    this.router.navigate(['/home/uforms', this.costing.orderId]);
  }

  ngOnInit(): void {
    this.costing.orderId = this.route.snapshot.params['id'];
    this.costingService.getWovenByOrderId(this.costing.orderId).subscribe(
      (data) => {
        if (data == null) {
          //use details from orders master
          this.fetchOrderDetails();
        } else {
          //use details from costingWoven (data received)
          this.isNew = false;
          this.costing = data;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  fetchOrderDetails() {
    this.everythingService.getById(this.costing.orderId).subscribe(
      (data) => {
        this.order = data;
        this.assignOrderDetails();
      },
      (err) => console.log(err)
    );
  }

  assignOrderDetails() {
    this.costing.quotationNo = this.order.refNo;
    this.costing.customerName = this.order.name;
    this.costing.estimatedQuantity = Number(this.order.expectedQuantity);
    this.costing.labelName = this.order.sampName;

    //convert to CM
    switch (this.order.unit) {
      case 'CM':
        this.costing.labelWidth = Number(this.order.unitWidth);
        this.costing.labelLength = Number(this.order.unitHeight);
        break;
      case 'INCHES':
        this.costing.labelWidth = Number(this.order.unitWidth) * 2.54;
        this.costing.labelLength = Number(this.order.unitHeight) * 2.54;
        break;
      case 'MM':
        this.costing.labelWidth = Number(this.order.unitWidth) / 10;
        this.costing.labelLength = Number(this.order.unitHeight) / 10;
        break;
      default:
        this.costing.labelWidth = Number(this.order.unitWidth);
        this.costing.labelLength = Number(this.order.unitHeight);
        break;
    }

    this.costing.totalPicks = Number(this.order.totalpicks)
      ? Number(this.order.totalpicks)
      : null;
    this.costing.noOfRepeats = Number(this.order.noOfRepeats);
    this.costing.rpmRaiper = 450;
    this.costing.rpmAirjet = 700;
    if (this.costing.totalPicks) {
      this.calcLabelCost();
    }
  }

  roundToTwo(num): number {
    return +(Math.round(Number(num + 'e+2')) + 'e-2');
  }

  calcLabelCost() {
    this.costing.hrRaiper = this.roundToTwo(
      (this.costing.rpmRaiper / this.costing.totalPicks) * 48 * 60
    );
    this.costing.hrAirjet = this.roundToTwo(
      (this.costing.rpmAirjet / this.costing.totalPicks) *
        this.costing.noOfRepeats *
        60
    );
    this.costing.labelCostRaiper = this.roundToTwo(
      1350 / this.costing.hrRaiper
    );
    this.costing.labelCostAirjet = this.roundToTwo(
      1900 / this.costing.hrAirjet
    );
    this.calcEstimateCost();
  }

  calcEstimateCost() {
    this.costing.estimateCostRaiper =
      this.costing.labelCostRaiper +
      this.costing.additionalWork +
      this.costing.productionCost +
      this.costing.qcAndPackingCost +
      this.costing.adminCost +
      this.costing.profit;

    this.costing.estimateCostAirjet =
      this.costing.labelCostAirjet +
      this.costing.additionalWork +
      this.costing.productionCost +
      this.costing.qcAndPackingCost +
      this.costing.adminCost +
      this.costing.profit;
  }

  save() {
    this.costingService.createWoven(this.costing).subscribe(
      (data) => {
        this.snackBarService.showSuccessSnack(
          'Costing Sheet saved successfully'
        );
        this.back();
      },
      (err) => console.log(err)
    );
  }

  update() {
    this.costingService.updateWoven(this.costing).subscribe(
      (data) => {
        this.snackBarService.showSuccessSnack(
          'Costing Sheet updated successfully'
        );
        this.back();
      },
      (err) => console.log(err)
    );
  }
}

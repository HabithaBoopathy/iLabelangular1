import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private CostingOrderId = '';

  setCostingOrderId(id) {
    this.CostingOrderId = id;
  }

  getCostingOrderId(): string {
    return this.CostingOrderId;
  }
}

export class Territory {
  id: string;
  name: string;
  isActive: boolean;
  executiveIds: string[];

  constructor() {
    this.id = '';
    this.name = '';
    this.isActive = true;
    this.executiveIds = [];
  }
}

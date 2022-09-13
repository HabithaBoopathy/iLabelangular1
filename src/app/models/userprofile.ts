export class Userprofile {
  // User Profile Variables
  id: number;
  username: string;
  loginId: string;
  password: string;
  accessRights: string;
  trimTypes: string[];
  customerName: string;
  //except the value "deactivated" for all other values, status is considered enabled
  status: string;
  territoryId: string[];
  superUser: boolean;

  constructor() {
    this.id = null;
    this.username = '';
    this.loginId = '';
    this.password = '';
    this.accessRights = '';
    this.customerName = '';
    this.status = '';
    this.trimTypes = [];
    this.territoryId = [];
    this.superUser = false;
  }
}

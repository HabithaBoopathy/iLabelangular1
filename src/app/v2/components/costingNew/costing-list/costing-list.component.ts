import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonDetailsCosting } from '../model/common-details-costing';
import { CostingService } from '../services/costing.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { MexecutiveService } from 'src/app/services/mexecutive.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { UserService } from 'src/app/services/user.service';
import { Userprofile } from 'src/app/models/userprofile';
import { TagCosting } from '../model/tag-costing';
import { SnackBarService } from 'src/app/services/snackBar.service';
import { PrintedCosting } from '../model/printed-costing';
import { WovenCosting } from '../model/woven-costing';
import { StickerFlexoCosting } from '../model/sticker-flexo-costing';
import { StickerOffsetCosting } from '../model/sticker-offset-costing';
import { Employee } from 'src/app/models/employee';

@Component({
  selector: 'app-costing-list',
  templateUrl: './costing-list.component.html',
  styleUrls: ['./costing-list.component.css'],
})
export class CostingListComponent implements OnInit {
  searchText: string;
  //modal vars
  modalReference: NgbModalRef;

  p: number = 1;

  commonDetails: CommonDetailsCosting[];
  accessType: string;
  archivedFlag: boolean = false;

  stickerTypesDisplay: boolean = false;
  disableSaveBtn: boolean = false;
  costing: WovenCosting;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private costingService: CostingService,
    private mExecutiveService: MexecutiveService,
    private mEmployeeService: EmployeeService,
    private userService: UserService,
    private snackBarService: SnackBarService
  ) {
    this.accessType = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.showActiveCosting();
  }

  showActiveCosting() {
    this.archivedFlag = false;

    if (this.accessType == 'Administrator') {
      this.costingService.getAllCommonDetails().subscribe(
        (data) => {
          data.sort(this.compare);
          this.commonDetails = data;
        },
        (err) => console.log(err)
      );
    } else if (this.accessType == 'Sample Head') {
      this.userService
        .getUserByLoginId(localStorage.getItem('emailToken'))
        .subscribe(
          (data: Userprofile) => {
            //a bug and thus array value may contain Print instead of Printed
            let printIndex = data.trimTypes.indexOf('Print');
            if (printIndex !== -1) {
              data.trimTypes[printIndex] = 'Printed';
            }

            let stickerIndex = data.trimTypes.indexOf('Sticker');
            if (stickerIndex !== -1) {
              data.trimTypes.push('Sticker-Flexo');
              data.trimTypes.push('Sticker-Offset');
            }

            this.costingService
              .getAllCommonDetailsForSampleHead(data.trimTypes)
              .subscribe(
                (data) => {
                  data.sort(this.compare);
                  this.commonDetails = data;
                },
                (err) => {
                  alert('Error - Unable to fetch data for current executive');
                  console.log(err);
                }
              );
          },
          (err) => {
            alert('Error - Unable to fetch data for current executive');
            console.log(err);
          }
        );
    } else if (this.accessType == 'Sales Team') {
      this.mExecutiveService
        .getByExecutiveEmail(localStorage.getItem('emailToken'))
        .subscribe(
          (data) => {
            this.costingService
              .getAllCommonDetailsForExecutive(data['id'])
              .subscribe(
                (data) => {
                  data.sort(this.compare);
                  this.commonDetails = data;
                },
                (err) => {
                  alert('Error - Unable to fetch data for current executive');
                  console.log(err);
                }
              );
          },
          (err) => {
            alert('Error - Unable to fetch data for current executive');
            console.log(err);
          }
        );
    } else if (this.accessType == 'TManager') {
      this.costingService
        .getAllCommonDetailsForTManager(localStorage.getItem('id'))
        .subscribe(
          (data) => {
            data.sort(this.compare);
            this.commonDetails = data;
          },
          (err) => {
            this.snackBarService.showWarningSnack(
              "Couldn't fetch costing details for the current user"
            );
            console.log(err);
          }
        );
    } else if (this.accessType == 'Customer') {
      this.mEmployeeService
        .getCustomerEmail(localStorage.getItem('emailToken'))
        .subscribe(
          (data: Employee) => {
            this.costingService
              .getAllCommonDetailsForCustomer(String(data.id))
              .subscribe(
                (data) => {
                  data.sort(this.compare);
                  this.commonDetails = data;
                },
                (err) => {
                  this.snackBarService.showWarningSnack(
                    "Couldn't fetch costing details for the current user"
                  );
                  console.log(err);
                }
              );
          },
          (err) => {
            this.snackBarService.showWarningSnack('Error: Invalid UserID');
            console.log(err);
          }
        );
    }
  }

  showArchivedCosting() {
    this.archivedFlag = true;
    if (this.accessType == 'Administrator') {
      this.costingService.getArchivedCommonDetails().subscribe(
        (data) => {
          this.commonDetails = data;
          data.sort(this.compare);
        },
        (err) => console.log(err)
      );
    }
  }

  compare(a, b) {
    if (a.id < b.id) {
      return 1;
    }
    if (a.id > b.id) {
      return -1;
    }
    return 0;
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

  create() {}

  open(content) {
    this.stickerTypesDisplay = false;
    this.modalReference = this.modalService.open(content, {
      backdrop: 'static',

      centered: true,
      ariaLabelledBy: 'modal-basic-title',

      windowClass: 'modalWidth',
    });
    this.modalReference.result.then(
      (result) => {
        // this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  f1() {
    alert('open modal');
  }

  f2() {
    alert('remove filter');
  }

  @ViewChild('fullScreen') divRef;
  openFullscreen() {
    // Use this.divRef.nativeElement here to request fullscreen
    const elem = this.divRef.nativeElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  }

  redirect(trimType: string, id = 'new') {
    switch (trimType) {
      case 'Woven':
        this.router.navigate([
          '/home/wovenCosting',
          id,
          { previousPage: 'costingList' },
        ]);
        break;
      case 'Printed':
        this.router.navigate([
          '/home/printedCosting',
          id,
          { previousPage: 'costingList' },
        ]);
        break;
      case 'Tag':
        this.router.navigate(['/home/tagCosting', id]);
        break;
      case 'Sticker-Flexo':
        this.router.navigate([
          '/home/stickerFlexoCosting',
          id,
          { previousPage: 'costingList' },
        ]);
        break;
      case 'Sticker-Offset':
        this.router.navigate([
          '/home/stickerOffsetCosting',
          id,
          { previousPage: 'costingList' },
        ]);
        break;
      default:
        console.warn('Invalid Trim Type Input', trimType);
        alert(
          'Costing sheet for trim type - Heat Transfer is under development'
        );
        break;
    }
    if (document.getElementById('modalCloseBtn') != null) {
      this.closeModal();
    }
  }

  closeModal() {
    document.getElementById('modalCloseBtn').click();
  }

  work() {
    alert('Work In Progress. Please check it out later');
  }

  displayTrimTpe(trimType: string): string {
    console.log(trimType);
    return trimType;
  }

  confirmDuplicateCreation(
    totalDetailsId: string,
    trimType: string,
    refNo: string
  ) {
    let flag = confirm(`Are you sure to duplicate the costing: ${refNo}?`);
    if (flag) {
      this.createDuplicate(totalDetailsId, trimType);
    }
  }

  createDuplicate(totalDetailsId: string, trimType: string) {
    if (trimType == 'Tag') {
      this.costingService.getTagByid(totalDetailsId).subscribe(
        (data) => {
          let tagCosting: TagCosting = data;
          tagCosting.id = null;
          tagCosting.status = 0;
          this.costingService.createTag(tagCosting).subscribe(
            (data) => {
              this.costingService
                .copyAttachment(
                  tagCosting.entryDate,
                  tagCosting.refNo + '.' + tagCosting.attachmentExtension,
                  data['refNo'] + '.' + tagCosting.attachmentExtension
                )
                .subscribe(
                  (data) => {
                    if (data) {
                      this.snackBarService.showSuccessSnack(
                        'Duplicate costing created successfully'
                      );
                      this.showActiveCosting();
                    } else {
                      console.log(
                        'Duplication step 3: Error while copying attachment. Costing duplicated successfully. Received false'
                      );
                    }
                  },
                  (err) => {
                    console.log(
                      'Duplication step 3: Error while copying attachment. Costing duplicated successfully '
                    );
                    console.log(err);
                  }
                );
            },
            (err) => {
              alert('Error while creating duplicate');
              console.log(
                'Duplication step 2: Error while inserting new costing sheet'
              );
              console.log(err);
            }
          );
        },
        (err) => {
          alert('Error while creating duplicate');
          console.log(
            'Duplication step 1: Error during order details retrieval'
          );
          console.log(err);
        }
      );
    } else if (trimType == 'Printed') {
      this.costingService.getPrintedByid(totalDetailsId).subscribe(
        (data) => {
          let printedCosting: PrintedCosting = data;
          printedCosting.id = null;
          printedCosting.status = 0;

          //create
          this.costingService.createPrinted(printedCosting).subscribe(
            (data) => {
              let commonDetailsCosting: CommonDetailsCosting =
                new CommonDetailsCosting();
              commonDetailsCosting.totalDetailsId = data['id'];
              commonDetailsCosting.entryDate = data['entryDate'];
              commonDetailsCosting.refNo = data['refNo'];
              commonDetailsCosting.trimType = data['trimType'];
              commonDetailsCosting.customerId = data['customerId'];
              commonDetailsCosting.customerName = data['customerName'];
              commonDetailsCosting.status = data['status'];
              commonDetailsCosting.executiveId = data['executiveId'];

              this.costingService
                .createCommonDetails(commonDetailsCosting)
                .subscribe(
                  (data) => {
                    this.costingService
                      .copyAttachment(
                        printedCosting.entryDate,
                        printedCosting.refNo +
                          '.' +
                          printedCosting.attachmentExtension,
                        commonDetailsCosting.refNo +
                          '.' +
                          printedCosting.attachmentExtension
                      )
                      .subscribe(
                        (data) => {
                          if (data) {
                            this.snackBarService.showSuccessSnack(
                              'Duplicate costing created successfully'
                            );
                            this.showActiveCosting();
                          } else {
                            console.log(
                              'Duplication step 4: Error while copying attachment. Costing duplicated successfully. Received false'
                            );
                          }
                        },
                        (err) => {
                          console.log(
                            'Duplication step 3: Error while copying attachment. Costing duplicated successfully '
                          );
                          console.log(err);
                        }
                      );
                  },
                  (err) => {
                    alert('Error while creating duplicate');
                    console.log(
                      'Duplication step 3: Error while inserting new costing sheet - common details. But Costing sheet inserted successfully'
                    );
                    console.log(err);
                  }
                );
            },
            (err) => {
              alert('Error while creating duplicate');
              console.log(
                'Duplication step 2: Error while inserting new costing sheet'
              );
              console.log(err);
            }
          );
        },
        (err) => {
          alert('Error while creating duplicate');
          console.log(
            'Duplication step 1: Error during order details retrieval'
          );
          console.log(err);
        }
      );
    } else if (trimType == 'Woven') {
      this.costingService.getWovenByid(totalDetailsId).subscribe(
        (data) => {
          let wovenCosting: WovenCosting = data;
          wovenCosting.id = null;
          wovenCosting.status = 0;

          //create
          this.costingService.createWoven(wovenCosting).subscribe(
            (data) => {
              let commonDetailsCosting: CommonDetailsCosting =
                new CommonDetailsCosting();
              commonDetailsCosting.totalDetailsId = data['id'];
              commonDetailsCosting.entryDate = data['entryDate'];
              commonDetailsCosting.refNo = data['refNo'];
              commonDetailsCosting.trimType = data['trimType'];
              commonDetailsCosting.customerId = data['customerId'];
              commonDetailsCosting.customerName = data['customerName'];
              commonDetailsCosting.status = data['status'];
              commonDetailsCosting.executiveId = data['executiveId'];

              this.costingService
                .createCommonDetails(commonDetailsCosting)
                .subscribe(
                  (data) => {
                    this.costingService
                      .copyAttachment(
                        wovenCosting.entryDate,
                        wovenCosting.refNo +
                          '.' +
                          wovenCosting.attachmentExtension,
                        commonDetailsCosting.refNo +
                          '.' +
                          wovenCosting.attachmentExtension
                      )
                      .subscribe(
                        (data) => {
                          if (data) {
                            this.snackBarService.showSuccessSnack(
                              'Duplicate costing created successfully'
                            );
                            this.showActiveCosting();
                          } else {
                            console.log(
                              'Duplication step 4: Error while copying attachment. Costing duplicated successfully. Received false'
                            );
                          }
                        },
                        (err) => {
                          console.log(
                            'Duplication step 3: Error while copying attachment. Costing duplicated successfully '
                          );
                          console.log(err);
                        }
                      );
                  },
                  (err) => {
                    alert('Error while creating duplicate');
                    console.log(
                      'Duplication step 3: Error while inserting new costing sheet - common details. But Costing sheet inserted successfully'
                    );
                    console.log(err);
                  }
                );
            },
            (err) => {
              alert('Error while creating duplicate');
              console.log(
                'Duplication step 2: Error while inserting new costing sheet'
              );
              console.log(err);
            }
          );
        },
        (err) => {
          alert('Error while creating duplicate');
          console.log(
            'Duplication step 1: Error during order details retrieval'
          );
          console.log(err);
        }
      );
    } else if (trimType == 'Sticker-Flexo') {
      this.costingService.getStickerFlexoByid(totalDetailsId).subscribe(
        (data) => {
          let stickerFlexoCosting: StickerFlexoCosting = data;
          stickerFlexoCosting.id = null;
          stickerFlexoCosting.status = 0;
          this.costingService.createStickerFlexo(stickerFlexoCosting).subscribe(
            (data) => {
              this.costingService
                .copyAttachment(
                  stickerFlexoCosting.entryDate,
                  stickerFlexoCosting.refNo +
                    '.' +
                    stickerFlexoCosting.attachmentExtension,
                  data['refNo'] + '.' + stickerFlexoCosting.attachmentExtension
                )
                .subscribe(
                  (data) => {
                    if (data) {
                      this.snackBarService.showSuccessSnack(
                        'Duplicate costing created successfully'
                      );
                      this.showActiveCosting();
                    } else {
                      console.log(
                        'Duplication step 3: Error while copying attachment. Costing duplicated successfully. Received false'
                      );
                    }
                  },
                  (err) => {
                    console.log(
                      'Duplication step 3: Error while copying attachment. Costing duplicated successfully '
                    );
                    console.log(err);
                  }
                );
            },
            (err) => {
              alert('Error while creating duplicate');
              console.log(
                'Duplication step 2: Error while inserting new costing sheet'
              );
              console.log(err);
            }
          );
        },
        (err) => {
          alert('Error while creating duplicate');
          console.log(
            'Duplication step 1: Error during order details retrieval'
          );
          console.log(err);
        }
      );
    } else if (trimType == 'Sticker-Offset') {
      this.costingService.getStickerOffsetByid(totalDetailsId).subscribe(
        (data) => {
          let stickerOffsetCosting: StickerOffsetCosting = data;
          stickerOffsetCosting.id = null;
          stickerOffsetCosting.status = 0;
          this.costingService
            .createStickerOffset(stickerOffsetCosting)
            .subscribe(
              (data) => {
                this.costingService
                  .copyAttachment(
                    stickerOffsetCosting.entryDate,
                    stickerOffsetCosting.refNo +
                      '.' +
                      stickerOffsetCosting.attachmentExtension,
                    data['refNo'] +
                      '.' +
                      stickerOffsetCosting.attachmentExtension
                  )
                  .subscribe(
                    (data) => {
                      if (data) {
                        this.snackBarService.showSuccessSnack(
                          'Duplicate costing created successfully'
                        );
                        this.showActiveCosting();
                      } else {
                        console.log(
                          'Duplication step 3: Error while copying attachment. Costing duplicated successfully. Received false'
                        );
                      }
                    },
                    (err) => {
                      console.log(
                        'Duplication step 3: Error while copying attachment. Costing duplicated successfully '
                      );
                      console.log(err);
                    }
                  );
              },
              (err) => {
                alert('Error while creating duplicate');
                console.log(
                  'Duplication step 2: Error while inserting new costing sheet'
                );
                console.log(err);
              }
            );
        },
        (err) => {
          alert('Error while creating duplicate');
          console.log(
            'Duplication step 1: Error during order details retrieval'
          );
          console.log(err);
        }
      );
    } else {
      alert('Duplication failed - Invalid Trim Type');
    }
  }

  archiveCosting(id: string) {
    if (confirm('Are you sure to archive this costing?')) {
      let index = this.commonDetails.findIndex((obj) => obj.id == id);
      let commonDetailsCosting: CommonDetailsCosting = {
        ...this.commonDetails[index],
      };
      commonDetailsCosting.archived = true;
      this.costingService
        .archiveToggleCommonDetails(commonDetailsCosting)
        .subscribe(
          (data) => {
            if (data) {
              alert('Costing sheet archived successfully');
              this.showActiveCosting();
            }
          },
          (err) => console.log(err)
        );
    }
  }

  activateCosting(id: string) {
    if (confirm('Are you sure to activate this costing?')) {
      let index = this.commonDetails.findIndex((obj) => obj.id == id);
      let commonDetailsCosting: CommonDetailsCosting = {
        ...this.commonDetails[index],
      };
      commonDetailsCosting.archived = false;
      this.costingService
        .archiveToggleCommonDetails(commonDetailsCosting)
        .subscribe(
          (data) => {
            if (data) {
              alert('Costing sheet activated successfully');
              this.showArchivedCosting();
            }
          },
          (err) => console.log(err)
        );
    }
  }
  saveCostingInputByExecutive() {
    this.disableSaveBtn = true;
    
      this.costingService.createWoven(this.costing).subscribe(
        (data) => {
          if (data) {
           
          } else {
            // we received null - indicating recursion failure
            alert(
              'R - Error while saving - Woven costing sheet. Please contact the administrator.'
            );
            console.log(
              'Recursion failure - Indicating Mismatch in Reference Number sequence'
            );
            this.disableSaveBtn = false;
          }
        },
        (err) => {
          alert(
            'Error while saving - Woven costing sheet. Please contact the administrator'
          );
          console.log(err);
          this.disableSaveBtn = false;
        }
      );
    } 
  }
 


import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

//create an instance of MatSnackBar

  constructor(private _snackBar:MatSnackBar) { }

/* It takes three parameters
    1.the message string
    2.the action
    3.the duration, alignment, etc. */

    showWarningSnack(message: string){
      this._snackBar.open(message, '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    showSuccessSnack(message: string){
      this._snackBar.open(message, '', {
        duration: 2000,
        panelClass: ['snackbar3'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }
}

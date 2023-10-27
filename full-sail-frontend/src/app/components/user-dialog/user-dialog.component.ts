import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent {

  userData: any = {};
  isSignIn: boolean;

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
  ) {
    this.isSignIn = data.isSignIn;
  }

  onSave() {
    if (this.isSignIn) {
      if (!this.userData.email || !this.userData.password) {
        return;
      }
    } else {
      if (!this.userData.email || !this.userData.password || !this.userData.firstName || !this.userData.lastName || !this.userData.address || !this.userData.phoneNum) {
        return;
      }
    }
    // this.userService.SetUserData(this.userData);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

}

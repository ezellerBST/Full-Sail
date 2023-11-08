import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent {

  email: string;
  password: string;
  displayName: string;
  photoURL: string;
  phoneNum: string;
  isSignIn: boolean;

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    private userService: UserService,
    public router: Router
  ) { }

  async onSave() {
    try {
      const user = await this.userService.createUser(
        this.email,
        this.password,
        this.displayName,
        this.photoURL,
      );
      this.router.navigate(['/account'], {
        queryParams: {
          user: JSON.stringify(user)
        }
      });
      this.dialogRef.close();

    } catch (error) {
      console.log(error);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

}

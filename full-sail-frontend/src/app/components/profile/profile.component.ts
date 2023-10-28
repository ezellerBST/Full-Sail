import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';









@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    if(this.email.hasError('required')){
      return 'You must enter a valid email';
    }
    return this.email.hasError('email') ? 'Not a valid email' : 'Please enter a valid email';
  }

}

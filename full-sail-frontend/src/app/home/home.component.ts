import { Component, OnInit } from '@angular/core';
import { UserDialogComponent } from '../components/user-dialog/user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isSignedIn: boolean = false;

  constructor(private router: Router, private auth: Auth, private userService: UserService ) {}
  
  ngOnInit() {
    this.auth.onAuthStateChanged(user => {
      this.isSignedIn = !!user;
    }); 
  }
  
  getRegisterPage(){
    this.router.navigate(['register']);
  }
}


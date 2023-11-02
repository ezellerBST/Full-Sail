import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { ProfileComponent } from './components/profile/profile.component';
import { AccountComponent } from './components/account/account.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
// import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';

import { FirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { MatDialogModule } from "@angular/material/dialog";
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatDividerModule} from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';



@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    AccountComponent,
    UserDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    BrowserAnimationsModule,
    FirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideAuth(() => getAuth()),
    // provideFirestore(() => getFirestore()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatDividerModule,
    MatRippleModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

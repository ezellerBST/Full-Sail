import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { ProfileComponent } from './components/profile/profile.component';
import { AccountComponent } from './components/account/account.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';

import { FirestoreModule } from '@angular/fire/firestore';
import { MatDialogModule } from "@angular/material/dialog";
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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { SigninComponent } from './components/signin/signin.component';
import { RegisterComponent } from './components/register/register.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AddTransactionComponent } from './components/add-transaction/add-transaction.component';
import { EditTransactionComponent } from './components/edit-transaction/edit-transaction.component';
import { DeleteTransactionComponent } from './components/delete-transaction/delete-transaction.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { CashflowComponent } from './components/cashflow/cashflow.component';
import { MatSortModule } from '@angular/material/sort';
import { AddGoalComponent } from './components/add-goal/add-goal.component';
import { EditGoalComponent } from './components/edit-goal/edit-goal.component';
import { DeleteGoalComponent } from './components/delete-goal/delete-goal.component';


@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    AccountComponent,
    SigninComponent,
    RegisterComponent,
    PageNotFoundComponent,
    AddTransactionComponent,
    EditTransactionComponent,
    DeleteTransactionComponent,
    CashflowComponent,
    AddGoalComponent,
    EditGoalComponent,
    DeleteGoalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    BrowserAnimationsModule,
    FirestoreModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatDividerModule,
    MatProgressBarModule,
    MatGridListModule,
    MatRippleModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    NgApexchartsModule,
    MatSortModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

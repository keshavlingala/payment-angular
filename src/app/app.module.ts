import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatStepperModule} from "@angular/material/stepper";
import {NumbersOnlyDirective} from './misc/numbers-only.directive';
import {MatListModule} from "@angular/material/list";
import {JwtInterceptor} from "./misc/jwt.interceptor";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDialogModule} from "@angular/material/dialog";
import {ErrorComponent} from './components/dialogs/error/error.component';
import {SuccessComponent} from './components/dialogs/success/success.component';
import {HistoryComponent} from './components/history/history.component';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatChipsModule} from "@angular/material/chips";
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {Ng2GoogleChartsModule} from "ng2-google-charts";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NumbersOnlyDirective,
    ErrorComponent,
    SuccessComponent,
    HistoryComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    HttpClientModule,
    MatStepperModule,
    MatListModule,
    MatSnackBarModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    FormsModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatChipsModule,
    Ng2GoogleChartsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

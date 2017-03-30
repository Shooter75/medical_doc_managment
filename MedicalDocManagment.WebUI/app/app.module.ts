﻿import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UsersListModule } from './users-list/users-list.module';
import { UsersListPaginateComponent } from './users-list-paginate/users-list-paginate.component';
import { UsersSearchFormComponent } from './users-search/users-search-form.component';
import { Ng2PaginationModule } from 'ng2-pagination';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    UsersListModule,
    Ng2PaginationModule,
    SimpleNotificationsModule,
    PushNotificationsModule
  ],
  declarations: [
    AppComponent,
    UserAddComponent,
    UsersListPaginateComponent,
    UsersSearchFormComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

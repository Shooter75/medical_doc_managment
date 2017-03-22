﻿/**
 * @fileoverview This file defines HttpFacade — component, which provides interaction between
 *     front-end side and back-end side via HTTP requests.   
 * @author Rv-023.Net
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import UserModel from './models/usermodel';

@Injectable()
export class HttpFacade {
  private _http: Http;

  constructor(http: Http) {
    this._http = http;
  }

  postData(obj: UserModel) {
    const body = JSON.stringify(obj);
    let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
    return this._http.post('/api/Admin/AddUser', body, { headers: headers })
                     .map((resp: Response) => resp.json())
                     .catch((error: any) => { return Observable.throw(error); });
  }

  /**
   * Sends HTTP-request to server for list of users.
   * @return {Observable<UserModel[]>} observable array with users. 
   */
  getUsersList(): Observable<UserModel[]> {
    return this._http.get('/api/Admin/GetUsers')
                     .map((resp: Response) => resp.json())
                     .catch((error: any) => { return Observable.throw(error); });
  }

}
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import ChildCardModel from '../models/child-card.model';
import ChildrenCardsModel from '../models/children-cards.model';
import ParentModel from '../models/parent.model';

import { AuthenticationService } from "./authentication.service";

@Injectable()
export default class ChildrensCardService {
    private _apiUrl: string = '/api/childcards';
    private _headers: Headers;
    
    constructor(private _http: Http, private _authenticationService: AuthenticationService) {
        this._headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        this._headers.append('Authorization', 'Bearer ' + _authenticationService.token);
    }
    
    addChildrenCard(childrensCard: ChildCardModel): boolean {
        if (childrensCard) {
            console.log(childrensCard);

            return true;
        }

        return false;
    }

    /**
     * Method sends to server request for adding new parent.
     * @param {ParentModel} parent Contains data about parent to add
     * @return {Observable<ParentModel>} Model, which contains added data of parent.
     */
    addParent(parent: ParentModel): Observable<ParentModel> {
        let body:string = JSON.stringify(parent);
        let headers = this._headers;
        return this._http.post('/api/childcards/addparent', body, { headers: headers })
            .map((resp: Response) => {
                Observable.of(new ParentModel(resp.json()));
            })
            .catch((error: any) => { return Observable.throw(error); });
    }

    getChildrenCards(): Observable<ChildrenCardsModel> {
        let headers = this._headers;
        return this._http.get('/api/childcards/GetChildrenCards', { headers })
           .map((resp: Response) => { return new ChildrenCardsModel(resp.json()); })
           .catch((error: any) => { return Observable.throw(error); });
    }

}
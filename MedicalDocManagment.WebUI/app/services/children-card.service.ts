import { Injectable } from '@angular/core';
import { Inject } from '@angular/core'; 
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Subject } from 'rxjs/Subject';
declare var $;

import ParentChildCard from '../models/child-card/parent-child-card.model';
import ChildCardModel from '../models/child-card/child-card.model';
import ChildrenCardsModel from '../models/children-cards.model';
import ParentModel from '../models/child-card/parent.model';
import ProcedureModel from '../models/child-card/procedure.model';
import RehabilitationModel from '../models/child-card/rehabilitation.model';
import ViewPatientDataModel from '../models/view-patient-data.model';
import ChildrenCardsPagedModel from '../models/children-cards-paged.model';

import { AuthenticationService } from "./authentication.service";

@Injectable()
export default class ChildrensCardService {
    private _apiUrl: string = '/api/childcards';
    private _headers: Headers;
    private _childrenCardsSubject: Subject<any>;
    private _currentChildCard: ChildCardModel;
    private _route: ActivatedRoute;

    constructor(private _http: Http, @Inject(AuthenticationService) private _authenticationService: AuthenticationService,
        route: ActivatedRoute) {
        this._headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        this._headers.append('Authorization', 'Bearer ' + this._authenticationService.token);
        this._childrenCardsSubject = new Subject<any>();
        this._currentChildCard = null;
        this._route = route;
    }

    addChildrenCard(childCard: ChildCardModel): Observable<ChildCardModel> {
        let headers = this._headers;
        let sendObj = {
            lastName: childCard.lastName,
            firstName: childCard.firstName,
            secondName: childCard.secondName,
            date: childCard.date,
            checkin: childCard.checkIn,
            checkout: childCard.checkOut,
            address: childCard.address,
            diagnosisCode: childCard.diagnosis.id,
            prescription: childCard.prescription,
            directedBy: childCard.directedBy,
        };
        let body = JSON.stringify(sendObj);

        return this._http.post(this._apiUrl + '/addpatient', body, { headers })
            .map((resp: Response) => new ChildCardModel(resp.json()))
            .catch((error: any) => { return Observable.throw(error); });
    }

    /**
     * Method sends to server request for adding new parent.
     * @param {ParentModel} parent Contains data about parent to add
     * @return {Observable<ParentModel>} Model, which contains added data of parent.
     */
    addParent(parent: ParentModel): Observable<ParentModel> {
        let body: string = JSON.stringify(parent);
        let headers = this._headers;
        return this._http.post(this._apiUrl + '/addparent', body, { headers: headers })
            .map((resp: Response) => {
                return Observable.of(new ParentModel(resp.json()));
            })
            .catch((error: any) => { return Observable.throw(error); });
    }

    addParentIntoChildCard(parent: ParentModel, childCard: ChildCardModel): Observable<ParentChildCard> {
        let headers = this._headers;
        let sendObj = new ParentChildCard({
            parentId: parent.id,
            childId: childCard.id
        });
        let body = JSON.stringify(sendObj);

        return this._http.post(this._apiUrl + '/addparentintochildcard', body, { headers })
                         .map((resp: Response) => { return new ParentChildCard(resp.json()); })
                         .catch((error: any) => { return Observable.throw(error); });
    }

    get currentChildCardObservable(): Observable<ChildCardModel> {
        return Observable.create((observer: Observer<ChildCardModel>) => {
            let subscription = this._route.params.subscribe(
                params => {
                    let childCardId = params['id'];
                    if (childCardId) {
                        if (!this._currentChildCard || (this._currentChildCard
                            && this._currentChildCard.id != childCardId)) {
                            this.getChildCard(childCardId)
                                .subscribe((childCard: ChildCardModel) => {
                                    this._currentChildCard = childCard;
                                    observer.next(this._currentChildCard);
                                }
                            );
                        }
                        else {
                            observer.next(this._currentChildCard);
                        }
                    }
                    else {
                        observer.next(null);
                    }
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    observer.complete();
                    subscription.unsubscribe();
                }
            );
        });
    }

    get currentUsersPositionName(): string {
        return this._authenticationService.position;
    }

    getChildCard(childCardId: number): Observable<ChildCardModel> {
        let headers: Headers = this._headers;
        return this._http.get(this._apiUrl + '/getChildCard?childCardId=' + childCardId,
            { headers })
            .map((resp: Response) => {
                return new ChildCardModel(resp.json());
            })
            .catch((error: any) => { return Observable.throw(error); });
    }

    getProcedures(): Observable<ProcedureModel[]> {
        let headers = this._headers;
        return this._http.get('/api/childcards/gettherapeuticprocedures', { headers })
            .map((resp: Response) => { console.log(resp); return resp.json(); })
            .catch((error: any) => { return Observable.throw(error); });
    }

    getChildrenCards(): Observable<ChildrenCardsModel> {
        let headers = this._headers;
        return this._http.get('/api/childcards/getchildrencards', { headers })
                         .map((resp: Response) => { return new ChildrenCardsModel(resp.json()); })
                         .catch((error: any) => { return Observable.throw(error); });
    }
    getChildrenCardsPaged(page: number, pageSize: number): void {
        let headers = this._headers;
        
        this._http.get("api/childcards/getchildrencardspaged?pageNumber=" + page + "&pageSize=" + pageSize, { headers })
            .map((resp: Response) => {
                let pagedResponse: ChildrenCardsPagedModel = new ChildrenCardsPagedModel();
                pagedResponse.pageCount = resp.json().paging.pageCount;
                pagedResponse.pageNumber = resp.json().paging.pageNumber;
                pagedResponse.pageSize = resp.json().paging.pageSize;
                pagedResponse.totalRecordCount = resp.json().paging.totalRecordCount;
                pagedResponse.childrenCards = new ChildrenCardsModel(resp.json().data);
                return pagedResponse;
            })
            .catch((error: any) => {
                return Observable.throw(error);
            })
            .subscribe(resp => {
                this._childrenCardsSubject.next(resp);
            });
    }
    get childrenCardsSubject() {
        return this._childrenCardsSubject;
    }

    /**
     * Method returns some patient data
     * @param {any} dataOfPatient Contains data about patient to view
     * @return {Observable<ChildrenCardsModel>} Contains data about patients
    */
    viewPatientData(dataOfPatient: ViewPatientDataModel): Observable<ChildrenCardsModel> {
        let headers = this._headers;

        if (dataOfPatient.date) {
            dataOfPatient.date = new Date(dataOfPatient.date).toISOString();
        }

        return this._http.get('/api/childcards/viewPatientData?' +
            $.param(dataOfPatient), { headers })
            .map((resp: Response) => { return new ChildrenCardsModel(resp.json()); })
            .catch((error: any) => { return Observable.throw(error); });
    }

    getChildsParents(childCardId: number): Observable<ParentModel[]> {
        let headers: Headers = this._headers;
        return this._http.get('/api/childcards/getChildsParents?childCardId=' + childCardId,
            { headers })
                         .map((resp: Response) => {
                             return resp.json();
                         })
                         .catch((error: any) => { return Observable.throw(error); });
    }

    addRehabilitationIntoChildCard(childCardId: number, rehabilitation: RehabilitationModel):
        Observable<RehabilitationModel> {
    let headers: Headers = this._headers;
    let body: string = JSON.stringify(rehabilitation);
    return this._http.put('/api/childcards/addRehabilitationIntoChildCard?childCardId=' + childCardId,
        body, { headers })
        .map((resp: Response) => {
            return resp;
        })
        .catch((error: any) => { return Observable.throw(error); });
}

    getChildsRehabilitations(childCardId: number): Observable<RehabilitationModel[]> {
        let headers: Headers = this._headers;
        return this._http.get('/api/childcards/GetRehabilitations?childCardId=' + childCardId,
            { headers })
            .map((resp: Response) => {
                return resp.json();
            })
            .catch((error: any) => { return Observable.throw(error); });
    }
}

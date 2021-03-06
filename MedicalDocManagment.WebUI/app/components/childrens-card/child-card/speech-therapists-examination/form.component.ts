﻿import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { NotificationsService, SimpleNotificationsComponent } from 'angular2-notifications';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

declare var $: any;

import ChildCardModel from "../../../../models/child-card/child-card.model";
import SpeechTherapistsExaminationModel from "../../../../models/child-card/speech-therapists-examination/examination.model";

import ChildCardService from '../../../../services/child-card.service';
import ChildrenCardService from '../../../../services/children-card.service';
import SharedService from '../../../../services/shared.service';

@Component({
    moduleId: module.id,
    providers: [
        ChildCardService,
        ChildrenCardService,
        NotificationsService,
        SharedService
    ],
    selector: 'speech-therapists-examination-form',
    styleUrls: ['form.component.css'],
    templateUrl: 'form.component.html'
})
export default class SpeechTherapistsExaminationFormComponent implements OnDestroy {
    private _childCard: ChildCardModel;
    private _childCardSubscription: Subscription;
    private _childCardService: ChildCardService;
    private _childrenCardService: ChildrenCardService;
    private _dateFormat: Object;
    private _examination: SpeechTherapistsExaminationModel;
    private _isErrorOnLoading: boolean;
    private _isErrorOnSaving: boolean;
    private _isLoading: boolean;
    private _isLoadingDiagnosis: boolean;
    private _isSaving: boolean;
    private _lastLoadingErrorMessage: string;
    private _lastSavingErrorMessage: string;
    private _notificationOptions: any;
    private _notificationService: NotificationsService;

    constructor(childCardService: ChildCardService, childrenCardService: ChildrenCardService,
        notificationService: NotificationsService,
        sharedService: SharedService) {
        this._childCard = null;
        this._childCardService = childCardService;
        this._childrenCardService = childrenCardService;
        this._childCardSubscription = this._childrenCardService.currentChildCardObservable
            .subscribe((childCard: ChildCardModel) => {
                this._childCard = childCard;
                this._loadExaminationFromServer();
            });
        moment.updateLocale('uk', {
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'HH:mm:ss',
                L: 'DD.MM.YYYY',
                LL: '"DD" MMMM YYYYр.',
                LLL: 'D MMMM YYYY р., HH:mm',
                LLLL: 'dddd, D MMMM YYYY р., HH:mm'
            },
            months: {
                'format': 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split('_'),
                'standalone': 'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split('_'),
                isFormat: /"DD" MMMM YYYYр./
            }
        });
        this._dateFormat = {
            toDisplay: (date: Date, format, language) => {
                let str = moment(date).format('LL');                
                return str;
            },
            toValue: (date: string, format, language) => {
                let obj = moment(date, 'LL').toDate();
                return obj;
            },
        }
        this._examination = new SpeechTherapistsExaminationModel();
        this._isErrorOnLoading = this._isErrorOnSaving = false;
        this._isLoading = true;
        this._isSaving = false;
        this._isLoadingDiagnosis = false;
        this._lastLoadingErrorMessage = '';
        this._lastSavingErrorMessage = '';
        this._notificationOptions = sharedService.notificationOptions;
        this._notificationService = notificationService;
    }

    private _loadExaminationFromServer(): void {
        this._isLoading = true;
        this._isErrorOnLoading = false;
        this._lastLoadingErrorMessage = '';

        this._childCardService.getSpeechTherapistsExamination(this._childCard.id)
            .subscribe((examination: SpeechTherapistsExaminationModel) => {
                this._examination = examination;
                this._isLoading = false;
            },
            (error: any) => {
                this._isLoading = false;
                this._isErrorOnLoading = true;
                this._lastLoadingErrorMessage = 'При отриманні результатів огляду \
                    виникла помилка: \r\n' + <any>error;
            });
    }

    private _save():void {
        this._lastSavingErrorMessage = '';
        this._isErrorOnSaving = false;
        this._isSaving = true;

        this._childCardService.saveSpeechTherapistsExamination(this._childCard.id,
            this._examination)
            .subscribe((savedExamination: SpeechTherapistsExaminationModel) => {
                this._notificationService.success("Успіх", "Огляд логопеда успішно збережено");
                this._examination = savedExamination;
                this._isSaving = false;
            },
            (error: any) => {
                this._notificationService.error("Помилка",
                    "При збереженні огляду логопеда виникла помилка");
                this._isSaving = false;
                this._isErrorOnSaving = true;
                this._lastSavingErrorMessage = 'При збереженні результатів огляду \
                    виникла помилка: \r\n' + <any>error;
            });
    }

    ngOnDestroy(): void {
        this._childCardSubscription.unsubscribe();
    }
}
﻿export default class PositionModel {
    id: string;
    name: string;

    constructor(jsonobject?) {
        if (jsonobject) {
            this.id = jsonobject.positionId;
            this.name = jsonobject.name;
        }
        else {
            this.id = null;
            this.name = null;
        }
    }
}
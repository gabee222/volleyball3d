export default class Player {
    constructor (name, position, team) {
        this._name = name;
        this._position = position;
        this._team = team;
    }


    toString() {
        return `Name: ${this._name}
        Position: ${this._position}
        Team: ${this._team}`;
    }
    get name() {
        return this._name;
    }
    get position () {
        return this._position;
    }
    get team () {
        return this._team;
    }

}